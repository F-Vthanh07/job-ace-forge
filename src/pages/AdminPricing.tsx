import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, Edit, Plus, Loader2, Ban, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { subscriptionService, CreateSubscriptionPlanRequest, SubscriptionPlan } from "@/services/subscriptionService";
import { notifyError, notifySuccess } from "@/utils/notification";

const AdminPricing = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [inactivatingPlanId, setInactivatingPlanId] = useState<string | null>(null);
  const [activatingPlanId, setActivatingPlanId] = useState<string | null>(null);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [formData, setFormData] = useState<CreateSubscriptionPlanRequest>({
    name: "",
    targetRole: "Candidate",
    price: 0,
    durationInDays: 30,
    status: "Active",
    features: "",
  });
  const [editFormData, setEditFormData] = useState<CreateSubscriptionPlanRequest>({
    name: "",
    targetRole: "Candidate",
    price: 0,
    durationInDays: 30,
    status: "Active",
    features: "",
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await subscriptionService.getAllPlans();
      
      console.log("📦 Fetched subscription plans:", response);
      
      if (response.success && response.data) {
        console.log("✅ Total plans:", response.data.length);
        console.log("📋 All plans:", response.data);
        console.log("👤 Candidate plans:", response.data.filter(p => p.targetRole === "Candidate"));
        console.log("💼 Recruiter plans:", response.data.filter(p => p.targetRole === "Recruiter"));
        setPlans(response.data);
      } else {
        notifyError({
          title: "Error",
          description: response.message || "Failed to fetch subscription plans"
        });
      }
    } catch (error) {
      console.error("Error fetching plans:", error);
      notifyError({
        title: "Error",
        description: "An error occurred while fetching plans"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateSubscriptionPlanRequest, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditPlan = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setEditFormData({
      name: plan.name,
      targetRole: plan.targetRole,
      price: plan.price,
      durationInDays: plan.durationInDays,
      status: plan.status || "Active",
      features: plan.features,
    });
    setIsEditDialogOpen(true);
  };

  const handleEditInputChange = (field: keyof CreateSubscriptionPlanRequest, value: string | number) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdatePlan = async () => {
    if (!editingPlan) return;

    try {
      // Validation
      if (!editFormData.features.trim()) {
        notifyError({
          title: "Validation Error",
          description: "Features are required"
        });
        return;
      }

      setIsUpdating(true);
      
      // Convert "Business" to "Recruiter" for API
      const apiData = {
        ...editFormData,
        targetRole: editFormData.targetRole === "Business" ? "Recruiter" : editFormData.targetRole
      };
      
      console.log("📤 Updating plan:", editingPlan.id);
      console.log("📝 Update data:", apiData);
      
      const response = await subscriptionService.updatePlan(editingPlan.id, apiData);
      
      console.log("📊 Update Plan Response:", response);
      console.log("✅ Response success:", response.success);
      console.log("💬 Response message:", response.message);
      console.log("📦 Response data:", response.data);

      if (response.success) {
        notifySuccess({
          title: "Success",
          description: "Subscription plan updated successfully"
        });
        setIsEditDialogOpen(false);
        setEditingPlan(null);
        // Refresh the plans list
        fetchPlans();
      } else {
        notifyError({
          title: "Error",
          description: response.message || "Failed to update subscription plan"
        });
      }
    } catch (error) {
      console.error("Error updating plan:", error);
      notifyError({
        title: "Error",
        description: "An error occurred while updating the plan"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInactivatePlan = async (planId: string, planName: string) => {
    try {
      setInactivatingPlanId(planId);
      
      const response = await subscriptionService.updateStatusToInactive(planId);

      if (response.success) {
        notifySuccess({
          title: "Success",
          description: `${planName} has been set to Inactive successfully`
        });
        // Refresh the plans list
        fetchPlans();
      } else {
        notifyError({
          title: "Error",
          description: response.message || "Failed to update plan status"
        });
      }
    } catch (error) {
      console.error("Error inactivating plan:", error);
      notifyError({
        title: "Error",
        description: "An error occurred while updating the plan status"
      });
    } finally {
      setInactivatingPlanId(null);
    }
  };

  const handleActivatePlan = async (plan: SubscriptionPlan) => {
    try {
      setActivatingPlanId(plan.id);
      
      // Use update API with status changed to Active
      const updateData = {
        name: plan.name,
        targetRole: plan.targetRole,
        price: plan.price,
        durationInDays: plan.durationInDays,
        status: "Active",
        features: plan.features,
      };
      
      console.log("🔄 Activating plan:", plan.id, plan.name);
      console.log("📝 Activate data:", updateData);
      
      const response = await subscriptionService.updatePlan(plan.id, updateData);
      
      console.log("📊 Activate Plan Response:", response);
      console.log("✅ Response success:", response.success);
      console.log("💬 Response message:", response.message);
      console.log("📦 Response data:", response.data);

      if (response.success) {
        notifySuccess({
          title: "Success",
          description: `${plan.name} has been activated successfully`
        });
        // Refresh the plans list
        fetchPlans();
      } else {
        notifyError({
          title: "Error",
          description: response.message || "Failed to activate plan"
        });
      }
    } catch (error) {
      console.error("Error activating plan:", error);
      notifyError({
        title: "Error",
        description: "An error occurred while activating the plan"
      });
    } finally {
      setActivatingPlanId(null);
    }
  };

  const handleCreatePlan = async () => {
    try {
      // Validation
      if (!formData.name.trim()) {
        notifyError({
          title: "Validation Error",
          description: "Plan name is required"
        });
        return;
      }

      if (!formData.features.trim()) {
        notifyError({
          title: "Validation Error",
          description: "Features are required"
        });
        return;
      }

      setIsCreating(true);
      
      // Convert "Business" to "Recruiter" for API
      const apiData = {
        ...formData,
        targetRole: formData.targetRole === "Business" ? "Recruiter" : formData.targetRole
      };
      
      const response = await subscriptionService.createSubscriptionPlan(apiData);

      if (response.success) {
        notifySuccess({
          title: "Success",
          description: response.message || "Subscription plan created successfully"
        });
        setIsDialogOpen(false);
        // Reset form
        setFormData({
          name: "",
          targetRole: "Candidate",
          price: 0,
          durationInDays: 30,
          status: "Active",
          features: "",
        });
        // Refresh the plans list
        fetchPlans();
      } else {
        notifyError({
          title: "Error",
          description: response.message || "Failed to create subscription plan"
        });
      }
    } catch (error) {
      console.error("Error creating plan:", error);
      notifyError({
        title: "Error",
        description: "An error occurred while creating the plan"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const candidatePlans = plans.filter(plan => {
    const role = (plan.targetRole || "").trim().toLowerCase();
    return role === "candidate";
  });
  
  const businessPlans = plans.filter(plan => {
    const role = (plan.targetRole || "").trim().toLowerCase();
    return role === "recruiter";
  });
  
  const formatPrice = (price: number) => {
    if (price === 0) return "Free";
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K VND`;
    }
    return `${Math.round(price)}K VND`;
  };
  
  const getDurationLabel = (days: number) => {
    if (days === 30) return 'month';
    if (days === 365) return 'year';
    return `${days} days`;
  };
  
  console.log("🎯 Candidate Plans Count:", candidatePlans.length);
  console.log("💼 Business Plans Count:", businessPlans.length);
  console.log("📊 Business Plans Data:", businessPlans);
  console.log("🔍 All targetRoles:", plans.map(p => ({ name: p.name, targetRole: p.targetRole, trimmed: (p.targetRole || "").trim(), lower: (p.targetRole || "").trim().toLowerCase() })));

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
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gradient-primary shadow-glow">
                <Plus className="h-4 w-4 mr-2" />
                Add New Plan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create Subscription Plan</DialogTitle>
                <DialogDescription>
                  Create a new subscription plan for candidates or businesses
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="target-role">Target Role *</Label>
                    <Select
                      value={formData.targetRole}
                      onValueChange={(value) => {
                        handleInputChange("targetRole", value);
                        // Reset plan name when target role changes
                        handleInputChange("name", "");
                      }}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Candidate">Candidate</SelectItem>
                        <SelectItem value="Business">Business</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="plan-name">Plan Name *</Label>
                    <Select
                      value={formData.name}
                      onValueChange={(value) => handleInputChange("name", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.targetRole === "Candidate" ? (
                          <>
                            <SelectItem value="Free">Free</SelectItem>
                            <SelectItem value="Plus">Plus</SelectItem>
                            <SelectItem value="Pro">Pro</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="Starter">Starter</SelectItem>
                            <SelectItem value="Professional">Professional</SelectItem>
                            <SelectItem value="Enterprise">Enterprise</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price (VND) *</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      step="1000"
                      placeholder="699000"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", Number(e.target.value))}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter price in VND (e.g., 699000 for 699K VND)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="duration">Duration (days) *</Label>
                    <Input
                      id="duration"
                      type="number"
                      min="1"
                      placeholder="30"
                      value={formData.durationInDays}
                      onChange={(e) => handleInputChange("durationInDays", Number(e.target.value))}
                      className="mt-1"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use 2147483647 for unlimited duration
                    </p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange("status", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="features">Features *</Label>
                  <Textarea
                    id="features"
                    placeholder="Enter features separated by commas&#10;e.g., 5 job applications/month, Basic CV builder, Standard support"
                    value={formData.features}
                    onChange={(e) => handleInputChange("features", e.target.value)}
                    rows={6}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Separate each feature with a comma. Each feature will be displayed as a bullet point.
                  </p>
                  {formData.features && (
                    <div className="mt-3 p-3 bg-secondary/50 rounded-lg">
                      <p className="text-xs font-medium mb-2">Preview:</p>
                      <ul className="space-y-1">
                        {formData.features.split(',').map((feature) => (
                          feature.trim() && (
                            <li key={feature.trim()} className="flex items-center gap-2 text-sm">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              {feature.trim()}
                            </li>
                          )
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isCreating}
                >
                  Cancel
                </Button>
                <Button
                  className="gradient-primary shadow-glow"
                  onClick={handleCreatePlan}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Plan
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        {/* Edit Plan Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Subscription Plan</DialogTitle>
              <DialogDescription>
                Update the subscription plan details
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-target-role">Target Role *</Label>
                  <Select
                    value={editFormData.targetRole}
                    onValueChange={(value) => handleEditInputChange("targetRole", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Candidate">Candidate</SelectItem>
                      <SelectItem value="Business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edit-plan-name">Plan Name *</Label>
                  <Select
                    value={editFormData.name}
                    onValueChange={(value) => handleEditInputChange("name", value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {editFormData.targetRole === "Candidate" ? (
                        <>
                          <SelectItem value="Free">Free</SelectItem>
                          <SelectItem value="Plus">Plus</SelectItem>
                          <SelectItem value="Pro">Pro</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="Starter">Starter</SelectItem>
                          <SelectItem value="Professional">Professional</SelectItem>
                          <SelectItem value="Enterprise">Enterprise</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-price">Price (VND) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    step="1000"
                    placeholder="699000"
                    value={editFormData.price}
                    onChange={(e) => handleEditInputChange("price", Number(e.target.value))}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter price in VND (e.g., 699000 for 699K VND)
                  </p>
                </div>

                <div>
                  <Label htmlFor="edit-duration">Duration (days) *</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    min="1"
                    placeholder="30"
                    value={editFormData.durationInDays}
                    onChange={(e) => handleEditInputChange("durationInDays", Number(e.target.value))}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Use 2147483647 for unlimited duration
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-status">Status *</Label>
                <Select
                  value={editFormData.status}
                  onValueChange={(value) => handleEditInputChange("status", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="edit-features">Features *</Label>
                <Textarea
                  id="edit-features"
                  placeholder="Enter features separated by commas&#10;e.g., 5 job applications/month, Basic CV builder, Standard support"
                  value={editFormData.features}
                  onChange={(e) => handleEditInputChange("features", e.target.value)}
                  rows={6}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate each feature with a comma. Each feature will be displayed as a bullet point.
                </p>
                {editFormData.features && (
                  <div className="mt-3 p-3 bg-secondary/50 rounded-lg">
                    <p className="text-xs font-medium mb-2">Preview:</p>
                    <ul className="space-y-1">
                      {editFormData.features.split(',').map((feature) => (
                        feature.trim() && (
                          <li key={feature.trim()} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            {feature.trim()}
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingPlan(null);
                }}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                className="gradient-primary shadow-glow"
                onClick={handleUpdatePlan}
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update Plan
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        <Tabs defaultValue="candidate" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="candidate">Candidate Plans</TabsTrigger>
            <TabsTrigger value="business">Business Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="candidate" className="space-y-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading plans...</span>
              </div>
            )}
            
            {!loading && candidatePlans.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No candidate plans found.</p>
              </Card>
            )}
            
            {!loading && candidatePlans.length > 0 && candidatePlans.map((plan) => (
              <Card key={plan.id} className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <Badge variant={plan.status === "Active" ? "default" : "destructive"}>
                        {plan.status || "Active"}
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold text-gradient">
                      {formatPrice(plan.price)}
                      <span className="text-lg text-muted-foreground">/{getDurationLabel(plan.durationInDays)}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => handleEditPlan(plan)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {plan.status === "Active" ? (
                      <Button 
                        variant="destructive"
                        onClick={() => handleInactivatePlan(plan.id, plan.name)}
                        disabled={inactivatingPlanId === plan.id}
                      >
                        {inactivatingPlanId === plan.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Ban className="h-4 w-4 mr-2" />
                            Inactive
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleActivatePlan(plan)}
                        disabled={activatingPlanId === plan.id}
                      >
                        {activatingPlanId === plan.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Active
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground">Price</Label>
                      <p className="text-lg font-semibold">{plan.price.toLocaleString()} VND</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Duration</Label>
                      <p className="text-lg font-semibold">{plan.durationInDays === 2147483647 ? 'Unlimited' : `${plan.durationInDays} days`}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Target Role</Label>
                      <p className="text-lg font-semibold">{plan.targetRole}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Features</Label>
                    <ul className="mt-2 space-y-2">
                      {plan.features.split(',').map((feature, i) => (
                        feature.trim() && (
                          <li key={`${plan.id}-feature-${i}`} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            {feature.trim()}
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="business" className="space-y-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading plans...</span>
              </div>
            )}
            
            {!loading && businessPlans.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">No business plans found.</p>
              </Card>
            )}
            
            {!loading && businessPlans.length > 0 && businessPlans.map((plan) => (
              <Card key={plan.id} className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold">{plan.name}</h3>
                      <Badge variant={plan.status === "Active" ? "default" : "destructive"}>
                        {plan.status || "Active"}
                      </Badge>
                    </div>
                    <p className="text-3xl font-bold text-gradient">
                      {formatPrice(plan.price)}
                      <span className="text-lg text-muted-foreground">/{getDurationLabel(plan.durationInDays)}</span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => handleEditPlan(plan)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    {plan.status === "Active" ? (
                      <Button 
                        variant="destructive"
                        onClick={() => handleInactivatePlan(plan.id, plan.name)}
                        disabled={inactivatingPlanId === plan.id}
                      >
                        {inactivatingPlanId === plan.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Ban className="h-4 w-4 mr-2" />
                            Inactive
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button 
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleActivatePlan(plan)}
                        disabled={activatingPlanId === plan.id}
                      >
                        {activatingPlanId === plan.id ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Active
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-muted-foreground">Price</Label>
                      <p className="text-lg font-semibold">{plan.price.toLocaleString()} VND</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Duration</Label>
                      <p className="text-lg font-semibold">{plan.durationInDays === 2147483647 ? 'Unlimited' : `${plan.durationInDays} days`}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Target Role</Label>
                      <p className="text-lg font-semibold">{plan.targetRole}</p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">Features</Label>
                    <ul className="mt-2 space-y-2">
                      {plan.features.split(',').map((feature, i) => (
                        feature.trim() && (
                          <li key={`${plan.id}-biz-feature-${i}`} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full bg-primary" />
                            {feature.trim()}
                          </li>
                        )
                      ))}
                    </ul>
                  </div>
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
