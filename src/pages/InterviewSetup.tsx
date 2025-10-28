import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Video, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

const InterviewSetup = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState("male");
  const [difficulty, setDifficulty] = useState("medium");
  const { t } = useLanguage();

  const handleStartInterview = () => {
    navigate(`/interview-session?gender=${gender}&difficulty=${difficulty}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Video className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Mock Interview</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">Interview Setup</h1>
            <p className="text-muted-foreground">Configure your practice session for the best experience</p>
          </div>

          <Card className="p-8 mb-6">
            <div className="space-y-6">
              {/* Industry Selection */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">Industry</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry" />
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
                <Label className="text-lg font-semibold mb-3 block">Target Role</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend">Frontend Developer</SelectItem>
                    <SelectItem value="backend">Backend Developer</SelectItem>
                    <SelectItem value="fullstack">Full Stack Developer</SelectItem>
                    <SelectItem value="designer">UI/UX Designer</SelectItem>
                    <SelectItem value="pm">Product Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Interview Style */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">Interview Style</Label>
                <RadioGroup defaultValue="behavioral">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="behavioral" id="behavioral" />
                      <Label htmlFor="behavioral" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Behavioral</p>
                          <p className="text-sm text-muted-foreground">Focus on past experiences and soft skills</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="technical" id="technical" />
                      <Label htmlFor="technical" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Technical</p>
                          <p className="text-sm text-muted-foreground">Coding challenges and technical knowledge</p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="mixed" id="mixed" />
                      <Label htmlFor="mixed" className="flex-1 cursor-pointer">
                        <div>
                          <p className="font-medium">Mixed</p>
                          <p className="text-sm text-muted-foreground">Combination of behavioral and technical</p>
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Difficulty Level */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">Difficulty Level</Label>
                <RadioGroup defaultValue="medium" onValueChange={setDifficulty}>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex items-center space-x-2 p-4 rounded-lg border hover:border-success transition-colors cursor-pointer">
                      <RadioGroupItem value="easy" id="easy" />
                      <Label htmlFor="easy" className="cursor-pointer font-medium">Easy</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-lg border hover:border-warning transition-colors cursor-pointer">
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium" className="cursor-pointer font-medium">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2 p-4 rounded-lg border hover:border-destructive transition-colors cursor-pointer">
                      <RadioGroupItem value="hard" id="hard" />
                      <Label htmlFor="hard" className="cursor-pointer font-medium">Hard</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              {/* Interviewer Gender */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">Interviewer Gender</Label>
                <RadioGroup defaultValue="male" onValueChange={setGender}>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="male" id="male" />
                      <Label htmlFor="male" className="cursor-pointer font-medium">Male</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                      <RadioGroupItem value="female" id="female" />
                      <Label htmlFor="female" className="cursor-pointer font-medium">Female</Label>
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
          >
            <Play className="h-5 w-5 mr-2" />
            Start Interview
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
