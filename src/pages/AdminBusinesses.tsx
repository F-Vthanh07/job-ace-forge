import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Search, Eye, CheckCircle, XCircle, Loader2, RefreshCw, Shield } from "lucide-react";
import { companyService, CompanyData } from "@/services/companyService";
import { notifyError, notifySuccess } from "@/utils/notification";

const AdminBusinesses = () => {
  const [companies, setCompanies] = useState<CompanyData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-verified");
  const [verifyDialogOpen, setVerifyDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyData | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<string>("Verified");
  const [rejectionMessage, setRejectionMessage] = useState("");
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await companyService.getAllCompanies();
      if (response.success && response.data) {
        setCompanies(response.data);
        console.log("✅ Loaded companies:", response.data.length);
      } else {
        notifyError(response.message);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      notifyError("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const openVerifyDialog = (company: CompanyData) => {
    setSelectedCompany(company);
    setVerificationStatus("Verified");
    setRejectionMessage("");
    setVerifyDialogOpen(true);
  };

  const handleVerify = async () => {
    if (!selectedCompany) return;

    // Validate message is required for all verification statuses
    if (!rejectionMessage.trim()) {
      notifyError("Please provide a message");
      return;
    }

    setVerifying(true);
    try {
      const response = await companyService.verifyCompany(
        selectedCompany.id,
        verificationStatus,
        rejectionMessage
      );
      if (response.success) {
        notifySuccess(`Company ${verificationStatus.toLowerCase()} successfully`);
        setVerifyDialogOpen(false);
        fetchCompanies(); // Reload list
      } else {
        notifyError(response.message);
      }
    } catch (error) {
      notifyError("Failed to verify company");
    } finally {
      setVerifying(false);
    }
  };

  // Filter companies based on search and status
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch =
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.taxCode.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all-verified" ||
      (statusFilter === "verified" && company.verificationStatus === "Verified") ||
      (statusFilter === "unverified" && company.verificationStatus !== "Verified");

    return matchesSearch && matchesStatus;
  });


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="gradient-primary p-3 rounded-lg shadow-glow">
              <Building2 className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Business Management</h1>
              <p className="text-muted-foreground">
                {loading ? "Loading companies..." : `${filteredCompanies.length} companies found`}
              </p>
            </div>
          </div>
          <Button onClick={fetchCompanies} variant="outline" disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies by name or tax code..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-verified">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No companies found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Tax Code</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompanies.map((company) => (
                  <TableRow key={company.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {company.logoUrl ? (
                          <img
                            src={company.logoUrl}
                            alt={company.name}
                            className="h-8 w-8 rounded object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                        )}
                        <div>
                          <div>{company.name}</div>
                          {company.website && (
                            <a
                              href={company.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-muted-foreground hover:text-primary"
                            >
                              {company.website}
                            </a>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{company.industry || "N/A"}</TableCell>
                    <TableCell>{company.size > 0 ? `${company.size} employees` : "N/A"}</TableCell>
                    <TableCell className="font-mono text-sm">{company.taxCode}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {company.address.wardName && <div>{company.address.wardName}</div>}
                        {company.address.districtName && <div>{company.address.districtName}</div>}
                        {company.address.cityName && <div className="text-muted-foreground">{company.address.cityName}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {company.verificationStatus === "Verified" ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-success" />
                            <span className="text-sm text-success">Verified</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-warning" />
                            <span className="text-sm text-warning">{company.verificationStatus || "Pending"}</span>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(company.createTime).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {company.businessLicenseUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(company.businessLicenseUrl, "_blank")}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View License
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className={company.verificationStatus === "Verified" ? "text-primary" : "text-success"}
                          onClick={() => openVerifyDialog(company)}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          {company.verificationStatus === "Verified" ? "Update Status" : "Verify"}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>

        {/* Verification Dialog */}
        <Dialog open={verifyDialogOpen} onOpenChange={setVerifyDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Verify Company</DialogTitle>
              <DialogDescription>
                Update the verification status for {selectedCompany?.name}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="verification-status">Verification Status</Label>
                <Select value={verificationStatus} onValueChange={setVerificationStatus}>
                  <SelectTrigger id="verification-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Verified">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Verified</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Pending">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 text-warning" />
                        <span>Pending</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="Rejected">
                      <div className="flex items-center gap-2">
                        <XCircle className="h-4 w-4 text-destructive" />
                        <span>Rejected</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejection-message">
                  Message *
                </Label>
                <Textarea
                  id="rejection-message"
                  placeholder={
                    verificationStatus === "Verified"
                      ? "Provide a message for verification..."
                      : verificationStatus === "Rejected"
                      ? "Please provide a reason for rejection..."
                      : "Provide a message..."
                  }
                  value={rejectionMessage}
                  onChange={(e) => setRejectionMessage(e.target.value)}
                  rows={4}
                  className="resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  This message will be sent to the company as notification
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setVerifyDialogOpen(false)}
                disabled={verifying}
              >
                Cancel
              </Button>
              <Button
                onClick={handleVerify}
                disabled={verifying}
                className="gradient-primary"
              >
                {verifying && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {verifying ? "Updating..." : "Update Status"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminBusinesses;
