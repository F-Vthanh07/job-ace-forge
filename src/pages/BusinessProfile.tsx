import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Upload, Loader2, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { companyService, CompanyData } from "@/services/companyService";
import { notifyError } from "@/utils/notification";

const BusinessProfile = () => {
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanyData();
  }, []);

  const loadCompanyData = () => {
    setLoading(true);
    try {
      console.log("📖 Loading company data from localStorage...");
      
      // Get company data from localStorage (saved during login or dashboard load)
      const company = companyService.getCompanyFromLocalStorage();
      
      if (company) {
        console.log("✅ Company data loaded:", company.name);
        setCompanyData(company);
      } else {
        console.warn("⚠️ No company data found in localStorage");
        notifyError({
          title: "No Data",
          description: "Company data not found. Please visit dashboard first."
        });
      }
    } catch (error) {
      console.error("❌ Error loading company data:", error);
      notifyError({
        title: "Error",
        description: "Failed to load company data"
      });
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
            <p className="text-muted-foreground">Loading company profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="gradient-primary p-3 rounded-lg shadow-glow">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold">Company Profile</h1>
              <p className="text-muted-foreground">Manage your company information</p>
            </div>
            {companyData && (
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                companyData.verificationStatus === "Verified" 
                  ? "bg-success/10 text-success" 
                  : "bg-warning/10 text-warning"
              }`}>
                {companyData.verificationStatus}
              </span>
            )}
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Company Logo</h2>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                  {companyData?.logoUrl ? (
                    <img 
                      src={companyData.logoUrl} 
                      alt={companyData.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="h-16 w-16 text-muted-foreground" />
                  )}
                </div>
                <div className="space-y-2">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-sm text-muted-foreground">PNG or JPG (max. 2MB)</p>
                  {companyData?.logoUrl && (
                    <a 
                      href={companyData.logoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      View current logo <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input 
                    id="companyName" 
                    defaultValue={companyData?.name || ""} 
                    className="mt-1" 
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="taxCode">Tax Code</Label>
                    <Input 
                      id="taxCode" 
                      defaultValue={companyData?.taxCode || ""} 
                      className="mt-1"
                      disabled
                    />
                  </div>
                  <div>
                    <Label htmlFor="size">Company Size</Label>
                    <Input 
                      id="size" 
                      defaultValue={companyData?.size ? `${companyData.size} employees` : ""} 
                      className="mt-1" 
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    defaultValue={companyData?.website || ""} 
                    className="mt-1" 
                  />
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Input 
                    id="industry" 
                    defaultValue={companyData?.industry || ""} 
                    className="mt-1" 
                  />
                </div>

                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea 
                    id="description" 
                    rows={6}
                    defaultValue={companyData?.description || ""}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input 
                    id="address" 
                    defaultValue={companyData?.address 
                      ? `${companyData.address.wardName}, ${companyData.address.districtName}, ${companyData.address.cityName}` 
                      : ""
                    } 
                    className="mt-1"
                    disabled 
                  />
                </div>

                {companyData?.businessLicenseUrl && (
                  <div>
                    <Label>Business License</Label>
                    <div className="mt-1">
                      <a 
                        href={companyData.businessLicenseUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        View Business License <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Company Information</h2>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Company ID</p>
                  <p className="font-mono text-xs mt-1">{companyData?.id}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created Date</p>
                  <p className="mt-1">
                    {companyData?.createTime 
                      ? new Date(companyData.createTime).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={loadCompanyData}>Refresh Data</Button>
              <Button className="gradient-primary shadow-glow">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
