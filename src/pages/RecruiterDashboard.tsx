import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Users, TrendingUp, Clock, Plus, Loader2, XCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { companyService, CompanyData } from "@/services/companyService";
import { notifyError, notifySuccess } from "@/utils/notification";
import { jobService } from "@/services/jobService";
import { applicationService, ApplicationResponse } from "@/services/applicationService";

interface RecentApplication {
  applicationId: string;
  candidateName: string;
  candidateId: string;
  jobTitle: string;
  jobPostingId: string;
  matchScore: number;
  appliedTime: string;
  status: string;
}

interface ActiveJobListing {
  id: string;
  title: string;
  applicants: number;
  views: number;
  daysLeft: number;
}

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [recentApplications, setRecentApplications] = useState<RecentApplication[]>([]);
  const [loadingApplications, setLoadingApplications] = useState(false);
  const [activeJobs, setActiveJobs] = useState<ActiveJobListing[]>([]);
  const [loadingActiveJobs, setLoadingActiveJobs] = useState(false);

  useEffect(() => {
    // Delay fetching company data by 2 seconds to ensure user data is properly stored after login
    const timeoutId = setTimeout(() => {
      fetchRecruiterCompany();
    }, 2000);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, []);

  useEffect(() => {
    if (companyData?.id) {
      fetchRecentApplications(companyData.id);
      fetchActiveJobs(companyData.id);
    }
  }, [companyData]);

  const fetchRecruiterCompany = async () => {
    try {
      setLoading(true);
      
      console.log("🔍 Loading company data...");
      
      // First try to get company data from localStorage (cached from login)
      const cachedCompany = companyService.getCompanyFromLocalStorage();
      if (cachedCompany) {
        console.log("✅ Found cached company data:", cachedCompany.name);
        setCompanyData(cachedCompany);
        setLoading(false);
        return;
      }

      console.log("⚠️ No cached company data, fetching from API...");
      
      // Get recruiter account ID from localStorage (stored during login)
      const userDataString = localStorage.getItem("user");
      if (!userDataString) {
        console.error("❌ User data not found in localStorage");
        notifyError({
          title: "Error",
          description: "User data not found. Please login again."
        });
        setLoading(false);
        return;
      }

      const userData = JSON.parse(userDataString);
      const recruiterId = userData.id;

      if (!recruiterId) {
        console.error("❌ Recruiter ID not found in user data");
        notifyError({
          title: "Error",
          description: "Invalid user data. Please login again."
        });
        setLoading(false);
        return;
      }

      console.log("📤 Fetching company for recruiter ID:", recruiterId);

      // Call API to get company by recruiter ID
      const response = await companyService.getCompanyByRecruiterId(recruiterId);

      if (response.success && response.data) {
        console.log("✅ Company data loaded:", response.data.name);
        setCompanyData(response.data);
        notifySuccess({
          title: "Success",
          description: `Welcome to ${response.data.name}!`
        });
      } else {
        console.error("❌ Failed to load company:", response.message);
        notifyError({
          title: "Error",
          description: response.message || "Failed to load company data"
        });
      }
    } catch (error) {
      console.error("❌ Error fetching company:", error);
      notifyError({
        title: "Error",
        description: "Failed to load company information"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentApplications = async (companyId: string) => {
    try {
      setLoadingApplications(true);
      console.log("📤 Fetching recent applications for company:", companyId);

      // First, get all jobs for this company
      const jobsResponse = await jobService.getJobsByCompanyId(companyId);
      
      if (!jobsResponse.success || !jobsResponse.data) {
        console.log("⚠️ No jobs found for company");
        setRecentApplications([]);
        return;
      }

      const jobs = jobsResponse.data;
      console.log(`✅ Found ${jobs.length} jobs`);

      // Fetch applications for all jobs
      const allApplicationsPromises = jobs.map(job => 
        applicationService.getApplicationsByJobPostingId(job.id)
      );

      const allApplicationsResponses = await Promise.all(allApplicationsPromises);
      
      // Combine all applications
      const allApplications: RecentApplication[] = [];
      
      allApplicationsResponses.forEach((response, index) => {
        if (response.success && response.data) {
          const job = jobs[index];
          response.data.forEach((app: ApplicationResponse) => {
            try {
              const profile = JSON.parse(app.profilesSnapshot);
              allApplications.push({
                applicationId: app.id,
                candidateName: profile.FullName || "Unknown",
                candidateId: app.candidateId,
                jobTitle: job.title,
                jobPostingId: app.jobPostingId,
                matchScore: app.matchScore,
                appliedTime: new Date().toISOString(), // API doesn't return application time, using current
                status: app.status,
              });
            } catch (error) {
              console.error("Error parsing profile snapshot:", error);
            }
          });
        }
      });

      // Sort by most recent (in real scenario, should use actual application timestamp)
      // For now, just take first 5
      const recent = allApplications.slice(0, 5);
      
      console.log(`✅ Loaded ${allApplications.length} total applications, showing ${recent.length} recent`);
      setRecentApplications(recent);

    } catch (error) {
      console.error("❌ Error fetching recent applications:", error);
    } finally {
      setLoadingApplications(false);
    }
  };

  const handleReviewCandidate = (jobPostingId: string, applicationId: string) => {
    // Navigate to candidates page with job and application ID
    navigate(`/candidates?job=${jobPostingId}&application=${applicationId}`);
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const fetchActiveJobs = async (companyId: string) => {
    try {
      setLoadingActiveJobs(true);
      console.log("📤 Fetching active jobs for dashboard...");

      // Fetch all jobs for the company
      const jobsResponse = await jobService.getJobsByCompanyId(companyId);
      
      if (!jobsResponse.success || !jobsResponse.data) {
        console.error("❌ Failed to fetch jobs:", jobsResponse.message);
        return;
      }

      const jobs = jobsResponse.data.filter(job => job.isActive);
      console.log(`✅ Found ${jobs.length} active jobs`);

      // For each job, fetch applications count
      const jobsWithDataPromises = jobs.map(async (job) => {
        try {
          const applicationsResponse = await applicationService.getApplicationsByJobPostingId(job.id);
          const applicantsCount = applicationsResponse.success && applicationsResponse.data
            ? applicationsResponse.data.length
            : 0;

          // Calculate days left
          const expiryDate = new Date(job.expiryDate);
          const today = new Date();
          const diffTime = expiryDate.getTime() - today.getTime();
          const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

          return {
            id: job.id,
            title: job.title,
            applicants: applicantsCount,
            views: job.viewCount || 0,
            daysLeft: Math.max(0, daysLeft), // Don't show negative days
          };
        } catch (error) {
          console.error(`Error fetching data for job ${job.id}:`, error);
          return {
            id: job.id,
            title: job.title,
            applicants: 0,
            views: job.viewCount || 0,
            daysLeft: 0,
          };
        }
      });

      const jobsWithData = await Promise.all(jobsWithDataPromises);
      
      // Sort by most applicants and take top jobs
      const sortedJobs = jobsWithData.sort((a, b) => b.applicants - a.applicants);
      
      console.log(`✅ Active jobs data loaded:`, sortedJobs);
      setActiveJobs(sortedJobs);

    } catch (error) {
      console.error("❌ Error fetching active jobs:", error);
    } finally {
      setLoadingActiveJobs(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading company information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if company verification status is Pending or Rejected
  if (companyData && (companyData.verificationStatus === "Pending" || companyData.verificationStatus === "Rejected")) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <Card className="max-w-2xl w-full p-8">
            <div className="text-center">
              {companyData.verificationStatus === "Pending" ? (
                <>
                  <AlertCircle className="h-20 w-20 mx-auto mb-6 text-warning" />
                  <h1 className="text-3xl font-bold mb-4">Company Verification Pending</h1>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Your company <span className="font-semibold text-foreground">{companyData.name}</span> is currently under review.
                  </p>
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-6 mb-6">
                    <p className="text-sm text-foreground">
                      Our team is reviewing your company information. This process typically takes 1-2 business days.
                      You will receive a notification once the verification is complete.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <XCircle className="h-20 w-20 mx-auto mb-6 text-destructive" />
                  <h1 className="text-3xl font-bold mb-4">Company Verification Rejected</h1>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Unfortunately, your company <span className="font-semibold text-foreground">{companyData.name}</span> verification has been rejected.
                  </p>
                  {companyData.notiMess && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold mb-2 text-destructive">Reason for Rejection:</h3>
                      <p className="text-sm text-foreground">{companyData.notiMess}</p>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground mb-6">
                    Please update your company information and resubmit for verification.
                  </p>
                </>
              )}
              
              <div className="flex gap-4 justify-center">
                <Button variant="outline" asChild>
                  <Link to="/business-profile">View Company Profile</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/">Go to Home</Link>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Recruitment Dashboard</h1>
            <p className="text-muted-foreground">
              {companyData?.name || "TechCorp Vietnam"}
            </p>
            {companyData && (
              <div className="flex items-center gap-2 mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  companyData.verificationStatus === "Verified" 
                    ? "bg-success/10 text-success" 
                    : "bg-warning/10 text-warning"
                }`}>
                  {companyData.verificationStatus}
                </span>
                <span className="text-sm text-muted-foreground">
                  {companyData.industry}
                </span>
              </div>
            )}
          </div>
          <Button className="gradient-primary shadow-glow" size="lg" asChild>
            <Link to="/post-job">
              <Plus className="h-5 w-5 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Jobs"
            value="8"
            subtitle="2 closing soon"
            icon={Briefcase}
          />
          <StatCard
            title="Total Applicants"
            value="142"
            subtitle="This month"
            icon={Users}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Avg. Match Score"
            value="86%"
            subtitle="Across all jobs"
            icon={TrendingUp}
          />
          <StatCard
            title="Time to Fill"
            value="18"
            subtitle="Days average"
            icon={Clock}
          />
        </div>

        {/* Recent Applications */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Applications</h2>
            <Button variant="outline" asChild>
              <Link to="/manage-jobs">View All Jobs</Link>
            </Button>
          </div>

          {loadingApplications ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : recentApplications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No applications yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app.applicationId}
                  className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                      {app.candidateName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-semibold">{app.candidateName}</h3>
                      <p className="text-sm text-muted-foreground">{app.jobTitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-primary">{app.matchScore}% Match</p>
                      <p className="text-xs text-muted-foreground">{getTimeAgo(app.appliedTime)}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleReviewCandidate(app.jobPostingId, app.applicationId)}
                    >
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Active Job Listings */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Active Job Listings</h2>
            <Link to="/manage-jobs">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>
          
          {loadingActiveJobs ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : activeJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Active Jobs</h3>
              <p className="text-muted-foreground mb-4">You haven't posted any jobs yet</p>
              <Link to="/post-job">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post a Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {activeJobs.slice(0, 6).map((job) => (
                <JobListingCard
                  key={job.id}
                  id={job.id}
                  title={job.title}
                  applicants={job.applicants}
                  views={job.views}
                  daysLeft={job.daysLeft}
                  onManage={() => navigate(`/candidates?job=${job.id}`)}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

const JobListingCard = ({ 
  id,
  title, 
  applicants, 
  views, 
  daysLeft,
  onManage 
}: { 
  id: string;
  title: string; 
  applicants: number; 
  views: number; 
  daysLeft: number;
  onManage?: () => void;
}) => (
  <div className="p-4 rounded-lg border hover:border-primary transition-colors">
    <h3 className="font-semibold mb-3 truncate" title={title}>{title}</h3>
    <div className="grid grid-cols-3 gap-2 text-sm mb-3">
      <div>
        <p className="text-muted-foreground">Applicants</p>
        <p className="font-bold text-lg">{applicants}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Views</p>
        <p className="font-bold text-lg">{views}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Days Left</p>
        <p className={`font-bold text-lg ${
          daysLeft === 0 ? "text-red-600" : 
          daysLeft <= 3 ? "text-orange-600" : 
          "text-green-600"
        }`}>
          {daysLeft === 0 ? "Expired" : daysLeft}
        </p>
      </div>
    </div>
    <Button 
      variant="outline" 
      size="sm" 
      className="w-full"
      onClick={onManage}
    >
      Manage
    </Button>
  </div>
);

export default RecruiterDashboard;
