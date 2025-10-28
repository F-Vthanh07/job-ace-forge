import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";

const RecruiterLogin = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="gradient-primary p-3 rounded-lg shadow-glow">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-gradient">CareerAI for Business</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Recruiter Portal</h1>
          <p className="text-muted-foreground">Sign in to manage your recruitment</p>
        </div>

        <form className="space-y-4">
          <div>
            <Label htmlFor="email">Company Email</Label>
            <Input id="email" type="email" placeholder="hr@company.com" className="mt-1" />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" className="mt-1" />
          </div>

          <Button className="w-full gradient-primary shadow-glow" size="lg" asChild>
            <Link to="/recruiter-dashboard">Sign In</Link>
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Need an enterprise account? </span>
            <Link to="/enterprise-signup" className="text-primary hover:underline font-medium">
              Contact Sales
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RecruiterLogin;
