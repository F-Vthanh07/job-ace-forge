import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Save, Eye, Download, FileText, Upload } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CVPreview } from "@/components/CVPreview";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";
import simpleTemplate from "@/assets/cv-template-simple.png";
import modernTemplate from "@/assets/cv-template-modern.png";
import professionalTemplate from "@/assets/cv-template-professional.png";
import creativeTemplate from "@/assets/cv-template-creative.png";

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
    company: "",
    position: "",
    duration: "",
    description: "",
    education: "",
    skills: "",
    photo: "",
  });

  const generateSuggestion = () => {
    setAiSuggestion("Consider highlighting your leadership experience in managing cross-functional teams. This adds value to your profile for senior positions.");
  };

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

  const handleAIGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
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

  const templates = [
    { id: "simple", name: t("cvBuilder.templateSimple"), color: "border-primary", preview: simpleTemplate },
    { id: "modern", name: t("cvBuilder.templateModern"), color: "border-accent", preview: modernTemplate },
    { id: "professional", name: t("cvBuilder.templateProfessional"), color: "border-success", preview: professionalTemplate },
    { id: "creative", name: t("cvBuilder.templateCreative"), color: "border-warning", preview: creativeTemplate },
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
              <Button 
                variant="outline" 
                onClick={() => setShowPreview(true)}
                disabled={!formData.fullName}
              >
                <Eye className="h-4 w-4 mr-2" />
                {t("cvBuilder.previewCV")}
              </Button>
              <Button 
                className="gradient-primary shadow-glow"
                onClick={handleDownloadPDF}
                disabled={!formData.fullName}
              >
                <Download className="h-4 w-4 mr-2" />
                {t("cvBuilder.downloadPDF")}
              </Button>
            </div>
          </div>

          {/* Template Selection */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">{t("cvBuilder.selectTemplate")}</h2>
            <RadioGroup value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <div key={template.id} className="relative">
                    <RadioGroupItem
                      value={template.id}
                      id={template.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={template.id}
                      className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 ${template.color}`}
                    >
                      <img 
                        src={template.preview} 
                        alt={template.name}
                        className="w-full h-32 object-cover rounded mb-2 border border-border"
                      />
                      <span className="text-sm font-medium">{template.name}</span>
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          </Card>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">{t("cvBuilder.fullName")}</Label>
                      <Input 
                        id="fullName" 
                        placeholder="John Doe" 
                        className="mt-1"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t("cvBuilder.email")}</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        className="mt-1"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">{t("cvBuilder.phone")}</Label>
                      <Input 
                        id="phone" 
                        placeholder="+84 123 456 789" 
                        className="mt-1"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">{t("cvBuilder.address")}</Label>
                      <Input 
                        id="address" 
                        placeholder="Ho Chi Minh City" 
                        className="mt-1"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">{t("cvBuilder.professionalTitle")}</Label>
                    <Input 
                      id="title" 
                      placeholder="Senior Frontend Developer" 
                      className="mt-1"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="summary">{t("cvBuilder.summary")}</Label>
                    <Textarea 
                      id="summary" 
                      rows={4} 
                      placeholder={t("cvBuilder.summary")} 
                      className="mt-1"
                      value={formData.summary}
                      onChange={(e) => handleInputChange("summary", e.target.value)}
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">{t("cvBuilder.workExperience")}</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company">{t("cvBuilder.company")}</Label>
                    <Input 
                      id="company" 
                      placeholder="Tech Company Inc." 
                      className="mt-1"
                      value={formData.company}
                      onChange={(e) => handleInputChange("company", e.target.value)}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="position">{t("cvBuilder.position")}</Label>
                      <Input 
                        id="position" 
                        placeholder="Senior Developer" 
                        className="mt-1"
                        value={formData.position}
                        onChange={(e) => handleInputChange("position", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">{t("cvBuilder.duration")}</Label>
                      <Input 
                        id="duration" 
                        placeholder="2020 - Present" 
                        className="mt-1"
                        value={formData.duration}
                        onChange={(e) => handleInputChange("duration", e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">{t("cvBuilder.description")}</Label>
                    <Textarea 
                      id="description" 
                      rows={4} 
                      placeholder={t("cvBuilder.description")} 
                      className="mt-1"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>
                  <Button variant="outline" className="w-full">{t("cvBuilder.addPosition")}</Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">{t("cvBuilder.educationSection")}</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="education">{t("cvBuilder.educationField")}</Label>
                    <Input 
                      id="education" 
                      placeholder="Bachelor's in Computer Science" 
                      className="mt-1"
                      value={formData.education}
                      onChange={(e) => handleInputChange("education", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="skills">{t("cvBuilder.skills")}</Label>
                    <Textarea 
                      id="skills" 
                      rows={3} 
                      placeholder="React, TypeScript, Node.js..." 
                      className="mt-1"
                      value={formData.skills}
                      onChange={(e) => handleInputChange("skills", e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* AI Assistant */}
            <div className="space-y-6">
              <Card className="p-6 sticky top-4">
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
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("cvBuilder.previewCV")}</DialogTitle>
            </DialogHeader>
            <CVPreview data={formData} template={selectedTemplate} />
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
