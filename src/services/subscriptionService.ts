/**
 * Subscription Plan API Service
 * Handles subscription plan management
 */

import { API_CONFIG } from "../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface CreateSubscriptionPlanRequest {
  name: string;
  targetRole: string; // "Candidate" or "Business"
  price: number;
  durationInDays: number;
  status: string; // "Active" or "Inactive"
  features: string; // Comma-separated features
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  targetRole: string;
  price: number;
  durationInDays: number;
  features: string;
  status?: string;
  createTime: string;
  updateTime: string;
  isDeleted: boolean;
}

export interface SubscriptionPlanResponse {
  success: boolean;
  message?: string;
  data?: {
    id?: string;
    name?: string;
  };
}

export interface GetAllPlansResponse {
  success: boolean;
  message?: string;
  data?: SubscriptionPlan[];
}

export interface UserSubscriptionPlan {
  userId: string;
  planId: string;
  status: string;
  subscriptionPlansName: string;
  subscriptionPlansTargetRole: string;
  subscriptionPlansPrice: number;
  subscriptionPlansDurationInDays: number;
  subscriptionPlansFeatures: string;
}

export interface GetUserSubscriptionResponse {
  success: boolean;
  message?: string;
  data?: UserSubscriptionPlan | null;
}

const USER_SUBSCRIPTION_STORAGE_KEY = "userSubscription";

class SubscriptionService {
  /**
   * Get all subscription plans
   */
  async getAllPlans(): Promise<GetAllPlansResponse> {
    try {
      console.log("📤 Fetching all subscription plans...");

      const response = await fetch(`${API_BASE_URL}/SubscriptionPlan/Get_All`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        return {
          success: false,
          message: `Failed to fetch subscription plans: ${response.status}`,
        };
      }

      const data = await response.json();
      console.log("✅ Subscription plans fetched successfully:", data);

      // Filter out deleted plans
      const activePlans = data.filter((plan: SubscriptionPlan) => !plan.isDeleted);

      return {
        success: true,
        message: "Subscription plans fetched successfully",
        data: activePlans,
      };
    } catch (error) {
      console.error("❌ Error fetching subscription plans:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error. Please try again.",
      };
    }
  }

  /**
   * Get current logged-in user's subscription plan
   */
  async getCurrentUserSubscription(): Promise<GetUserSubscriptionResponse> {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        return {
          success: false,
          message: "Authentication required. Please login again.",
          data: null,
        };
      }

      const response = await fetch(`${API_BASE_URL}/SubscriptionPlan/Get_Subcription_Plan_By_User`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ Failed to fetch user subscription:", errorText);
        return {
          success: false,
          message: `Failed to fetch user subscription: ${response.status}`,
          data: null,
        };
      }

      const result = (await response.json()) as UserSubscriptionPlan[];
      const currentSubscription = Array.isArray(result) && result.length > 0 ? result[0] : null;

      return {
        success: true,
        message: "User subscription fetched successfully",
        data: currentSubscription,
      };
    } catch (error) {
      console.error("❌ Error fetching user subscription:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error. Please try again.",
        data: null,
      };
    }
  }

  setStoredCurrentSubscription(subscription: UserSubscriptionPlan | null): void {
    if (!subscription) {
      localStorage.removeItem(USER_SUBSCRIPTION_STORAGE_KEY);
      return;
    }

    localStorage.setItem(USER_SUBSCRIPTION_STORAGE_KEY, JSON.stringify(subscription));
  }

  getStoredCurrentSubscription(): UserSubscriptionPlan | null {
    const subscriptionRaw = localStorage.getItem(USER_SUBSCRIPTION_STORAGE_KEY);
    if (!subscriptionRaw) return null;

    try {
      return JSON.parse(subscriptionRaw) as UserSubscriptionPlan;
    } catch {
      return null;
    }
  }

  /**
   * Create a new subscription plan
   * Requires admin authentication
   */
  async createSubscriptionPlan(data: CreateSubscriptionPlanRequest): Promise<SubscriptionPlanResponse> {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        console.error("❌ Auth token not found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log("📤 Creating subscription plan:", {
        name: data.name,
        targetRole: data.targetRole,
        price: data.price,
      });

      const response = await fetch(`${API_BASE_URL}/SubscriptionPlan/Create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      const responseText = await response.text();
      console.log("📥 Response text:", responseText);

      if (!response.ok) {
        let errorMessage = `Failed to create subscription plan: ${response.status}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.title || errorMessage;
        } catch {
          errorMessage = responseText || errorMessage;
        }

        return {
          success: false,
          message: errorMessage,
        };
      }

      // Try to parse JSON response
      try {
        const result = JSON.parse(responseText);
        console.log("✅ Subscription plan created successfully:", result);
        return {
          success: true,
          message: "Subscription plan created successfully",
          data: result,
        };
      } catch {
        // If response is plain text
        console.log("✅ Subscription plan created successfully");
        return {
          success: true,
          message: responseText || "Subscription plan created successfully",
        };
      }
    } catch (error) {
      console.error("❌ Error creating subscription plan:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error. Please try again.",
      };
    }
  }

  /**
   * Update subscription plan
   * Requires admin authentication
   */
  async updatePlan(planId: string, data: CreateSubscriptionPlanRequest): Promise<SubscriptionPlanResponse> {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        console.error("❌ Auth token not found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log("📤 Updating subscription plan:", planId, data);

      const response = await fetch(`${API_BASE_URL}/SubscriptionPlan/Update_${planId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:");
        console.error("   Status:", response.status);
        console.error("   Error Text:", errorText);
        return {
          success: false,
          message: `Failed to update subscription plan: ${response.status}`,
        };
      }

      const result = await response.json();
      console.log("✅ Plan updated successfully:");
      console.log("   Result:", result);
      console.log("   Result keys:", Object.keys(result));

      return {
        success: true,
        message: "Subscription plan updated successfully",
        data: result,
      };
    } catch (error) {
      console.error("❌ Error updating subscription plan:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error. Please try again.",
      };
    }
  }

  /**
   * Update subscription plan status to Inactive
   * Requires admin authentication
   */
  async updateStatusToInactive(planId: string): Promise<SubscriptionPlanResponse> {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        console.error("❌ Auth token not found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log("📤 Updating plan status to inactive:", planId);

      const response = await fetch(`${API_BASE_URL}/SubscriptionPlan/UpdateStatusToInactive_${planId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        return {
          success: false,
          message: `Failed to update plan status: ${response.status}`,
        };
      }

      const result = await response.json();
      console.log("✅ Response received:", result);

      if (result.isSuccess) {
        return {
          success: true,
          message: result.message || "Subscription plan status changed to Inactive successfully.",
        };
      } else {
        return {
          success: false,
          message: result.message || "Failed to update plan status",
        };
      }
    } catch (error) {
      console.error("❌ Error updating plan status:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error. Please try again.",
      };
    }
  }
}

export const subscriptionService = new SubscriptionService();
