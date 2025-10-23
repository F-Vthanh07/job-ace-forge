import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Share2, Download, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";

const InterviewReport = () => {
  const scoreCategories = [
    { name: "Communication", score: 88, feedback: "Clear and articulate responses" },
    { name: "Confidence", score: 82, feedback: "Good eye contact and body language" },
    { name: "Content Quality", score: 90, feedback: "Well-structured answers with examples" },
    { name: "Technical Knowledge", score: 85, feedback: "Strong understanding of concepts" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Interview Performance Report</h1>
              <p className="text-muted-foreground">Behavioral Interview • Frontend Developer</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* Overall Score */}
          <Card className="p-8 mb-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-32 h-32 rounded-full gradient-primary mb-4 shadow-glow">
                <span className="text-5xl font-bold text-white">86</span>
              </div>
              <h2 className="text-3xl font-bold mb-2">Great Performance!</h2>
              <p className="text-muted-foreground">You're well-prepared for your interviews</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Strengths</h3>
                <div className="space-y-2">
                  <Badge variant="default" className="bg-success text-success-foreground">
                    Strong STAR method usage
                  </Badge>
                  <Badge variant="default" className="bg-success text-success-foreground">
                    Excellent examples
                  </Badge>
                  <Badge variant="default" className="bg-success text-success-foreground">
                    Clear communication
                  </Badge>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Areas to Improve</h3>
                <div className="space-y-2">
                  <Badge variant="secondary">
                    Reduce filler words
                  </Badge>
                  <Badge variant="secondary">
                    More concise answers
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Detailed Scores */}
          <Card className="p-6 mb-6">
            <h3 className="text-2xl font-bold mb-6">Performance Breakdown</h3>
            <div className="space-y-6">
              {scoreCategories.map((category) => (
                <div key={category.name}>
                  <div className="flex justify-between mb-2">
                    <div>
                      <h4 className="font-semibold">{category.name}</h4>
                      <p className="text-sm text-muted-foreground">{category.feedback}</p>
                    </div>
                    <span className="text-2xl font-bold text-primary">{category.score}</span>
                  </div>
                  <Progress value={category.score} className="h-2" />
                </div>
              ))}
            </div>
          </Card>

          {/* Question-by-Question Analysis */}
          <Card className="p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4">Question Analysis</h3>
            <div className="space-y-4">
              <QuestionAnalysis
                question="Tell me about yourself"
                score={92}
                feedback="Excellent structured response with clear career progression"
              />
              <QuestionAnalysis
                question="Describe a challenging project"
                score={85}
                feedback="Good use of STAR method, could include more specific metrics"
              />
              <QuestionAnalysis
                question="What are your strengths?"
                score={88}
                feedback="Well-articulated strengths with relevant examples"
              />
            </div>
          </Card>

          {/* Next Steps */}
          <Card className="p-6">
            <h3 className="text-2xl font-bold mb-4">Recommended Next Steps</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 rounded-lg bg-accent-light border border-accent/20">
                <div className="gradient-accent p-2 rounded-lg">
                  <RotateCcw className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold mb-1">Practice Technical Questions</h4>
                  <p className="text-sm text-muted-foreground mb-3">
                    Improve your technical interview skills with coding challenges
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/interview-setup">Start New Session</Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const QuestionAnalysis = ({ 
  question, 
  score, 
  feedback 
}: { 
  question: string; 
  score: number; 
  feedback: string;
}) => (
  <div className="p-4 rounded-lg border">
    <div className="flex justify-between items-start mb-2">
      <h4 className="font-semibold flex-1">{question}</h4>
      <Badge className="bg-primary text-primary-foreground">{score}/100</Badge>
    </div>
    <p className="text-sm text-muted-foreground">{feedback}</p>
  </div>
);

export default InterviewReport;
