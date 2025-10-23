import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

const Onboarding = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 3;

  const handleComplete = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="gradient-primary p-2 rounded-lg">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold">Complete Your Profile</h1>
          </div>
          <Progress value={(step / totalSteps) * 100} className="h-2" />
          <p className="text-sm text-muted-foreground mt-2">Step {step} of {totalSteps}</p>
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" placeholder="+84 123 456 789" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="Ho Chi Minh City, Vietnam" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea id="bio" placeholder="Tell us about yourself..." className="mt-1" rows={4} />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Education & Experience</h2>
            <div>
              <Label htmlFor="education">Highest Education</Label>
              <Input id="education" placeholder="Bachelor's in Computer Science" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="experience">Years of Experience</Label>
              <Input id="experience" type="number" placeholder="3" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="current-role">Current/Last Role</Label>
              <Input id="current-role" placeholder="Senior Frontend Developer" className="mt-1" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Career Goals</h2>
            <div>
              <Label htmlFor="target-role">Target Role</Label>
              <Input id="target-role" placeholder="Lead Developer" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="skills">Key Skills (comma separated)</Label>
              <Input id="skills" placeholder="React, TypeScript, Node.js" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="goals">Career Goals</Label>
              <Textarea id="goals" placeholder="What do you want to achieve?" className="mt-1" rows={4} />
            </div>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Previous
            </Button>
          )}
          {step < totalSteps ? (
            <Button className="ml-auto gradient-primary" onClick={() => setStep(step + 1)}>
              Next Step
            </Button>
          ) : (
            <Button className="ml-auto gradient-primary shadow-glow" onClick={handleComplete}>
              Complete Setup
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
