import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock } from "lucide-react";

const Payment = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Complete Your Purchase</h1>

          <div className="grid gap-6">
            {/* Order Summary */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Premium Plan (Monthly)</span>
                  <span className="font-semibold">150,000 VND</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Tax</span>
                  <span>0 VND</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>150,000 VND</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">~$6 USD per month</p>
                </div>
              </div>
            </Card>

            {/* Payment Method */}
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <div className="relative mt-1">
                    <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input 
                      id="expiry" 
                      placeholder="MM/YY"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input 
                      id="cvv" 
                      placeholder="123"
                      type="password"
                      maxLength={3}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="cardName">Cardholder Name</Label>
                  <Input 
                    id="cardName" 
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>
              </div>
            </Card>

            {/* Security Notice */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Submit Button */}
            <Button size="lg" className="w-full gradient-primary shadow-glow">
              Pay 150,000 VND
            </Button>

            {/* Alternative Payment Methods */}
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-3">Or pay with</p>
              <div className="flex justify-center gap-3">
                <Badge variant="outline" className="px-4 py-2">Bank Transfer</Badge>
                <Badge variant="outline" className="px-4 py-2">E-Wallet</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
