import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Briefcase, MapPin, DollarSign, Clock, Building, Share2, Heart } from "lucide-react";
import { SkillBadge } from "@/components/SkillBadge";

const JobDetail = () => {
  const matchBreakdown = [
    { category: "Skills Match", score: 95 },
    { category: "Experience Level", score: 88 },
    { category: "Education", score: 92 },
    { category: "Location", score: 90 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <Card className="p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex gap-4">
                <div className="gradient-primary p-4 rounded-lg">
                  <Briefcase className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-2">Senior Frontend Developer</h1>
                  <p className="text-xl text-muted-foreground mb-3">TechCorp Vietnam</p>
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      Ho Chi Minh City, Vietnam
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      $2,000 - $3,500 / month
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      Posted 2 days ago
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      50-200 employees
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-3">
              <Button size="lg" className="gradient-primary shadow-glow">
                Apply Now
              </Button>
              <Button size="lg" variant="outline">
                Save for Later
              </Button>
            </div>
          </Card>

          {/* Match Rate */}
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Profile Match Analysis</h2>
              <div className="text-right">
                <p className="text-4xl font-bold text-success">92%</p>
                <p className="text-sm text-muted-foreground">Overall Match</p>
              </div>
            </div>

            <div className="space-y-4">
              {matchBreakdown.map((item) => (
                <div key={item.category}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-success font-bold">{item.score}%</span>
                  </div>
                  <Progress value={item.score} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Job Description */}
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                We are looking for an experienced Senior Frontend Developer to join our dynamic team.
                You will be responsible for building and maintaining high-quality web applications
                using modern technologies.
              </p>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Responsibilities:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>Develop and maintain frontend applications using React and TypeScript</li>
                  <li>Collaborate with designers and backend developers</li>
                  <li>Optimize applications for maximum speed and scalability</li>
                  <li>Mentor junior developers and conduct code reviews</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Requirements:</h3>
                <ul className="list-disc list-inside space-y-1">
                  <li>5+ years of experience in frontend development</li>
                  <li>Strong proficiency in React, TypeScript, and modern CSS</li>
                  <li>Experience with state management and API integration</li>
                  <li>Excellent problem-solving and communication skills</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Required Skills */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              <SkillBadge skill="React" variant="primary" />
              <SkillBadge skill="TypeScript" variant="primary" />
              <SkillBadge skill="Tailwind CSS" variant="success" />
              <SkillBadge skill="Git" variant="success" />
              <SkillBadge skill="REST APIs" variant="accent" />
              <SkillBadge skill="Testing" variant="accent" />
              <SkillBadge skill="Agile" variant="default" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
