import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state as {
    transactionId?: string;
    planName?: string;
    amount?: string;
    date?: string;
  } | undefined;

  // Use state data or default values
  const paymentDetails = {
    transactionId: stateData?.transactionId || "TXN-" + Date.now(),
    planName: stateData?.planName || "Premium Plan",
    amount: stateData?.amount || "699K VND",
    date: stateData?.date || new Date().toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon Animation */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-success/10 mb-6 animate-in zoom-in duration-500">
              <CheckCircle2 className="h-12 w-12 text-success" strokeWidth={2} />
            </div>
            
            <div className="inline-flex items-center gap-2 bg-success/10 px-4 py-2 rounded-full mb-4">
              <Sparkles className="h-4 w-4 text-success" />
              <span className="text-sm font-medium text-success">Payment Successful</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Thank You for Your Purchase!</h1>
            <p className="text-xl text-muted-foreground">
              Your payment has been processed successfully
            </p>
          </div>

          {/* Payment Details Card */}
          <Card className="p-8 mb-6 border-success/20 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono font-semibold text-sm">{paymentDetails.transactionId}</span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold">{paymentDetails.planName}</span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-semibold text-lg">{paymentDetails.amount}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="font-medium">{paymentDetails.date}</span>
              </div>
            </div>

            {/* Success Message */}
            <div className="mt-6 p-4 bg-success/10 rounded-lg border border-success/20">
              <p className="text-sm text-center">
                <span className="font-semibold">Your account has been upgraded!</span>
                <br />
                You now have access to all premium features.
              </p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="flex-1 gradient-primary shadow-glow"
              onClick={() => navigate("/dashboard")}
            >
              Go to Dashboard
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => globalThis.print()}
            >
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
          </div>

          {/* Additional Info */}
          <Card className="p-6 mt-6 bg-muted/50">
            <h3 className="font-semibold mb-3 text-center">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>A confirmation email has been sent to your registered email address</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>Your premium features are now active and ready to use</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                <span>You can view your subscription details in the account settings</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
