import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const RecruiterLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;
      navigate("/recruiter-dashboard");
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
          <h1 className="text-3xl font-bold mb-2">{t("business.login.title")}</h1>
          <p className="text-muted-foreground">{t("business.login.subtitle")}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">{t("business.login.email")}</Label>
            <Input 
              id="email" 
              type="email" 
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">{t("business.login.password")}</Label>
            <Input 
              id="password" 
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Signing in..." : t("business.login.signIn")}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t("business.login.needAccount")} </span>
            <Link to="/business-signup" className="text-primary hover:underline font-medium">
              {t("common.signUp")}
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default RecruiterLogin;
