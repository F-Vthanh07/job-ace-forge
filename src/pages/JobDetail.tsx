import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Briefcase, MapPin, DollarSign, Clock, Building2, Share2, Heart, Users, Calendar, CheckCircle2, TrendingUp, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { jobService, JobData } from "@/services/jobService";
import { useToast } from "@/hooks/use-toast";
import { ApplyJobDialog } from "@/components/ApplyJobDialog";

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showApplyDialog, setShowApplyDialog] = useState(false);
  const [applicationResult, setApplicationResult] = useState<{
    matchScore: number;
    status: string;
  } | null>(null);

  useEffect(() => {
    if (id) {
      loadJobDetail(id);
    }
  }, [id]);

  const loadJobDetail = async (jobId: string) => {
    setLoading(true);
    try {
      const response = await jobService.getJobById(jobId);
      
      if (response.success && response.data) {
        setJob(response.data);
        console.log("✅ Loaded job detail:", response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load job details",
          variant: "destructive",
        });
        setTimeout(() => navigate("/jobs"), 2000);
      }
    } catch (error) {
      console.error("Error loading job detail:", error);
      toast({
        title: "Error",
        description: "Failed to load job details. Please try again.",
        variant: "destructive",
      });
      setTimeout(() => navigate("/jobs"), 2000);
    } finally {
      setLoading(false);
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

  const handleApplicationSuccess = (matchScore: number, status: string) => {
    setApplicationResult({ matchScore, status });
    toast({
      title: "Application Submitted Successfully!",
      description: `Match Score: ${matchScore}% - Status: ${status}`,
    });
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto space-y-6">
            <Button
              variant="outline"
              onClick={() => navigate("/jobs")}
              className="mb-6 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Button>
            <Card className="p-8">
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-4" />
              <div className="flex gap-3 mb-6">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
              <Skeleton className="h-12 w-40" />
            </Card>
            <Card className="p-6">
              <Skeleton className="h-64" />
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <Button
              variant="outline"
              onClick={() => navigate("/jobs")}
              className="mb-6 gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Jobs
            </Button>
            <Card className="p-12 text-center">
              <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">Job not found</h3>
              <p className="text-muted-foreground mb-4">The job you're looking for doesn't exist or has been removed.</p>
              <Button onClick={() => navigate("/jobs")}>Back to Jobs</Button>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <Button
            variant="outline"
            onClick={() => navigate("/jobs")}
            className="mb-6 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Jobs
          </Button>

          {/* Application Result Alert */}
          {applicationResult && (
            <Alert className="mb-6 border-2 bg-green-50 dark:bg-green-950/20 border-green-500/30">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertTitle className="text-green-800 dark:text-green-200 font-semibold">
                Application Submitted Successfully!
              </AlertTitle>
              <AlertDescription className="mt-2 space-y-2">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">Match Score:</span>
                    <Badge variant="secondary" className="text-lg font-bold">
                      {applicationResult.matchScore}%
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    <Badge className={getStatusColor(applicationResult.status)}>
                      {applicationResult.status}
                    </Badge>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your application has been submitted and is being reviewed by the employer.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Header */}
          <Card className="p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex gap-4">
                <div className="gradient-primary p-4 rounded-lg">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                  <div className="flex items-center gap-2 mb-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <p className="text-xl text-muted-foreground">{job.companyName}</p>
                    <span className="text-xs">•</span>
                    <span className="text-sm text-muted-foreground">{job.recruiterName}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      {getLocationString(job)}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {formatSalary(job)}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {formatDate(job.createTime)}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      {job.quantity} positions
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary">{job.jobType}</Badge>
                    <Badge variant="outline">{job.yearsOfExperience}+ years experience</Badge>
                    <Badge variant={job.isActive ? "default" : "destructive"}>
                      {job.isActive ? "Active" : "Closed"}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                size="lg" 
                className="gradient-primary shadow-glow"
                onClick={() => setShowApplyDialog(true)}
                disabled={!job.isActive || !!applicationResult}
              >
                {applicationResult ? "Already Applied" : "Apply Now"}
              </Button>
              <Button size="lg" variant="outline">
                Save for Later
              </Button>
            </div>
          </Card>

          {/* Job Stats */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Job Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Posted Date</p>
                  <p className="font-semibold">{new Date(job.createTime).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expiry Date</p>
                  <p className="font-semibold">{new Date(job.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Open Positions</p>
                  <p className="font-semibold">{job.quantity}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Experience Required</p>
                  <p className="font-semibold">{job.yearsOfExperience}+ years</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Job Description */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <div className="space-y-4 text-muted-foreground">
              <p className="whitespace-pre-line">{job.description}</p>
            </div>
          </Card>

          {/* Requirements */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Requirements</h2>
            <div className="text-muted-foreground whitespace-pre-line">
              {job.requirement}
            </div>
          </Card>

          {/* Benefits */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Benefits</h2>
            <div className="text-muted-foreground whitespace-pre-line">
              {job.benefits}
            </div>
          </Card>
        </div>
      </div>

      {/* Apply Job Dialog */}
      {job && (
        <ApplyJobDialog
          open={showApplyDialog}
          onOpenChange={setShowApplyDialog}
          job={job}
          onApplicationSuccess={handleApplicationSuccess}
        />
      )}
    </div>
  );
};

export default JobDetail;
