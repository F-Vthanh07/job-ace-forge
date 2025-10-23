import { Navbar } from "@/components/Navbar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download } from "lucide-react";

const EnterprisePayment = () => {
  const transactions = [
    { id: "INV-001", date: "2025-01-15", amount: "400,000 VND", status: "Paid" },
    { id: "INV-002", date: "2024-12-15", amount: "400,000 VND", status: "Paid" },
    { id: "INV-003", date: "2024-11-15", amount: "400,000 VND", status: "Paid" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Billing & Invoices</h1>

          {/* Current Plan */}
          <Card className="p-8 mb-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">Enterprise Plan</h2>
                <p className="text-muted-foreground">Your next billing date is February 15, 2025</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">400,000 VND</p>
                <p className="text-sm text-muted-foreground">per month</p>
              </div>
            </div>
            <Badge className="bg-success text-success-foreground">Active</Badge>
          </Card>

          {/* Payment History */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Payment History</h2>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border"
                >
                  <div className="flex items-center gap-4">
                    <div className="gradient-primary p-3 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold">{transaction.id}</p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-semibold">{transaction.amount}</p>
                    <Badge variant="secondary">{transaction.status}</Badge>
                    <Download className="h-5 w-5 text-muted-foreground cursor-pointer hover:text-primary" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EnterprisePayment;
