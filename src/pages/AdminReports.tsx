import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { TrendingUp, DollarSign, Users, Briefcase } from "lucide-react";

const AdminReports = () => {
  const { t } = useLanguage();
  const { role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
    }
  }, [role]);

  const reports = [
    {
      title: t("admin.reports.userGrowth"),
      value: "+245",
      change: "+12.5%",
      icon: Users,
    },
    {
      title: t("admin.reports.revenue"),
      value: "4.8M VND",
      change: "+8.2%",
      icon: DollarSign,
    },
    {
      title: t("admin.reports.jobStats"),
      value: "156",
      change: "+23.1%",
      icon: Briefcase,
    },
    {
      title: t("admin.reports.engagement"),
      value: "78%",
      change: "+5.4%",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t("admin.reports.title")}</h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {reports.map((report) => (
            <Card key={report.title} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <report.icon className="h-8 w-8 text-primary" />
                <span className="text-sm text-green-600 font-medium">{report.change}</span>
              </div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                {report.title}
              </h3>
              <p className="text-3xl font-bold">{report.value}</p>
            </Card>
          ))}
        </div>

        <Card className="p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Monthly Overview</h2>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Chart visualization would go here
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="font-medium">New business registered</p>
                <p className="text-sm text-muted-foreground">Tech Innovations Co.</p>
              </div>
              <p className="text-sm text-muted-foreground">2 hours ago</p>
            </div>
            <div className="flex justify-between items-center pb-4 border-b">
              <div>
                <p className="font-medium">Job posting created</p>
                <p className="text-sm text-muted-foreground">Senior Developer Position</p>
              </div>
              <p className="text-sm text-muted-foreground">5 hours ago</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Premium subscription activated</p>
                <p className="text-sm text-muted-foreground">ABC Corporation</p>
              </div>
              <p className="text-sm text-muted-foreground">1 day ago</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminReports;
