import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap } from "lucide-react";

const Premium = () => {
  const features = {
    free: [
      "3 CV reviews per month",
      "5 mock interviews per month",
      "Basic job matching",
      "Standard AI suggestions",
    ],
    premium: [
      "Unlimited CV reviews",
      "Unlimited mock interviews",
      "Advanced AI analysis",
      "Priority job matching",
      "Personalized career coaching",
      "Industry-specific templates",
      "Download interview recordings",
      "Email support",
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Upgrade Your Career Journey</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
            <p className="text-xl text-muted-foreground">
              Unlock advanced features to accelerate your career growth
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <Card className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Free</h3>
                <div className="mb-4">
                  <span className="text-5xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-muted-foreground">Perfect for getting started</p>
              </div>

              <Button variant="outline" size="lg" className="w-full mb-6">
                Current Plan
              </Button>

              <div className="space-y-3">
                {features.free.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Premium Plan */}
            <Card className="p-8 border-primary shadow-glow relative overflow-hidden">
              <div className="absolute top-4 right-4">
                <Badge className="gradient-primary text-white">
                  <Zap className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <div className="mb-1">
                  <span className="text-5xl font-bold">699K</span>
                  <span className="text-muted-foreground"> VND/month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  ~$6 USD • Save 33% with annual billing
                </p>
              </div>

              <Button size="lg" className="w-full gradient-primary shadow-glow mb-6">
                Upgrade to Premium
              </Button>

              <div className="space-y-3">
                {features.premium.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-sm font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* FAQ */}
          <Card className="p-8 mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <FAQItem
                question="Can I cancel anytime?"
                answer="Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period."
              />
              <FAQItem
                question="What payment methods do you accept?"
                answer="We accept all major credit cards, debit cards, and local payment methods including bank transfers."
              />
              <FAQItem
                question="Is there a free trial?"
                answer="New users get 7 days to try all Premium features for free. No credit card required."
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
  <div>
    <h3 className="font-semibold mb-2">{question}</h3>
    <p className="text-muted-foreground">{answer}</p>
  </div>
);

export default Premium;
