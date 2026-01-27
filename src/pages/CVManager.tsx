import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Plus, Download, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { cvService, CVData } from "@/services/cvService";
import { notifyError } from "@/utils/notification";
import { SimpleTemplate, ModernTemplate, ProfessionalTemplate, CreativeTemplate } from "@/components/cv-templates";
import html2pdf from "html2pdf.js";
import { useToast } from "@/hooks/use-toast";

const CVManager = () => {
  const [cvs, setCvs] = useState<CVData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCV, setSelectedCV] = useState<CVData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

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

  const handleViewCV = (cv: CVData) => {
    setSelectedCV(cv);
    setShowPreview(true);
  };

  const handleDownloadPDF = (cv: CVData) => {
    setSelectedCV(cv);
    setTimeout(() => {
      const element = document.getElementById("cv-preview-print");
      if (!element) return;

      const opt = {
        margin: 0,
        filename: `${cv.fullName || "CV"}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" as const },
      };

      html2pdf().set(opt).from(element).save();
      toast({
        title: "PDF Downloaded",
        description: "Your CV has been downloaded successfully!",
      });
    }, 100);
  };

  const renderCVTemplate = (cv: CVData) => {
    const templateData = {
      fullName: cv.fullName,
      email: cv.contacts?.split(', ').find(c => c.startsWith('Email:'))?.replace('Email: ', '') || '',
      phone: cv.contacts?.split(', ').find(c => c.startsWith('Phone:'))?.replace('Phone: ', '') || '',
      address: cv.workLocation || '',
      title: cv.jobtitle,
      summary: cv.aboutMe,
      photo: cv.avatarUrl || '',
    };

    const templateMap: { [key: string]: typeof SimpleTemplate } = {
      simple: SimpleTemplate,
      modern: ModernTemplate,
      professional: ProfessionalTemplate,
      creative: CreativeTemplate,
    };

    const TemplateComponent = templateMap[cv.template?.toLowerCase() || 'simple'] || SimpleTemplate;

    return (
      <TemplateComponent
        data={templateData}
        skills={cv.skills || []}
        workExperiences={cv.workExperiences || []}
        educations={cv.educations || []}
      />
    );
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

                {cv.aboutMe && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {cv.aboutMe}
                  </p>
                )}

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleViewCV(cv)}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View CV
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <Link to={`/cv-builder?id=${cv.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDownloadPDF(cv)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* CV Preview Dialog */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card">
            <DialogHeader>
              <DialogTitle>CV Preview - {selectedCV?.jobtitle}</DialogTitle>
            </DialogHeader>
            {selectedCV && (
              <div id="cv-preview-print">
                {renderCVTemplate(selectedCV)}
              </div>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close
              </Button>
              <Button 
                className="gradient-primary"
                onClick={() => selectedCV && handleDownloadPDF(selectedCV)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default CVManager;
