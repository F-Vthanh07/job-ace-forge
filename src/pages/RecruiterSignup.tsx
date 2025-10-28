import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Building2 } from "lucide-react";

const RecruiterSignup = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="gradient-primary p-3 rounded-lg shadow-glow">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-gradient">Business Account</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Join as Recruiter</h1>
          <p className="text-muted-foreground">Find the perfect candidates for your company</p>
        </div>

        <form className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Company Information</h3>
            
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" placeholder="Tech Corp" className="mt-1" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyEmail">Company Email</Label>
                <Input id="companyEmail" type="email" placeholder="hr@company.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="companyPhone">Phone Number</Label>
                <Input id="companyPhone" type="tel" placeholder="+84 123 456 789" className="mt-1" />
              </div>
            </div>

            <div>
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input id="companyWebsite" type="url" placeholder="https://company.com" className="mt-1" />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="industry">Industry</Label>
                <Input id="industry" placeholder="Technology" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="companySize">Company Size</Label>
                <Input id="companySize" placeholder="50-100 employees" className="mt-1" />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Company Description</Label>
              <Textarea 
                id="description" 
                rows={4}
                placeholder="Tell candidates about your company..."
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">Company Address</Label>
              <Input id="address" placeholder="123 Street, District, City" className="mt-1" />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Account Details</h3>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" className="mt-1" />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" placeholder="••••••••" className="mt-1" />
            </div>
          </div>

          <Button className="w-full gradient-primary shadow-glow" size="lg" asChild>
            <Link to="/recruiter-dashboard">Create Business Account</Link>
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/recruiter-login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RecruiterSignup;
