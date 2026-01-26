import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { 
  Briefcase, 
  Eye, 
  Users, 
  Edit, 
  Trash2, 
  Power, 
  PowerOff,
  Plus,
  Loader2
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { jobService, JobData, JobPostingRequest } from "@/services/jobService";
import { useToast } from "@/hooks/use-toast";

const ManageJobs = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [togglingStatus, setTogglingStatus] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<JobData | null>(null);
  const [editFormData, setEditFormData] = useState<JobPostingRequest | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      console.log("📋 Fetching jobs from API");

      // Get company data from localStorage
      const companyDataStr = localStorage.getItem("recruiterCompany");
      if (!companyDataStr) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Company information not found. Please login again.",
        });
        return;
      }

      const companyData = JSON.parse(companyDataStr);
      console.log("🏢 Company data:", companyData);

      if (!companyData.id) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Company ID not found.",
        });
        return;
      }

      const response = await jobService.getJobsByCompanyId(companyData.id);
      console.log("📡 API Response:", response);

      if (response.success && response.data) {
        setJobs(response.data);
        toast({
          title: "Success",
          description: `Loaded ${response.data.length} job posting(s)`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to load jobs",
        });
      }
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load jobs. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getFilteredAndSortedJobs = () => {
    let filtered = jobs;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => {
        if (statusFilter === "active") return job.isActive;
        if (statusFilter === "inactive") return !job.isActive;
        return true;
      });
    }

    // Sort
    const sorted = [...filtered];
    if (sortBy === "recent") {
      sorted.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
    } else if (sortBy === "views") {
      sorted.sort((a, b) => b.viewCount - a.viewCount);
    }

    return sorted;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const handleToggleStatus = async (job: JobData) => {
    try {
      setTogglingStatus(job.id);
      console.log(`🔄 Toggling status for job: ${job.id}, current: ${job.isActive}`);

      const response = await jobService.toggleJobStatus(job);

      if (response.success) {
        // Update local state
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.id === job.id ? { ...j, isActive: !j.isActive } : j
          )
        );

        toast({
          title: "Success",
          description: `Job ${!job.isActive ? "activated" : "deactivated"} successfully`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to update job status",
        });
      }
    } catch (error) {
      console.error("❌ Error toggling job status:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update job status. Please try again.",
      });
    } finally {
      setTogglingStatus(null);
    }
  };

  const handleEditClick = (job: JobData) => {
    setEditingJob(job);
    setEditFormData({
      title: job.title,
      jobType: job.jobType,
      quantity: job.quantity,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      currency: job.currency,
      isNegotiable: job.isNegotiable,
      description: job.description,
      requirement: job.requirement,
      benefits: job.benefits,
      yearsOfExperience: job.yearsOfExperience,
      expiryDate: job.expiryDate.split("T")[0],
      isActive: job.isActive,
    });
  };

  const handleEditFormChange = (field: string, value: any) => {
    if (!editFormData) return;
    setEditFormData({
      ...editFormData,
      [field]: value,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingJob || !editFormData) return;

    // Validation
    if (!editFormData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Job title is required",
      });
      return;
    }

    if (editFormData.minSalary > editFormData.maxSalary) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Minimum salary cannot be greater than maximum salary",
      });
      return;
    }

    try {
      setSubmitting(true);
      console.log("📤 Updating job:", editFormData);

      const response = await jobService.updateJobPosting(editingJob.id, editFormData);

      if (response.success) {
        // Update local state
        setJobs((prevJobs) =>
          prevJobs.map((j) =>
            j.id === editingJob.id ? { ...j, ...editFormData } : j
          )
        );

        toast({
          title: "Success",
          description: "Job updated successfully",
        });

        setEditingJob(null);
        setEditFormData(null);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to update job",
        });
      }
    } catch (error) {
      console.error("❌ Error updating job:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const displayedJobs = getFilteredAndSortedJobs();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Job Posts</h1>
            <p className="text-muted-foreground">View and manage all your job postings</p>
          </div>
          <Button className="gradient-primary shadow-glow" asChild>
            <Link to="/post-job">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs ({jobs.length})</SelectItem>
              <SelectItem value="active">Active ({jobs.filter(j => j.isActive).length})</SelectItem>
              <SelectItem value="inactive">Inactive ({jobs.filter(j => !j.isActive).length})</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="views">Most Views</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading jobs...</span>
          </div>
        ) : displayedJobs.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-6">
              {statusFilter !== "all" 
                ? `No ${statusFilter} jobs at the moment.` 
                : "You haven't posted any jobs yet. Create your first job posting!"}
            </p>
            <Button className="gradient-primary shadow-glow" asChild>
              <Link to="/post-job">
                <Plus className="h-4 w-4 mr-2" />
                Post Your First Job
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {displayedJobs.map((job) => (
              <Card key={job.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex gap-4 flex-1">
                    <div className="gradient-primary p-3 rounded-lg shadow-glow">
                      <Briefcase className="h-6 w-6 text-primary-foreground" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{job.title}</h3>
                        <Badge 
                          variant={job.isActive ? "default" : "secondary"}
                          className={job.isActive ? "gradient-primary" : ""}
                        >
                          {job.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Badge variant="outline">{job.jobType}</Badge>
                      </div>
                      
                      <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                        <span>{job.address?.cityName || "Location not set"}</span>
                        {job.address?.districtName && (
                          <>
                            <span>•</span>
                            <span>{job.address.districtName}</span>
                          </>
                        )}
                        <span>•</span>
                        <span>Posted {formatDate(job.createTime)}</span>
                        <span>•</span>
                        <span className="text-primary font-medium">
                          {job.minSalary.toLocaleString()} - {job.maxSalary.toLocaleString()} {job.currency}
                          {job.isNegotiable && " (Negotiable)"}
                        </span>
                      </div>

                      <div className="flex gap-6">
                        <div className="flex items-center gap-2">
                          <Eye className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{job.viewCount}</span>
                          <span className="text-sm text-muted-foreground">Views</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{job.quantity}</span>
                          <span className="text-sm text-muted-foreground">Positions</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-primary" />
                          <span className="font-semibold">{job.yearsOfExperience}+</span>
                          <span className="text-sm text-muted-foreground">Years Exp</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/candidates?job=${job.id}`}>
                        <Users className="h-4 w-4 mr-2" />
                        Candidates
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditClick(job)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={job.isActive ? "text-warning" : "text-success"}
                      onClick={() => handleToggleStatus(job)}
                      disabled={togglingStatus === job.id}
                    >
                      {togglingStatus === job.id ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : job.isActive ? (
                        <>
                          <PowerOff className="h-4 w-4 mr-2" />
                          Deactivate
                        </>
                      ) : (
                        <>
                          <Power className="h-4 w-4 mr-2" />
                          Activate
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Edit Job Modal */}
        <Dialog open={!!editingJob} onOpenChange={(open) => {
          if (!open) {
            setEditingJob(null);
            setEditFormData(null);
          }
        }}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Edit Job Posting
              </DialogTitle>
              <DialogDescription>
                Update job details and requirements
              </DialogDescription>
            </DialogHeader>

            {editFormData && (
              <form onSubmit={handleEditSubmit} className="space-y-6 mt-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-title">Job Title *</Label>
                    <Input
                      id="edit-title"
                      value={editFormData.title}
                      onChange={(e) => handleEditFormChange("title", e.target.value)}
                      placeholder="e.g., Senior Frontend Developer"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-jobType">Job Type *</Label>
                      <Select
                        value={editFormData.jobType}
                        onValueChange={(value) => handleEditFormChange("jobType", value)}
                      >
                        <SelectTrigger id="edit-jobType">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="full-time">Full-time</SelectItem>
                          <SelectItem value="part-time">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                          <SelectItem value="internship">Internship</SelectItem>
                          <SelectItem value="freelance">Freelance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="edit-quantity">Positions *</Label>
                      <Input
                        id="edit-quantity"
                        type="number"
                        min="1"
                        value={editFormData.quantity}
                        onChange={(e) => handleEditFormChange("quantity", parseInt(e.target.value) || 1)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="edit-minSalary">Min Salary *</Label>
                      <Input
                        id="edit-minSalary"
                        type="number"
                        min="0"
                        step="1000"
                        value={editFormData.minSalary}
                        onChange={(e) => handleEditFormChange("minSalary", parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-maxSalary">Max Salary *</Label>
                      <Input
                        id="edit-maxSalary"
                        type="number"
                        min="0"
                        step="1000"
                        value={editFormData.maxSalary}
                        onChange={(e) => handleEditFormChange("maxSalary", parseFloat(e.target.value) || 0)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-currency">Currency *</Label>
                      <Select
                        value={editFormData.currency}
                        onValueChange={(value) => handleEditFormChange("currency", value)}
                      >
                        <SelectTrigger id="edit-currency">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VND">VND</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-isNegotiable"
                      checked={editFormData.isNegotiable}
                      onCheckedChange={(checked) => handleEditFormChange("isNegotiable", checked)}
                    />
                    <Label htmlFor="edit-isNegotiable" className="cursor-pointer">
                      Salary is negotiable
                    </Label>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-yearsOfExperience">Years of Experience *</Label>
                      <Input
                        id="edit-yearsOfExperience"
                        type="number"
                        min="0"
                        max="50"
                        value={editFormData.yearsOfExperience}
                        onChange={(e) => handleEditFormChange("yearsOfExperience", parseInt(e.target.value) || 0)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="edit-expiryDate">Application Deadline *</Label>
                      <Input
                        id="edit-expiryDate"
                        type="date"
                        value={editFormData.expiryDate}
                        onChange={(e) => handleEditFormChange("expiryDate", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-isActive"
                      checked={editFormData.isActive}
                      onCheckedChange={(checked) => handleEditFormChange("isActive", checked)}
                    />
                    <Label htmlFor="edit-isActive" className="cursor-pointer">
                      Job is active (visible to candidates)
                    </Label>
                  </div>

                  <div>
                    <Label htmlFor="edit-description">Job Description *</Label>
                    <Textarea
                      id="edit-description"
                      value={editFormData.description}
                      onChange={(e) => handleEditFormChange("description", e.target.value)}
                      placeholder="Describe the role..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-requirement">Requirements *</Label>
                    <Textarea
                      id="edit-requirement"
                      value={editFormData.requirement}
                      onChange={(e) => handleEditFormChange("requirement", e.target.value)}
                      placeholder="List the requirements..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="edit-benefits">Benefits *</Label>
                    <Textarea
                      id="edit-benefits"
                      value={editFormData.benefits}
                      onChange={(e) => handleEditFormChange("benefits", e.target.value)}
                      placeholder="Describe the benefits..."
                      rows={4}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditingJob(null);
                      setEditFormData(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="gradient-primary shadow-glow flex-1"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Job"
                    )}
                  </Button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ManageJobs;
