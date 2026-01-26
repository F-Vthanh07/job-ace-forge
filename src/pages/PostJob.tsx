import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { jobService, JobPostingRequest } from "@/services/jobService";
import { companyService } from "@/services/companyService";
import { notifyError, notifySuccess } from "@/utils/notification";
import { useNavigate } from "react-router-dom";

const PostJob = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    jobType: "",
    quantity: 1,
    minSalary: "",
    maxSalary: "",
    currency: "VND",
    isNegotiable: false,
    description: "",
    requirement: "",
    benefits: "",
    yearsOfExperience: 0,
    expiryDate: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (isDraft: boolean = false) => {
    console.log("🚀 handleSubmit called, isDraft:", isDraft);
    console.log("📋 Form data:", formData);
    
    try {
      setLoading(true);

      // Validation
      if (!formData.title.trim()) {
        console.log("❌ Validation failed: title is empty");
        notifyError({ title: "Error", description: "Job title is required" });
        return;
      }
      if (!formData.jobType) {
        console.log("❌ Validation failed: jobType is empty");
        notifyError({ title: "Error", description: "Job type is required" });
        return;
      }
      if (!formData.description.trim()) {
        console.log("❌ Validation failed: description is empty");
        notifyError({ title: "Error", description: "Job description is required" });
        return;
      }
      if (!formData.expiryDate) {
        console.log("❌ Validation failed: expiryDate is empty");
        notifyError({ title: "Error", description: "Application deadline is required" });
        return;
      }

      console.log("✅ All validations passed");

      // Get recruiter info from localStorage (for validation only)
      const userDataString = localStorage.getItem("userData");
      if (!userDataString) {
        console.log("❌ No userData in localStorage");
        notifyError({ title: "Error", description: "User data not found. Please login again." });
        navigate("/recruiter-login");
        return;
      }

      const userData = JSON.parse(userDataString);
      console.log("👤 User data:", { id: userData.id, role: userData.role });

      // Check if user is recruiter (case-insensitive)
      if (userData.role?.toLowerCase() !== "recruiter") {
        console.log("❌ User is not a recruiter:", userData.role);
        notifyError({ title: "Error", description: "Only recruiters can post jobs." });
        return;
      }

      console.log("✅ User validation passed");

      // Prepare request data (backend will get recruiterId and companyId from token)
      const requestData: JobPostingRequest = {
        title: formData.title,
        jobType: formData.jobType,
        quantity: formData.quantity,
        minSalary: formData.minSalary ? parseInt(formData.minSalary) : 0,
        maxSalary: formData.maxSalary ? parseInt(formData.maxSalary) : 0,
        currency: formData.currency,
        isNegotiable: formData.isNegotiable,
        description: formData.description,
        requirement: formData.requirement,
        benefits: formData.benefits,
        yearsOfExperience: formData.yearsOfExperience,
        expiryDate: formData.expiryDate,
        isActive: !isDraft, // Active if publishing, inactive if draft
      };

      console.log("📤 Submitting job posting:", requestData);

      // Call API
      const response = await jobService.createJobPosting(requestData);

      if (response.success) {
        notifySuccess({
          title: "Success",
          description: isDraft ? "Job saved as draft" : "Job posted successfully!"
        });
        navigate("/manage-jobs");
      } else {
        notifyError({
          title: "Failed",
          description: response.message
        });
      }
    } catch (error) {
      console.error("Error submitting job:", error);
      notifyError({
        title: "Error",
        description: "Failed to post job. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Post a New Job</h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Job Details</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="jobTitle">Job Title *</Label>
                    <Input 
                      id="jobTitle" 
                      placeholder="e.g. Senior Frontend Developer" 
                      className="mt-1"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Employment Type *</Label>
                      <Select value={formData.jobType} onValueChange={(value) => handleInputChange("jobType", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Full-time">Full-time</SelectItem>
                          <SelectItem value="Part-time">Part-time</SelectItem>
                          <SelectItem value="Contract">Contract</SelectItem>
                          <SelectItem value="Internship">Internship</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="quantity">Number of Positions</Label>
                      <Input 
                        id="quantity" 
                        type="number"
                        min="1"
                        placeholder="1" 
                        className="mt-1"
                        value={formData.quantity}
                        onChange={(e) => handleInputChange("quantity", parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="experience">Years of Experience</Label>
                      <Input 
                        id="experience" 
                        type="number"
                        min="0"
                        placeholder="e.g. 3" 
                        className="mt-1"
                        value={formData.yearsOfExperience}
                        onChange={(e) => handleInputChange("yearsOfExperience", parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryDate">Application Deadline *</Label>
                      <Input 
                        id="expiryDate" 
                        type="date"
                        className="mt-1"
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Salary Range</Label>
                    <div className="grid md:grid-cols-3 gap-2">
                      <Input 
                        type="number"
                        placeholder="Min Salary"
                        value={formData.minSalary}
                        onChange={(e) => handleInputChange("minSalary", e.target.value)}
                      />
                      <Input 
                        type="number"
                        placeholder="Max Salary"
                        value={formData.maxSalary}
                        onChange={(e) => handleInputChange("maxSalary", e.target.value)}
                      />
                      <Select value={formData.currency} onValueChange={(value) => handleInputChange("currency", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="VND">VND</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox 
                        id="negotiable"
                        checked={formData.isNegotiable}
                        onCheckedChange={(checked) => handleInputChange("isNegotiable", checked)}
                      />
                      <label htmlFor="negotiable" className="text-sm">Salary is negotiable</label>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea 
                      id="description" 
                      rows={6} 
                      placeholder="Describe the role, responsibilities, and what makes it exciting..."
                      className="mt-1"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea 
                      id="requirements" 
                      rows={6} 
                      placeholder="List the required skills, experience, and qualifications..."
                      className="mt-1"
                      value={formData.requirement}
                      onChange={(e) => handleInputChange("requirement", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="benefits">Benefits</Label>
                    <Textarea 
                      id="benefits" 
                      rows={4} 
                      placeholder="What benefits and perks do you offer?"
                      className="mt-1"
                      value={formData.benefits}
                      onChange={(e) => handleInputChange("benefits", e.target.value)}
                    />
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => handleSubmit(true)}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save as Draft
                </Button>
                <Button 
                  className="flex-1 gradient-primary shadow-glow"
                  onClick={() => handleSubmit(false)}
                  disabled={loading}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Publish Job
                </Button>
              </div>
            </div>

            {/* AI Assistant Sidebar */}
            <div className="space-y-6">
              <Card className="p-6 sticky top-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="gradient-primary p-2 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">AI Writing Assistant</h3>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  Get AI-powered suggestions to create compelling job descriptions
                </p>

                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Generate Description
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Suggest Requirements
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Optimize Keywords
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Preview for ATS
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-3">💡 Tips</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Be specific about required skills</li>
                  <li>• Highlight company culture</li>
                  <li>• Include salary range for transparency</li>
                  <li>• Use inclusive language</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostJob;
