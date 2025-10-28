import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Building2, Search, Eye, CheckCircle, XCircle } from "lucide-react";

const AdminBusinesses = () => {
  const businesses = [
    {
      id: 1,
      name: "Tech Corp",
      email: "hr@techcorp.com",
      plan: "Professional",
      activeJobs: 12,
      totalApplications: 234,
      verified: true,
      joinDate: "2024-01-10"
    },
    {
      id: 2,
      name: "Design Studio",
      email: "contact@designstudio.com",
      plan: "Enterprise",
      activeJobs: 8,
      totalApplications: 156,
      verified: true,
      joinDate: "2023-12-05"
    },
    {
      id: 3,
      name: "Marketing Inc",
      email: "jobs@marketing.com",
      plan: "Starter",
      activeJobs: 3,
      totalApplications: 45,
      verified: false,
      joinDate: "2024-03-15"
    },
    {
      id: 4,
      name: "Finance Solutions",
      email: "hr@finance.com",
      plan: "Professional",
      activeJobs: 15,
      totalApplications: 287,
      verified: true,
      joinDate: "2024-02-01"
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="gradient-primary p-3 rounded-lg shadow-glow">
            <Building2 className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Business Management</h1>
            <p className="text-muted-foreground">Monitor and manage business accounts</p>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search businesses by name or email..." 
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Plans</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enterprise">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-verified">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-verified">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Active Jobs</TableHead>
                <TableHead>Applications</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {businesses.map((business) => (
                <TableRow key={business.id}>
                  <TableCell className="font-medium">{business.name}</TableCell>
                  <TableCell>{business.email}</TableCell>
                  <TableCell>
                    <Badge 
                      className={business.plan !== "Starter" ? "gradient-primary" : ""}
                      variant={business.plan !== "Starter" ? "default" : "secondary"}
                    >
                      {business.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>{business.activeJobs}</TableCell>
                  <TableCell>{business.totalApplications}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {business.verified ? (
                        <>
                          <CheckCircle className="h-4 w-4 text-success" />
                          <span className="text-sm text-success">Verified</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4 text-warning" />
                          <span className="text-sm text-warning">Pending</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{business.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      {!business.verified && (
                        <Button variant="ghost" size="sm" className="text-success">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Verify
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
};

export default AdminBusinesses;
