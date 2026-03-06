import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { notifyError, notifySuccess } from "@/utils/notification";
import { transactionService } from "@/services/transactionService";

interface PlanInfo {
  id: string;
  name: string;
  price: number;
  durationInDays: number;
  features: string;
}

const PaymentDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const planInfo = location.state?.plan as PlanInfo | undefined;

  const [isProcessing, setIsProcessing] = useState(false);

  // Redirect if no plan info
  if (!planInfo) {
    navigate("/premium");
    return null;
  }

  const formatPrice = (price: number) => {
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K`;
    }
    return `${Math.round(price)}K`;
  };

  const getDurationLabel = (days: number) => {
    if (days === 30) return "Monthly";
    if (days === 365) return "Yearly";
    return `${days} days`;
  };

  const handlePayment = async () => {
    setIsProcessing(true);

    try {
      // Get current domain for return URLs
      const baseUrl = globalThis.location.origin;
      const returnUrl = `${baseUrl}/payment-success`;
      const cancelUrl = `${baseUrl}/payment-failure`;

      console.log("🔄 Initiating payment for plan:", planInfo.id);

      const response = await transactionService.getTransactionLink(
        planInfo.id,
        returnUrl,
        cancelUrl
      );

      if (response.success && response.paymentUrl) {
        notifySuccess({
          title: "Redirecting to Payment",
          description: "You will be redirected to PayOS for payment"
        });

        // Save planId to sessionStorage for later use in payment success page
        sessionStorage.setItem('selectedPlanId', planInfo.id);
        sessionStorage.setItem('selectedPlanName', planInfo.name);
        sessionStorage.setItem('selectedPlanPrice', formatPrice(planInfo.price));

        // Redirect to PayOS payment page
        globalThis.location.href = response.paymentUrl;
      } else {
        notifyError({
          title: "Payment Error",
          description: response.message || "Failed to initialize payment"
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      notifyError({
        title: "Payment Error",
        description: "An error occurred while processing your payment"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const features = planInfo.features.split(',').map(f => f.trim()).filter(f => f.length > 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/premium")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Plans
          </Button>

          <h1 className="text-4xl font-bold mb-8 text-center">Complete Your Purchase</h1>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Left Column - Order Summary */}
            <div className="space-y-6">
              {/* Order Summary */}
              <Card className="p-6 border-primary/20">
                <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <h3 className="font-bold text-lg mb-2">{planInfo.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {getDurationLabel(planInfo.durationInDays)} Subscription
                    </p>
                    <div className="space-y-2">
                      {features.slice(0, 4).map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                      {features.length > 4 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          +{features.length - 4} more features
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 pt-3 border-t">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-semibold">{formatPrice(planInfo.price)} VND</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Tax (0%)</span>
                      <span>0 VND</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between text-xl font-bold">
                        <span>Total</span>
                        <span className="text-primary">{formatPrice(planInfo.price)} VND</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Billed {getDurationLabel(planInfo.durationInDays).toLowerCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Security Notice */}
              <Card className="p-4 bg-muted/50">
                <div className="flex items-start gap-3">
                  <Lock className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-semibold mb-1">Secure Payment</p>
                    <p className="text-muted-foreground">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Column - Payment Info */}
            <div className="space-y-6">
              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center gap-3 mb-2">
                      <CreditCard className="h-6 w-6 text-primary" />
                      <h3 className="font-semibold text-lg">PayOS Payment Gateway</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      You will be redirected to PayOS secure payment page to complete your purchase.
                    </p>
                  </div>

                  <div className="space-y-2 text-sm">
                    <p className="font-semibold">Supported Payment Methods:</p>
                    <ul className="space-y-1 text-muted-foreground ml-4">
                      <li>• Credit/Debit Cards (Visa, Mastercard, JCB)</li>
                      <li>• Bank Transfer</li>
                      <li>• QR Code Payment</li>
                      <li>• E-Wallets (Momo, ZaloPay, VNPay)</li>
                    </ul>
                  </div>
                </div>
              </Card>

              {/* Submit Button */}
              <Button 
                size="lg" 
                className="w-full gradient-primary shadow-glow"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Redirecting to Payment...
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 mr-2" />
                    Proceed to Secure Payment
                  </>
                )}
              </Button>

              {/* Payment Info */}
              <Card className="p-4 bg-muted/50">
                <div className="text-sm space-y-2">
                  <p className="font-semibold text-center">🔒 100% Secure Payment</p>
                  <p className="text-muted-foreground text-center text-xs">
                    Your payment is protected by PayOS secure payment gateway with SSL encryption and PCI DSS compliance.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentDetail;
