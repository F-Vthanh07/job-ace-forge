import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const BusinessProfile = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    company_email: "",
    company_phone: "",
    company_address: "",
    company_website: "",
    industry: "",
    company_size: "",
    description: "",
  });

  useEffect(() => {
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    const { data } = await supabase
      .from("business_profiles")
      .select("*")
      .eq("user_id", user?.id)
      .single();

    if (data) {
      setFormData(data);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from("business_profiles")
        .update(formData)
        .eq("user_id", user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">{t("business.profile.title")}</h1>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">{t("business.profile.companyInfo")}</h2>
            
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("business.profile.companyName")}</Label>
                  <Input
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{t("business.profile.email")}</Label>
                  <Input
                    type="email"
                    value={formData.company_email}
                    onChange={(e) => setFormData({ ...formData, company_email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("business.profile.phone")}</Label>
                  <Input
                    value={formData.company_phone || ""}
                    onChange={(e) => setFormData({ ...formData, company_phone: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{t("business.profile.website")}</Label>
                  <Input
                    value={formData.company_website || ""}
                    onChange={(e) => setFormData({ ...formData, company_website: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>{t("business.profile.address")}</Label>
                <Input
                  value={formData.company_address || ""}
                  onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>{t("business.profile.industry")}</Label>
                  <Input
                    value={formData.industry || ""}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  />
                </div>
                <div>
                  <Label>{t("business.profile.companySize")}</Label>
                  <Input
                    value={formData.company_size || ""}
                    onChange={(e) => setFormData({ ...formData, company_size: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <Label>{t("business.profile.description")}</Label>
                <Textarea
                  rows={4}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <Button onClick={handleSave} disabled={loading} className="w-full">
                {loading ? "Saving..." : t("business.profile.saveChanges")}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
