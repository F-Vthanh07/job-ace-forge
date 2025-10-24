import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect, useRef } from "react";
import { Video, Mic, MicOff, VideoOff, StopCircle, Maximize, Minimize, ZoomIn, ZoomOut, Subtitles } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import interviewerMale from "@/assets/interviewer-male.png";
import interviewerFemale from "@/assets/interviewer-female.png";
import { interviewQuestions } from "@/data/interviewQuestions";

const InterviewSession = () => {
  const [searchParams] = useSearchParams();
  const gender = searchParams.get("gender") || "male";
  const difficulty = searchParams.get("difficulty") || "medium";
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(60); // 60 seconds
  const [isSessionActive, setIsSessionActive] = useState(true);
  const [isUserFullscreen, setIsUserFullscreen] = useState(false);
  const [isAIFullscreen, setIsAIFullscreen] = useState(false);
  const [userZoom, setUserZoom] = useState(1);
  const [aiZoom, setAIZoom] = useState(1);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const userVideoContainerRef = useRef<HTMLDivElement>(null);
  const aiVideoContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const interviewerImage = gender === "female" ? interviewerFemale : interviewerMale;
  const interviewerName = gender === "female" ? "Female Interviewer" : "Male Interviewer";

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        toast({
          title: "Camera Access Denied",
          description: "Please allow camera access to continue with the interview.",
          variant: "destructive",
        });
      }
    };

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  // Questions management
  useEffect(() => {
    const questions = interviewQuestions[difficulty as keyof typeof interviewQuestions] || interviewQuestions.medium;
    const elapsedTime = 60 - timeRemaining;
    
    const currentQ = questions.find((q, idx) => {
      const nextQ = questions[idx + 1];
      return elapsedTime >= q.timeAppear && (!nextQ || elapsedTime < nextQ.timeAppear);
    });
    
    if (currentQ) {
      setCurrentQuestion(currentQ.question);
    }
  }, [timeRemaining, difficulty]);

  // Countdown timer
  useEffect(() => {
    if (!isSessionActive) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          setIsSessionActive(false);
          clearInterval(timer);
          // End session and redirect
          if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
          }
          toast({
            title: "Interview Completed",
            description: "Redirecting to your results...",
          });
          setTimeout(() => {
            navigate("/interview-report/1");
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isSessionActive, navigate, toast]);

  // Toggle video
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
      }
    }
  };

  // Toggle mic
  const toggleMic = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMicOn(audioTrack.enabled);
      }
    }
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    navigate("/interview-report/1");
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const toggleUserFullscreen = () => {
    if (!userVideoContainerRef.current) return;
    
    if (!isUserFullscreen) {
      userVideoContainerRef.current.requestFullscreen?.();
      setIsUserFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsUserFullscreen(false);
    }
  };

  const toggleAIFullscreen = () => {
    if (!aiVideoContainerRef.current) return;
    
    if (!isAIFullscreen) {
      aiVideoContainerRef.current.requestFullscreen?.();
      setIsAIFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsAIFullscreen(false);
    }
  };

  const handleUserZoomIn = () => setUserZoom(prev => Math.min(prev + 0.25, 2));
  const handleUserZoomOut = () => setUserZoom(prev => Math.max(prev - 0.25, 1));
  const handleAIZoomIn = () => setAIZoom(prev => Math.min(prev + 0.25, 2));
  const handleAIZoomOut = () => setAIZoom(prev => Math.max(prev - 0.25, 1));

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setIsUserFullscreen(false);
        setIsAIFullscreen(false);
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header with Timer */}
      <div className="bg-card border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <div className="gradient-primary p-2 rounded-lg">
                <Video className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold">AI Mock Interview Session</h2>
                <p className="text-sm text-muted-foreground">Practice makes perfect</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${timeRemaining <= 10 ? 'text-destructive' : 'text-primary'}`}>
                  {formatTime(timeRemaining)}
                </div>
                <p className="text-xs text-muted-foreground">Time Remaining</p>
              </div>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleEndSession}
              >
                <StopCircle className="h-4 w-4 mr-2" />
                End Session
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Main Video Grid */}
          <div className="grid lg:grid-cols-2 gap-4 mb-4">
            {/* Your Video */}
            <Card className="overflow-hidden bg-black relative" ref={userVideoContainerRef}>
              <div className="relative aspect-video bg-black overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ 
                    display: isVideoOn ? 'block' : 'none',
                    transform: `scale(${userZoom})`
                  }}
                />
                {!isVideoOn && (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                        <VideoOff className="h-12 w-12 text-muted-foreground" />
                      </div>
                      <p className="text-lg text-muted-foreground">Camera Off</p>
                    </div>
                  </div>
                )}
                
                {/* Zoom & Fullscreen controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-black/70 hover:bg-black/90"
                    onClick={handleUserZoomIn}
                    disabled={userZoom >= 2}
                  >
                    <ZoomIn className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-black/70 hover:bg-black/90"
                    onClick={handleUserZoomOut}
                    disabled={userZoom <= 1}
                  >
                    <ZoomOut className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-black/70 hover:bg-black/90"
                    onClick={toggleUserFullscreen}
                  >
                    {isUserFullscreen ? (
                      <Minimize className="h-4 w-4 text-white" />
                    ) : (
                      <Maximize className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>

                {/* Overlay controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
                  <Button
                    variant={isMicOn ? "secondary" : "destructive"}
                    size="icon"
                    className="rounded-full h-12 w-12"
                    onClick={toggleMic}
                  >
                    {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                  </Button>
                  <Button
                    variant={isVideoOn ? "secondary" : "destructive"}
                    size="icon"
                    className="rounded-full h-12 w-12"
                    onClick={toggleVideo}
                  >
                    {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                  </Button>
                </div>

                {/* Name tag */}
                <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded-md">
                  <p className="text-sm text-white font-medium">You</p>
                </div>
              </div>
            </Card>

            {/* AI Interviewer */}
            <Card className="overflow-hidden bg-black relative" ref={aiVideoContainerRef}>
              <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
                <img 
                  src={interviewerImage} 
                  alt={interviewerName}
                  className="w-full h-full object-cover transition-transform duration-300"
                  style={{ transform: `scale(${aiZoom})` }}
                />
                
                {/* Zoom & Fullscreen controls */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-black/70 hover:bg-black/90"
                    onClick={handleAIZoomIn}
                    disabled={aiZoom >= 2}
                  >
                    <ZoomIn className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-black/70 hover:bg-black/90"
                    onClick={handleAIZoomOut}
                    disabled={aiZoom <= 1}
                  >
                    <ZoomOut className="h-4 w-4 text-white" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="h-8 w-8 bg-black/70 hover:bg-black/90"
                    onClick={toggleAIFullscreen}
                  >
                    {isAIFullscreen ? (
                      <Minimize className="h-4 w-4 text-white" />
                    ) : (
                      <Maximize className="h-4 w-4 text-white" />
                    )}
                  </Button>
                </div>

                {/* Listening indicator overlay */}
                <div className="absolute top-4 left-4">
                  <div className="flex items-center gap-2 bg-black/70 px-3 py-1.5 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                    <span className="text-xs text-white font-medium">Listening</span>
                  </div>
                </div>

                {/* Subtitles toggle */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-black/70 hover:bg-black/90 h-8"
                    onClick={() => setShowSubtitles(!showSubtitles)}
                  >
                    <Subtitles className="h-4 w-4 mr-2" />
                    {showSubtitles ? "Hide" : "Show"} Subtitles
                  </Button>
                </div>

                {/* Subtitles */}
                {showSubtitles && currentQuestion && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/80 px-4 py-3 rounded-lg">
                    <p className="text-white text-sm md:text-base font-medium text-center leading-relaxed">
                      {currentQuestion}
                    </p>
                  </div>
                )}

                {/* Name tag */}
                <div className="absolute bottom-4 left-4 bg-black/70 px-3 py-1 rounded-md" style={{ bottom: showSubtitles && currentQuestion ? '80px' : '16px' }}>
                  <p className="text-sm text-white font-medium">{interviewerName}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Live Transcript / Status */}
          <Card className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-destructive animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">🎙️ Live Interview in Progress</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  The AI interviewer is actively listening and analyzing your responses. Speak naturally and confidently.
                  Your body language, tone, and content are being evaluated in real-time.
                </p>
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    Voice Analysis Active
                  </div>
                  <div className="px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
                    Camera Recording
                  </div>
                  <div className="px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium">
                    AI Processing
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InterviewSession;
