import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Eye, Download, FileText, Upload, Loader2, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CVPreview } from "@/components/CVPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";
import { SimpleTemplate, ModernTemplate, ProfessionalTemplate, CreativeTemplate } from "@/components/cv-templates";
import { Link } from "react-router-dom";
import { cvService, CVSkill, CVWorkExperience, CVEducation } from "@/services/cvService";
import { authService } from "@/services/authService";
import { notifySuccess, notifyError } from "@/utils/notification";

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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    // Validate required fields
    if (!formData.fullName || !formData.title || !formData.summary) {
      notifyError("Please fill in all required fields: Full Name, Job Title, and About Me");
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

  const handleDownloadPDF = () => {
    const element = document.getElementById("cv-preview");
    if (!element) return;

    const opt = {
      margin: 0,
      filename: `${formData.fullName || "CV"}.pdf`,
      image: { type: "jpeg" as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
    };

    html2pdf().set(opt).from(element).save();
    toast({
      title: "PDF Downloaded",
      description: "Your CV has been downloaded successfully!",
    });
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
              <Button 
                variant="outline"
                onClick={handleDownloadPDF}
                disabled={!formData.fullName}
              >
                <Download className="h-4 w-4 mr-2" />
                {t("cvBuilder.downloadPDF")}
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
                      className="mt-1"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">{t("cvBuilder.email")} *</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="thao.tran@company.vn" 
                        className="mt-1"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">{t("cvBuilder.phone")} *</Label>
                      <Input 
                        id="phone" 
                        placeholder="0522138110" 
                        className="mt-1"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
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
                          className="mt-1"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="summary">Professional Summary *</Label>
                        <Textarea 
                          id="summary" 
                          rows={4} 
                          placeholder="Tôi là một nhà phát triển Frontend với hơn 5 năm kinh nghiệm xây dựng các ứng dụng web quy mô lớn..." 
                          className="mt-1"
                          value={formData.summary}
                          onChange={(e) => handleInputChange("summary", e.target.value)}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="portfolioUrl">Portfolio URL</Label>
                          <Input 
                            id="portfolioUrl" 
                            placeholder="https://nguyenfrontend.dev" 
                            className="mt-1"
                            value={formData.portfolioUrl}
                            onChange={(e) => handleInputChange("portfolioUrl", e.target.value)}
                          />
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
                        <Label>Skill Name</Label>
                        <Input
                          placeholder="ReactJS, TypeScript..."
                          value={skill.skillName}
                          onChange={(e) => {
                            const newSkills = [...skills];
                            newSkills[index].skillName = e.target.value;
                            setSkills(newSkills);
                          }}
                        />
                      </div>
                      <div className="w-40">
                        <Label>Level</Label>
                        <Input
                          placeholder="Beginner/Advanced/Expert"
                          value={skill.proficiencyLevel}
                          onChange={(e) => {
                            const newSkills = [...skills];
                            newSkills[index].proficiencyLevel = e.target.value;
                            setSkills(newSkills);
                          }}
                        />
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
                      <Label>Company Name</Label>
                      <Input
                        placeholder="Tech Company Inc."
                        value={exp.companyName}
                        onChange={(e) => {
                          const newExp = [...workExperiences];
                          newExp[index].companyName = e.target.value;
                          setWorkExperiences(newExp);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Position</Label>
                      <Input
                        placeholder="Senior Developer"
                        value={exp.position}
                        onChange={(e) => {
                          const newExp = [...workExperiences];
                          newExp[index].position = e.target.value;
                          setWorkExperiences(newExp);
                        }}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) => {
                            const newExp = [...workExperiences];
                            newExp[index].startDate = e.target.value;
                            setWorkExperiences(newExp);
                          }}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) => {
                            const newExp = [...workExperiences];
                            newExp[index].endDate = e.target.value;
                            setWorkExperiences(newExp);
                          }}
                        />
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
                      <Label>School Name</Label>
                      <Input
                        placeholder="University of Technology"
                        value={edu.schoolName}
                        onChange={(e) => {
                          const newEdu = [...educations];
                          newEdu[index].schoolName = e.target.value;
                          setEducations(newEdu);
                        }}
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          placeholder="Bachelor's"
                          value={edu.degree}
                          onChange={(e) => {
                            const newEdu = [...educations];
                            newEdu[index].degree = e.target.value;
                            setEducations(newEdu);
                          }}
                        />
                      </div>
                      <div>
                        <Label>Major</Label>
                        <Input
                          placeholder="Computer Science"
                          value={edu.major}
                          onChange={(e) => {
                            const newEdu = [...educations];
                            newEdu[index].major = e.target.value;
                            setEducations(newEdu);
                          }}
                        />
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
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          type="date"
                          value={edu.startDate}
                          onChange={(e) => {
                            const newEdu = [...educations];
                            newEdu[index].startDate = e.target.value;
                            setEducations(newEdu);
                          }}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          type="date"
                          value={edu.endDate}
                          onChange={(e) => {
                            const newEdu = [...educations];
                            newEdu[index].endDate = e.target.value;
                            setEducations(newEdu);
                          }}
                        />
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
              <Button className="gradient-primary" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                {t("cvBuilder.downloadPDF")}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CVBuilder;
