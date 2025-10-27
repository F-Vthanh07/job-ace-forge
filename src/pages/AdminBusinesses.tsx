import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const AdminBusinesses = () => {
  const { t } = useLanguage();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<any[]>([]);

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }
    loadBusinesses();
  }, [role]);

  const loadBusinesses = async () => {
    const { data } = await supabase
      .from("business_profiles")
      .select(`
        *,
        job_postings (count)
      `);

    if (data) setBusinesses(data);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t("admin.businesses.title")}</h1>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-4">{t("admin.businesses.companyName")}</th>
                  <th className="text-left p-4">{t("admin.businesses.industry")}</th>
                  <th className="text-left p-4">{t("admin.businesses.jobs")}</th>
                  <th className="text-left p-4">{t("admin.businesses.subscription")}</th>
                  <th className="text-left p-4">{t("admin.users.joined")}</th>
                </tr>
              </thead>
              <tbody>
                {businesses.map((business) => (
                  <tr key={business.id} className="border-b">
                    <td className="p-4 font-medium">{business.company_name}</td>
                    <td className="p-4">{business.industry || "N/A"}</td>
                    <td className="p-4">{business.job_postings?.[0]?.count || 0}</td>
                    <td className="p-4">
                      <Badge variant={business.is_premium ? "default" : "secondary"}>
                        {business.is_premium ? "Premium" : "Basic"}
                      </Badge>
                    </td>
                    <td className="p-4">
                      {new Date(business.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminBusinesses;
