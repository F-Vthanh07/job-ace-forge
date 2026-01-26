import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Building2, Plus, LogIn, Loader } from "lucide-react";

const BusinessChoice = () => {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState<"new" | "existing" | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    if (!selectedChoice) return;

    setIsLoading(true);
    
    try {
      if (selectedChoice === "new") {
        navigate("/register-new-company");
      } else {
        navigate("/join-existing-company");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="gradient-primary p-3 rounded-lg shadow-glow">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-gradient">Business Account</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Setup Your Company</h1>
          <p className="text-muted-foreground">Choose how you'd like to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Register New Company */}
          <div
            onClick={() => setSelectedChoice("new")}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedChoice === "new"
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className={`p-4 rounded-lg ${
                  selectedChoice === "new"
                    ? "gradient-primary"
                    : "bg-muted"
                }`}
              >
                <Plus
                  className={`h-8 w-8 ${
                    selectedChoice === "new" ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Register New Company</h2>
                <p className="text-sm text-muted-foreground">
                  Create a new company profile and start hiring
                </p>
              </div>
            </div>
          </div>

          {/* Join Existing Company */}
          <div
            onClick={() => setSelectedChoice("existing")}
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
              selectedChoice === "existing"
                ? "border-primary bg-primary/5"
                : "border-muted hover:border-primary/50"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className={`p-4 rounded-lg ${
                  selectedChoice === "existing"
                    ? "gradient-primary"
                    : "bg-muted"
                }`}
              >
                <LogIn
                  className={`h-8 w-8 ${
                    selectedChoice === "existing" ? "text-primary-foreground" : "text-muted-foreground"
                  }`}
                />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">Join Existing Company</h2>
                <p className="text-sm text-muted-foreground">
                  Join an existing company using an invite code
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
              onClick={() => navigate("/role-selection")}
              disabled={isLoading}
            >
              Back
            </Button>
            <Button
              className="w-full gradient-primary shadow-glow"
              onClick={handleConfirm}
              disabled={!selectedChoice || isLoading}
              size="lg"
            >
              {isLoading && <Loader className="w-4 h-4 mr-2 animate-spin" />}
              {isLoading ? "Loading..." : "Continue"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BusinessChoice;
