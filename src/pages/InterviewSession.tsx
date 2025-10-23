import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Video, Mic, MicOff, VideoOff, StopCircle } from "lucide-react";
import { Link } from "react-router-dom";

const InterviewSession = () => {
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 5;

  const questions = [
    "Tell me about yourself and your professional background.",
    "Describe a challenging project you worked on and how you overcame obstacles.",
    "What are your greatest strengths and how do they apply to this role?",
    "Tell me about a time you had to work with a difficult team member.",
    "Where do you see yourself in 5 years?",
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Progress */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Question {currentQuestion} of {totalQuestions}</span>
              <span className="text-sm text-muted-foreground">00:45 remaining</span>
            </div>
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full gradient-primary transition-all duration-300"
                style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            {/* Video Feed */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Your Video</h3>
              <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center mb-4">
                {isVideoOn ? (
                  <div className="text-center">
                    <Video className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Camera Active</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <VideoOff className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Camera Off</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center gap-3">
                <Button
                  variant={isMicOn ? "default" : "destructive"}
                  size="lg"
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={isMicOn ? "bg-primary" : ""}
                >
                  {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="lg"
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={isVideoOn ? "bg-primary" : ""}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
              </div>
            </Card>

            {/* AI Interviewer */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">AI Interviewer</h3>
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <div className="gradient-primary p-6 rounded-full inline-flex mb-4 shadow-glow animate-pulse-slow">
                    <div className="h-12 w-12" />
                  </div>
                  <p className="text-sm font-medium">AI Interviewer is listening...</p>
                </div>
              </div>
              <div className="flex justify-center">
                <Button variant="outline" size="sm">
                  Repeat Question
                </Button>
              </div>
            </Card>
          </div>

          {/* Current Question */}
          <Card className="p-8 mb-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-4">Current Question:</h2>
              <p className="text-xl text-muted-foreground mb-6">
                {questions[currentQuestion - 1]}
              </p>
              <div className="flex justify-center gap-4">
                {currentQuestion < totalQuestions ? (
                  <Button 
                    className="gradient-primary shadow-glow" 
                    size="lg"
                    onClick={() => setCurrentQuestion(currentQuestion + 1)}
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button className="gradient-primary shadow-glow" size="lg" asChild>
                    <Link to="/interview-report/1">
                      <StopCircle className="h-5 w-5 mr-2" />
                      Finish Interview
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Tips */}
          <Card className="p-6">
            <h3 className="font-semibold mb-3">💡 Interview Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Speak clearly and maintain good posture</li>
              <li>• Use the STAR method for behavioral questions</li>
              <li>• Take a moment to think before answering</li>
              <li>• Make eye contact with the camera</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
