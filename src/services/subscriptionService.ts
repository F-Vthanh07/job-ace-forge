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
}

export const subscriptionService = new SubscriptionService();
