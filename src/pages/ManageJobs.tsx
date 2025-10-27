import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Eye, EyeOff } from "lucide-react";

const ManageJobs = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    setLoading(true);
    const { data: businessProfile } = await supabase
      .from("business_profiles")
      .select("id")
      .eq("user_id", user?.id)
      .single();

    if (businessProfile) {
      const { data, error } = await supabase
        .from("job_postings")
        .select("*")
        .eq("business_id", businessProfile.id)
        .order("created_at", { ascending: false });

      if (data) setJobs(data);
      if (error) console.error(error);
    }
    setLoading(false);
  };

  const updateJobStatus = async (jobId: string, status: string) => {
    const { error } = await supabase
      .from("job_postings")
      .update({ status })
      .eq("id", jobId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Job status updated",
      });
      loadJobs();
    }
  };

  const deleteJob = async (jobId: string) => {
    const { error } = await supabase
      .from("job_postings")
      .delete()
      .eq("id", jobId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Job deleted",
      });
      loadJobs();
    }
  };

  const filterJobs = (status: string) => {
    return jobs.filter((job) => status === "all" || job.status === status);
  };

  const JobCard = ({ job }: { job: any }) => (
    <Card className="p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold mb-2">{job.title}</h3>
          <p className="text-muted-foreground mb-2">{job.location}</p>
          <Badge>{job.status}</Badge>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => job.status === "active" 
              ? updateJobStatus(job.id, "inactive") 
              : updateJobStatus(job.id, "active")
            }
          >
            {job.status === "active" ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          <Button size="sm" variant="outline">
            <Edit className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => deleteJob(job.id)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">{t("business.manageJobs.applications")}</p>
          <p className="font-semibold">{job.applications_count}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t("business.dashboard.views")}</p>
          <p className="font-semibold">{job.views}</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t("business.manageJobs.created")}</p>
          <p className="font-semibold">{new Date(job.created_at).toLocaleDateString()}</p>
        </div>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <p>{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t("business.manageJobs.title")}</h1>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">{t("business.manageJobs.allJobs")}</TabsTrigger>
            <TabsTrigger value="active">{t("business.manageJobs.active")}</TabsTrigger>
            <TabsTrigger value="inactive">{t("business.manageJobs.inactive")}</TabsTrigger>
            <TabsTrigger value="draft">{t("business.manageJobs.draft")}</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            {filterJobs("all").map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </TabsContent>

          <TabsContent value="active" className="mt-6">
            {filterJobs("active").map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </TabsContent>

          <TabsContent value="inactive" className="mt-6">
            {filterJobs("inactive").map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </TabsContent>

          <TabsContent value="draft" className="mt-6">
            {filterJobs("draft").map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ManageJobs;
