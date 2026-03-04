import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Rocket, Bell, ArrowLeft, Zap, Star, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { notifySuccess } from "@/utils/notification";

const ComingSoon = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    // Generate random particles for background animation
    const newParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const handleNotifyMe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      notifySuccess("Thanks! We'll notify you when this feature launches!");
      setEmail("");
    } else {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 relative overflow-hidden">
      <Navbar />

      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-2 h-2 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}s`,
              top: `-20px`,
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-30 animate-blob animation-delay-4000" />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Link to="/dashboard">
            <Button variant="ghost" className="mb-8 group">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Button>
          </Link>

          {/* Main Content */}
          <div className="text-center space-y-8 animate-fade-in">
            {/* Animated Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-2xl opacity-50 animate-pulse" />
                <div className="relative bg-gradient-to-br from-purple-500 via-blue-500 to-pink-500 p-8 rounded-full animate-bounce-slow">
                  <Rocket className="h-20 w-20 text-white" />
                </div>
                {/* Sparkles around icon */}
                <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-400 animate-spin-slow" />
                <Star className="absolute -bottom-2 -left-2 h-6 w-6 text-pink-400 animate-ping" />
                <Zap className="absolute top-1/2 -right-8 h-6 w-6 text-blue-400 animate-pulse" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                Coming Soon
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-300">
                AI Mock Interview
              </p>
            </div>

            {/* Description */}
            <div className="max-w-2xl mx-auto space-y-4">
              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                We're working hard to bring you an amazing AI-powered mock interview experience. 
                Practice your interview skills with realistic AI conversations and get instant feedback!
              </p>

              {/* Features Preview */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-purple-200 dark:border-purple-700 transform hover:scale-105 transition-transform">
                  <Zap className="h-8 w-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">AI-Powered</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Real-time AI interviewer
                  </p>
                </div>

                <div className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-blue-200 dark:border-blue-700 transform hover:scale-105 transition-transform">
                  <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Instant Feedback</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Get results immediately
                  </p>
                </div>

                <div className="p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg border border-pink-200 dark:border-pink-700 transform hover:scale-105 transition-transform">
                  <Star className="h-8 w-8 text-pink-600 dark:text-pink-400 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-1">Personalized</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tailored to your role
                  </p>
                </div>
              </div>
            </div>

            {/* Notify Me Form */}
            <div className="max-w-md mx-auto mt-12">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Bell className="h-6 w-6 text-primary animate-ring" />
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                    Get Notified
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Be the first to know when this feature launches!
                </p>
                <form onSubmit={handleNotifyMe} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="text-center"
                  />
                  <Button
                    type="submit"
                    className="w-full gradient-primary shadow-glow text-lg py-6"
                  >
                    <Bell className="h-5 w-5 mr-2" />
                    Notify Me
                  </Button>
                </form>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-12 text-sm text-gray-500 dark:text-gray-500">
              <p>Expected launch: Q2 2026</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-100vh) translateX(10px);
          }
          50% {
            transform: translateY(-200vh) translateX(-10px);
          }
          75% {
            transform: translateY(-300vh) translateX(5px);
          }
        }

        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gradient {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }

        @keyframes ring {
          0%, 100% {
            transform: rotate(0deg);
          }
          10%, 30% {
            transform: rotate(-10deg);
          }
          20%, 40% {
            transform: rotate(10deg);
          }
        }

        .animate-float {
          animation: float 15s linear infinite;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }

        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-ring {
          animation: ring 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;
