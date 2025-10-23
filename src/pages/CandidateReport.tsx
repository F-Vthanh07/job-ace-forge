import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Mail, Phone, MapPin, Download, Star } from "lucide-react";

const CandidateReport = () => {
  const skillScores = [
    { skill: "React", score: 95 },
    { skill: "TypeScript", score: 90 },
    { skill: "Problem Solving", score: 88 },
    { skill: "Communication", score: 92 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <Card className="p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex gap-6">
                <div className="h-24 w-24 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-3xl">
                  JD
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">John Doe</h1>
                  <p className="text-xl text-muted-foreground mb-3">Senior Frontend Developer</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      john.doe@email.com
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      +84 123 456 789
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Ho Chi Minh City
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download CV
                </Button>
                <Button className="gradient-primary">
                  Schedule Interview
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Badge className="bg-success text-success-foreground">
                <Star className="h-3 w-3 mr-1" />
                Top Candidate
              </Badge>
              <Badge variant="secondary">5 years experience</Badge>
              <Badge variant="secondary">Applied 2 hours ago</Badge>
            </div>
          </Card>

          {/* Match Score */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">AI Match Analysis</h2>
              <div className="text-right">
                <p className="text-4xl font-bold text-success">92%</p>
                <p className="text-sm text-muted-foreground">Overall Match</p>
              </div>
            </div>

            <div className="space-y-4">
              {skillScores.map((item) => (
                <div key={item.skill}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{item.skill}</span>
                    <span className="text-success font-bold">{item.score}%</span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Interview Summary */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">AI Interview Summary</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Strengths</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Excellent technical knowledge in React and modern frontend technologies</li>
                  <li>Strong problem-solving abilities demonstrated in mock interviews</li>
                  <li>Clear and articulate communication style</li>
                  <li>Proven leadership experience managing small teams</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Areas to Explore</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Backend development experience could be expanded</li>
                  <li>Ask about experience with large-scale applications</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Experience */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
            <div className="space-y-6">
              <ExperienceItem
                title="Senior Frontend Developer"
                company="Tech Company Inc."
                period="2021 - Present"
                description="Leading frontend development for enterprise applications using React, TypeScript, and modern tooling."
              />
              <ExperienceItem
                title="Frontend Developer"
                company="Digital Agency"
                period="2019 - 2021"
                description="Built responsive websites and web applications for various clients."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ExperienceItem = ({ 
  title, 
  company, 
  period, 
  description 
}: { 
  title: string; 
  company: string; 
  period: string; 
  description: string;
}) => (
  <div>
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="text-muted-foreground mb-1">{company} • {period}</p>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default CandidateReport;
