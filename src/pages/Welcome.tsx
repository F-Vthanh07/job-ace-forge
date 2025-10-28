import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, TrendingUp, Target, Zap, Search, MapPin, Briefcase, Building2, Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Welcome = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="gradient-primary p-2 rounded-lg shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl text-gradient">{t("common.appName")}</span>
            </Link>

            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
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

              <Button variant="ghost" asChild>
                <Link to="/login">{t("common.signIn")}</Link>
              </Button>
              <Button className="gradient-primary shadow-glow" asChild>
                <Link to="/signup">{t("common.getStarted")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
              {t("welcome.hero")}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t("welcome.subtitle")}
            </p>

            {/* Job Search Bar */}
            <Card className="p-4 max-w-3xl mx-auto shadow-lg">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={t("welcome.searchPlaceholder")}
                    className="pl-10"
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder={t("welcome.locationPlaceholder")}
                    className="pl-10"
                  />
                </div>
                <Button className="gradient-primary shadow-glow md:w-auto w-full">
                  <Search className="h-4 w-4 mr-2" />
                  {t("welcome.searchButton")}
                </Button>
              </div>
            </Card>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-20">
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <Briefcase className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold mb-1">10,000+</div>
              <div className="text-sm text-muted-foreground">{t("jobs.title")}</div>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <Building2 className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold mb-1">500+</div>
              <div className="text-sm text-muted-foreground">Companies</div>
            </div>
            <div className="text-center p-6 rounded-lg bg-card border border-border">
              <Target className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold mb-1">95%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            AI-Powered Career Tools
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to succeed in your job search
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Target}
            title={t("welcome.cvBuilder")}
            description={t("welcome.cvBuilderDesc")}
          />
          <FeatureCard
            icon={Zap}
            title={t("welcome.mockInterview")}
            description={t("welcome.mockInterviewDesc")}
          />
          <FeatureCard
            icon={TrendingUp}
            title={t("welcome.jobMatch")}
            description={t("welcome.jobMatchDesc")}
          />
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20">
        <Card className="p-12 text-center gradient-primary">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Find Your Dream Job?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful job seekers using AI JOBMATCH
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
            <Link to="/signup">{t("common.getStarted")}</Link>
          </Button>
        </Card>
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  icon: Icon, 
  title, 
  description 
}: { 
  icon: typeof Sparkles; 
  title: string; 
  description: string;
}) => (
  <div className="p-6 rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
    <div className="gradient-primary p-3 rounded-lg w-fit mb-4 shadow-glow">
      <Icon className="h-6 w-6 text-primary-foreground" />
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

export default Welcome;
