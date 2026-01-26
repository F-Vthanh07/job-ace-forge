import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Briefcase, User, Loader } from "lucide-react";
import { authService } from "@/services/authService";
import { notifyError, notifySuccess, notifyWarning } from "@/utils/notification";

type Role = "Candidate" | "Recruiter" | null;

const RoleSelection = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedRole) {
      notifyWarning("Vui lòng chọn mục đích của bạn.");
      return;
    }

    setIsLoading(true);

    try {
      // Get signup data from sessionStorage
      const signupDataStr = sessionStorage.getItem("signupData");
      const captchaToken = sessionStorage.getItem("signupCaptchaToken");

      if (!signupDataStr) {
        notifyWarning("Phiên đã hết hạn. Vui lòng đăng ký lại.");
        setTimeout(() => navigate("/signup"), 2000);
        return;
      }

      const signupData = JSON.parse(signupDataStr);

      // Prepare registration data to match backend schema
      // Backend expects: Role = "Candidate" or "Recruiter", Gender = "Male"/"Female"/"Other"

      // Convert gender to proper case (male -> Male, female -> Female, other -> Other)
      const genderValue = signupData.gender
        ? signupData.gender.charAt(0).toUpperCase() + signupData.gender.slice(1).toLowerCase()
        : "";

      // Convert dateOfBirth to ISO format with timezone
      const dateOfBirthISO = signupData.dateOfBirth
        ? new Date(signupData.dateOfBirth).toISOString()
        : "";

      const registerData = {
        fullName: signupData.fullName,
        email: signupData.email,
        phoneNumber: signupData.phoneNumber,
        dateOfBirth: dateOfBirthISO,
        gender: genderValue,
        passwordHash: signupData.password,
        role: selectedRole, // "Candidate" or "Recruiter" (uppercase first letter)
        captchaToken: captchaToken || "",
      };

      console.log("Sending registration data:", registerData);

      // Call API to register
      const response = await authService.register(registerData);

      if (!response.success) {
        notifyError(response.message);
        setIsLoading(false);
        return; // Stop here - don't proceed to next step
      }

      // Auto login after successful registration
      console.log("📤 Auto login after registration...");
      const loginResponse = await authService.login({
        email: signupData.email,
        passwordHash: signupData.password,
        captchaToken: captchaToken || "",
      });

      if (!loginResponse.success || !loginResponse.data?.token) {
        // Registration succeeded but auto-login failed - redirect to login page
        notifySuccess("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
        sessionStorage.removeItem("signupData");
        sessionStorage.removeItem("signupCaptchaToken");
        navigate("/login");
        return;
      }

      console.log("✅ Auto login successful, token saved");

      // Clear sessionStorage
      sessionStorage.removeItem("signupData");
      sessionStorage.removeItem("signupCaptchaToken");

      // Store user info if provided
      if (loginResponse.data?.user) {
        localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
      }

      notifySuccess("Đăng ký tài khoản thành công!");

      // Redirect based on role
      if (selectedRole === "Recruiter") {
        navigate("/business-choice");
      } else {
        navigate("/onboarding");
      }
    } catch (err) {
      console.error("Error creating account:", err);
      notifyError(err);
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
