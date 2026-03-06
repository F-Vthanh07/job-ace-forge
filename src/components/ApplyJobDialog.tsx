import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, FileText, Eye, CheckCircle2, Briefcase, MapPin } from "lucide-react";
import { cvService, CVData } from "@/services/cvService";
import { applicationService, CreateApplicationRequest } from "@/services/applicationService";
import { JobData } from "@/services/jobService";
import { useToast } from "@/hooks/use-toast";
import { CVPreview } from "@/components/CVPreview";

interface ApplyJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  job: JobData;
  onApplicationSuccess?: (matchScore: number, status: string) => void;
}

export const ApplyJobDialog = ({ open, onOpenChange, job, onApplicationSuccess }: ApplyJobDialogProps) => {
  const { toast } = useToast();
  const [cvList, setCvList] = useState<CVData[]>([]);
  const [selectedCV, setSelectedCV] = useState<CVData | null>(null);
  const [cvUrl, setCvUrl] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showCVPreview, setShowCVPreview] = useState(false);
  const [previewCV, setPreviewCV] = useState<CVData | null>(null);

  const loadCVList = useCallback(async () => {
    setLoading(true);
    try {
      const response = await cvService.getAllCVsByCandidate();
      if (response.success && response.data) {
        setCvList(response.data);
        console.log("✅ Loaded CV list:", response.data);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load your CVs",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading CVs:", error);
      toast({
        title: "Error",
        description: "Failed to load your CVs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (open) {
      loadCVList();
    } else {
      // Reset state when dialog closes
      setSelectedCV(null);
      setCvUrl("");
      setCoverLetter("");
    }
  }, [open, loadCVList]);

  const handleViewCVDetail = (cv: CVData) => {
    setPreviewCV(cv);
    setShowCVPreview(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedCV) {
      toast({
        title: "Error",
        description: "Please select a CV to apply",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const applicationData: CreateApplicationRequest = {
        postingResponse: job,
        candidateProfileId: selectedCV.id!,
        cvUrl: cvUrl.trim(),
        coverLetter: coverLetter.trim(),
      };

      const response = await applicationService.createApplication(applicationData);

      if (response.success && response.data) {
        toast({
          title: "Success",
          description: "Application submitted successfully!",
        });
        
        // Pass match score and status back to parent
        if (onApplicationSuccess) {
          onApplicationSuccess(response.data.matchScore, response.data.status);
        }

        onOpenChange(false);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to submit application",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Apply for {job.title}</DialogTitle>
            <DialogDescription>
              Select a CV and provide additional information for your application to {job.companyName}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* CV Selection */}
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Select Your CV <span className="text-destructive">*</span>
                </Label>
                
                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                )}
                
                {!loading && cvList.length === 0 && (
                  <Card className="p-8 text-center">
                    <FileText className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">
                      You don't have any CVs yet. Create one to apply for jobs.
                    </p>
                    <Button variant="outline" onClick={() => globalThis.location.href = "/cv-manager"}>
                      Go to CV Manager
                    </Button>
                  </Card>
                )}
                
                {!loading && cvList.length > 0 && (
                  <div className="grid md:grid-cols-2 gap-3">
                    {cvList.map((cv) => (
                      <Card
                        key={cv.id}
                        className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                          selectedCV?.id === cv.id
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border"
                        }`}
                        onClick={() => setSelectedCV(cv)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-lg flex items-center gap-2">
                              {cv.fullName}
                              {selectedCV?.id === cv.id && (
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                              )}
                            </h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Briefcase className="h-3 w-3" />
                              {cv.jobtitle}
                            </p>
                          </div>
                        </div>
                        
                        <div className="space-y-1 mb-3">
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {cv.workLocation}
                          </p>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              {cv.jobType}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {cv.template}
                            </Badge>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="w-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCVDetail(cv);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Detail
                        </Button>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* CV URL */}
              <div>
                <Label htmlFor="cvUrl" className="text-base font-semibold">
                  External CV URL (Optional)
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Provide a link to your CV hosted elsewhere (Google Drive, Dropbox, etc.)
                </p>
                <Input
                  id="cvUrl"
                  type="url"
                  placeholder="https://example.com/my-cv.pdf"
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                />
              </div>

              {/* Cover Letter */}
              <div>
                <Label htmlFor="coverLetter" className="text-base font-semibold">
                  Cover Letter (Optional)
                </Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Write a brief introduction about yourself and why you're interested in this position
                </p>
                <Textarea
                  id="coverLetter"
                  placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my interest in the position..."
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  rows={6}
                  className="resize-none"
                />
              </div>
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleSubmitApplication} disabled={!selectedCV || submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Application
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* CV Preview Dialog */}
      <Dialog open={showCVPreview} onOpenChange={setShowCVPreview}>
        <DialogContent className="max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>CV Preview - {previewCV?.fullName}</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-[75vh]">
            {previewCV && (() => {
              // Normalize template name
              const normalizeTemplate = (template: string): string => {
                const normalized = template.toLowerCase().replace(/[-_\s]/g, '');
                const templateMap: Record<string, string> = {
                  'simple': 'simple',
                  'modern': 'modern',
                  'modernprofessional01': 'modern',
                  'modernprofessional': 'modern',
                  'professional': 'professional',
                  'creative': 'creative',
                };
                return templateMap[normalized] || 'modern';
              };

              return (
                <div className="bg-white p-8 rounded-lg">
                  <CVPreview
                    data={{
                      fullName: previewCV.fullName,
                      email: previewCV.contacts.split("|")[1]?.trim() || "",
                      phone: previewCV.contacts.split("|")[0]?.trim() || "",
                      address: previewCV.workLocation,
                      title: previewCV.jobtitle,
                      summary: previewCV.aboutMe,
                      photo: previewCV.avatarUrl || "",
                    }}
                    template={normalizeTemplate(previewCV.template)}
                    skills={previewCV.skills}
                    workExperiences={previewCV.workExperiences}
                    educations={previewCV.educations}
                  />
                </div>
              );
            })()}
          </ScrollArea>
          <DialogFooter>
            <Button onClick={() => setShowCVPreview(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
