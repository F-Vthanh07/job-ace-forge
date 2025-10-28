import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/StatCard";
import { 
  Users, 
  Building2, 
  Briefcase, 
  DollarSign,
  TrendingUp,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const stats = [
    {
      title: "Total Users",
      value: "12,543",
      icon: Users,
      trend: {
        value: 12.5,
        isPositive: true
      }
    },
    {
      title: "Active Businesses",
      value: "248",
      icon: Building2,
      trend: {
        value: 8.2,
        isPositive: true
      }
    },
    {
      title: "Job Postings",
      value: "1,856",
      icon: Briefcase,
      trend: {
        value: 15.3,
        isPositive: true
      }
    },
    {
      title: "Revenue (Monthly)",
      value: "$48,250",
      icon: DollarSign,
      trend: {
        value: 23.1,
        isPositive: true
      }
    }
  ];

  const recentActivities = [
    { user: "Tech Corp", action: "Posted new job", time: "2 minutes ago" },
    { user: "John Doe", action: "Upgraded to Premium", time: "15 minutes ago" },
    { user: "Design Studio", action: "Registered business account", time: "1 hour ago" },
    { user: "Jane Smith", action: "Applied to 3 jobs", time: "2 hours ago" },
    { user: "Marketing Inc", action: "Posted new job", time: "3 hours ago" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and management</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="gradient-primary p-3 rounded-lg shadow-glow">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold">User Management</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Manage user accounts, roles, and permissions
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/users">Manage Users</Link>
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="gradient-primary p-3 rounded-lg shadow-glow">
                <Building2 className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold">Business Accounts</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Monitor and manage business profiles
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/businesses">Manage Businesses</Link>
            </Button>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="gradient-primary p-3 rounded-lg shadow-glow">
                <DollarSign className="h-6 w-6 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-bold">Pricing Plans</h2>
            </div>
            <p className="text-muted-foreground mb-4">
              Configure subscription plans and pricing
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/admin/pricing">Manage Pricing</Link>
            </Button>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Activity className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-bold">Recent Activity</h2>
              </div>
              <Button variant="ghost" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
                  <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                  <div className="flex-1">
                    <p className="font-medium">{activity.user}</p>
                    <p className="text-sm text-muted-foreground">{activity.action}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">Quick Stats</h2>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-lg bg-secondary/50">
                <span className="font-medium">Premium Users</span>
                <span className="text-2xl font-bold text-gradient">1,245</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-secondary/50">
                <span className="font-medium">Active Jobs</span>
                <span className="text-2xl font-bold text-gradient">856</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-secondary/50">
                <span className="font-medium">Applications (Today)</span>
                <span className="text-2xl font-bold text-gradient">324</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-secondary/50">
                <span className="font-medium">Avg. Response Time</span>
                <span className="text-2xl font-bold text-gradient">2.4h</span>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6 mt-6">
          <Button className="gradient-primary shadow-glow w-full" size="lg" asChild>
            <Link to="/admin/reports">View Detailed Reports</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
