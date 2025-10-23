import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, User, Menu, X } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";
  
  if (isAuthPage) return null;

  const candidateLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "CV Builder", path: "/cv-builder" },
    { name: "Mock Interview", path: "/interview-setup" },
    { name: "Jobs", path: "/jobs" },
  ];

  const recruiterLinks = [
    { name: "Dashboard", path: "/recruiter-dashboard" },
    { name: "Post Job", path: "/post-job" },
    { name: "Candidates", path: "/candidates" },
  ];

  const isRecruiterPath = location.pathname.includes("recruiter") || 
                          location.pathname.includes("post-job") || 
                          location.pathname.includes("candidates");

  const links = isRecruiterPath ? recruiterLinks : candidateLinks;

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="gradient-primary p-2 rounded-lg shadow-glow">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl text-gradient">CareerAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === link.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/profile">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Link>
            </Button>
            <Button size="sm" className="gradient-primary shadow-glow" asChild>
              <Link to="/premium">Upgrade to Premium</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === link.path
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/profile"
              className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Profile
            </Link>
            <Link
              to="/premium"
              className="block px-3 py-2 rounded-md text-sm font-medium bg-primary text-primary-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Upgrade to Premium
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
