import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";

const PostJob = () => {
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
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input id="jobTitle" placeholder="e.g. Senior Frontend Developer" className="mt-1" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="engineering">Engineering</SelectItem>
                          <SelectItem value="design">Design</SelectItem>
                          <SelectItem value="product">Product</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" placeholder="Ho Chi Minh City" className="mt-1" />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Employment Type</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fulltime">Full-time</SelectItem>
                          <SelectItem value="parttime">Part-time</SelectItem>
                          <SelectItem value="contract">Contract</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="level">Experience Level</Label>
                      <Select>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="junior">Junior</SelectItem>
                          <SelectItem value="mid">Mid-level</SelectItem>
                          <SelectItem value="senior">Senior</SelectItem>
                          <SelectItem value="lead">Lead</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="salary">Salary Range</Label>
                    <Input id="salary" placeholder="e.g. $2,000 - $3,500" className="mt-1" />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Job Description</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      rows={6} 
                      placeholder="Describe the role, responsibilities, and what makes it exciting..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="requirements">Requirements</Label>
                    <Textarea 
                      id="requirements" 
                      rows={6} 
                      placeholder="List the required skills, experience, and qualifications..."
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="benefits">Benefits</Label>
                    <Textarea 
                      id="benefits" 
                      rows={4} 
                      placeholder="What benefits and perks do you offer?"
                      className="mt-1"
                    />
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">Save as Draft</Button>
                <Button className="flex-1 gradient-primary shadow-glow">Publish Job</Button>
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
