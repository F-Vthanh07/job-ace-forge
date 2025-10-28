import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  Briefcase, 
  Eye, 
  Users, 
  Edit, 
  Trash2, 
  Power, 
  PowerOff,
  Plus 
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ManageJobs = () => {
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Ho Chi Minh City",
      status: "active",
      applications: 45,
      views: 320,
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Product Designer",
      department: "Design",
      location: "Remote",
      status: "active",
      applications: 28,
      views: 180,
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "Marketing Manager",
      department: "Marketing",
      location: "Hanoi",
      status: "inactive",
      applications: 12,
      views: 95,
      posted: "2 weeks ago"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Manage Job Posts</h1>
            <p className="text-muted-foreground">View and manage all your job postings</p>
          </div>
          <Button className="gradient-primary shadow-glow" asChild>
            <Link to="/post-job">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </Button>
        </div>

        <div className="flex gap-4 mb-6">
          <Select defaultValue="all">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Jobs</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="recent">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="applications">Most Applications</SelectItem>
              <SelectItem value="views">Most Views</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <div className="gradient-primary p-3 rounded-lg shadow-glow">
                    <Briefcase className="h-6 w-6 text-primary-foreground" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{job.title}</h3>
                      <Badge 
                        variant={job.status === "active" ? "default" : "secondary"}
                        className={job.status === "active" ? "gradient-primary" : ""}
                      >
                        {job.status}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                      <span>{job.department}</span>
                      <span>•</span>
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>Posted {job.posted}</span>
                    </div>

                    <div className="flex gap-6">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{job.applications}</span>
                        <span className="text-sm text-muted-foreground">Applications</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-primary" />
                        <span className="font-semibold">{job.views}</span>
                        <span className="text-sm text-muted-foreground">Views</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/candidates?job=${job.id}`}>
                      <Users className="h-4 w-4 mr-2" />
                      View Candidates
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className={job.status === "active" ? "text-warning" : "text-success"}
                  >
                    {job.status === "active" ? (
                      <>
                        <PowerOff className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <Power className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
