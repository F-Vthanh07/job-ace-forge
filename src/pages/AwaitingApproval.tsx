import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, AlertCircle } from "lucide-react";

type ApprovalStatus = "pending" | "approved" | "rejected";

const AwaitingApproval = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<ApprovalStatus>("pending");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // In production, poll the server for approval status
    // For now, simulate the pending state
    const checkApprovalStatus = async () => {
      try {
        // TODO: Call API to check company approval status
        // const response = await companyService.getApprovalStatus();
        // setStatus(response.status);
        // setMessage(response.message);
        
        console.log("Checking approval status...");
      } catch (error) {
        console.error("Error checking approval status:", error);
      }
    };

    // Check status every 5 seconds
    const interval = setInterval(checkApprovalStatus, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusContent = () => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          title: "Pending Admin Approval",
          description:
            "Your company registration has been submitted successfully. Our admin team is reviewing your information and will approve your account shortly.",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-200",
        };
      case "approved":
        return {
          icon: CheckCircle2,
          title: "Approved!",
          description:
            "Congratulations! Your company has been approved. You can now start posting job listings and managing candidates.",
          color: "text-green-600",
          bgColor: "bg-green-50",
          borderColor: "border-green-200",
        };
      case "rejected":
        return {
          icon: AlertCircle,
          title: "Registration Rejected",
          description: message || "Your company registration was rejected. Please review the information and try again.",
          color: "text-red-600",
          bgColor: "bg-red-50",
          borderColor: "border-red-200",
        };
      default:
        return {
          icon: Clock,
          title: "Loading...",
          description: "",
          color: "text-gray-600",
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200",
        };
    }
  };

  const content = getStatusContent();
  const StatusIcon = content.icon;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center space-y-6">
          <div className={`inline-flex items-center justify-center p-4 rounded-full ${content.bgColor}`}>
            <StatusIcon className={`h-12 w-12 ${content.color}`} />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
            <p className="text-muted-foreground">{content.description}</p>
          </div>

          {status === "pending" && (
            <div className={`p-4 rounded-lg border ${content.borderColor} ${content.bgColor}`}>
              <p className="text-sm font-medium text-muted-foreground">
                Estimated approval time: 24-48 hours
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                We'll send you an email notification once your account is approved.
              </p>
            </div>
          )}

          {status === "approved" && (
            <div className={`p-4 rounded-lg border ${content.borderColor} ${content.bgColor}`}>
              <p className="text-sm font-medium">Your account is ready to use!</p>
            </div>
          )}

          {status === "rejected" && (
            <div className={`p-4 rounded-lg border ${content.borderColor} ${content.bgColor}`}>
              <p className="text-sm font-medium">Please contact our support team for more information.</p>
            </div>
          )}

          <div className="space-y-3 pt-4">
            {status === "approved" && (
              <Button
                className="w-full gradient-primary shadow-glow"
                size="lg"
                onClick={() => navigate("/recruiter-dashboard")}
              >
                Go to Dashboard
              </Button>
            )}

            {status === "rejected" && (
              <Button
                className="w-full gradient-primary shadow-glow"
                size="lg"
                onClick={() => navigate("/business-choice")}
              >
                Try Again
              </Button>
            )}

            {status === "pending" && (
              <>
                <p className="text-xs text-muted-foreground">
                  You can close this page and we'll email you when your account is approved.
                </p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate("/login")}
                >
                  Back to Login
                </Button>
              </>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AwaitingApproval;
