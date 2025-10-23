import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, TrendingUp, Target, Zap } from "lucide-react";

const Welcome = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="gradient-hero absolute inset-0 opacity-10" />
        
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6 animate-pulse-slow">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Career Development</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
              Build Your Dream Career
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Master interviews, craft perfect CVs, and land your ideal job with AI-powered guidance
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="gradient-primary shadow-glow text-lg px-8" asChild>
                <Link to="/signup">Get Started Free</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Target}
            title="AI CV Builder"
            description="Create ATS-optimized CVs with intelligent suggestions and real-time scoring"
          />
          <FeatureCard
            icon={Zap}
            title="Mock Interviews"
            description="Practice with AI interviewers and get detailed feedback on your performance"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Smart Job Matching"
            description="Find perfect opportunities with AI-powered CV-JD compatibility analysis"
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: typeof Sparkles; 
  title: string; 
  description: string;
}) => (
  <div className="p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="gradient-primary p-3 rounded-lg w-fit mb-4 shadow-glow">
      <Icon className="h-6 w-6 text-primary-foreground" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Welcome;
