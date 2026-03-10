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
  Activity,
  CreditCard,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { notifyError, notifyNetworkError } from "@/utils/notification";

interface DashboardData {
  totalRevenue: number;
  totalTransactions: number;
  totalSubscribedUsers: number;
  totalSubscriptionsSold: number;
  thisMonthRevenue: number;
  thisMonthTransactions: number;
  lastMonthRevenue: number;
  growthPercentage: number;
  newUsersThisMonth: number;
}

interface SubscriptionPlan {
  planId: string;
  planName: string;
  planPrice: number;
  totalSold: number;
  totalRevenue: number;
  percentageOfTotal: number;
  activeSubscriptions: number;
  expiredSubscriptions: number;
}

interface UserStatistics {
  totalUsers: number;
  candidateUsers: number;
  recruiterUsers: number;
  usersWithActiveSubscription: number;
  usersWithExpiredSubscription: number;
  subscriptionConversionRate: number;
}

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [loadingUserStats, setLoadingUserStats] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('https://aijobmatch.onrender.com/api/AdminDashboard/overview');
        const result = await response.json();
        
        if (result.success) {
          setDashboardData(result.data);
        } else {
          notifyError("Failed to load dashboard data", "Data Error");
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        notifyNetworkError();
      } finally {
        setLoading(false);
      }
    };

    const fetchSubscriptionPlans = async () => {
      try {
        const response = await fetch('https://aijobmatch.onrender.com/api/AdminDashboard/subscription-sales');
        const result = await response.json();
        
        if (result.success) {
          setSubscriptionPlans(result.data);
        } else {
          notifyError("Failed to load subscription plans", "Data Error");
        }
      } catch (error) {
        console.error("Failed to fetch subscription plans:", error);
        notifyError("Failed to load subscription plans", "Data Error");
      } finally {
        setLoadingPlans(false);
      }
    };

    const fetchUserStatistics = async () => {
      try {
        const response = await fetch('https://aijobmatch.onrender.com/api/AdminDashboard/user-statistics');
        const result = await response.json();
        
        if (result.success) {
          setUserStats(result.data);
        } else {
          notifyError("Failed to load user statistics", "Data Error");
        }
      } catch (error) {
        console.error("Failed to fetch user statistics:", error);
        notifyError("Failed to load user statistics", "Data Error");
      } finally {
        setLoadingUserStats(false);
      }
    };

    fetchDashboardData();
    fetchSubscriptionPlans();
    fetchUserStatistics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const stats = [
    {
      title: "New Users This Month",
      value: loading ? "..." : dashboardData?.newUsersThisMonth.toString() || "0",
      icon: Users,
      trend: {
        value: loading ? 0 : dashboardData?.growthPercentage || 0,
        isPositive: (dashboardData?.growthPercentage || 0) >= 0
      }
    },
    {
      title: "Subscribed Users",
      value: loading ? "..." : dashboardData?.totalSubscribedUsers.toString() || "0",
      icon: Building2,
      trend: {
        value: loading ? 0 : dashboardData?.growthPercentage || 0,
        isPositive: (dashboardData?.growthPercentage || 0) >= 0
      }
    },
    {
      title: "Subscriptions Sold",
      value: loading ? "..." : dashboardData?.totalSubscriptionsSold.toString() || "0",
      icon: Briefcase,
      trend: {
        value: loading ? 0 : dashboardData?.growthPercentage || 0,
        isPositive: (dashboardData?.growthPercentage || 0) >= 0
      }
    },
    {
      title: "Revenue (Monthly)",
      value: loading ? "..." : formatCurrency(dashboardData?.thisMonthRevenue || 0),
      icon: DollarSign,
      trend: {
        value: loading ? 0 : dashboardData?.growthPercentage || 0,
        isPositive: (dashboardData?.growthPercentage || 0) >= 0
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
          {stats.map((stat) => (
            <StatCard key={stat.title} {...stat} />
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
              {recentActivities.map((activity) => (
                <div key={`${activity.user}-${activity.time}`} className="flex items-start gap-3 pb-4 border-b border-border last:border-0">
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
                <span className="font-medium">Total Revenue</span>
                <span className="text-2xl font-bold text-gradient">
                  {loading ? "..." : formatCurrency(dashboardData?.totalRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-secondary/50">
                <span className="font-medium">This Month Revenue</span>
                <span className="text-2xl font-bold text-gradient">
                  {loading ? "..." : formatCurrency(dashboardData?.thisMonthRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-secondary/50">
                <span className="font-medium">Total Transactions</span>
                <span className="text-2xl font-bold text-gradient">
                  {loading ? "..." : dashboardData?.totalTransactions || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-secondary/50">
                <span className="font-medium">This Month Transactions</span>
                <span className="text-2xl font-bold text-gradient">
                  {loading ? "..." : dashboardData?.thisMonthTransactions || 0}
                </span>
              </div>
            </div>
          </Card>
        </div>

        {/* Subscription Plans Section */}
        <Card className="p-6 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Subscription Plans Performance</h2>
          </div>
          
          {loadingPlans && (
            <div className="text-center py-8 text-muted-foreground">Loading subscription plans...</div>
          )}
          {!loadingPlans && subscriptionPlans.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">No subscription plans found</div>
          )}
          {!loadingPlans && subscriptionPlans.length > 0 && (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {subscriptionPlans.map((plan) => (
                <Card key={plan.planId} className="p-6 border-2 hover:border-primary/50 transition-colors">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gradient">{plan.planName}</h3>
                      <span className="text-xl font-semibold text-primary">
                        {formatCurrency(plan.planPrice)}
                      </span>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                        <span className="text-sm font-medium text-muted-foreground">Total Sold</span>
                        <span className="text-lg font-bold">{plan.totalSold}</span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                        <span className="text-sm font-medium text-muted-foreground">Total Revenue</span>
                        <span className="text-lg font-bold text-green-600 dark:text-green-400">
                          {formatCurrency(plan.totalRevenue)}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 rounded-lg bg-secondary/30">
                        <span className="text-sm font-medium text-muted-foreground">% of Total</span>
                        <span className="text-lg font-bold">{plan.percentageOfTotal.toFixed(1)}%</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                          <div>
                            <div className="text-xs text-muted-foreground">Active</div>
                            <div className="text-lg font-bold text-green-600 dark:text-green-400">
                              {plan.activeSubscriptions}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                          <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                          <div>
                            <div className="text-xs text-muted-foreground">Expired</div>
                            <div className="text-lg font-bold text-red-600 dark:text-red-400">
                              {plan.expiredSubscriptions}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* User Statistics Section */}
        <Card className="p-6 mt-6">
          <div className="flex items-center gap-3 mb-6">
            <Users className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">User Statistics</h2>
          </div>
          
          {loadingUserStats && (
            <div className="text-center py-8 text-muted-foreground">Loading user statistics...</div>
          )}
          {!loadingUserStats && userStats && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-blue-500/20">
                    <Users className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Total Users</p>
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {userStats.totalUsers}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-green-500/20">
                    <Briefcase className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Candidate Users</p>
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {userStats.candidateUsers}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-purple-500/20">
                    <Building2 className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Recruiter Users</p>
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                      {userStats.recruiterUsers}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border-emerald-500/20">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-emerald-500/20">
                    <CheckCircle className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Active Subscriptions</p>
                    <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                      {userStats.usersWithActiveSubscription}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-red-500/10 to-red-600/10 border-red-500/20">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-red-500/20">
                    <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Expired Subscriptions</p>
                    <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {userStats.usersWithExpiredSubscription}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-amber-500/10 to-amber-600/10 border-amber-500/20">
                <div className="flex items-center gap-4">
                  <div className="p-4 rounded-full bg-amber-500/20">
                    <TrendingUp className="h-8 w-8 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground font-medium">Conversion Rate</p>
                    <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                      {userStats.subscriptionConversionRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </Card>

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
