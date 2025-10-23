import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Candidates = () => {
  const candidates = [
    {
      id: 1,
      name: "John Doe",
      role: "Senior Frontend Developer",
      matchScore: 92,
      experience: "5 years",
      skills: ["React", "TypeScript", "Tailwind"],
      applied: "2 hours ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Full Stack Engineer",
      matchScore: 88,
      experience: "4 years",
      skills: ["React", "Node.js", "PostgreSQL"],
      applied: "5 hours ago",
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "React Developer",
      matchScore: 85,
      experience: "3 years",
      skills: ["React", "Redux", "CSS"],
      applied: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Candidate Pool</h1>
          <p className="text-muted-foreground">AI-ranked candidates for your open positions</p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search candidates..." 
                className="pl-10"
              />
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Job Position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                <SelectItem value="frontend">Frontend Developer</SelectItem>
                <SelectItem value="fullstack">Full Stack Engineer</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="match">Match Score</SelectItem>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="experience">Experience</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Candidate List */}
        <div className="space-y-4">
          {candidates.map((candidate) => (
            <Card key={candidate.id} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-xl shrink-0">
                    {candidate.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-bold mb-1">{candidate.name}</h3>
                        <p className="text-muted-foreground mb-2">{candidate.role}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{candidate.experience} experience</span>
                      <span>•</span>
                      <span>Applied {candidate.applied}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-success" />
                    <span className="text-2xl font-bold text-success">{candidate.matchScore}%</span>
                  </div>
                  <Button className="gradient-primary" asChild>
                    <Link to={`/candidate-report/${candidate.id}`}>
                      View Profile
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Candidates;
