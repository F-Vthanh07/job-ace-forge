import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap } from "lucide-react";

const RecruiterPremium = () => {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small businesses",
      features: [
        "Post up to 5 jobs",
        "Basic candidate matching",
        "Email support",
        "Job analytics",
        "30-day job listings"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Professional",
      price: "$299",
      period: "/month",
      description: "Ideal for growing companies",
      features: [
        "Post up to 20 jobs",
        "Advanced AI matching",
        "Priority support",
        "Advanced analytics",
        "60-day job listings",
        "Branded company page",
        "Featured job posts"
      ],
      cta: "Upgrade Now",
      popular: true
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations",
      features: [
        "Unlimited job posts",
        "Custom AI training",
        "Dedicated account manager",
        "Custom integrations",
        "90-day job listings",
        "White-label solution",
        "API access",
        "Custom analytics"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="gradient-primary p-3 rounded-lg shadow-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-xl text-muted-foreground">
            Unlock powerful recruitment tools and find the best talent faster
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`p-8 relative ${plan.popular ? 'border-primary shadow-glow' : ''}`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary">
                  <Zap className="h-3 w-3 mr-1" />
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-gradient">{plan.price}</span>
                  {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                className={`w-full ${plan.popular ? 'gradient-primary shadow-glow' : ''}`}
                variant={plan.popular ? 'default' : 'outline'}
                size="lg"
              >
                {plan.cta}
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Need a Custom Solution?</h2>
              <p className="text-muted-foreground mb-6">
                Our enterprise plan can be tailored to your specific needs. Get in touch with our sales team to discuss custom pricing and features.
              </p>
              <Button className="gradient-primary shadow-glow" size="lg">
                Schedule a Demo
              </Button>
            </div>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="gradient-primary p-3 rounded-lg shadow-glow h-fit">
                  <Check className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Dedicated Support</h3>
                  <p className="text-sm text-muted-foreground">24/7 priority support from our team</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="gradient-primary p-3 rounded-lg shadow-glow h-fit">
                  <Check className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Custom Integrations</h3>
                  <p className="text-sm text-muted-foreground">Connect with your existing HR tools</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="gradient-primary p-3 rounded-lg shadow-glow h-fit">
                  <Check className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Advanced Analytics</h3>
                  <p className="text-sm text-muted-foreground">Deep insights into your recruitment process</p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RecruiterPremium;
