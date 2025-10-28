import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  Users, 
  Briefcase,
  DollarSign
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminReports = () => {
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
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Total Users</p>
            <p className="text-3xl font-bold">12,543</p>
            <p className="text-sm text-success mt-2">↑ 12.5% from last month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Job Postings</p>
            <p className="text-3xl font-bold">1,856</p>
            <p className="text-sm text-success mt-2">↑ 15.3% from last month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-8 w-8 text-primary" />
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Applications</p>
            <p className="text-3xl font-bold">8,234</p>
            <p className="text-sm text-success mt-2">↑ 18.7% from last month</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-8 w-8 text-primary" />
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <p className="text-sm text-muted-foreground mb-1">Revenue</p>
            <p className="text-3xl font-bold">$48,250</p>
            <p className="text-sm text-success mt-2">↑ 23.1% from last month</p>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">User Growth</h2>
            <div className="h-64 flex items-end justify-around gap-2">
              {[65, 78, 82, 90, 85, 95, 100].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full gradient-primary rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-6">Revenue Growth</h2>
            <div className="h-64 flex items-end justify-around gap-2">
              {[70, 75, 80, 88, 92, 96, 100].map((height, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full gradient-accent rounded-t-lg"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Top Industries</h3>
            <div className="space-y-3">
              {[
                { name: "Technology", percent: 35 },
                { name: "Healthcare", percent: 22 },
                { name: "Finance", percent: 18 },
                { name: "Education", percent: 15 },
                { name: "Other", percent: 10 }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.name}</span>
                    <span className="font-semibold">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="gradient-primary h-2 rounded-full transition-all"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Popular Job Types</h3>
            <div className="space-y-3">
              {[
                { name: "Full-time", percent: 60 },
                { name: "Part-time", percent: 20 },
                { name: "Contract", percent: 15 },
                { name: "Internship", percent: 5 }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.name}</span>
                    <span className="font-semibold">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="gradient-accent h-2 rounded-full transition-all"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">Subscription Distribution</h3>
            <div className="space-y-3">
              {[
                { name: "Free", percent: 45 },
                { name: "Premium", percent: 30 },
                { name: "Professional", percent: 20 },
                { name: "Enterprise", percent: 5 }
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.name}</span>
                    <span className="font-semibold">{item.percent}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="gradient-success h-2 rounded-full transition-all"
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
