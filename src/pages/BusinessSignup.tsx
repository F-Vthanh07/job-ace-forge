import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const BusinessSignup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/recruiter-dashboard`,
          data: {
            full_name: formData.companyName,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Add business role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: authData.user.id, role: "business" });

        if (roleError) throw roleError;

        // Create business profile
        const { error: profileError } = await supabase
          .from("business_profiles")
          .insert({
            user_id: authData.user.id,
            company_name: formData.companyName,
            company_email: formData.email,
          });

        if (profileError) throw profileError;

        toast({
          title: "Success",
          description: "Account created successfully",
        });

        navigate("/recruiter-dashboard");
      }
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="gradient-primary p-3 rounded-lg shadow-glow">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-gradient">{t("common.appName")} for Business</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">{t("common.signUp")}</h1>
          <p className="text-muted-foreground">Create your business account</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Company Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
            />
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Creating account..." : t("common.signUp")}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default BusinessSignup;
