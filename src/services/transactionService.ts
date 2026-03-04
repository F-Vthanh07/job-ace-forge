/**
 * Transaction API Service
 * Handles payment transactions with PayOS
 */

import { API_CONFIG } from "../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface GetTransactionLinkRequest {
  planId: string;
  returnUrl: string;
  cancelUrl: string;
}

export interface TransactionLinkResponse {
  success: boolean;
  message?: string;
  paymentUrl?: string;
}

class TransactionService {
  /**
   * Get payment link from PayOS
   */
  async getTransactionLink(
    planId: string,
    returnUrl: string,
    cancelUrl: string
  ): Promise<TransactionLinkResponse> {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        console.error("❌ Auth token not found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      // Encode URLs
      const encodedReturnUrl = encodeURIComponent(returnUrl);
      const encodedCancelUrl = encodeURIComponent(cancelUrl);

      const url = `${API_BASE_URL}/Transaction/Get-Link-Transaciton?PlanId=${planId}&ReturnUrl=${encodedReturnUrl}&CancelUrl=${encodedCancelUrl}`;

      console.log("📤 Getting payment link:", {
        planId,
        returnUrl,
        cancelUrl,
      });

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "accept": "*/*",
        },
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("❌ API Error:", errorText);
        return {
          success: false,
          message: `Failed to get payment link: ${response.status}`,
        };
      }

      // The response is a payment URL string
      const paymentUrl = await response.text();
      console.log("✅ Payment URL received:", paymentUrl);

      // Check if it's a valid URL
      if (!paymentUrl?.startsWith("http")) {
        return {
          success: false,
          message: "Invalid payment URL received",
        };
      }

      return {
        success: true,
        message: "Payment link generated successfully",
        paymentUrl: paymentUrl,
      };
    } catch (error) {
      console.error("❌ Error getting payment link:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error. Please try again.",
      };
    }
  }
}

export const transactionService = new TransactionService();
