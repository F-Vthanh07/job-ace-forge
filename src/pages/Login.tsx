import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";
import { authService } from "@/services/authService";
import { notifyError, notifySuccess, notifyWarning } from "@/utils/notification";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const turnstileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Turnstile widget
    const initTurnstile = async () => {
      console.log("🔄 Initializing Turnstile widget...");
      if (turnstileRef.current) {
        await authService.renderTurnstile("turnstile-container");
        console.log("✅ Turnstile widget initialized");
      } else {
        console.error("❌ Turnstile container ref not found");
      }
    };
    initTurnstile();

    return () => {
      console.log("🧹 Cleaning up Turnstile widget");
      authService.removeTurnstile();
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("📝 Login attempt started");
      
      // Get Turnstile token
      const captchaToken = authService.getTurnstileToken();
      console.log("🔐 CAPTCHA Token:", captchaToken ? "✅ Exists" : "❌ Missing");
      
      if (!captchaToken) {
        console.error("❌ Missing captcha token");
        notifyWarning("Vui lòng hoàn thành xác thực bảo mật.");
        setLoading(false);
        return;
      }

      if (!email || !password) {
        console.error("❌ Missing email or password");
        notifyWarning("Vui lòng nhập email và mật khẩu.");
        setLoading(false);
        return;
      }

      console.log("📧 Email:", email);
      console.log("🔑 Password: [plaintext]");

      // Call login API (Backend sẽ hash với BCrypt)
      console.log("📤 Sending login request to backend...");
      const result = await authService.login({
        email,
        passwordHash: password, // Gửi plaintext, BE sẽ hash
        captchaToken,
      });

      console.log("📥 Backend response:", result);

      if (result.success && result.data?.token) {
        console.log("✅ Login successful!");
        notifySuccess("Đăng nhập thành công!");
        // Redirect to dashboard immediately
        navigate("/dashboard");
      } else {
        console.error("❌ Login failed:", result.message);
        notifyError(result.message);
        authService.resetTurnstile();
      }
    } catch (err) {
      console.error("❌ Login error:", err);
      notifyError(err);
      authService.resetTurnstile();
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
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="your@email.com" 
              className="mt-1" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              className="mt-1"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          {/* Turnstile Widget */}
          <div 
            ref={turnstileRef} 
            id="turnstile-container" 
            className="flex justify-center my-4"
          />

          <Button 
            className="w-full gradient-primary shadow-glow" 
            size="lg"
            type="submit"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Signing In..." : "Sign In"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">Don't have an account? </span>
            <a href="/signup" className="text-primary hover:underline font-medium">
              Sign up
            </a>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            variant="outline" 
            className="w-full"
            type="button"
            disabled={loading}
            onClick={() => navigate("/recruiter-login")}
          >
            Sign in as Recruiter
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
