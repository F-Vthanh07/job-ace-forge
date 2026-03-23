import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { cvService } from "@/services/cvService";

const InterviewSetup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [gender, setGender] = useState("male");
  const [difficulty, setDifficulty] = useState("medium");
  const [targetRole, setTargetRole] = useState("developer");
  const [isLoading, setIsLoading] = useState(false);
  
  const [candidateId, setCandidateId] = useState("");
  const [profileId, setProfileId] = useState("");

  const { t } = useLanguage();

  useEffect(() => {
    const fetchUserData = async () => {
      const accountId = localStorage.getItem("accountId");
      if (accountId) {
        setCandidateId(accountId);
      }

      // Fetch CVs to get profileId
      try {
        const response = await cvService.getAllCVsByCandidate();
        if (response.success && response.data && response.data.length > 0) {
          const activeCV = response.data.find(cv => cv.isActive) || response.data[0];
          if (activeCV && activeCV.id) {
            setProfileId(activeCV.id);
          }
        }
      } catch (e) {
        console.error("Error fetching CVs:", e);
      }
    };
    fetchUserData();
  }, []);

  const handleStartInterview = async () => {
    try {
      setIsLoading(true);
      if (!candidateId || !profileId) {
        toast({
          title: "Thiếu thông tin",
          description: "Vui lòng đăng nhập và tạo ít nhất 1 CV để có thể phỏng vấn Mock Interview.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Format difficulty to PascalCase for backend Enum compatibility
      const formattedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

      const response = await fetch("https://aijobmatch.onrender.com/api/MockInterview/start-Interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidateId: candidateId,
          candidateProfileId: profileId,
          interviewDifficulty: formattedDifficulty,
          customTargetJobTitle: targetRole
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("API error response:", errText);
        throw new Error(`API error: ${response.status} - ${errText}`);
      }

      const data = await response.json();
      console.log("✅ API Success Response:", data);
      
      toast({
        title: "Success",
        description: "Mock interview initialized"
      });

      navigate(`/interview-session?gender=${gender}&difficulty=${difficulty}`, {
        state: { 
          mockInterviewId: data.mockInterviewId,
          firstQuestionId: data.firstQuestionId,
          firstQuestionText: data.firstQuestionText
        }
      });
    } catch (error) {
      console.error("Failed to start mock interview:", error);
      toast({
        title: "Error",
        description: "Failed to initialize mock interview. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Video className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">{t("interview.badge")}</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">{t("interview.setupTitle")}</h1>
            <p className="text-muted-foreground">{t("interview.setupSubtitle")}</p>
          </div>

          <Card className="p-8 mb-6">
            <div className="space-y-6">
              {/* Industry Selection */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">{t("interview.industry")}</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={t("interview.selectIndustry")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="consulting">Consulting</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Role Selection */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">{t("interview.targetRole")}</Label>
                <Select value={targetRole} onValueChange={setTargetRole}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("interview.selectRole")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Developer</SelectItem>
                    <SelectItem value="backend">Backend Developer</SelectItem>
                    <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                    <SelectItem value="designer">UI/UX Designer</SelectItem>
                    <SelectItem value="pm">Product Manager</SelectItem>
                    <SelectItem value="developer">Developer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interview Style */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">{t("interview.interviewStyle")}</Label>
                <RadioGroup defaultValue="behavioral">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="behavioral" id="behavioral" />
                      <Label htmlFor="behavioral" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">{t("interview.behavioral")}</p>
                          <p className="text-sm text-muted-foreground">{t("interview.behavioralDesc")}</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="technical" id="technical" />
                      <Label htmlFor="technical" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">{t("interview.technical")}</p>
                          <p className="text-sm text-muted-foreground">{t("interview.technicalDesc")}</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="mixed" id="mixed" />
                      <Label htmlFor="mixed" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">{t("interview.mixed")}</p>
                          <p className="text-sm text-muted-foreground">{t("interview.mixedDesc")}</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Difficulty Level */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">{t("interview.selectDifficulty")}</Label>
                <RadioGroup defaultValue="medium" onValueChange={setDifficulty}>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2 p-4 rounded-lg border hover:border-success transition-colors cursor-pointer">
                      <RadioGroupItem value="easy" id="easy" />
                      <Label htmlFor="easy" className="cursor-pointer font-medium">{t("interview.easy")}</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-lg border hover:border-warning transition-colors cursor-pointer">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="cursor-pointer font-medium">{t("interview.medium")}</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-lg border hover:border-destructive transition-colors cursor-pointer">
                      <RadioGroupItem value="hard" id="hard" />
                      <Label htmlFor="hard" className="cursor-pointer font-medium">{t("interview.hard")}</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Interviewer Gender */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">{t("interview.selectGender")}</Label>
                <RadioGroup defaultValue="male" onValueChange={setGender}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer font-medium">{t("interview.male")}</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer font-medium">{t("interview.female")}</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            </div>
          </Card>

          <Button 
            className="w-full gradient-primary shadow-glow" 
            size="lg"
            onClick={handleStartInterview}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
              <Play className="h-5 w-5 mr-2" />
            )}
            {isLoading ? t("Loading...") || "Loading..." : t("interview.startInterview")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
