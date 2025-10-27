import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Users, Building2, Briefcase, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBusinesses: 0,
    activeJobs: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }
    loadStats();
  }, [role]);

  const loadStats = async () => {
    const [usersCount, businessesCount, jobsCount] = await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("business_profiles").select("*", { count: "exact", head: true }),
      supabase.from("job_postings").select("*", { count: "exact", head: true }).eq("status", "active"),
    ]);

    setStats({
      totalUsers: usersCount.count || 0,
      totalBusinesses: businessesCount.count || 0,
      activeJobs: jobsCount.count || 0,
      revenue: 4800000,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-2">{t("admin.dashboard.title")}</h1>
        <p className="text-muted-foreground mb-8">{t("admin.dashboard.overview")}</p>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Users}
            title={t("admin.dashboard.stats.totalUsers")}
            value={stats.totalUsers.toString()}
          />
          <StatCard
            icon={Building2}
            title={t("admin.dashboard.stats.totalBusinesses")}
            value={stats.totalBusinesses.toString()}
          />
          <StatCard
            icon={Briefcase}
            title={t("admin.dashboard.stats.activeJobs")}
            value={stats.activeJobs.toString()}
          />
          <StatCard
            icon={DollarSign}
            title={t("admin.dashboard.stats.revenue")}
            value={`${(stats.revenue / 1000000).toFixed(1)}M VND`}
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/users")}>
            <h3 className="text-xl font-bold mb-2">{t("admin.users.title")}</h3>
            <p className="text-muted-foreground">Manage users and their permissions</p>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/businesses")}>
            <h3 className="text-xl font-bold mb-2">{t("admin.businesses.title")}</h3>
            <p className="text-muted-foreground">Manage business accounts</p>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/pricing")}>
            <h3 className="text-xl font-bold mb-2">{t("admin.pricing.title")}</h3>
            <p className="text-muted-foreground">Configure pricing plans</p>
          </Card>

          <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate("/admin/reports")}>
            <h3 className="text-xl font-bold mb-2">{t("admin.reports.title")}</h3>
            <p className="text-muted-foreground">View analytics and reports</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
