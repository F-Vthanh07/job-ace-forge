import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Briefcase, User, Loader } from "lucide-react";
import { authService } from "@/services/authService";

type Role = "Candidate" | "Recruiter" | null;

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const handleConfirm = async () => {
    if (!selectedRole) {
      setError("Vui lòng chọn mục đích của bạn.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Get signup data from sessionStorage
      const signupDataStr = sessionStorage.getItem("signupData");
      if (!signupDataStr) {
        setError("Phiên đã hết hạn. Vui lòng đăng ký lại.");
        setTimeout(() => navigate("/signup"), 2000);
        return;
      }

      const signupData = JSON.parse(signupDataStr);

      // Prepare registration data to match backend schema
      const registerData = {
        fullName: signupData.fullName,
        email: signupData.email,
        phoneNumber: signupData.phoneNumber,
        dateOfBirth: signupData.dateOfBirth,
        gender: signupData.gender,
        passwordHash: signupData.password,
        role: selectedRole,
      };

      console.log("Sending registration data:", registerData);

      // Call API to register
      const response = await authService.register(registerData);

      if (response.success) {
        // Clear sessionStorage
        sessionStorage.removeItem("signupData");

        // Store user info if provided
        if (response.data?.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        // Redirect based on role
        if (selectedRole === "Recruiter") {
          navigate("/recruiter-dashboard");
        } else {
          navigate("/onboarding");
        }
      } else {
        setError(response.message || "Đăng ký không thành công. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error creating account:", err);
      setError("Lỗi kết nối. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="gradient-primary p-2 rounded-lg shadow-glow">
              <Sparkles className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-gradient">AI JOBMATCH</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">What is your purpose?</h1>
          <p className="text-muted-foreground">Select whether you're an employer or a job seeker</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Candidate Option */}
          <div
            onClick={() => setSelectedRole("Candidate")}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedRole === "Candidate"
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className={`p-4 rounded-lg ${
                  selectedRole === "Candidate"
                    ? "gradient-primary"
                    : "bg-muted"
                }`}
              >
                <User
                  className={`h-8 w-8 ${
                    selectedRole === "Candidate" ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Job Seeker</h2>
                <p className="text-sm text-muted-foreground">
                  I'm looking for a job and want to improve my skills
                </p>
              </div>
            </div>
          </div>

          {/* Recruiter Option */}
          <div
            onClick={() => setSelectedRole("Recruiter")}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedRole === "Recruiter"
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className={`p-4 rounded-lg ${
                  selectedRole === "Recruiter"
                    ? "gradient-primary"
                    : "bg-muted"
                }`}
              >
                <Briefcase
                  className={`h-8 w-8 ${
                    selectedRole === "Recruiter" ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Employer</h2>
                <p className="text-sm text-muted-foreground">
                  I'm hiring and looking for qualified candidates
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/signup")}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              className="w-full gradient-primary shadow-glow"
              onClick={handleConfirm}
              disabled={!selectedRole || isLoading}
              size="lg"
            >
              {isLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading ? "Creating Account..." : "Complete Registration"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RoleSelection;
