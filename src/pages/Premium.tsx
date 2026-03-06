import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subscriptionService, SubscriptionPlan } from "@/services/subscriptionService";
import { notifyError } from "@/utils/notification";

const Premium = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCandidatePlans();
  }, []);

  const fetchCandidatePlans = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getAllPlans();
      
      if (response.success && response.data) {
        // Filter for candidate plans only (active status)
        const candidatePlans = response.data.filter(plan => {
          const role = (plan.targetRole || "").trim().toLowerCase();
          const status = (plan.status || "").trim().toLowerCase();
          return role === "candidate" && status === "active";
        });
        setPlans(candidatePlans);
      } else {
        notifyError({
          title: "Error",
          description: response.message || "Failed to fetch subscription plans"
        });
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      notifyError({
        title: "Error",
        description: "An error occurred while fetching plans"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "";
    if (price >= 1000) {
      // Giá lớn hơn 1000, hiển thị dạng K (VND)
      return `${(price / 1000).toFixed(0)}K`;
    }
    // Giá nhỏ hơn 1000, có thể là đơn vị nghìn VND, hiển thị trực tiếp
    return `${Math.round(price)}K`;
  };

  const parseFeatures = (features: string): string[] => {
    return features.split(',').map(f => f.trim()).filter(f => f.length > 0);
  };

  const getDurationLabel = (days: number) => {
    if (days === 30) return "/month";
    if (days === 365) return "/year";
    return `/${days} days`;
  };

  const getGridColumns = () => {
    if (plans.length === 2) return 'md:grid-cols-2';
    if (plans.length === 1) return 'md:grid-cols-1';
    return 'md:grid-cols-3';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

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

          <div className={`grid gap-8 max-w-4xl mx-auto ${getGridColumns()}`}>
            {plans.map((plan, index) => {
              const isFree = plan.price === 0;
              const isPremium = plan.price > 0;
              const isPopular = isPremium && index === 1; // Second non-free plan is popular
              const features = parseFeatures(plan.features);

              return (
                <Card 
                  key={plan.id} 
                  className={`p-8 ${isPremium ? 'border-primary shadow-glow' : ''} relative overflow-hidden`}
                >
                  {isPopular && (
                    <div className="absolute top-4 right-4">
                      <Badge className="gradient-primary text-white">
                        <Zap className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="mb-1">
                      <span className="text-5xl font-bold">{formatPrice(plan.price)}</span>
                      <span className="text-muted-foreground">
                        {isPremium && " VND" + getDurationLabel(plan.durationInDays)}
                      </span>
                    </div>
                    {isPremium && plan.durationInDays === 365 && (
                      <p className="text-sm text-muted-foreground mb-4">
                        Save 33% with annual billing
                      </p>
                    )}
                    {isFree && (
                      <p className="text-muted-foreground mt-4">Perfect for getting started</p>
                    )}
                  </div>

                  <Button 
                    size="lg" 
                    variant={isFree ? "outline" : "default"}
                    className={`w-full mb-6 ${isPremium ? 'gradient-primary shadow-glow' : ''}`}
                    onClick={() => {
                      if (isPremium) {
                        navigate("/payment-detail", {
                          state: {
                            plan: {
                              id: plan.id,
                              name: plan.name,
                              price: plan.price,
                              durationInDays: plan.durationInDays,
                              features: plan.features
                            }
                          }
                        });
                      }
                    }}
                    disabled={isFree}
                  >
                    {isFree ? "Current Plan" : `Upgrade to ${plan.name}`}
                  </Button>

                  <div className="space-y-3">
                    {features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Check className={`h-5 w-5 ${isPremium ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-sm ${isPremium ? 'font-medium' : ''}`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
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
