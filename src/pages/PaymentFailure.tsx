import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, AlertTriangle, ArrowLeft, RefreshCcw } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentFailure = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const stateData = location.state as {
    transactionId?: string;
    planName?: string;
    amount?: string;
    date?: string;
    errorMessage?: string;
  } | undefined;

  // Use state data or default values
  const failureDetails = {
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
    errorMessage: stateData?.errorMessage || "Payment declined by your bank",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Failure Icon Animation */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-destructive/10 mb-6 animate-in zoom-in duration-500">
              <XCircle className="h-12 w-12 text-destructive" strokeWidth={2} />
            </div>
            
            <div className="inline-flex items-center gap-2 bg-destructive/10 px-4 py-2 rounded-full mb-4">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Payment Failed</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">Payment Unsuccessful</h1>
            <p className="text-xl text-muted-foreground">
              We couldn't process your payment
            </p>
          </div>

          {/* Failure Details Card */}
          <Card className="p-8 mb-6 border-destructive/20 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Transaction Details</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono font-semibold text-sm">{failureDetails.transactionId}</span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-semibold">{failureDetails.planName}</span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold text-lg">{failureDetails.amount}</span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="text-muted-foreground">Date & Time</span>
                <span className="font-medium">{failureDetails.date}</span>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Error</span>
                <span className="font-medium text-destructive text-right max-w-[60%]">
                  {failureDetails.errorMessage}
                </span>
              </div>
            </div>

            {/* Error Message */}
            <div className="mt-6 p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <p className="text-sm text-center">
                <span className="font-semibold">Your payment was not processed.</span>
                <br />
                Please check your payment details and try again.
              </p>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              className="flex-1 gradient-primary shadow-glow"
              onClick={() => navigate("/premium")}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={() => navigate("/premium")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Button>
          </div>

          {/* Troubleshooting Tips */}
          <Card className="p-6 mt-6 bg-muted/50">
            <h3 className="font-semibold mb-3 text-center">Common Issues & Solutions</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Insufficient Funds:</span>
                  <span className="ml-1">Please ensure your account has enough balance</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Card Declined:</span>
                  <span className="ml-1">Contact your bank to authorize online transactions</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Incorrect Details:</span>
                  <span className="ml-1">Verify your card number, expiry date, and CVV</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-warning mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-medium text-foreground">Network Issues:</span>
                  <span className="ml-1">Check your internet connection and try again</span>
                </div>
              </li>
            </ul>
            
            <div className="mt-4 pt-4 border-t text-center">
              <p className="text-sm">
                Need help? Contact our support team at{" "}
                <a href="mailto:support@jobaceforge.com" className="text-primary hover:underline font-medium">
                  support@jobaceforge.com
                </a>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
