import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Building2, Loader2 } from "lucide-react";
import { notifyError, notifySuccess, notifyWarning } from "@/utils/notification";

const JoinExistingCompany = () => {
  const navigate = useNavigate();
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);

  const handleJoinCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate invite code
      if (!inviteCode.trim()) {
        notifyWarning("Vui lòng nhập mã mời.");
        setLoading(false);
        return;
      }

      // TODO: Call API to verify invite code and join company
      // const response = await companyService.joinCompanyWithInviteCode(inviteCode);

      // For now, navigate to awaiting approval
      // In production, store company info and verify the code with backend
      sessionStorage.setItem("inviteCode", inviteCode);

      notifySuccess("Đã gửi yêu cầu tham gia công ty!");
      navigate("/awaiting-approval");
    } catch (err) {
      console.error("Error joining company:", err);
      notifyError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="gradient-primary p-3 rounded-lg shadow-glow">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-2xl text-gradient">Business Account</span>
          </div>
          <h1 className="text-3xl font-bold mb-2">Join Existing Company</h1>
          <p className="text-muted-foreground">Enter your invite code to join your company</p>
        </div>

        <form className="space-y-6" onSubmit={handleJoinCompany}>
          <div>
            <Label htmlFor="inviteCode">Invite Code *</Label>
            <Input
              id="inviteCode"
              placeholder="Enter your invite code"
              className="mt-1 font-mono text-center text-lg tracking-widest"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
              disabled={loading}
              required
            />
            <p className="text-xs text-muted-foreground mt-2">
              Your invite code was sent to your email by your company administrator
            </p>
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary shadow-glow"
            size="lg"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Verifying..." : "Join Company"}
          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => navigate("/business-choice")}
            disabled={loading}
          >
            Back
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default JoinExistingCompany;
