import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AdminPricing = () => {
  const { t } = useLanguage();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [plans, setPlans] = useState<any[]>([]);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }
    loadPlans();
  }, [role]);

  const loadPlans = async () => {
    const { data } = await supabase
      .from("pricing_plans")
      .select("*")
      .order("price", { ascending: true });

    if (data) setPlans(data);
  };

  const filterByType = (type: string) => {
    return plans.filter(plan => plan.type === type);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t("admin.pricing.title")}</h1>

        <Tabs defaultValue="candidate">
          <TabsList>
            <TabsTrigger value="candidate">{t("admin.pricing.candidatePlans")}</TabsTrigger>
            <TabsTrigger value="business">{t("admin.pricing.businessPlans")}</TabsTrigger>
          </TabsList>

          {["candidate", "business"].map((type) => (
            <TabsContent key={type} value={type} className="mt-6">
              <div className="grid md:grid-cols-2 gap-6">
                {filterByType(type).map((plan) => (
                  <Card key={plan.id} className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <p className="text-3xl font-bold text-primary">
                          {plan.price.toLocaleString()} VND
                        </p>
                        <p className="text-sm text-muted-foreground">
                          / {plan.duration_days} days
                        </p>
                      </div>
                      <Badge variant={plan.is_active ? "default" : "secondary"}>
                        {plan.is_active ? t("admin.pricing.active") : "Inactive"}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <p className="font-semibold">{t("admin.pricing.features")}:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {(plan.features as string[]).map((feature, idx) => (
                          <li key={idx} className="text-sm">{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPricing;
