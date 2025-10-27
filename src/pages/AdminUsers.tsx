import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const { t } = useLanguage();
  const { role } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (role !== "admin") {
      navigate("/");
      return;
    }
    loadUsers();
  }, [role]);

  const loadUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select(`
        *,
        user_roles (role)
      `);

    if (data) setUsers(data);
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filterByRole = (role: string) => {
    if (role === "all") return filteredUsers;
    return filteredUsers.filter(user => 
      user.user_roles?.some((r: any) => r.role === role)
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t("admin.users.title")}</h1>

        <Card className="p-6 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-10"
              placeholder={t("admin.users.searchUsers")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </Card>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Users</TabsTrigger>
            <TabsTrigger value="candidate">{t("admin.users.candidates")}</TabsTrigger>
            <TabsTrigger value="business">{t("admin.users.businesses")}</TabsTrigger>
            <TabsTrigger value="admin">{t("admin.users.admins")}</TabsTrigger>
          </TabsList>

          {["all", "candidate", "business", "admin"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="mt-6">
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4">{t("admin.users.userName")}</th>
                        <th className="text-left p-4">{t("admin.users.email")}</th>
                        <th className="text-left p-4">{t("admin.users.role")}</th>
                        <th className="text-left p-4">{t("admin.users.joined")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filterByRole(tabValue).map((user) => (
                        <tr key={user.id} className="border-b">
                          <td className="p-4">{user.full_name || "N/A"}</td>
                          <td className="p-4">{user.id}</td>
                          <td className="p-4">
                            {user.user_roles?.map((r: any) => (
                              <Badge key={r.role} className="mr-1">{r.role}</Badge>
                            ))}
                          </td>
                          <td className="p-4">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default AdminUsers;
