import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { authService } from "@/services/authService";

interface SignupData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  password: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<SignupData>({
    fullName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    password: "",
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize Turnstile widget
    const initTurnstile = async () => {
      if (turnstileRef.current) {
        await authService.renderTurnstile("turnstile-signup-container");
      }
    };
    initTurnstile();

    return () => {
      authService.removeTurnstile();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    setError(""); // Clear error on input change
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      // Get Turnstile token
      const captchaToken = authService.getTurnstileToken();
      if (!captchaToken) {
        setError("Vui lòng hoàn thành xác thực Turnstile.");
        setLoading(false);
        return;
      }

      // Validate required fields
      if (!formData.fullName || !formData.email || !formData.phoneNumber || !formData.password || !formData.dateOfBirth) {
        setError("Vui lòng điền tất cả các trường bắt buộc.");
        authService.resetTurnstile();
        setLoading(false);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        setError("Email không hợp lệ.");
        authService.resetTurnstile();
        setLoading(false);
        return;
      }

      // Validate password length
      if (formData.password.length < 6) {
        setError("Mật khẩu phải có ít nhất 6 ký tự.");
        authService.resetTurnstile();
        setLoading(false);
        return;
      }

      // Store signup data in sessionStorage for role selection page
      sessionStorage.setItem("signupData", JSON.stringify(formData));
      sessionStorage.setItem("signupCaptchaToken", captchaToken);
      
      // Navigate to role selection page
      navigate("/role-selection");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="gradient-primary p-2 rounded-lg shadow-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-gradient">AI JOBMATCH</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground">Start your career transformation today</p>
        </div>

        <form className="space-y-4" onSubmit={handleNext}>
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              placeholder="John Doe"
              className="mt-1"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="mt-1"
              value={formData.email}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number *</Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="+84 123 456 789"
              className="mt-1"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          <div>
            <Label htmlFor="dateOfBirth">Date of Birth *</Label>
            <Input
              id="dateOfBirth"
              type="date"
              className="mt-1"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              className="w-full mt-1 px-3 py-2 border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={loading}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="mt-1"
              value={formData.password}
              onChange={handleInputChange}
              disabled={loading}
              required
            />
          </div>

          {/* Turnstile Widget */}
          <div 
            ref={turnstileRef} 
            id="turnstile-signup-container" 
            className="flex justify-center my-4"
          />

          <Button 
            type="submit" 
            className="w-full gradient-primary shadow-glow" 
            size="lg"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Processing..." : "Register"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Signup;
