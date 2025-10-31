import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, User, Menu, X, Moon, Sun, Globe, LogOut } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { setLanguage, t } = useLanguage();
  
  const handleLogout = () => {
    try {
      // clear common auth storages
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      sessionStorage.removeItem("token");
    } catch (e) {
      console.error("Logout storage cleanup failed", e);
    }
    navigate("/login");
  };
  
  const isAuthPage = location.pathname === "/login" || 
                      location.pathname === "/signup" || 
                      location.pathname === "/recruiter-login" ||
                      location.pathname === "/recruiter-signup" ||
                      location.pathname === "/";
  
  if (isAuthPage) return null;

  const candidateLinks = [
    { name: t("nav.jobs"), path: "/jobs" },
    { name: t("nav.dashboard"), path: "/dashboard" },
    { name: t("nav.cvBuilder"), path: "/cv-builder" },
    { name: t("nav.mockInterview"), path: "/interview-setup" },
  ];

  const recruiterLinks = [
    { name: "Dashboard", path: "/recruiter-dashboard" },
    { name: "Post Job", path: "/post-job" },
    { name: "Manage Jobs", path: "/manage-jobs" },
    { name: "Candidates", path: "/candidates" },
    { name: "Profile", path: "/business-profile" },
  ];

  const adminLinks = [
    { name: "Dashboard", path: "/admin" },
    { name: "Users", path: "/admin/users" },
    { name: "Businesses", path: "/admin/businesses" },
    { name: "Pricing", path: "/admin/pricing" },
    { name: "Reports", path: "/admin/reports" },
  ];

  const isRecruiterPath = location.pathname.includes("recruiter") || 
                          location.pathname.includes("post-job") ||
                          location.pathname.includes("manage-jobs") ||
                          location.pathname.includes("business-profile") ||
                          location.pathname.includes("candidates");
  
  const isAdminPath = location.pathname.includes("admin");

  let links = candidateLinks;
  if (isAdminPath) {
    links = adminLinks;
  } else if (isRecruiterPath) {
    links = recruiterLinks;
  }

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center h-16 gap-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 group shrink-0 col-start-1 justify-self-start">
             <div className="gradient-primary p-2 rounded-lg shadow-glow">
               <Sparkles className="h-5 w-5 text-primary-foreground" />
             </div>
             <span className="font-bold text-xl text-gradient">{t("common.appName")}</span>
           </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center gap-6 col-start-2 justify-self-center">
             {links.map((link) => (
               <Link
                 key={link.path}
                 to={link.path}
                 className={`text-sm font-medium transition-colors hover:text-primary/90 ${
                   location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                 }`}
               >
                 {link.name}
               </Link>
             ))}
           </div>

          {/* Right utilities */}
          <div className="hidden md:flex items-center justify-end gap-2 col-start-3 justify-self-end">
            <Button
              aria-label="Toggle theme"
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </Button>
              
             <DropdownMenu>
               <DropdownMenuTrigger asChild>
                 <Button aria-label="Change language" variant="ghost" size="icon">
                    <Globe className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setLanguage("vi")}>
                    Tiếng Việt
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setLanguage("en")}>
                    English
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {!isAdminPath && (
                <>
                  {/* Profile hover card with logout */}
                  <HoverCard openDelay={80} closeDelay={100}>
                    <HoverCardTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src="" alt="user" />
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline">{t("common.profile")}</span>
                      </Button>
                    </HoverCardTrigger>
                    <HoverCardContent align="end" className="w-64">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src="" alt="user" />
                          <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <div className="text-sm">
                          <div className="font-medium">Tài khoản của bạn</div>
                          <div className="text-muted-foreground">user@example.com</div>
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link to={isRecruiterPath ? "/business-profile" : "/profile"}>Xem hồ sơ</Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="justify-start text-destructive hover:text-destructive"
                          onClick={handleLogout}
                        >
                          <LogOut className="h-4 w-4 mr-2" /> Đăng xuất
                        </Button>
                      </div>
                    </HoverCardContent>
                  </HoverCard>

                  <Button size="sm" className="gradient-primary shadow-glow" asChild>
                    <Link to={isRecruiterPath ? "/recruiter-premium" : "/premium"}>
                      {t("common.upgrade")}
                    </Link>
                  </Button>
                </>
              )}
            </div>

           {/* Mobile Menu Button */}
           <button
             className="md:hidden p-2 rounded-md hover:bg-secondary col-start-3 justify-self-end"
             onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
             aria-label="Toggle menu"
           >
             {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
           </button>
          </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 rounded-b-xl shadow-sm">
            <div className="flex flex-col gap-1">
              {links.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-secondary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {!isAdminPath && (
                <>
                  <Link
                    to={isRecruiterPath ? "/business-profile" : "/profile"}
                    className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("common.profile")}
                  </Link>
                  <button
                    onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                    className="text-left px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary text-destructive"
                  >
                    Đăng xuất
                  </button>
                  <Link
                    to={isRecruiterPath ? "/recruiter-premium" : "/premium"}
                    className="px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("common.upgrade")}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
