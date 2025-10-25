import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Save, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const CVBuilder = () => {
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState("simple");
  const { t } = useLanguage();

  const generateSuggestion = () => {
    setAiSuggestion("Consider highlighting your leadership experience in managing cross-functional teams. This adds value to your profile for senior positions.");
  };

  const templates = [
    { id: "simple", name: t("cvBuilder.templateSimple"), color: "border-primary" },
    { id: "modern", name: t("cvBuilder.templateModern"), color: "border-accent" },
    { id: "professional", name: t("cvBuilder.templateProfessional"), color: "border-success" },
    { id: "creative", name: t("cvBuilder.templateCreative"), color: "border-warning" },
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
              <Button variant="outline" asChild>
                <Link to="/cv-manager">
                  <Eye className="h-4 w-4 mr-2" />
                  {t("cvBuilder.preview")}
                </Link>
              </Button>
              <Button className="gradient-primary shadow-glow">
                <Save className="h-4 w-4 mr-2" />
                {t("cvBuilder.saveCV")}
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
                      className={`flex flex-col items-center justify-center p-6 border-2 rounded-lg cursor-pointer transition-all hover:border-primary peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 ${template.color}`}
                    >
                      <div className="w-16 h-20 mb-2 bg-muted rounded border-2 border-border"></div>
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
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">{t("cvBuilder.fullName")}</Label>
                      <Input id="fullName" placeholder="John Doe" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">{t("cvBuilder.email")}</Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="mt-1" />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">{t("cvBuilder.phone")}</Label>
                      <Input id="phone" placeholder="+84 123 456 789" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="address">{t("cvBuilder.address")}</Label>
                      <Input id="address" placeholder="Ho Chi Minh City" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">{t("cvBuilder.professionalTitle")}</Label>
                    <Input id="title" placeholder="Senior Frontend Developer" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="summary">{t("cvBuilder.summary")}</Label>
                    <Textarea id="summary" rows={4} placeholder={t("cvBuilder.summary")} className="mt-1" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">{t("cvBuilder.workExperience")}</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company">{t("cvBuilder.company")}</Label>
                    <Input id="company" placeholder="Tech Company Inc." className="mt-1" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="position">{t("cvBuilder.position")}</Label>
                      <Input id="position" placeholder="Senior Developer" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="duration">{t("cvBuilder.duration")}</Label>
                      <Input id="duration" placeholder="2020 - Present" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">{t("cvBuilder.description")}</Label>
                    <Textarea id="description" rows={4} placeholder={t("cvBuilder.description")} className="mt-1" />
                  </div>
                  <Button variant="outline" className="w-full">{t("cvBuilder.addPosition")}</Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">{t("cvBuilder.educationSection")}</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="education">{t("cvBuilder.educationField")}</Label>
                    <Input id="education" placeholder="Bachelor's in Computer Science" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="skills">{t("cvBuilder.skills")}</Label>
                    <Textarea id="skills" rows={3} placeholder="React, TypeScript, Node.js..." className="mt-1" />
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
                  onClick={generateSuggestion}
                >
                  {t("cvBuilder.getAISuggestions")}
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
      </div>
    </div>
  );
};

export default CVBuilder;
