import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Eye, FileText, Upload, Loader2, Plus, Trash2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CVPreview } from "@/components/CVPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { SimpleTemplate, ModernTemplate, ProfessionalTemplate, CreativeTemplate } from "@/components/cv-templates";
import { Link } from "react-router-dom";
import { cvService, CVSkill, CVWorkExperience, CVEducation } from "@/services/cvService";
import { authService } from "@/services/authService";
import { notifySuccess, notifyError } from "@/utils/notification";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Country codes for phone numbers
const countryCodes = [
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
  { code: "+1", country: "USA/Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
];

const CVBuilder = () => {
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("simple");
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useLanguage();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    title: "",
    summary: "",
    portfolioUrl: "",
    desiredJobTitle: "",
    workLocation: "",
    jobType: "Full-time",
    achievements: "",
    contacts: "",
    photo: "",
  });

  const [skills, setSkills] = useState<CVSkill[]>([{ skillName: "", proficiencyLevel: "Beginner" }]);
  const [workExperiences, setWorkExperiences] = useState<CVWorkExperience[]>([
    { companyName: "", position: "", startDate: "", endDate: "", description: "" }
  ]);
  const [educations, setEducations] = useState<CVEducation[]>([
    { schoolName: "", degree: "", major: "", grade: "", startDate: "", endDate: "", description: "" }
  ]);
  const [isSaving, setIsSaving] = useState(false);
  const [additionalContacts, setAdditionalContacts] = useState<{type: string, value: string}[]>([]);
  
  // Validation errors state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Phone number with country code
  const [countryCode, setCountryCode] = useState("+84");
  const [phoneWithoutCode, setPhoneWithoutCode] = useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Handle phone number with country code
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Only numbers
    setPhoneWithoutCode(value);
    setFormData((prev) => ({
      ...prev,
      phone: countryCode + value,
    }));
    // Clear error
    if (errors.phone) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.phone;
        return newErrors;
      });
    }
  };

  const handleCountryCodeChange = (value: string) => {
    setCountryCode(value);
    setFormData((prev) => ({
      ...prev,
      phone: value + phoneWithoutCode,
    }));
  };

  // Validation functions
  const validateFullName = (name: string): string | null => {
    if (!name || !name.trim()) return "Full name is required";
    if (name.trim().length < 2) return "Full name must be at least 2 characters";
    if (name.length > 100) return "Full name must not exceed 100 characters";
    return null;
  };

  const validateEmail = (email: string): string | null => {
    if (!email || !email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
    if (email.length > 100) return "Email must not exceed 100 characters";
    return null;
  };

  const validatePhone = (phone: string): string | null => {
    if (!phone || !phone.trim()) return "Phone number is required";
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) return "Phone must have at least 10 digits";
    if (cleanPhone.length > 15) return "Phone must not exceed 15 digits";
    return null;
  };

  const validateTitle = (title: string): string | null => {
    if (!title || !title.trim()) return "Professional title is required";
    if (title.trim().length < 3) return "Title must be at least 3 characters";
    if (title.length > 200) return "Title must not exceed 200 characters";
    return null;
  };

  const validateSummary = (summary: string): string | null => {
    if (!summary || !summary.trim()) return "Professional summary is required";
    if (summary.trim().length < 50) return "Summary must be at least 50 characters";
    if (summary.length > 2000) return "Summary must not exceed 2000 characters";
    return null;
  };

  const validateUrl = (url: string): string | null => {
    if (!url) return null; // Optional field
    try {
      const urlObj = new URL(url);
      if (!['http:', 'https:'].includes(urlObj.protocol)) {
        return "URL must start with http:// or https://";
      }
    } catch {
      return "Invalid URL format";
    }
    return null;
  };

  const validateCV = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Validate basic fields
    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;

    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) newErrors.phone = phoneError;

    const titleError = validateTitle(formData.title);
    if (titleError) newErrors.title = titleError;

    const summaryError = validateSummary(formData.summary);
    if (summaryError) newErrors.summary = summaryError;

    const portfolioError = validateUrl(formData.portfolioUrl);
    if (portfolioError) newErrors.portfolioUrl = portfolioError;

    // Validate skills (at least one skill)
    const validSkills = skills.filter(s => s.skillName.trim());
    if (validSkills.length === 0) {
      newErrors.skills = "Please add at least one skill";
    }

    // Validate work experience
    workExperiences.forEach((exp, index) => {
      if (exp.companyName || exp.position) {
        if (!exp.companyName.trim()) newErrors[`workExp${index}_company`] = "Company name is required";
        if (!exp.position.trim()) newErrors[`workExp${index}_position`] = "Position is required";
        if (!exp.startDate) newErrors[`workExp${index}_startDate`] = "Start date is required";
      }
    });

    // Validate education
    educations.forEach((edu, index) => {
      if (edu.schoolName || edu.degree) {
        if (!edu.schoolName.trim()) newErrors[`edu${index}_school`] = "School name is required";
        if (!edu.degree.trim()) newErrors[`edu${index}_degree`] = "Degree is required";
        if (!edu.major.trim()) newErrors[`edu${index}_major`] = "Major is required";
      }
    });

    setErrors(newErrors);

    // Show toast with errors
    if (Object.keys(newErrors).length > 0) {
      const errorMessages = Object.values(newErrors).slice(0, 5); // Show first 5 errors
      toast({
        title: "Validation Errors",
        description: (
          <ul className="list-disc list-inside space-y-1 text-sm">
            {errorMessages.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
            {Object.keys(newErrors).length > 5 && (
              <li>...and {Object.keys(newErrors).length - 5} more errors</li>
            )}
          </ul>
        ),
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveCV = async () => {
    // Run validation
    if (!validateCV()) {
      return;
    }

    const user = authService.getUser();
    if (!user) {
      notifyError("Please login to save your CV");
      return;
    }

    setIsSaving(true);
    try {
      // Compile contacts from multiple sources
      const contactParts: string[] = [];
      if (formData.email) contactParts.push(`Email: ${formData.email}`);
      if (formData.phone) contactParts.push(`Phone: ${formData.phone}`);
      additionalContacts.forEach(contact => {
        if (contact.value.trim()) {
          contactParts.push(`${contact.type}: ${contact.value}`);
        }
      });
      const compiledContacts = contactParts.join(", ");

      // Prepare CV data according to API structure
      const cvData = {
        fullName: formData.fullName,
        jobtitle: formData.title,
        aboutMe: formData.summary,
        portfolioUrl: formData.portfolioUrl,
        avatarUrl: formData.photo,
        desiredJobTitle: formData.desiredJobTitle || formData.title,
        workLocation: formData.workLocation || formData.address,
        jobType: formData.jobType,
        achievements: formData.achievements,
        contacts: compiledContacts,
        isActive: true,
        candidateId: user.id,
        template: selectedTemplate, // Save selected template name
        skills: skills.filter(s => s.skillName.trim() !== ""),
        workExperiences: workExperiences
          .filter(w => w.companyName.trim() !== "")
          .map(w => ({
            ...w,
            startDate: w.startDate ? new Date(w.startDate).toISOString() : new Date().toISOString(),
            endDate: w.endDate ? new Date(w.endDate).toISOString() : new Date().toISOString(),
          })),
        educations: educations
          .filter(e => e.schoolName.trim() !== "")
          .map(e => ({
            ...e,
            startDate: e.startDate ? new Date(e.startDate).toISOString() : new Date().toISOString(),
            endDate: e.endDate ? new Date(e.endDate).toISOString() : new Date().toISOString(),
          })),
      };

      const response = await cvService.createCV(cvData);
      if (response.success) {
        notifySuccess("CV saved successfully!");
      } else {
        notifyError(response.message);
      }
    } catch (error) {
      notifyError("Failed to save CV");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAIGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setAiSuggestion(
        "Gợi ý: Nhấn mạnh thành tựu định lượng (ví dụ: tăng 25% hiệu suất hệ thống, giảm 40% lỗi sản xuất) và thêm 5–7 kỹ năng liên quan tới vị trí mục tiêu."
      );
      toast({
        title: "CV Generated",
        description: "Your CV has been generated with AI assistance!",
      });
    }, 2000);
  };

  // Use a single consistent border color for all templates
  const templates = [
    { id: "simple", name: t("cvBuilder.templateSimple"), color: "border-accent", component: SimpleTemplate },
    { id: "modern", name: t("cvBuilder.templateModern"), color: "border-accent", component: ModernTemplate },
    { id: "professional", name: t("cvBuilder.templateProfessional"), color: "border-accent", component: ProfessionalTemplate },
    { id: "creative", name: t("cvBuilder.templateCreative"), color: "border-accent", component: CreativeTemplate },
  ];

  // Sample data for template previews
  const sampleData = {
    fullName: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    phone: "0901234567",
    address: "TP. Hồ Chí Minh",
    title: "Frontend Developer",
    summary: "Chuyên gia phát triển Frontend với 5 năm kinh nghiệm trong React, TypeScript và các công nghệ web hiện đại.",
    photo: "",
  };

  const sampleSkills = [
    { skillName: "React", proficiencyLevel: "Expert" },
    { skillName: "TypeScript", proficiencyLevel: "Advanced" },
  ];

  const sampleWorkExperiences = [
    {
      companyName: "Tech Company",
      position: "Senior Developer",
      startDate: "2020-01-01",
      endDate: "2024-12-31",
      description: "Phát triển các ứng dụng web quy mô lớn",
    },
  ];

  const sampleEducations = [
    {
      schoolName: "Đại học Công nghệ",
      degree: "Cử nhân",
      major: "Khoa học Máy tính",
      grade: "3.8",
      startDate: "2015-09-01",
      endDate: "2019-06-30",
      description: "",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">{t("cvBuilder.title")}</h1>
              <p className="text-muted-foreground">{t("cvBuilder.subtitle")}</p>
            </div>
            <div className="flex gap-3">
              <Button asChild variant="outline">
                <Link to="/cv-manager">{t("cvBuilder.viewAllCVs")}</Link>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(true)}
                disabled={!formData.fullName}
              >
                <Eye className="h-4 w-4 mr-2" />
                {t("cvBuilder.previewCV")}
              </Button>
              <Button 
                onClick={handleSaveCV}
                disabled={!formData.fullName || isSaving}
                className="gradient-primary shadow-glow"
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 mr-2" />
                )}
                {isSaving ? "Saving..." : "Save CV"}
              </Button>
            </div>
          </div>

          {/* Template Selection */}
          <Card className="p-6 mb-6 bg-card">
            <h2 className="text-2xl font-bold mb-4">{t("cvBuilder.selectTemplate")}</h2>
            <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {templates.map((template) => {
                  const TemplateComponent = template.component;
                  return (
                    <div key={template.id} className="relative">
                      <RadioGroupItem
                        value={template.id}
                        id={template.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={template.id}
                        className={`group flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 transform-gpu hover:-translate-y-0.5 hover:shadow-lg hover:ring-2 hover:ring-primary/40 ring-offset-2 ring-offset-background hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 peer-data-[state=checked]:ring-2 peer-data-[state=checked]:ring-primary/50 ${template.color}`}
                      >
                        <div className="w-full h-32 overflow-hidden rounded mb-2 border border-border transition-transform duration-200 group-hover:scale-[1.02] bg-white">
                          <div className="scale-[0.15] origin-top-left w-[667%] h-[667%]">
                            <TemplateComponent 
                              data={sampleData}
                              skills={sampleSkills}
                              workExperiences={sampleWorkExperiences}
                              educations={sampleEducations}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium">{template.name}</span>
                      </Label>
                    </div>
                  );
                })}
              </div>
            </RadioGroup>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 bg-card">
                <h2 className="text-2xl font-bold mb-4">{t("cvBuilder.personalInfo")}</h2>
                <div className="space-y-4">
                  <div className="flex flex-col items-center mb-4">
                    <div className="w-32 h-32 rounded-full bg-muted flex items-center justify-center overflow-hidden mb-3">
                      {formData.photo ? (
                        <img src={formData.photo} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-muted-foreground text-sm">No Photo</span>
                      )}
                    </div>
                    <Label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-accent transition-colors">
                        <Upload className="h-4 w-4" />
                        <span>Upload Photo</span>
                      </div>
                      <Input 
                        id="photo-upload" 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handlePhotoUpload}
                      />
                    </Label>
                  </div>
                  {/* Basic Information */}
                  <div>
                    <Label htmlFor="fullName">{t("cvBuilder.fullName")} *</Label>
                    <Input 
                      id="fullName" 
                      placeholder="Lê Hoàng Nam" 
                      className={cn("mt-1", errors.fullName && "border-destructive")}
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                    />
                    {errors.fullName && (
                      <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                        <AlertCircle className="h-3 w-3" />
                        <span>{errors.fullName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">{t("cvBuilder.email")} *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="thao.tran@company.vn" 
                        className={cn("mt-1", errors.email && "border-destructive")}
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                      {errors.email && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          <span>{errors.email}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("cvBuilder.phone")} *</Label>
                      <div className="flex gap-2 mt-1">
                        <Select value={countryCode} onValueChange={handleCountryCodeChange}>
                          <SelectTrigger className="w-[120px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {countryCodes.map((country) => (
                              <SelectItem key={country.code} value={country.code}>
                                <span className="flex items-center gap-2">
                                  <span>{country.flag}</span>
                                  <span>{country.code}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input 
                          id="phoneInput"
                          type="tel"
                          placeholder="912345678" 
                          className={cn("flex-1", errors.phone && "border-destructive")}
                          value={phoneWithoutCode}
                          onChange={handlePhoneChange}
                        />
                      </div>
                      {errors.phone && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          <span>{errors.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">{t("cvBuilder.address")}</Label>
                    <Input 
                      id="address" 
                      placeholder="HCM city" 
                      className="mt-1"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>

                  {/* Professional Info */}
                  <div className="border-t pt-4 mt-2">
                    <h3 className="font-semibold mb-3">Professional Information</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">{t("cvBuilder.professionalTitle")} *</Label>
                        <Input 
                          id="title" 
                          placeholder="Senior Frontend Developer" 
                          className={cn("mt-1", errors.title && "border-destructive")}
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                        />
                        {errors.title && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors.title}</span>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="summary">Professional Summary *</Label>
                        <Textarea 
                          id="summary" 
                          rows={4} 
                          placeholder="Tôi là một nhà phát triển Frontend với hơn 5 năm kinh nghiệm xây dựng các ứng dụng web quy mô lớn..." 
                          className={cn("mt-1", errors.summary && "border-destructive")}
                          value={formData.summary}
                          onChange={(e) => handleInputChange("summary", e.target.value)}
                        />
                        {errors.summary && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors.summary}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                          Minimum 50 characters ({formData.summary.length}/50)
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                          <Input 
                            id="portfolioUrl" 
                            placeholder="https://nguyenfrontend.dev" 
                            className={cn("mt-1", errors.portfolioUrl && "border-destructive")}
                            value={formData.portfolioUrl}
                            onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                          />
                          {errors.portfolioUrl && (
                            <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                              <AlertCircle className="h-3 w-3" />
                              <span>{errors.portfolioUrl}</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="desiredJobTitle">Desired Job Title</Label>
                          <Input 
                            id="desiredJobTitle" 
                            placeholder="Frontend Architect / Tech Lead" 
                            className="mt-1"
                            value={formData.desiredJobTitle}
                            onChange={(e) => handleInputChange("desiredJobTitle", e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="workLocation">Work Location</Label>
                          <Input 
                            id="workLocation" 
                            placeholder="Hồ Chí Minh (Remote/Hybrid)" 
                            className="mt-1"
                            value={formData.workLocation}
                            onChange={(e) => handleInputChange("workLocation", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="jobType">Job Type</Label>
                          <Input 
                            id="jobType" 
                            placeholder="Full-time" 
                            className="mt-1"
                            value={formData.jobType}
                            onChange={(e) => handleInputChange("jobType", e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="achievements">Achievements</Label>
                        <Textarea 
                          id="achievements" 
                          rows={3} 
                          placeholder="Giải nhất cuộc thi Hackathon 2024, Chứng chỉ AWS Certified Developer..." 
                          className="mt-1"
                          value={formData.achievements}
                          onChange={(e) => handleInputChange("achievements", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Contacts */}
                  <div className="border-t pt-4 mt-2">
                    <h3 className="font-semibold mb-3">Additional Contacts</h3>
                    <p className="text-sm text-muted-foreground mb-3">Add other ways to contact you (Zalo, Facebook, Skype, LinkedIn, etc.)</p>
                    <div className="space-y-3">
                      {additionalContacts.map((contact, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder="Type (e.g., Zalo, Facebook)"
                            value={contact.type}
                            onChange={(e) => {
                              const newContacts = [...additionalContacts];
                              newContacts[index].type = e.target.value;
                              setAdditionalContacts(newContacts);
                            }}
                            className="w-1/3"
                          />
                          <Input
                            placeholder="Value (e.g., 0901234567)"
                            value={contact.value}
                            onChange={(e) => {
                              const newContacts = [...additionalContacts];
                              newContacts[index].value = e.target.value;
                              setAdditionalContacts(newContacts);
                            }}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setAdditionalContacts(additionalContacts.filter((_, i) => i !== index))}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => setAdditionalContacts([...additionalContacts, { type: "", value: "" }])}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Contact Method
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-card">
                <h2 className="text-2xl font-bold mb-4">{t("cvBuilder.skills")}</h2>
                <div className="space-y-4">
                  {skills.map((skill, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="flex-1">
                        <Label>Skill Name *</Label>
                        <Input
                          placeholder="ReactJS, TypeScript..."
                          className={cn(errors.skills && !skill.skillName.trim() && "border-destructive")}
                          value={skill.skillName}
                          onChange={(e) => {
                            const newSkills = [...skills];
                            newSkills[index].skillName = e.target.value;
                            setSkills(newSkills);
                            // Clear skills error
                            if (errors.skills) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors.skills;
                                return newErrors;
                              });
                            }
                          }}
                        />
                      </div>
                      <div className="w-40">
                        <Label>Level</Label>
                        <Select
                          value={skill.proficiencyLevel}
                          onValueChange={(value) => {
                            const newSkills = [...skills];
                            newSkills[index].proficiencyLevel = value;
                            setSkills(newSkills);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Beginner">Beginner</SelectItem>
                            <SelectItem value="Intermediate">Intermediate</SelectItem>
                            <SelectItem value="Advanced">Advanced</SelectItem>
                            <SelectItem value="Expert">Expert</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {skills.length > 1 && (
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {errors.skills && (
                    <div className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3 w-3" />
                      <span>{errors.skills}</span>
                    </div>
                  )}
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setSkills([...skills, { skillName: "", proficiencyLevel: "Beginner" }])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Skill
                  </Button>
                </div>
              </Card>

              <Card className="p-6 bg-card">
                <h2 className="text-2xl font-bold mb-4">{t("cvBuilder.workExperience")}</h2>
                {workExperiences.map((exp, index) => (
                  <div key={index} className="space-y-4 mb-6 pb-6 border-b last:border-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Experience {index + 1}</h3>
                      {workExperiences.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setWorkExperiences(workExperiences.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <Label>Company Name *</Label>
                      <Input
                        placeholder="Tech Company Inc."
                        className={cn(errors[`workExp${index}_company`] && "border-destructive")}
                        value={exp.companyName}
                        onChange={(e) => {
                          const newExp = [...workExperiences];
                          newExp[index].companyName = e.target.value;
                          setWorkExperiences(newExp);
                          // Clear error
                          if (errors[`workExp${index}_company`]) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors[`workExp${index}_company`];
                              return newErrors;
                            });
                          }
                        }}
                      />
                      {errors[`workExp${index}_company`] && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          <span>{errors[`workExp${index}_company`]}</span>
                        </div>
                      )}
                    </div>
                    <div>
                      <Label>Position *</Label>
                      <Input
                        placeholder="Senior Developer"
                        className={cn(errors[`workExp${index}_position`] && "border-destructive")}
                        value={exp.position}
                        onChange={(e) => {
                          const newExp = [...workExperiences];
                          newExp[index].position = e.target.value;
                          setWorkExperiences(newExp);
                          // Clear error
                          if (errors[`workExp${index}_position`]) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors[`workExp${index}_position`];
                              return newErrors;
                            });
                          }
                        }}
                      />
                      {errors[`workExp${index}_position`] && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          <span>{errors[`workExp${index}_position`]}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Start Date *</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={exp.startDate?.split("-")[1] || ""}
                            onValueChange={(value) => {
                              const newExp = [...workExperiences];
                              const year = exp.startDate?.split("-")[0] || new Date().getFullYear().toString();
                              newExp[index].startDate = `${year}-${value}`;
                              setWorkExperiences(newExp);
                              if (errors[`workExp${index}_startDate`]) {
                                setErrors((prev) => {
                                  const newErrors = { ...prev };
                                  delete newErrors[`workExp${index}_startDate`];
                                  return newErrors;
                                });
                              }
                            }}
                          >
                            <SelectTrigger className={cn(errors[`workExp${index}_startDate`] && "border-destructive")}>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="01">January</SelectItem>
                              <SelectItem value="02">February</SelectItem>
                              <SelectItem value="03">March</SelectItem>
                              <SelectItem value="04">April</SelectItem>
                              <SelectItem value="05">May</SelectItem>
                              <SelectItem value="06">June</SelectItem>
                              <SelectItem value="07">July</SelectItem>
                              <SelectItem value="08">August</SelectItem>
                              <SelectItem value="09">September</SelectItem>
                              <SelectItem value="10">October</SelectItem>
                              <SelectItem value="11">November</SelectItem>
                              <SelectItem value="12">December</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={exp.startDate?.split("-")[0] || ""}
                            onValueChange={(value) => {
                              const newExp = [...workExperiences];
                              const month = exp.startDate?.split("-")[1] || "01";
                              newExp[index].startDate = `${value}-${month}`;
                              setWorkExperiences(newExp);
                              if (errors[`workExp${index}_startDate`]) {
                                setErrors((prev) => {
                                  const newErrors = { ...prev };
                                  delete newErrors[`workExp${index}_startDate`];
                                  return newErrors;
                                });
                              }
                            }}
                          >
                            <SelectTrigger className={cn(errors[`workExp${index}_startDate`] && "border-destructive")}>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {errors[`workExp${index}_startDate`] && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors[`workExp${index}_startDate`]}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={exp.endDate?.split("-")[1] || ""}
                            onValueChange={(value) => {
                              const newExp = [...workExperiences];
                              const year = exp.endDate?.split("-")[0] || new Date().getFullYear().toString();
                              newExp[index].endDate = `${year}-${value}`;
                              setWorkExperiences(newExp);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="01">January</SelectItem>
                              <SelectItem value="02">February</SelectItem>
                              <SelectItem value="03">March</SelectItem>
                              <SelectItem value="04">April</SelectItem>
                              <SelectItem value="05">May</SelectItem>
                              <SelectItem value="06">June</SelectItem>
                              <SelectItem value="07">July</SelectItem>
                              <SelectItem value="08">August</SelectItem>
                              <SelectItem value="09">September</SelectItem>
                              <SelectItem value="10">October</SelectItem>
                              <SelectItem value="11">November</SelectItem>
                              <SelectItem value="12">December</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={exp.endDate?.split("-")[0] || ""}
                            onValueChange={(value) => {
                              const newExp = [...workExperiences];
                              const month = exp.endDate?.split("-")[1] || "01";
                              newExp[index].endDate = `${value}-${month}`;
                              setWorkExperiences(newExp);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        rows={3}
                        placeholder="Describe your responsibilities and achievements..."
                        value={exp.description}
                        onChange={(e) => {
                          const newExp = [...workExperiences];
                          newExp[index].description = e.target.value;
                          setWorkExperiences(newExp);
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setWorkExperiences([...workExperiences, { companyName: "", position: "", startDate: "", endDate: "", description: "" }])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("cvBuilder.addPosition")}
                </Button>
              </Card>

              <Card className="p-6 bg-card">
                <h2 className="text-2xl font-bold mb-4">{t("cvBuilder.educationSection")}</h2>
                {educations.map((edu, index) => (
                  <div key={index} className="space-y-4 mb-6 pb-6 border-b last:border-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">Education {index + 1}</h3>
                      {educations.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEducations(educations.filter((_, i) => i !== index))}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div>
                      <Label>School Name *</Label>
                      <Input
                        placeholder="University of Technology"
                        className={cn(errors[`edu${index}_school`] && "border-destructive")}
                        value={edu.schoolName}
                        onChange={(e) => {
                          const newEdu = [...educations];
                          newEdu[index].schoolName = e.target.value;
                          setEducations(newEdu);
                          // Clear error
                          if (errors[`edu${index}_school`]) {
                            setErrors((prev) => {
                              const newErrors = { ...prev };
                              delete newErrors[`edu${index}_school`];
                              return newErrors;
                            });
                          }
                        }}
                      />
                      {errors[`edu${index}_school`] && (
                        <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                          <AlertCircle className="h-3 w-3" />
                          <span>{errors[`edu${index}_school`]}</span>
                        </div>
                      )}
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Degree *</Label>
                        <Input
                          placeholder="Bachelor's"
                          className={cn(errors[`edu${index}_degree`] && "border-destructive")}
                          value={edu.degree}
                          onChange={(e) => {
                            const newEdu = [...educations];
                            newEdu[index].degree = e.target.value;
                            setEducations(newEdu);
                            // Clear error
                            if (errors[`edu${index}_degree`]) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors[`edu${index}_degree`];
                                return newErrors;
                              });
                            }
                          }}
                        />
                        {errors[`edu${index}_degree`] && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors[`edu${index}_degree`]}</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <Label>Major *</Label>
                        <Input
                          placeholder="Computer Science"
                          className={cn(errors[`edu${index}_major`] && "border-destructive")}
                          value={edu.major}
                          onChange={(e) => {
                            const newEdu = [...educations];
                            newEdu[index].major = e.target.value;
                            setEducations(newEdu);
                            // Clear error
                            if (errors[`edu${index}_major`]) {
                              setErrors((prev) => {
                                const newErrors = { ...prev };
                                delete newErrors[`edu${index}_major`];
                                return newErrors;
                              });
                            }
                          }}
                        />
                        {errors[`edu${index}_major`] && (
                          <div className="flex items-center gap-1 mt-1 text-xs text-destructive">
                            <AlertCircle className="h-3 w-3" />
                            <span>{errors[`edu${index}_major`]}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Grade/GPA</Label>
                        <Input
                          placeholder="3.6/4.0"
                          value={edu.grade}
                          onChange={(e) => {
                            const newEdu = [...educations];
                            newEdu[index].grade = e.target.value;
                            setEducations(newEdu);
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label>Start Date</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={edu.startDate?.split("-")[1] || ""}
                            onValueChange={(value) => {
                              const newEdu = [...educations];
                              const year = edu.startDate?.split("-")[0] || new Date().getFullYear().toString();
                              newEdu[index].startDate = `${year}-${value}`;
                              setEducations(newEdu);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="01">January</SelectItem>
                              <SelectItem value="02">February</SelectItem>
                              <SelectItem value="03">March</SelectItem>
                              <SelectItem value="04">April</SelectItem>
                              <SelectItem value="05">May</SelectItem>
                              <SelectItem value="06">June</SelectItem>
                              <SelectItem value="07">July</SelectItem>
                              <SelectItem value="08">August</SelectItem>
                              <SelectItem value="09">September</SelectItem>
                              <SelectItem value="10">October</SelectItem>
                              <SelectItem value="11">November</SelectItem>
                              <SelectItem value="12">December</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={edu.startDate?.split("-")[0] || ""}
                            onValueChange={(value) => {
                              const newEdu = [...educations];
                              const month = edu.startDate?.split("-")[1] || "01";
                              newEdu[index].startDate = `${value}-${month}`;
                              setEducations(newEdu);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Select
                            value={edu.endDate?.split("-")[1] || ""}
                            onValueChange={(value) => {
                              const newEdu = [...educations];
                              const year = edu.endDate?.split("-")[0] || new Date().getFullYear().toString();
                              newEdu[index].endDate = `${year}-${value}`;
                              setEducations(newEdu);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="01">January</SelectItem>
                              <SelectItem value="02">February</SelectItem>
                              <SelectItem value="03">March</SelectItem>
                              <SelectItem value="04">April</SelectItem>
                              <SelectItem value="05">May</SelectItem>
                              <SelectItem value="06">June</SelectItem>
                              <SelectItem value="07">July</SelectItem>
                              <SelectItem value="08">August</SelectItem>
                              <SelectItem value="09">September</SelectItem>
                              <SelectItem value="10">October</SelectItem>
                              <SelectItem value="11">November</SelectItem>
                              <SelectItem value="12">December</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select
                            value={edu.endDate?.split("-")[0] || ""}
                            onValueChange={(value) => {
                              const newEdu = [...educations];
                              const month = edu.endDate?.split("-")[1] || "01";
                              newEdu[index].endDate = `${value}-${month}`;
                              setEducations(newEdu);
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Year" />
                            </SelectTrigger>
                            <SelectContent>
                              {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                                <SelectItem key={year} value={year.toString()}>
                                  {year}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        rows={2}
                        placeholder="Additional information..."
                        value={edu.description}
                        onChange={(e) => {
                          const newEdu = [...educations];
                          newEdu[index].description = e.target.value;
                          setEducations(newEdu);
                        }}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setEducations([...educations, { schoolName: "", degree: "", major: "", grade: "", startDate: "", endDate: "", description: "" }])}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Education
                </Button>
              </Card>
            </div>

            {/* AI Assistant */}
            <div className="space-y-6">
              <Card className="p-6 sticky top-4 bg-card">
                <div className="flex items-center gap-2 mb-4">
                  <div className="gradient-primary p-2 rounded-lg">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="font-bold text-lg">{t("cvBuilder.aiAssistant")}</h3>
                </div>

                <Button 
                  className="w-full gradient-primary mb-4"
                  onClick={handleAIGenerate}
                  disabled={isGenerating || !formData.fullName}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {isGenerating ? t("cvBuilder.generating") : t("cvBuilder.aiGenerate")}
                </Button>

                {aiSuggestion && (
                  <div className="p-4 bg-accent-light rounded-lg border border-accent/20">
                    <p className="text-sm text-foreground">{aiSuggestion}</p>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    {t("cvBuilder.improveSummary")}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    {t("cvBuilder.optimizeKeywords")}
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    {t("cvBuilder.checkGrammar")}
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
            <DialogHeader>
              <DialogTitle>{t("cvBuilder.previewCV")}</DialogTitle>
            </DialogHeader>
            <CVPreview 
              data={formData} 
              template={selectedTemplate}
              skills={skills}
              workExperiences={workExperiences}
              educations={educations}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CVBuilder;
