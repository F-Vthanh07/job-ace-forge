import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, TrendingUp, FileText, Brain, User, ArrowLeft, MoreVertical, CheckCircle, Calendar, XCircle, Loader2 } from "lucide-react";
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
  const applicationId = searchParams.get("application");
  const { toast } = useToast();

  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("match");
  const [selectedApplication, setSelectedApplication] = useState<ApplicationResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  
  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [minMatchScore, setMinMatchScore] = useState(0);
  const [positionFilter, setPositionFilter] = useState("all");

  useEffect(() => {
    if (jobId) {
      fetchApplications(jobId);
    }
  }, [jobId]);

  // Auto-open modal if applicationId is provided
  useEffect(() => {
    if (applicationId && applications.length > 0) {
      const targetApplication = applications.find(app => app.id === applicationId);
      if (targetApplication) {
        setSelectedApplication(targetApplication);
        setIsModalOpen(true);
        
        // Update application status to "viewed"
        applicationService.updateApplicationStatus(targetApplication.id, "viewed")
          .then(response => {
            if (response.success) {
              console.log("✅ Application status updated to viewed");
              setApplications(prevApps => 
                prevApps.map(app => 
                  app.id === targetApplication.id ? { ...app, status: "viewed" } : app
                )
              );
            }
          })
          .catch(error => {
            console.error("Error updating application status:", error);
          });
      }
    }
  }, [applicationId, applications]);

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
      case "viewed":
        return "bg-blue-500/20 text-blue-700 border-blue-500/30";
      case "interview":
        return "bg-purple-500/20 text-purple-700 border-purple-500/30";
      case "hired":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "approved":
        return "bg-green-500/20 text-green-700 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-700 border-red-500/30";
      default:
        return "bg-blue-500/20 text-blue-700 border-blue-500/30";
    }
  };

  const handleViewDetails = async (application: ApplicationResponse) => {
    setSelectedApplication(application);
    setIsModalOpen(true);
    // Update URL to include application ID
    if (jobId) {
      navigate(`/candidates?job=${jobId}&application=${application.id}`, { replace: true });
    }

    // Update application status to "viewed" when recruiter opens the details
    try {
      const response = await applicationService.updateApplicationStatus(application.id, "viewed");
      if (response.success) {
        console.log("✅ Application status updated to viewed");
        // Update local state to reflect the status change
        setApplications(prevApps => 
          prevApps.map(app => 
            app.id === application.id ? { ...app, status: "viewed" } : app
          )
        );
      }
    } catch (error) {
      console.error("Error updating application status:", error);
      // Don't show error to user as this is a background operation
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedApplication(null);
    // Remove application ID from URL
    if (jobId) {
      navigate(`/candidates?job=${jobId}`, { replace: true });
    }
  };

  const handleStatusChange = async (applicationId: string, newStatus: string) => {
    try {
      setUpdatingStatus(applicationId);
      const response = await applicationService.updateApplicationStatus(applicationId, newStatus);
      
      if (response.success) {
        // Update local state
        setApplications(prevApps => 
          prevApps.map(app => 
            app.id === applicationId ? { ...app, status: newStatus } : app
          )
        );

        // Update selected application if it's the one being updated
        if (selectedApplication?.id === applicationId) {
          setSelectedApplication(prev => prev ? { ...prev, status: newStatus } : null);
        }

        toast({
          title: "Success",
          description: `Application status updated to ${newStatus}`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to update status",
        });
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update application status",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredApplications = applications.filter(app => {
    const profile = parseProfile(app.profilesSnapshot);
    if (!profile) return false;
    
    const matchesSearch = searchTerm === "" || 
      profile.FullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.Jobtitle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    
    const matchesScore = app.matchScore >= minMatchScore;
    
    const matchesPosition = positionFilter === "all" || 
      profile.Jobtitle.toLowerCase().includes(positionFilter.toLowerCase()) ||
      profile.DesiredJobTitle.toLowerCase().includes(positionFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesScore && matchesPosition;
  });
  
  // Get unique positions for filter dropdown
  const uniquePositions = Array.from(new Set(
    applications
      .map(app => parseProfile(app.profilesSnapshot)?.Jobtitle)
      .filter(Boolean)
  ));

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
            {sortedApps.length === applications.length ? (
              <span>AI-ranked candidates who applied for this position ({applications.length} total)</span>
            ) : (
              <span>
                Showing <strong className="text-foreground">{sortedApps.length}</strong> of {applications.length} candidates
                {(statusFilter !== "all" || minMatchScore > 0 || positionFilter !== "all" || searchTerm !== "") && (
                  <span className="ml-2 text-primary">(filtered)</span>
                )}
              </span>
            )}
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 shadow-lg border-2">
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filter & Sort Candidates</h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setMinMatchScore(0);
                  setPositionFilter("all");
                }}
              >
                Reset Filters
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  placeholder="Search candidates..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-yellow-500"></span>
                      {' '}Pending
                    </span>
                  </SelectItem>
                  <SelectItem value="viewed">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                      {' '}Viewed
                    </span>
                  </SelectItem>
                  <SelectItem value="interview">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      {' '}Interview
                    </span>
                  </SelectItem>
                  <SelectItem value="hired">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                      {' '}Hired
                    </span>
                  </SelectItem>
                  <SelectItem value="rejected">
                    <span className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                      {' '}Rejected
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
              
              {/* Match Score Filter */}
              <Select value={minMatchScore.toString()} onValueChange={(val) => setMinMatchScore(Number(val))}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Min Match Score" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">All Scores (0%+)</SelectItem>
                  <SelectItem value="50">Good Match (50%+)</SelectItem>
                  <SelectItem value="70">Great Match (70%+)</SelectItem>
                  <SelectItem value="85">Excellent Match (85%+)</SelectItem>
                  <SelectItem value="95">Perfect Match (95%+)</SelectItem>
                </SelectContent>
              </Select>
              
              {/* Position Filter */}
              <Select value={positionFilter} onValueChange={setPositionFilter}>
                <SelectTrigger className="border-2">
                  <SelectValue placeholder="Filter by Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {uniquePositions.map((position) => (
                    <SelectItem key={position} value={position || ""}>
                      {position}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Match Score (High to Low)</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Active Filters Summary */}
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              <span className="text-sm font-medium">Active filters:</span>
              {searchTerm && (
                <Badge variant="secondary">Search: {searchTerm}</Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary">Status: {statusFilter}</Badge>
              )}
              {minMatchScore > 0 && (
                <Badge variant="secondary">Score: {minMatchScore}%+</Badge>
              )}
              {positionFilter !== "all" && (
                <Badge variant="secondary">Position: {positionFilter}</Badge>
              )}
              {searchTerm === "" && statusFilter === "all" && minMatchScore === 0 && positionFilter === "all" && (
                <span className="text-sm text-muted-foreground">None</span>
              )}
            </div>
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
                      <div className="flex items-center gap-2">
                        <Button 
                          className="gradient-primary gap-2" 
                          onClick={() => handleViewDetails(app)}
                        >
                          <FileText className="h-4 w-4" />
                          View Details
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              disabled={updatingStatus === app.id}
                              className="border-2 hover:border-primary hover:bg-primary/10"
                            >
                              {updatingStatus === app.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <MoreVertical className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                              Change Status
                            </div>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(app.id, "Interview")}
                              className="gap-2 cursor-pointer hover:bg-purple-50 dark:hover:bg-purple-950 py-3"
                            >
                              <Calendar className="h-4 w-4 text-purple-600" />
                              <div className="flex flex-col">
                                <span className="font-medium">Schedule Interview</span>
                                <span className="text-xs text-muted-foreground">Move to interview stage</span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(app.id, "Hired")}
                              className="gap-2 cursor-pointer hover:bg-green-50 dark:hover:bg-green-950 py-3"
                            >
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <div className="flex flex-col">
                                <span className="font-medium text-green-700 dark:text-green-400">Accept (Hired)</span>
                                <span className="text-xs text-muted-foreground">Offer the job</span>
                              </div>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleStatusChange(app.id, "Rejected")}
                              className="gap-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950 py-3"
                            >
                              <XCircle className="h-4 w-4 text-red-600" />
                              <div className="flex flex-col">
                                <span className="font-medium text-red-700 dark:text-red-400">Reject</span>
                                <span className="text-xs text-muted-foreground">Decline application</span>
                              </div>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Candidate Detail Modal */}
        {selectedApplication && (
          <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCloseModal()}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
              <DialogHeader className="flex-shrink-0">
                <DialogTitle className="text-2xl">Candidate Profile & AI Analysis</DialogTitle>
                <DialogDescription>
                  Detailed view of candidate's CV and AI matching analysis
                </DialogDescription>
              </DialogHeader>

              {/* Action Buttons */}
              <div className="flex-shrink-0 flex items-center justify-between p-4 bg-gradient-to-r from-muted/30 to-muted/50 rounded-lg border-2 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold">Application Status:</span>
                  <Badge className={`${getStatusColor(selectedApplication.status)} text-sm px-3 py-1 shadow-sm`}>
                    {selectedApplication.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplication.id, "Interview")}
                    disabled={updatingStatus === selectedApplication.id}
                    className="gap-2 border-2 border-purple-300 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-400 dark:border-purple-700 dark:hover:bg-purple-950 shadow-sm"
                  >
                    <Calendar className="h-4 w-4" />
                    Schedule Interview
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplication.id, "Hired")}
                    disabled={updatingStatus === selectedApplication.id}
                    className="gap-2 bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-all"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Accept (Hired)
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleStatusChange(selectedApplication.id, "Rejected")}
                    disabled={updatingStatus === selectedApplication.id}
                    className="gap-2 shadow-md hover:shadow-lg transition-all"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                  {updatingStatus === selectedApplication.id && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                </div>
              </div>

              <Tabs defaultValue="cv" className="flex-1 flex flex-col min-h-0">
                <TabsList className="flex-shrink-0 grid w-full grid-cols-2">
                  <TabsTrigger value="cv" className="gap-2">
                    <FileText className="h-4 w-4" />
                    CV Preview
                  </TabsTrigger>
                  <TabsTrigger value="analysis" className="gap-2">
                    <Brain className="h-4 w-4" />
                    AI Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="cv" className="flex-1 overflow-y-auto mt-4">
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

                <TabsContent value="analysis" className="flex-1 overflow-y-auto mt-4 p-4">
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
