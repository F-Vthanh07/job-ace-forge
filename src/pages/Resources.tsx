import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BookOpen, Video, FileText, Search, ExternalLink } from "lucide-react";

const Resources = () => {
  const resources = [
    {
      category: "CV Writing",
      icon: FileText,
      items: [
        { title: "ATS Optimization Guide", type: "article", duration: "5 min read" },
        { title: "Action Verbs Cheat Sheet", type: "pdf", duration: "Download" },
        { title: "CV Templates Library", type: "resource", duration: "12 templates" },
      ],
    },
    {
      category: "Interview Skills",
      icon: Video,
      items: [
        { title: "STAR Method Masterclass", type: "video", duration: "15 min" },
        { title: "Body Language Tips", type: "article", duration: "7 min read" },
        { title: "Common Questions & Answers", type: "guide", duration: "20 min read" },
      ],
    },
    {
      category: "Career Development",
      icon: BookOpen,
      items: [
        { title: "Salary Negotiation Guide", type: "article", duration: "10 min read" },
        { title: "LinkedIn Profile Optimization", type: "guide", duration: "8 min read" },
        { title: "Networking Strategies", type: "video", duration: "12 min" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Learning Resources</h1>
            <p className="text-muted-foreground">Guides, tips, and tutorials to boost your career</p>
          </div>

          {/* Search */}
          <div className="relative mb-8">
            <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input 
              placeholder="Search resources..." 
              className="pl-10 h-12 text-lg"
            />
          </div>

          {/* Resource Categories */}
          <div className="space-y-8">
            {resources.map((category) => {
              const Icon = category.icon;
              return (
                <Card key={category.category} className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="gradient-primary p-3 rounded-lg">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">{category.category}</h2>
                  </div>

                  <div className="space-y-3">
                    {category.items.map((item) => (
                      <div
                        key={item.title}
                        className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-all duration-300 hover:shadow-md group"
                      >
                        <div>
                          <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="px-2 py-0.5 rounded bg-secondary capitalize">
                              {item.type}
                            </span>
                            <span>•</span>
                            <span>{item.duration}</span>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;
