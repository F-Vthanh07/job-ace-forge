import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, MapPin, Briefcase, DollarSign, Calendar, Building2, Users, TrendingUp, FileCheck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { jobService, JobData } from "@/services/jobService";
import { applicationService, ApplicationResponse } from "@/services/applicationService";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Jobs = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [applications, setApplications] = useState<ApplicationResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<ApplicationResponse | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobData | null>(null);
  const [loadingJobDetail, setLoadingJobDetail] = useState(false);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (activeTab === "applied") {
      loadApplications();
    }
  }, [activeTab]);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.getAllJobs();
      
      if (response.success && response.data) {
        // Filter only active jobs
        const activeJobs = response.data.filter(job => job.isActive);
        setJobs(activeJobs);
        console.log("✅ Loaded jobs:", activeJobs.length);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load jobs",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    setLoadingApplications(true);
    try {
      const accountId = localStorage.getItem("accountId");
      
      if (!accountId) {
        toast({
          title: "Error",
          description: "Please login to view your applications",
          variant: "destructive",
        });
        return;
      }

      const response = await applicationService.getApplicationsByCandidateId(accountId);
      
      if (response.success && response.data) {
        setApplications(response.data);
        console.log("✅ Loaded applications:", response.data.length);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load applications",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading applications:", error);
      toast({
        title: "Error",
        description: "Failed to load applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoadingApplications(false);
    }
  };

  const formatSalary = (job: JobData) => {
    const min = job.minSalary.toLocaleString();
    const max = job.maxSalary.toLocaleString();
    const negotiable = job.isNegotiable ? " (Negotiable)" : "";
    return `${min} - ${max} ${job.currency}${negotiable}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getLocationString = (job: JobData) => {
    if (!job.address) return "Not specified";
    const { wardName, districtName, cityName } = job.address;
    return `${wardName}, ${districtName}, ${cityName}`;
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

  const getJobFromApplication = (app: ApplicationResponse): Partial<JobData> => {
    try {
      const snapshot = JSON.parse(app.profilesSnapshot);
      return {
        id: app.jobPostingId,
        title: snapshot.Jobtitle || "Job Title",
        companyName: "Company",
        jobType: snapshot.JobType || "Full-time",
      } as Partial<JobData>;
    } catch {
      return {
        id: app.jobPostingId,
        title: "Job Title",
        companyName: "Company",
        jobType: "Full-time",
      } as Partial<JobData>;
    }
  };

  const handleViewJobFromApplication = async (app: ApplicationResponse) => {
    setSelectedApplication(app);
    setIsModalOpen(true);
    setLoadingJobDetail(true);
    
    try {
      const response = await jobService.getJobById(app.jobPostingId);
      if (response.success && response.data) {
        setSelectedJob(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load job details",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading job details:", error);
      toast({
        title: "Error",
        description: "Failed to load job details",
        variant: "destructive",
      });
    } finally {
      setLoadingJobDetail(false);
    }
  };

  // Filter jobs based on search and location
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === "" || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === "" ||
      (job.address && (
        job.address.cityName.toLowerCase().includes(locationFilter.toLowerCase()) ||
        job.address.districtName.toLowerCase().includes(locationFilter.toLowerCase()) ||
        job.address.wardName.toLowerCase().includes(locationFilter.toLowerCase())
      ));
    
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("jobs.title")}</h1>
          <p className="text-muted-foreground">{t("dashboard.findJobsDesc")}</p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4" />
              All Jobs
            </TabsTrigger>
            <TabsTrigger value="applied" className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              Applied Jobs
            </TabsTrigger>
          </TabsList>

          {/* All Jobs Tab */}
          <TabsContent value="all" className="mt-6">
            {/* Search & Filter */}
            <Card className="p-6 mb-8">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder={t("welcome.searchPlaceholder")} 
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input 
                    placeholder={t("welcome.locationPlaceholder")} 
                    className="pl-10"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                  />
                </div>
              </div>
              
              {/* Results count */}
              <div className="mt-4 text-sm text-muted-foreground">
                {loading ? (
                  <Skeleton className="h-4 w-32" />
                ) : (
                  `Found ${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''}`
                )}
              </div>
            </Card>

            {/* Job Listings */}
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card className="p-12 text-center">
                <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || locationFilter
                    ? "Try adjusting your search filters"
                    : "No active job postings available at the moment"}
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredJobs.map((job) => (
                  <Card key={job.id} className="p-6 hover:shadow-lg transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="gradient-primary p-3 rounded-lg">
                            <Briefcase className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Building2 className="h-4 w-4" />
                              <span>{job.companyName}</span>
                              <span className="text-xs">•</span>
                              <span className="text-sm">{job.recruiterName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3 mb-3">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            {getLocationString(job)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            {formatSalary(job)}
                          </div>
                          <Badge variant="secondary">{job.jobType}</Badge>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            {job.quantity} positions
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {formatDate(job.createTime)}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {job.description}
                        </p>

                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">
                            {job.yearsOfExperience}+ years exp
                          </Badge>
                          <Badge variant="outline">
                            {job.viewCount} views
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <Button className="gradient-primary" asChild>
                          <Link to={`/job-detail/${job.id}`}>{t("common.viewDetails")}</Link>
                        </Button>
                        <Button variant="outline">{t("jobs.saveJob")}</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Applied Jobs Tab */}
          <TabsContent value="applied" className="mt-6">
            {loadingApplications ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-24" />
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : applications.length === 0 ? (
              <Card className="p-12 text-center">
                <FileCheck className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">No applications yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't applied to any jobs yet. Start exploring opportunities!
                </p>
                <Button onClick={() => setActiveTab("all")}>Browse Jobs</Button>
              </Card>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  {applications.length} application{applications.length !== 1 ? 's' : ''} found
                </div>
                {applications.map((app) => {
                  const jobInfo = getJobFromApplication(app);
                  return (
                    <Card key={app.id} className="p-6 hover:shadow-lg transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3 mb-3">
                            <div className="gradient-primary p-3 rounded-lg">
                              <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold mb-1">{jobInfo.title}</h3>
                              <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <Building2 className="h-4 w-4" />
                                <span>{jobInfo.companyName}</span>
                              </div>
                              
                              {/* Match Score and Status */}
                              <div className="flex items-center gap-3 mt-3">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="h-4 w-4 text-primary" />
                                  <span className="text-sm font-semibold">Match Score:</span>
                                  <Badge variant="secondary" className="text-lg font-bold">
                                    {app.matchScore}%
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold">Status:</span>
                                  <Badge className={getStatusColor(app.status)}>
                                    {app.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge variant="secondary">{jobInfo.jobType}</Badge>
                            {app.cvUrl && (
                              <Badge variant="outline">External CV Provided</Badge>
                            )}
                            {app.coverLetter && (
                              <Badge variant="outline">Cover Letter Included</Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <Button 
                            className="gradient-primary" 
                            onClick={() => handleViewJobFromApplication(app)}
                          >
                            View Job
                          </Button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Job Detail Modal for Applied Jobs */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-2xl">Job Details & Application</DialogTitle>
              <DialogDescription>
                View job posting information and your application status
              </DialogDescription>
            </DialogHeader>

            <div className="overflow-y-auto max-h-[calc(90vh-120px)] pr-2">
              {loadingJobDetail ? (
                <div className="space-y-4 p-4">
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-24 w-full" />
                </div>
              ) : selectedJob && selectedApplication ? (
                <div className="space-y-6">
                  {/* Application Status Section */}
                  <Card className="p-6 bg-primary/5 border-primary/20">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-primary" />
                      Your Application
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Match Score</p>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <Badge variant="secondary" className="text-xl font-bold">
                            {selectedApplication.matchScore}%
                          </Badge>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Application Status</p>
                        <Badge className={getStatusColor(selectedApplication.status)}>
                          {selectedApplication.status}
                        </Badge>
                      </div>
                      {selectedApplication.cvUrl && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-muted-foreground mb-1">External CV</p>
                          <a 
                            href={selectedApplication.cvUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-primary hover:underline flex items-center gap-1"
                          >
                            View your submitted CV
                          </a>
                        </div>
                      )}
                      {selectedApplication.coverLetter && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-muted-foreground mb-2">Cover Letter</p>
                          <div className="bg-background p-4 rounded-lg border">
                            <p className="text-sm whitespace-pre-wrap">{selectedApplication.coverLetter}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </Card>

                  {/* Job Information Section */}
                  <div>
                    <h3 className="text-2xl font-bold mb-4">{selectedJob.title}</h3>
                    
                    <div className="space-y-4">
                      {/* Company Info */}
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Building2 className="h-5 w-5" />
                        <span className="font-semibold">{selectedJob.companyName}</span>
                        <span>•</span>
                        <span>{selectedJob.recruiterName}</span>
                      </div>

                      {/* Job Details Grid */}
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Location</p>
                            <p className="font-medium">{getLocationString(selectedJob)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Salary Range</p>
                            <p className="font-medium">{formatSalary(selectedJob)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Job Type</p>
                            <Badge variant="secondary">{selectedJob.jobType}</Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Open Positions</p>
                            <p className="font-medium">{selectedJob.quantity}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Posted</p>
                            <p className="font-medium">{formatDate(selectedJob.createTime)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Experience Required</p>
                            <p className="font-medium">{selectedJob.yearsOfExperience}+ years</p>
                          </div>
                        </div>
                      </div>

                      {/* Job Description */}
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Job Description</h4>
                        <div className="bg-muted/50 p-4 rounded-lg">
                          <p className="whitespace-pre-wrap">{selectedJob.description}</p>
                        </div>
                      </div>

                      {/* Benefits */}
                      {selectedJob.benefits && (
                        <div>
                          <h4 className="font-semibold text-lg mb-2">Benefits</h4>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="whitespace-pre-wrap">{selectedJob.benefits}</p>
                          </div>
                        </div>
                      )}

                      {/* Requirements */}
                      {selectedJob.requirements && (
                        <div>
                          <h4 className="font-semibold text-lg mb-2">Requirements</h4>
                          <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="whitespace-pre-wrap">{selectedJob.requirements}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  Failed to load job details
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Jobs;
