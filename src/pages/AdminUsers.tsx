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
import { Users, Search, Shield, Ban, Mail } from "lucide-react";

const AdminUsers = () => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "candidate",
      status: "active",
      plan: "Premium",
      joinDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "candidate",
      status: "active",
      plan: "Free",
      joinDate: "2024-02-20"
    },
    {
      id: 3,
      name: "Tech Corp",
      email: "hr@techcorp.com",
      role: "business",
      status: "active",
      plan: "Professional",
      joinDate: "2024-01-10"
    },
    {
      id: 4,
      name: "Design Studio",
      email: "contact@designstudio.com",
      role: "business",
      status: "active",
      plan: "Enterprise",
      joinDate: "2023-12-05"
    },
    {
      id: 5,
      name: "Bob Wilson",
      email: "bob@example.com",
      role: "candidate",
      status: "suspended",
      plan: "Free",
      joinDate: "2024-03-01"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="gradient-primary p-3 rounded-lg shadow-glow">
            <Users className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">User Management</h1>
            <p className="text-muted-foreground">Manage all user accounts and permissions</p>
          </div>
        </div>

        <Card className="p-6 mb-6">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search users by name or email..." 
                className="pl-10"
              />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="candidate">Candidates</SelectItem>
                <SelectItem value="business">Businesses</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-status">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-status">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={user.plan !== "Free" ? "gradient-primary" : ""}
                      variant={user.plan !== "Free" ? "default" : "secondary"}
                    >
                      {user.plan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={user.status === "active" ? "default" : "destructive"}
                      className={user.status === "active" ? "bg-success" : ""}
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{user.joinDate}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm">
                        <Mail className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className={user.status === "active" ? "text-destructive" : "text-success"}
                      >
                        <Ban className="h-4 w-4" />
                      </Button>
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

export default AdminUsers;
