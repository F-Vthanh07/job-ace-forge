import { Navbar } from "@/components/Navbar";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Users, TrendingUp, Clock, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const RecruiterDashboard = () => {
  const recentApplications = [
    { name: "John Doe", role: "Senior Frontend Developer", score: 92, time: "2 hours ago" },
    { name: "Jane Smith", role: "Full Stack Engineer", score: 88, time: "5 hours ago" },
    { name: "Mike Johnson", role: "React Developer", score: 85, time: "1 day ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Recruitment Dashboard</h1>
            <p className="text-muted-foreground">TechCorp Vietnam</p>
          </div>
          <Button className="gradient-primary shadow-glow" size="lg" asChild>
            <Link to="/post-job">
              <Plus className="h-5 w-5 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Jobs"
            value="8"
            subtitle="2 closing soon"
            icon={Briefcase}
          />
          <StatCard
            title="Total Applicants"
            value="142"
            subtitle="This month"
            icon={Users}
            trend={{ value: 15, isPositive: true }}
          />
          <StatCard
            title="Avg. Match Score"
            value="86%"
            subtitle="Across all jobs"
            icon={TrendingUp}
          />
          <StatCard
            title="Time to Fill"
            value="18"
            subtitle="Days average"
            icon={Clock}
          />
        </div>

        {/* Recent Applications */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Recent Applications</h2>
            <Button variant="outline" asChild>
              <Link to="/candidates">View All</Link>
            </Button>
          </div>

          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div
                key={app.name}
                className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-white font-bold">
                    {app.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-semibold">{app.name}</h3>
                    <p className="text-sm text-muted-foreground">{app.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-success">{app.score}% Match</p>
                    <p className="text-xs text-muted-foreground">{app.time}</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/candidate-report/${app.name.replace(' ', '-').toLowerCase()}`}>
                      Review
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Active Job Listings */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Active Job Listings</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <JobListingCard
              title="Senior Frontend Developer"
              applicants={45}
              views={312}
              daysLeft={12}
            />
            <JobListingCard
              title="Full Stack Engineer"
              applicants={38}
              views={267}
              daysLeft={8}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const JobListingCard = ({ 
  title, 
  applicants, 
  views, 
  daysLeft 
}: { 
  title: string; 
  applicants: number; 
  views: number; 
  daysLeft: number;
}) => (
  <div className="p-4 rounded-lg border">
    <h3 className="font-semibold mb-3">{title}</h3>
    <div className="grid grid-cols-3 gap-2 text-sm mb-3">
      <div>
        <p className="text-muted-foreground">Applicants</p>
        <p className="font-bold">{applicants}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Views</p>
        <p className="font-bold">{views}</p>
      </div>
      <div>
        <p className="text-muted-foreground">Days Left</p>
        <p className="font-bold">{daysLeft}</p>
      </div>
    </div>
    <Button variant="outline" size="sm" className="w-full">
      Manage
    </Button>
  </div>
);

export default RecruiterDashboard;
