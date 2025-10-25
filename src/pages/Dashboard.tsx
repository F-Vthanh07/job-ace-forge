import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { ProgressCard } from "@/components/ProgressCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Video, Briefcase, TrendingUp, Target, Award, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("dashboard.welcome")}, John! 👋</h1>
          <p className="text-muted-foreground">Let's continue building your career</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title={t("dashboard.cvScore")}
            value="85"
            subtitle="Excellent"
            icon={FileText}
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title={t("dashboard.interviews")}
            value="12"
            subtitle="This month"
            icon={Video}
          />
          <StatCard
            title={t("dashboard.jobMatches")}
            value="23"
            subtitle="New opportunities"
            icon={Briefcase}
          />
          <StatCard
            title={t("dashboard.skillLevel")}
            value="7"
            subtitle="Advanced"
            icon={TrendingUp}
          />
        </div>

        {/* Progress Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <ProgressCard
            title={t("dashboard.interviewSkills")}
            value={8}
            maxValue={10}
            icon={Target}
            color="primary"
          />
          <ProgressCard
            title={t("dashboard.cvCompleteness")}
            value={85}
            maxValue={100}
            icon={Award}
            color="success"
          />
          <ProgressCard
            title={t("dashboard.weeklyGoal")}
            value={3}
            maxValue={5}
            icon={Zap}
            color="accent"
          />
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <ActionCard
            title={t("dashboard.buildCV")}
            description={t("dashboard.buildCVDesc")}
            icon={FileText}
            linkTo="/cv-builder"
            gradient="primary"
          />
          <ActionCard
            title={t("dashboard.practiceInterview")}
            description={t("dashboard.practiceInterviewDesc")}
            icon={Video}
            linkTo="/interview-setup"
            gradient="accent"
          />
          <ActionCard
            title={t("dashboard.findJobs")}
            description={t("dashboard.findJobsDesc")}
            icon={Briefcase}
            linkTo="/jobs"
            gradient="success"
          />
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({ 
  title, 
  description, 
  icon: Icon, 
  linkTo, 
  gradient 
}: { 
  title: string; 
  description: string; 
  icon: typeof FileText; 
  linkTo: string;
  gradient: "primary" | "accent" | "success";
}) => {
  const { t } = useLanguage();
  const gradientClasses = {
    primary: "gradient-primary",
    accent: "gradient-accent",
    success: "from-success to-success/80",
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className={`${gradientClasses[gradient]} p-3 rounded-lg w-fit mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      <Button variant="outline" className="w-full" asChild>
        <Link to={linkTo}>Get Started</Link>
      </Button>
    </Card>
  );
};

export default Dashboard;
