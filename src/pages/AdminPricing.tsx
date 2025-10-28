import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Edit, Plus } from "lucide-react";

const AdminPricing = () => {
  const candidatePlans = [
    {
      name: "Free",
      price: "$0",
      features: ["5 job applications/month", "Basic CV builder", "Standard support"]
    },
    {
      name: "Premium",
      price: "$19",
      features: ["Unlimited applications", "Advanced CV builder", "AI interview prep", "Priority support"]
    }
  ];

  const businessPlans = [
    {
      name: "Starter",
      price: "$99",
      features: ["5 job posts", "Basic matching", "Email support"]
    },
    {
      name: "Professional",
      price: "$299",
      features: ["20 job posts", "Advanced AI matching", "Priority support", "Analytics"]
    },
    {
      name: "Enterprise",
      price: "Custom",
      features: ["Unlimited posts", "Custom AI", "Dedicated manager", "API access"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="gradient-primary p-3 rounded-lg shadow-glow">
              <DollarSign className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Pricing Management</h1>
              <p className="text-muted-foreground">Configure subscription plans and pricing</p>
            </div>
          </div>
          <Button className="gradient-primary shadow-glow">
            <Plus className="h-4 w-4 mr-2" />
            Add New Plan
          </Button>
        </div>

        <Tabs defaultValue="candidate" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="candidate">Candidate Plans</TabsTrigger>
            <TabsTrigger value="business">Business Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="candidate" className="space-y-6">
            {candidatePlans.map((plan, index) => (
              <Card key={index} className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-3xl font-bold text-gradient">{plan.price}<span className="text-lg text-muted-foreground">/month</span></p>
                  </div>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`price-${index}`}>Monthly Price ($)</Label>
                      <Input 
                        id={`price-${index}`} 
                        defaultValue={plan.price.replace('$', '')}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`duration-${index}`}>Duration (days)</Label>
                      <Input 
                        id={`duration-${index}`} 
                        defaultValue="30"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Features</Label>
                    <ul className="mt-2 space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border">
                  <Button variant="outline">Cancel</Button>
                  <Button className="gradient-primary">Save Changes</Button>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            {businessPlans.map((plan, index) => (
              <Card key={index} className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-3xl font-bold text-gradient">
                      {plan.price}
                      {plan.price !== "Custom" && <span className="text-lg text-muted-foreground">/month</span>}
                    </p>
                  </div>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`biz-price-${index}`}>Monthly Price ($)</Label>
                      <Input 
                        id={`biz-price-${index}`} 
                        defaultValue={plan.price === "Custom" ? "0" : plan.price.replace('$', '')}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`biz-duration-${index}`}>Duration (days)</Label>
                      <Input 
                        id={`biz-duration-${index}`} 
                        defaultValue="30"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Features</Label>
                    <ul className="mt-2 space-y-2">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border">
                  <Button variant="outline">Cancel</Button>
                  <Button className="gradient-primary">Save Changes</Button>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPricing;
