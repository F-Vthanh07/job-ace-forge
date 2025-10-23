import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Download, Eye, Edit, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const CVManager = () => {
  const cvs = [
    {
      id: 1,
      name: "Software Engineer CV",
      score: 92,
      lastUpdated: "2 days ago",
      status: "active",
    },
    {
      id: 2,
      name: "Frontend Developer CV",
      score: 85,
      lastUpdated: "1 week ago",
      status: "draft",
    },
    {
      id: 3,
      name: "Full Stack CV",
      score: 88,
      lastUpdated: "2 weeks ago",
      status: "active",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">CV Manager</h1>
            <p className="text-muted-foreground">Manage and optimize your CVs</p>
          </div>
          <Button className="gradient-primary shadow-glow" size="lg" asChild>
            <Link to="/cv-builder">
              <Plus className="h-5 w-5 mr-2" />
              Create New CV
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <Card key={cv.id} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between mb-4">
                <div className="gradient-primary p-3 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <Badge variant={cv.status === "active" ? "default" : "secondary"}>
                  {cv.status}
                </Badge>
              </div>

              <h3 className="text-xl font-bold mb-2">{cv.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">Updated {cv.lastUpdated}</p>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">ATS Score</span>
                  <span className="font-bold text-success">{cv.score}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-success transition-all duration-300"
                    style={{ width: `${cv.score}%` }}
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/cv-feedback/${cv.id}`}>
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1" asChild>
                  <Link to={`/cv-builder?id=${cv.id}`}>
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CVManager;
