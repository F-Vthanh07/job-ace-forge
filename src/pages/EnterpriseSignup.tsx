import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, Building2 } from "lucide-react";

const EnterpriseSignup = () => {
  const features = [
    "Unlimited job postings",
    "AI-powered candidate ranking",
    "Advanced analytics dashboard",
    "Custom interview templates",
    "Team collaboration tools",
    "Priority support",
    "API access",
    "Custom branding",
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-6">
              <div className="gradient-primary p-3 rounded-lg shadow-glow">
                <Building2 className="h-8 w-8 text-primary-foreground" />
              </div>
              <span className="font-bold text-3xl text-gradient">Enterprise Plan</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">Streamline Your Hiring</h1>
            <p className="text-xl text-muted-foreground">
              Powerful tools for modern recruitment teams
            </p>
          </div>

          <Card className="p-8 mb-8">
            <div className="text-center mb-8">
              <div className="mb-4">
                <span className="text-6xl font-bold">400K</span>
                <span className="text-2xl text-muted-foreground"> VND/month</span>
              </div>
              <p className="text-muted-foreground">~$16 USD • Flexible team pricing available</p>
            </div>

            <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              {features.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <div className="gradient-primary p-1 rounded-full">
                    <Check className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <Button size="lg" className="w-full gradient-primary shadow-glow mb-4" asChild>
              <Link to="/recruiter-dashboard">Start Free Trial</Link>
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              14-day free trial • No credit card required
            </p>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <StepCard
                number="1"
                title="Post Jobs"
                description="Create detailed job descriptions with AI assistance"
              />
              <StepCard
                number="2"
                title="Review Candidates"
                description="Get AI-ranked candidates based on skills and fit"
              />
              <StepCard
                number="3"
                title="Make Decisions"
                description="Access detailed reports and interview summaries"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="text-center">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full gradient-primary mb-4 text-white font-bold text-xl">
      {number}
    </div>
    <h3 className="font-bold mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground">{description}</p>
  </div>
);

export default EnterpriseSignup;
