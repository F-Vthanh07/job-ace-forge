import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Briefcase, DollarSign, Calendar, Building2, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useEffect, useState } from "react";
import { jobService, JobData } from "@/services/jobService";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const Jobs = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const response = await jobService.getAllJobs();
      
      if (response.success && response.data) {
        // Filter only active jobs
        const activeJobs = response.data.filter(job => job.isActive);
        setJobs(activeJobs);
        console.log("✅ Loaded jobs:", activeJobs.length);
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to load jobs",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error loading jobs:", error);
      toast({
        title: "Error",
        description: "Failed to load jobs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (job: JobData) => {
    const min = job.minSalary.toLocaleString();
    const max = job.maxSalary.toLocaleString();
    const negotiable = job.isNegotiable ? " (Negotiable)" : "";
    return `${min} - ${max} ${job.currency}${negotiable}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const getLocationString = (job: JobData) => {
    if (!job.address) return "Not specified";
    const { wardName, districtName, cityName } = job.address;
    return `${wardName}, ${districtName}, ${cityName}`;
  };

  // Filter jobs based on search and location
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === "" || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLocation = locationFilter === "" ||
      (job.address && (
        job.address.cityName.toLowerCase().includes(locationFilter.toLowerCase()) ||
        job.address.districtName.toLowerCase().includes(locationFilter.toLowerCase()) ||
        job.address.wardName.toLowerCase().includes(locationFilter.toLowerCase())
      ));
    
    return matchesSearch && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">{t("jobs.title")}</h1>
          <p className="text-muted-foreground">{t("dashboard.findJobsDesc")}</p>
        </div>

        {/* Search & Filter */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder={t("welcome.searchPlaceholder")} 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder={t("welcome.locationPlaceholder")} 
                className="pl-10"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
              />
            </div>
          </div>
          
          {/* Results count */}
          <div className="mt-4 text-sm text-muted-foreground">
            {loading ? (
              <Skeleton className="h-4 w-32" />
            ) : (
              `Found ${filteredJobs.length} job${filteredJobs.length !== 1 ? 's' : ''}`
            )}
          </div>
        </Card>

        {/* Job Listings */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <div className="space-y-3">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card className="p-12 text-center">
            <Briefcase className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No jobs found</h3>
            <p className="text-muted-foreground">
              {searchTerm || locationFilter
                ? "Try adjusting your search filters"
                : "No active job postings available at the moment"}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="gradient-primary p-3 rounded-lg">
                        <Briefcase className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-1">{job.title}</h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building2 className="h-4 w-4" />
                          <span>{job.companyName}</span>
                          <span className="text-xs">•</span>
                          <span className="text-sm">{job.recruiterName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mb-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {getLocationString(job)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        {formatSalary(job)}
                      </div>
                      <Badge variant="secondary">{job.jobType}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {job.quantity} positions
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {formatDate(job.createTime)}
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                      {job.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm">
                      <Badge variant="outline">
                        {job.yearsOfExperience}+ years exp
                      </Badge>
                      <Badge variant="outline">
                        {job.viewCount} views
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button className="gradient-primary" asChild>
                      <Link to={`/job-detail/${job.id}`}>{t("common.viewDetails")}</Link>
                    </Button>
                    <Button variant="outline">{t("jobs.saveJob")}</Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
