import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Loader2, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { subscriptionService, SubscriptionPlan } from "@/services/subscriptionService";
import { notifyError } from "@/utils/notification";

const RecruiterPremium = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);

  useEffect(() => {
    fetchRecruiterPlansAndCurrentPlan();
  }, []);

  const fetchRecruiterPlansAndCurrentPlan = async () => {
    try {
      setLoading(true);
      
      // Fetch both plans and user's current subscription concurrently
      const [plansResponse, userSubResponse] = await Promise.all([
        subscriptionService.getAllPlans(),
        subscriptionService.getCurrentUserSubscription()
      ]);
      
      console.log("📦 All plans from API:", plansResponse.data);
      console.log("👤 User subscription:", userSubResponse.data);
      
      if (userSubResponse.success && userSubResponse.data && userSubResponse.data.status === "Active") {
        setCurrentPlanId(userSubResponse.data.planId);
      }
      
      if (plansResponse.success && plansResponse.data) {
        // Filter for recruiter plans only (any plan with role "recruiter" and active status)
        const recruiterPlans = plansResponse.data.filter(plan => {
          const role = (plan.targetRole || "").trim().toLowerCase();
          const status = (plan.status || "").trim().toLowerCase();
          const isRecruiterPlan = role === "recruiter" && status === "active";
          
          if (isRecruiterPlan) {
            console.log(`✅ Recruiter plan found: "${plan.name}" - ${plan.price}K VND - ${plan.durationInDays} days`);
          }
          
          return isRecruiterPlan;
        });
        
        setPlans(recruiterPlans);
        
        if (recruiterPlans.length === 0) {
          console.log("ℹ️ No active plans found for role 'recruiter' - showing free features message");
        } else {
          console.log(`✅ Total ${recruiterPlans.length} recruiter plan(s) loaded`);
        }
      } else {
        notifyError({
          title: "Error",
          description: plansResponse.message || "Failed to fetch subscription plans"
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      notifyError({
        title: "Error",
        description: "An error occurred while fetching plans"
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
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

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    navigate('/payment-detail', { 
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

        {plans.length === 0 ? (
          <Card className="p-12 mb-16 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 text-center">
            <div className="max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-success/10 mb-6">
                <Gift className="h-10 w-10 text-success" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Tất cả tính năng miễn phí! 🎉</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Hiện tại tất cả các tính năng của nền tảng đều được cung cấp miễn phí cho nhà tuyển dụng. 
                Bạn có thể sử dụng đầy đủ các công cụ tuyển dụng mạnh mẽ mà không cần đăng ký gói Premium.
              </p>
              <div className="grid md:grid-cols-2 gap-4 mt-8">
                <div className="flex items-start gap-3 text-left">
                  <Check className="h-5 w-5 text-success shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Đăng tin tuyển dụng không giới hạn</p>
                    <p className="text-sm text-muted-foreground">Tạo và quản lý nhiều tin tuyển dụng</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <Check className="h-5 w-5 text-success shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">AI matching thông minh</p>
                    <p className="text-sm text-muted-foreground">Tìm ứng viên phù hợp với AI</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <Check className="h-5 w-5 text-success shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Quản lý ứng viên hiệu quả</p>
                    <p className="text-sm text-muted-foreground">Theo dõi và đánh giá ứng viên</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-left">
                  <Check className="h-5 w-5 text-success shrink-0 mt-1" />
                  <div>
                    <p className="font-semibold">Báo cáo và phân tích</p>
                    <p className="text-sm text-muted-foreground">Thống kê chi tiết về tuyển dụng</p>
                  </div>
                </div>
              </div>
              <Button 
                className="mt-8 gradient-primary shadow-glow" 
                size="lg"
                onClick={() => navigate('/recruiter/dashboard')}
              >
                Bắt đầu tuyển dụng ngay
              </Button>
            </div>
          </Card>
        ) : (
          <div className={`grid ${getGridColumns()} gap-8 mb-16`}>
            {plans.map((plan, index) => {
              const features = parseFeatures(plan.features);
              const isPopular = plan.isRecommended || index === 1;
              
              return (
                <Card 
                  key={plan.id} 
                  className={`p-8 relative ${isPopular ? 'border-primary shadow-glow' : ''}`}
                >
                  {isPopular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 gradient-primary">
                      <Zap className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{plan.description || "Premium recruitment features"}</p>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold text-gradient">{formatPrice(plan.price)}</span>
                      <span className="text-muted-foreground">{plan.price > 0 ? getDurationLabel(plan.durationInDays) : ""}</span>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-success shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className={`w-full ${currentPlanId === plan.id ? 'bg-green-600 hover:bg-green-700 shadow-glow text-white' : isPopular ? 'gradient-primary shadow-glow' : ''}`}
                    variant={currentPlanId === plan.id ? 'default' : isPopular ? 'default' : 'outline'}
                    size="lg"
                    onClick={() => handleSelectPlan(plan)}
                    disabled={currentPlanId === plan.id}
                  >
                    {currentPlanId === plan.id ? "Current Plan" : "Chọn gói này"}
                  </Button>
                </Card>
              );
            })}
          </div>
        )}

        {plans.length > 0 && (
          <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Cần giải pháp tùy chỉnh?</h2>
                <p className="text-muted-foreground mb-6">
                  Gói doanh nghiệp của chúng tôi có thể được tùy chỉnh theo nhu cầu cụ thể của bạn. 
                  Liên hệ với đội ngũ của chúng tôi để thảo luận về giá và tính năng tùy chỉnh.
                </p>
                <Button className="gradient-primary shadow-glow" size="lg">
                  Đặt lịch tư vấn
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="gradient-primary p-3 rounded-lg shadow-glow h-fit">
                    <Check className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Hỗ trợ chuyên biệt</h3>
                    <p className="text-sm text-muted-foreground">Hỗ trợ ưu tiên 24/7 từ đội ngũ của chúng tôi</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="gradient-primary p-3 rounded-lg shadow-glow h-fit">
                    <Check className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Tích hợp tùy chỉnh</h3>
                    <p className="text-sm text-muted-foreground">Kết nối với các công cụ HR hiện có của bạn</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="gradient-primary p-3 rounded-lg shadow-glow h-fit">
                    <Check className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Phân tích nâng cao</h3>
                    <p className="text-sm text-muted-foreground">Thông tin chi tiết về quy trình tuyển dụng</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecruiterPremium;
