import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Download, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cvService, CVData } from "@/services/cvService";
import { notifyError } from "@/utils/notification";

const CVManager = () => {
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      setLoading(true);
      const response = await cvService.getAllCVsByCandidate();
      if (response.success && response.data) {
        setCvs(response.data);
      } else {
        notifyError(response.message || "Failed to load CVs");
      }
    } catch (error) {
      notifyError("Failed to load CVs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your CVs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">CV Manager</h1>
            <p className="text-muted-foreground">Manage and optimize your CVs ({cvs.length} {cvs.length === 1 ? 'CV' : 'CVs'})</p>
          </div>
          <Button className="gradient-primary shadow-glow" size="lg" asChild>
            <Link to="/cv-builder">
              <Plus className="h-5 w-5 mr-2" />
              Create New CV
            </Link>
          </Button>
        </div>

        {cvs.length === 0 ? (
          <Card className="p-12 text-center">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No CVs yet</h3>
            <p className="text-muted-foreground mb-6">Create your first CV to get started</p>
            <Button className="gradient-primary" asChild>
              <Link to="/cv-builder">
                <Plus className="h-4 w-4 mr-2" />
                Create Your First CV
              </Link>
            </Button>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvs.map((cv) => (
              <Card key={cv.id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="gradient-primary p-3 rounded-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant={cv.isActive ? "default" : "secondary"}>
                    {cv.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold mb-1">{cv.jobtitle || "Untitled CV"}</h3>
                <p className="text-sm text-muted-foreground mb-1">{cv.fullName}</p>
                <p className="text-xs text-muted-foreground mb-4">
                  Template: <span className="font-medium capitalize">{cv.template?.replace(/_/g, ' ') || "Default"}</span>
                </p>

                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Skills:</span>
                    <span className="font-medium">{cv.skills?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Experience:</span>
                    <span className="font-medium">{cv.workExperiences?.length || 0}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Education:</span>
                    <span className="font-medium">{cv.educations?.length || 0}</span>
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
              </div>
            </Card>
          ))}
        </div>
        )}
      </div>
    </div>
  );
};

export default CVManager;
