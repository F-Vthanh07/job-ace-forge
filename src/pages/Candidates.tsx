import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, FileText, Brain, User, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { applicationService, ApplicationResponse } from "@/services/applicationService";
import { useToast } from "@/hooks/use-toast";
import { CVPreview } from "@/components/CVPreview";

interface CandidateProfile {
  Id: string;
  Template: string;
  FullName: string;
  Jobtitle: string;
  AboutMe: string;
  PortfolioUrl: string;
  AvatarUrl: string;
  DesiredJobTitle: string;
  WorkLocation: string;
  JobType: string;
  Achievements: string;
  Contacts: string;
  IsActive: boolean;
  isDeleted: boolean;
  CandidateId: string;
  Skills: Array<{
    Id: string;
    ProfileId: string;
    SkillName: string;
    ProficiencyLevel: string;
  }>;
  WorkExperiences: Array<{
    Id: string;
    ProfileId: string;
    CompanyName: string;
    Position: string;
    StartDate: string;
    EndDate: string;
    Description: string;
  }>;
  Educations: Array<{
    Id: string;
    ProfileId: string;
    SchoolName: string;
    Degree: string;
    Major: string;
    Grade: string;
    StartDate: string;
    EndDate: string;
    Description: string;
  }>;
}

interface AIAnalysis {
  Strengths: string[];
  Weaknesses: string[];
  Summary: string;
}

const Candidates = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const jobId = searchParams.get("job");
  const { toast } = useToast();

  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("match");
  const [selectedApplication, setSelectedApplication] = useState<ApplicationResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchApplications(jobId);
    }
  }, [jobId]);

  const fetchApplications = async (jobPostingId: string) => {
    try {
      setLoading(true);
      const response = await applicationService.getApplicationsByJobPostingId(jobPostingId);
      
      if (response.success && response.data) {
        setApplications(response.data);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to load candidates",
        });
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load candidates",
      });
    } finally {
      setLoading(false);
    }
  };

  const parseProfile = (profilesSnapshot: string): CandidateProfile | null => {
    try {
      return JSON.parse(profilesSnapshot);
    } catch (error) {
      console.error("Error parsing profile:", error);
      return null;
    }
  };

  const parseAIAnalysis = (aiAnalysis: string): AIAnalysis | null => {
    try {
      return JSON.parse(aiAnalysis);
    } catch (error) {
      console.error("Error parsing AI analysis:", error);
      return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case "approved":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    }
  };

  const handleViewDetails = (application: ApplicationResponse) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
  };

  const filteredApplications = applications.filter(app => {
    const profile = parseProfile(app.profilesSnapshot);
    if (!profile) return false;
    
    const matchesSearch = searchTerm === "" || 
      profile.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.Jobtitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  // Sort applications
  const sortedApps = [...filteredApplications].sort((a, b) => {
    if (sortBy === "match") {
      return b.matchScore - a.matchScore;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/manage-jobs")}
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Manage Jobs
        </Button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Job Candidates</h1>
          <p className="text-muted-foreground">
            AI-ranked candidates who applied for this position ({applications.length} total)
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search candidates by name or role..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Match Score (High to Low)</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Candidate List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-64 mb-3" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : sortedApps.length === 0 ? (
          <Card className="p-12 text-center">
            <User className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No candidates found</h3>
            <p className="text-muted-foreground">
              {searchTerm ? "Try adjusting your search" : "No applications received yet"}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {sortedApps.map((app) => {
              const profile = parseProfile(app.profilesSnapshot);
              if (!profile) return null;

              // Get unique skills
              const uniqueSkills = Array.from(new Set(profile.Skills.map(s => s.SkillName)));

              return (
                <Card key={app.id} className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div 
                        className="h-16 w-16 rounded-full bg-cover bg-center shrink-0"
                        style={{
                          backgroundImage: profile.AvatarUrl 
                            ? `url(${profile.AvatarUrl})` 
                            : 'none',
                          backgroundColor: profile.AvatarUrl ? 'transparent' : '#6366f1'
                        }}
                      >
                        {!profile.AvatarUrl && (
                          <div className="h-full w-full rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xl">
                            {profile.FullName.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-xl font-bold mb-1">{profile.FullName}</h3>
                            <p className="text-muted-foreground mb-2">{profile.Jobtitle}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {uniqueSkills.slice(0, 5).map((skill) => (
                            <Badge key={skill} variant="secondary">
                              {skill}
                            </Badge>
                          ))}
                          {uniqueSkills.length > 5 && (
                            <Badge variant="outline">+{uniqueSkills.length - 5} more</Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <Badge className={getStatusColor(app.status)}>
                            {app.status}
                          </Badge>
                          {app.cvUrl && (
                            <Badge variant="outline">External CV</Badge>
                          )}
                          {app.coverLetter && (
                            <Badge variant="outline">Cover Letter</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-3">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary" />
                        <span className="text-3xl font-bold text-primary">{app.matchScore}%</span>
                      </div>
                      <Button 
                        className="gradient-primary gap-2" 
                        onClick={() => handleViewDetails(app)}
                      >
                        <FileText className="h-4 w-4" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Candidate Detail Modal */}
        {selectedApplication && (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="max-w-6xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl">Candidate Profile & AI Analysis</DialogTitle>
                <DialogDescription>
                  Detailed view of candidate's CV and AI matching analysis
                </DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="cv" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="cv" className="gap-2">
                    <FileText className="h-4 w-4" />
                    CV Preview
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="gap-2">
                    <Brain className="h-4 w-4" />
                    AI Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cv" className="overflow-y-auto max-h-[calc(90vh-200px)]">
                  {(() => {
                    const profile = parseProfile(selectedApplication.profilesSnapshot);
                    if (!profile) return <p>Error loading CV</p>;

                    // Extract email and phone from Contacts string
                    const contactParts = profile.Contacts.split('|');
                    const phone = contactParts[0]?.trim() || "";
                    const email = contactParts[1]?.trim() || "";

                    // Map template name to lowercase
                    const templateName = profile.Template.toLowerCase().replaceAll('-', '');
                    const templateMap: Record<string, string> = {
                      'modernprofessional01': 'modern',
                      'modern': 'modern',
                      'simple': 'simple',
                      'professional': 'professional',
                      'creative': 'creative',
                    };
                    const template = templateMap[templateName] || 'modern';

                    // Transform to CVPreview format
                    const data = {
                      fullName: profile.FullName,
                      email: email,
                      phone: phone,
                      address: profile.WorkLocation,
                      title: profile.Jobtitle,
                      summary: profile.AboutMe,
                      photo: profile.AvatarUrl || "",
                    };

                    const skills = profile.Skills.map(s => ({
                      skillName: s.SkillName,
                      proficiencyLevel: s.ProficiencyLevel,
                    }));

                    // Remove duplicate skills (keep first occurrence)
                    const uniqueSkills = skills.filter((skill, index, self) =>
                      index === self.findIndex((s) => s.skillName === skill.skillName)
                    );

                    const workExperiences = profile.WorkExperiences.map(e => ({
                      companyName: e.CompanyName,
                      position: e.Position,
                      startDate: e.StartDate,
                      endDate: e.EndDate,
                      description: e.Description,
                    }));

                    // Remove duplicate work experiences
                    const uniqueWorkExperiences = workExperiences.filter((exp, index, self) =>
                      index === self.findIndex((e) => 
                        e.companyName === exp.companyName && 
                        e.position === exp.position && 
                        e.startDate === exp.startDate
                      )
                    );

                    const educations = profile.Educations.map(e => ({
                      schoolName: e.SchoolName,
                      degree: e.Degree,
                      major: e.Major,
                      grade: e.Grade,
                      startDate: e.StartDate,
                      endDate: e.EndDate,
                      description: e.Description,
                    }));

                    // Remove duplicate educations
                    const uniqueEducations = educations.filter((edu, index, self) =>
                      index === self.findIndex((e) => 
                        e.schoolName === edu.schoolName && 
                        e.degree === edu.degree && 
                        e.startDate === edu.startDate
                      )
                    );

                    return (
                      <CVPreview 
                        data={data} 
                        template={template}
                        skills={uniqueSkills}
                        workExperiences={uniqueWorkExperiences}
                        educations={uniqueEducations}
                      />
                    );
                  })()}
                </TabsContent>

                <TabsContent value="analysis" className="overflow-y-auto max-h-[calc(90vh-200px)] p-4">
                  {(() => {
                    const analysis = parseAIAnalysis(selectedApplication.aiAnalysis);
                    if (!analysis) return <p>No AI analysis available</p>;

                    return (
                      <div className="space-y-6">
                        {/* Match Score */}
                        <Card className="p-6 bg-primary/5 border-primary/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold mb-1">Match Score</h3>
                              <p className="text-sm text-muted-foreground">
                                Overall compatibility with job requirements
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <TrendingUp className="h-8 w-8 text-primary" />
                              <span className="text-5xl font-bold text-primary">
                                {selectedApplication.matchScore}%
                              </span>
                            </div>
                          </div>
                        </Card>

                        {/* Summary */}
                        <Card className="p-6">
                          <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                            <Brain className="h-5 w-5 text-primary" />
                            Summary
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">
                            {analysis.Summary}
                          </p>
                        </Card>

                        {/* Strengths */}
                        <Card className="p-6 bg-green-50 dark:bg-green-950/10 border-green-200 dark:border-green-900">
                          <h3 className="text-lg font-semibold mb-3 text-green-800 dark:text-green-200">
                            ✓ Strengths
                          </h3>
                          <ul className="space-y-2">
                            {analysis.Strengths.map((strength, index) => (
                              <li 
                                key={`strength-${index}-${strength.substring(0, 20)}`} 
                                className="flex gap-3 text-sm text-green-700 dark:text-green-300"
                              >
                                <span className="text-green-600 dark:text-green-400 font-bold">•</span>
                                <span>{strength}</span>
                              </li>
                            ))}
                          </ul>
                        </Card>

                        {/* Weaknesses */}
                        <Card className="p-6 bg-orange-50 dark:bg-orange-950/10 border-orange-200 dark:border-orange-900">
                          <h3 className="text-lg font-semibold mb-3 text-orange-800 dark:text-orange-200">
                            ⚠ Points to Consider
                          </h3>
                          <ul className="space-y-2">
                            {analysis.Weaknesses.map((weakness, index) => (
                              <li 
                                key={`weakness-${index}-${weakness.substring(0, 20)}`} 
                                className="flex gap-3 text-sm text-orange-700 dark:text-orange-300"
                              >
                                <span className="text-orange-600 dark:text-orange-400 font-bold">•</span>
                                <span>{weakness}</span>
                              </li>
                            ))}
                          </ul>
                        </Card>

                        {/* Cover Letter if available */}
                        {selectedApplication.coverLetter && (
                          <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-3">Cover Letter</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                              {selectedApplication.coverLetter}
                            </p>
                          </Card>
                        )}

                        {/* External CV Link */}
                        {selectedApplication.cvUrl && (
                          <Card className="p-6">
                            <h3 className="text-lg font-semibold mb-3">External CV</h3>
                            <a 
                              href={selectedApplication.cvUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              View submitted CV document
                            </a>
                          </Card>
                        )}
                      </div>
                    );
                  })()}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};

export default Candidates;
