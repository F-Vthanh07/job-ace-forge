import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Save, Eye } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const CVBuilder = () => {
  const [aiSuggestion, setAiSuggestion] = useState("");

  const generateSuggestion = () => {
    setAiSuggestion("Consider highlighting your leadership experience in managing cross-functional teams. This adds value to your profile for senior positions.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">AI CV Builder</h1>
              <p className="text-muted-foreground">Build your perfect CV with AI assistance</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to="/cv-manager">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
              <Button className="gradient-primary shadow-glow">
                <Save className="h-4 w-4 mr-2" />
                Save CV
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Editor */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input id="fullName" placeholder="John Doe" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="john@example.com" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input id="title" placeholder="Senior Frontend Developer" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea id="summary" rows={4} placeholder="Write a compelling summary..." className="mt-1" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Work Experience</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input id="company" placeholder="Tech Company Inc." className="mt-1" />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input id="position" placeholder="Senior Developer" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Input id="duration" placeholder="2020 - Present" className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" rows={4} placeholder="Describe your responsibilities and achievements..." className="mt-1" />
                  </div>
                  <Button variant="outline" className="w-full">Add Another Position</Button>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Education & Skills</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Input id="education" placeholder="Bachelor's in Computer Science" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="skills">Skills</Label>
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
                  <h3 className="font-bold text-lg">AI Assistant</h3>
                </div>

                <Button 
                  className="w-full gradient-primary mb-4"
                  onClick={generateSuggestion}
                >
                  Get AI Suggestions
                </Button>

                {aiSuggestion && (
                  <div className="p-4 bg-accent-light rounded-lg border border-accent/20">
                    <p className="text-sm text-foreground">{aiSuggestion}</p>
                  </div>
                )}

                <div className="mt-4 space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    Improve Summary
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Optimize Keywords
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Check Grammar
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
