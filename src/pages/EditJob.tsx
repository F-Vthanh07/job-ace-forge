import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { jobService, JobPostingRequest, JobData } from "@/services/jobService";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Briefcase, ArrowLeft } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

const EditJob = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState<JobPostingRequest>({
    title: "",
    jobType: "",
    quantity: 1,
    minSalary: 0,
    maxSalary: 0,
    currency: "VND",
    isNegotiable: false,
    description: "",
    requirement: "",
    benefits: "",
    yearsOfExperience: 0,
    expiryDate: "",
    isActive: true,
  });

  useEffect(() => {
    loadJobData();
  }, [jobId]);

  const loadJobData = async () => {
    try {
      setLoading(true);
      console.log(`📋 Loading job data for ID: ${jobId}`);

      // Get company data and fetch all jobs
      const companyDataStr = localStorage.getItem("recruiterCompany");
      if (!companyDataStr) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Company information not found. Please login again.",
        });
        navigate("/manage-jobs");
        return;
      }

      const companyData = JSON.parse(companyDataStr);
      const response = await jobService.getJobsByCompanyId(companyData.id);

      if (response.success && response.data) {
        const job = response.data.find((j) => j.id === jobId);
        
        if (!job) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Job not found",
          });
          navigate("/manage-jobs");
          return;
        }

        // Populate form with job data
        setFormData({
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
          expiryDate: job.expiryDate.split("T")[0], // Convert to YYYY-MM-DD format
          isActive: job.isActive,
        });

        console.log("✅ Job data loaded:", job.title);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: response.message || "Failed to load job data",
        });
        navigate("/manage-jobs");
      }
    } catch (error) {
      console.error("❌ Error loading job:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load job data. Please try again.",
      });
      navigate("/manage-jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jobId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Job ID is missing",
      });
      return;
    }

    // Validation
    if (!formData.title.trim()) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Job title is required",
      });
      return;
    }

    if (!formData.jobType) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Job type is required",
      });
      return;
    }

    if (formData.minSalary <= 0 || formData.maxSalary <= 0) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please enter valid salary range",
      });
      return;
    }

    if (formData.minSalary > formData.maxSalary) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Minimum salary cannot be greater than maximum salary",
      });
      return;
    }

    if (!formData.expiryDate) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Expiry date is required",
      });
      return;
    }

    try {
      setSubmitting(true);
      console.log("📤 Updating job posting:", formData);

      const response = await jobService.updateJobPosting(jobId, formData);

      if (response.success) {
        toast({
          title: "Success",
          description: "Job updated successfully",
        });
        navigate("/manage-jobs");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading job data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/manage-jobs")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Manage Jobs
        </Button>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="gradient-primary p-3 rounded-lg shadow-glow">
              <Briefcase className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold">Edit Job Posting</h1>
          </div>
          <p className="text-muted-foreground ml-[60px]">
            Update job details and requirements
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">Job Details</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Frontend Developer"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobType">Job Type *</Label>
                  <Select
                    value={formData.jobType}
                    onValueChange={(value) => handleSelectChange("jobType", value)}
                  >
                    <SelectTrigger id="jobType">
                      <SelectValue placeholder="Select job type" />
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
                  <Label htmlFor="quantity">Number of Positions *</Label>
                  <Input
                    id="quantity"
                    name="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="minSalary">Min Salary *</Label>
                  <Input
                    id="minSalary"
                    name="minSalary"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.minSalary}
                    onChange={handleNumberChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="maxSalary">Max Salary *</Label>
                  <Input
                    id="maxSalary"
                    name="maxSalary"
                    type="number"
                    min="0"
                    step="1000"
                    value={formData.maxSalary}
                    onChange={handleNumberChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency *</Label>
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => handleSelectChange("currency", value)}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
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
                  id="isNegotiable"
                  checked={formData.isNegotiable}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isNegotiable: checked as boolean }))
                  }
                />
                <Label htmlFor="isNegotiable" className="cursor-pointer">
                  Salary is negotiable
                </Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                  <Input
                    id="yearsOfExperience"
                    name="yearsOfExperience"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.yearsOfExperience}
                    onChange={handleNumberChange}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="expiryDate">Application Deadline *</Label>
                  <Input
                    id="expiryDate"
                    name="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData((prev) => ({ ...prev, isActive: checked as boolean }))
                  }
                />
                <Label htmlFor="isActive" className="cursor-pointer">
                  Job is active (visible to candidates)
                </Label>
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-6">Job Description</h2>

            <div className="space-y-4">
              <div>
                <Label htmlFor="description">Job Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="requirement">Requirements *</Label>
                <Textarea
                  id="requirement"
                  name="requirement"
                  value={formData.requirement}
                  onChange={handleInputChange}
                  placeholder="List the skills, qualifications, and experience required..."
                  rows={6}
                  required
                />
              </div>

              <div>
                <Label htmlFor="benefits">Benefits *</Label>
                <Textarea
                  id="benefits"
                  name="benefits"
                  value={formData.benefits}
                  onChange={handleInputChange}
                  placeholder="Describe the benefits, perks, and what makes this role attractive..."
                  rows={6}
                  required
                />
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/manage-jobs")}
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
                "Update Job Posting"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
