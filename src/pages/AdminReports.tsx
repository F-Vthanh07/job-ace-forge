import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Download, 
  Users, 
  DollarSign,
  CreditCard,
  UserCheck,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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

const AdminReports = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState<SubscriptionPlan[]>([]);
  const [userStats, setUserStats] = useState<UserStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [overviewRes, plansRes, userStatsRes] = await Promise.all([
          fetch('https://aijobmatch.onrender.com/api/AdminDashboard/overview'),
          fetch('https://aijobmatch.onrender.com/api/AdminDashboard/subscription-sales'),
          fetch('https://aijobmatch.onrender.com/api/AdminDashboard/user-statistics')
        ]);

        const [overviewData, plansData, userStatsData] = await Promise.all([
          overviewRes.json(),
          plansRes.json(),
          userStatsRes.json()
        ]);

        if (overviewData.success) {
          setDashboardData(overviewData.data);
        }
        if (plansData.success) {
          setSubscriptionPlans(plansData.data);
        }
        if (userStatsData.success) {
          setUserStats(userStatsData.data);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        toast({
          title: "Error",
          description: "Failed to load report data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [toast]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getGrowthText = () => {
    if (loading || !dashboardData) return "...";
    const growth = dashboardData.growthPercentage;
    const arrow = growth >= 0 ? '↑' : '↓';
    return `${arrow} ${Math.abs(growth)}% from last month`;
  };

  const getGrowthRateText = () => {
    if (loading || !dashboardData) return "...";
    const growth = dashboardData.growthPercentage;
    const arrow = growth >= 0 ? '↑' : '↓';
    return `${arrow} ${Math.abs(growth)}% growth rate`;
  };

  const getGrowthPercentageText = () => {
    if (loading || !dashboardData) return "...";
    const growth = dashboardData.growthPercentage;
    const sign = growth >= 0 ? '+' : '';
    return `${sign}${growth.toFixed(1)}%`;
  };

  const isPositiveGrowth = () => {
    return !loading && dashboardData && dashboardData.growthPercentage >= 0;
  };
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="gradient-primary p-3 rounded-lg shadow-glow">
              <BarChart3 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Reports & Analytics</h1>
              <p className="text-muted-foreground">Detailed insights and performance metrics</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Select defaultValue="30days">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-primary" />
              {isPositiveGrowth() ? (
                <ArrowUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-3xl font-bold">
              {loading ? "..." : userStats?.totalUsers.toLocaleString() || "0"}
            </p>
            <p className={`text-sm mt-2 ${isPositiveGrowth() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {getGrowthText()}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <UserCheck className="h-8 w-8 text-primary" />
              {isPositiveGrowth() ? (
                <ArrowUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">New Users This Month</p>
            <p className="text-3xl font-bold">
              {loading ? "..." : dashboardData?.newUsersThisMonth.toLocaleString() || "0"}
            </p>
            <p className={`text-sm mt-2 ${isPositiveGrowth() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {getGrowthRateText()}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <CreditCard className="h-8 w-8 text-primary" />
              {isPositiveGrowth() ? (
                <ArrowUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">Subscriptions Sold</p>
            <p className="text-3xl font-bold">
              {loading ? "..." : dashboardData?.totalSubscriptionsSold.toLocaleString() || "0"}
            </p>
            <p className={`text-sm mt-2 ${isPositiveGrowth() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {loading ? "..." : `${userStats?.subscriptionConversionRate.toFixed(1) || 0}% conversion rate`}
            </p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-primary" />
              {isPositiveGrowth() ? (
                <ArrowUp className="h-5 w-5 text-green-600 dark:text-green-400" />
              ) : (
                <ArrowDown className="h-5 w-5 text-red-600 dark:text-red-400" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mb-1">Revenue (Total)</p>
            <p className="text-3xl font-bold">
              {loading ? "..." : formatCurrency(dashboardData?.totalRevenue || 0)}
            </p>
            <p className={`text-sm mt-2 ${isPositiveGrowth() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
              {getGrowthText()}
            </p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Revenue Overview</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-blue-500/10 to-blue-600/10">
                <span className="font-medium">Total Revenue</span>
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {loading ? "..." : formatCurrency(dashboardData?.totalRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-green-600/10">
                <span className="font-medium">This Month Revenue</span>
                <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {loading ? "..." : formatCurrency(dashboardData?.thisMonthRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-amber-500/10 to-amber-600/10">
                <span className="font-medium">Last Month Revenue</span>
                <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {loading ? "..." : formatCurrency(dashboardData?.lastMonthRevenue || 0)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-purple-600/10">
                <span className="font-medium">Growth Rate</span>
                <span className={`text-2xl font-bold ${isPositiveGrowth() ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {getGrowthPercentageText()}
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Transaction Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-indigo-600/10">
                <span className="font-medium">Total Transactions</span>
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {loading ? "..." : dashboardData?.totalTransactions.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-teal-500/10 to-teal-600/10">
                <span className="font-medium">This Month Transactions</span>
                <span className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  {loading ? "..." : dashboardData?.thisMonthTransactions.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-pink-500/10 to-pink-600/10">
                <span className="font-medium">Subscribed Users</span>
                <span className="text-2xl font-bold text-pink-600 dark:text-pink-400">
                  {loading ? "..." : dashboardData?.totalSubscribedUsers.toLocaleString() || "0"}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-cyan-500/10 to-cyan-600/10">
                <span className="font-medium">Active Subscriptions</span>
                <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">
                  {loading ? "..." : userStats?.usersWithActiveSubscription.toLocaleString() || "0"}
                </span>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">User Type Distribution</h3>
            {loading && (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            )}
            {!loading && !userStats && (
              <div className="text-center py-8 text-muted-foreground">No data available</div>
            )}
            {!loading && userStats && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Candidates</span>
                    <span className="font-semibold">
                      {userStats.candidateUsers} ({((userStats.candidateUsers / userStats.totalUsers) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="gradient-primary h-2 rounded-full transition-all"
                      style={{ width: `${(userStats.candidateUsers / userStats.totalUsers) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Recruiters</span>
                    <span className="font-semibold">
                      {userStats.recruiterUsers} ({((userStats.recruiterUsers / userStats.totalUsers) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="gradient-accent h-2 rounded-full transition-all"
                      style={{ width: `${(userStats.recruiterUsers / userStats.totalUsers) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Subscription Status</h3>
            {loading && (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            )}
            {!loading && !userStats && (
              <div className="text-center py-8 text-muted-foreground">No data available</div>
            )}
            {!loading && userStats && (
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Active Subscriptions</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">
                      {userStats.usersWithActiveSubscription} ({((userStats.usersWithActiveSubscription / userStats.totalUsers) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-green-600 dark:bg-green-400 h-2 rounded-full transition-all"
                      style={{ width: `${(userStats.usersWithActiveSubscription / userStats.totalUsers) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Expired Subscriptions</span>
                    <span className="font-semibold text-red-600 dark:text-red-400">
                      {userStats.usersWithExpiredSubscription} ({((userStats.usersWithExpiredSubscription / userStats.totalUsers) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-red-600 dark:bg-red-400 h-2 rounded-full transition-all"
                      style={{ width: `${(userStats.usersWithExpiredSubscription / userStats.totalUsers) * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Free Users</span>
                    <span className="font-semibold">
                      {userStats.totalUsers - userStats.usersWithActiveSubscription - userStats.usersWithExpiredSubscription} ({(((userStats.totalUsers - userStats.usersWithActiveSubscription - userStats.usersWithExpiredSubscription) / userStats.totalUsers) * 100).toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-gray-600 dark:bg-gray-400 h-2 rounded-full transition-all"
                      style={{ width: `${((userStats.totalUsers - userStats.usersWithActiveSubscription - userStats.usersWithExpiredSubscription) / userStats.totalUsers) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Subscription Plans Revenue</h3>
            {loading && (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            )}
            {!loading && subscriptionPlans.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">No plans available</div>
            )}
            {!loading && subscriptionPlans.length > 0 && (
              <div className="space-y-3">
                {subscriptionPlans.map((plan) => (
                  <div key={plan.planId}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{plan.planName}</span>
                      <span className="font-semibold">{plan.percentageOfTotal.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="gradient-success h-2 rounded-full transition-all"
                        style={{ width: `${plan.percentageOfTotal}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Sold: {plan.totalSold}</span>
                      <span>{formatCurrency(plan.totalRevenue)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
