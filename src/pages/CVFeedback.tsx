import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, XCircle, Download, Edit } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const CVFeedback = () => {
  const { id } = useParams();

  const feedbackItems = [
    { type: "success", message: "Strong action verbs used throughout", icon: CheckCircle },
    { type: "success", message: "Good keyword optimization for ATS", icon: CheckCircle },
    { type: "warning", message: "Consider adding more quantifiable achievements", icon: AlertCircle },
    { type: "error", message: "Missing contact information", icon: XCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">CV Analysis Report</h1>
              <p className="text-muted-foreground">Software Engineer CV</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <Link to={`/cv-builder?id=${id}`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit CV
                </Link>
              </Button>
              <Button className="gradient-primary">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Overall Score */}
          <Card className="p-8 mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full gradient-primary mb-4 shadow-glow">
                <span className="text-5xl font-bold text-white">92</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Excellent Score!</h2>
              <p className="text-muted-foreground">Your CV is well-optimized for ATS systems</p>
            </div>

            <div className="grid md:grid-cols-4 gap-4">
              <ScoreItem label="Content" score={95} />
              <ScoreItem label="Keywords" score={90} />
              <ScoreItem label="Format" score={88} />
              <ScoreItem label="Impact" score={94} />
            </div>
          </Card>

          {/* Detailed Feedback */}
          <Card className="p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4">Detailed Analysis</h3>
            <div className="space-y-3">
              {feedbackItems.map((item, index) => {
                const Icon = item.icon;
                const colorClass = {
                  success: "text-success bg-success-light",
                  warning: "text-warning bg-warning/10",
                  error: "text-destructive bg-destructive/10",
                }[item.type];

                return (
                  <div key={index} className="flex items-start gap-3 p-4 rounded-lg border">
                    <div className={`p-2 rounded-lg ${colorClass}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <p className="flex-1 pt-1">{item.message}</p>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Recommendations */}
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-4">Recommendations</h3>
            <div className="space-y-4">
              <RecommendationItem
                title="Add Quantifiable Achievements"
                description="Include specific numbers and metrics to demonstrate your impact. For example: 'Increased user engagement by 40%'"
                priority="high"
              />
              <RecommendationItem
                title="Optimize for Target Role"
                description="Tailor your CV keywords to match the job description you're applying for"
                priority="medium"
              />
              <RecommendationItem
                title="Update Skills Section"
                description="Add trending technologies relevant to your field to improve ATS matching"
                priority="low"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ScoreItem = ({ label, score }: { label: string; score: number }) => (
  <div>
    <div className="flex justify-between text-sm mb-2">
      <span className="font-medium">{label}</span>
      <span className="text-success font-bold">{score}%</span>
    </div>
    <Progress value={score} className="h-2" />
  </div>
);

const RecommendationItem = ({ 
  title, 
  description, 
  priority 
}: { 
  title: string; 
  description: string; 
  priority: "high" | "medium" | "low";
}) => {
  const priorityColors = {
    high: "bg-destructive text-destructive-foreground",
    medium: "bg-warning text-warning-foreground",
    low: "bg-secondary text-secondary-foreground",
  };

  return (
    <div className="p-4 rounded-lg border">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-semibold">{title}</h4>
        <Badge className={priorityColors[priority]}>{priority}</Badge>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default CVFeedback;
