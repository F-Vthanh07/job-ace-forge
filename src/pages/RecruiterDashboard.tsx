import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Users, TrendingUp, Clock, Plus, Loader2, XCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { companyService, CompanyData } from "@/services/companyService";
import { notifyError, notifySuccess } from "@/utils/notification";

const RecruiterDashboard = () => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Delay fetching company data by 2 seconds to ensure user data is properly stored after login
    const timeoutId = setTimeout(() => {
      fetchRecruiterCompany();
    }, 2000);

    // Cleanup timeout on component unmount
    return () => clearTimeout(timeoutId);
  }, []);

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

  const recentApplications = [
    { name: "John Doe", role: "Senior Frontend Developer", score: 92, time: "2 hours ago" },
    { name: "Jane Smith", role: "Full Stack Engineer", score: 88, time: "5 hours ago" },
    { name: "Mike Johnson", role: "React Developer", score: 85, time: "1 day ago" },
  ];

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
              <Link to="/candidates">View All</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div
                key={app.name}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                    {app.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{app.name}</h3>
                    <p className="text-sm text-muted-foreground">{app.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-success">{app.score}% Match</p>
                    <p className="text-xs text-muted-foreground">{app.time}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/candidate-report/${app.name.replace(' ', '-').toLowerCase()}`}>
                      Review
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Job Listings */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Active Job Listings</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <JobListingCard
              title="Senior Frontend Developer"
              applicants={45}
              views={312}
              daysLeft={12}
            />
            <JobListingCard
              title="Full Stack Engineer"
              applicants={38}
              views={267}
              daysLeft={8}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const JobListingCard = ({ 
  title, 
  applicants, 
  views, 
  daysLeft 
}: { 
  title: string; 
  applicants: number; 
  views: number; 
  daysLeft: number;
}) => (
  <div className="p-4 rounded-lg border">
    <h3 className="font-semibold mb-3">{title}</h3>
    <div className="grid grid-cols-3 gap-2 text-sm mb-3">
      <div>
        <p className="text-muted-foreground">Applicants</p>
        <p className="font-bold">{applicants}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Views</p>
        <p className="font-bold">{views}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Days Left</p>
        <p className="font-bold">{daysLeft}</p>
      </div>
    </div>
    <Button variant="outline" size="sm" className="w-full">
      Manage
    </Button>
  </div>
);

export default RecruiterDashboard;
