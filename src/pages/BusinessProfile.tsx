import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Building2, Upload } from "lucide-react";

const BusinessProfile = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="gradient-primary p-3 rounded-lg shadow-glow">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Company Profile</h1>
              <p className="text-muted-foreground">Manage your company information</p>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Company Logo</h2>
              <div className="flex items-center gap-6">
                <div className="w-32 h-32 rounded-lg bg-secondary flex items-center justify-center">
                  <Building2 className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="space-y-2">
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Logo
                  </Button>
                  <p className="text-sm text-muted-foreground">PNG or JPG (max. 2MB)</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" defaultValue="Tech Corp" className="mt-1" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Company Email</Label>
                    <Input id="email" type="email" defaultValue="hr@techcorp.com" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" defaultValue="+84 123 456 789" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="https://techcorp.com" className="mt-1" />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input id="industry" defaultValue="Technology" className="mt-1" />
                  </div>
                  <div>
                    <Label htmlFor="size">Company Size</Label>
                    <Input id="size" defaultValue="50-100 employees" className="mt-1" />
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Company Description</Label>
                  <Textarea 
                    id="description" 
                    rows={6}
                    defaultValue="We are a leading technology company focused on innovation..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Tech Street, District 1, Ho Chi Minh City" className="mt-1" />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-6">Social Media</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input id="linkedin" placeholder="https://linkedin.com/company/..." className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input id="facebook" placeholder="https://facebook.com/..." className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="twitter">Twitter</Label>
                  <Input id="twitter" placeholder="https://twitter.com/..." className="mt-1" />
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="outline">Cancel</Button>
              <Button className="gradient-primary shadow-glow">Save Changes</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessProfile;
