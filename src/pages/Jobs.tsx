import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, DollarSign, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Jobs = () => {
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Vietnam",
      location: "Ho Chi Minh City",
      salary: "$2,000 - $3,500",
      matchRate: 92,
      type: "Full-time",
      posted: "2 days ago",
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "StartupXYZ",
      location: "Remote",
      salary: "$1,800 - $3,000",
      matchRate: 88,
      type: "Full-time",
      posted: "1 week ago",
    },
    {
      id: 3,
      title: "React Developer",
      company: "Digital Agency",
      location: "Hanoi",
      salary: "$1,500 - $2,500",
      matchRate: 85,
      type: "Contract",
      posted: "3 days ago",
    },
    {
      id: 4,
      title: "Frontend Lead",
      company: "E-commerce Giant",
      location: "Da Nang",
      salary: "$3,000 - $4,500",
      matchRate: 90,
      type: "Full-time",
      posted: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Job Opportunities</h1>
          <p className="text-muted-foreground">Discover jobs that match your skills and aspirations</p>
        </div>

        {/* Search & Filter */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Job title, keywords..." 
                className="pl-10"
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Location" 
                className="pl-10"
              />
            </div>
          </div>
        </Card>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="gradient-primary p-3 rounded-lg">
                      <Briefcase className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                      <p className="text-muted-foreground">{job.company}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 mb-3">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      {job.salary}
                    </div>
                    <Badge variant="secondary">{job.type}</Badge>
                    <span className="text-sm text-muted-foreground">{job.posted}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-sm font-medium">
                      <span className="text-success">{job.matchRate}%</span> match with your profile
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button className="gradient-primary" asChild>
                    <Link to={`/job-detail/${job.id}`}>View Details</Link>
                  </Button>
                  <Button variant="outline">Save</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
