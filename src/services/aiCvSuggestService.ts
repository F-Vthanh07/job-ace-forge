import { authService } from "./authService";
import { API_CONFIG } from "../config/api";

const API_BASE_URL = `${API_CONFIG.BASE_URL}/AiCvSuggest`;

export interface AICVSuggestion {
  section: string;
  itemIndex: number;
  subSection: string;
  originalText: string;
  suggestedText: string | null;
  reason: string;
}

export interface AICVReviewResponse {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: AICVSuggestion[];
}

export interface AICVReviewRequest {
  template: string;
  fullName: string;
  jobtitle: string;
  aboutMe: string;
  portfolioUrl: string;
  avatarUrl: string;
  desiredJobTitle: string;
  workLocation: string;
  jobType: string;
  achievements: string;
  contacts: string;
  isActive: boolean;
  candidtateId: string;
  skills: Array<{
    profileId?: string;
    skillName: string;
    proficiencyLevel: string;
  }>;
  workExperiences: Array<{
    profileId?: string;
    companyName: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  educations: Array<{
    profileId?: string;
    schoolName: string;
    degree: string;
    major: string;
    grade: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  statusCode?: number;
}

class AICVSuggestService {
  /**
   * Get AI suggestions for CV
   */
  async suggestCV(cvData: AICVReviewRequest): Promise<ApiResponse<AICVReviewResponse>> {
    try {
      const token = authService.getToken();
      if (!token) {
        console.error("❌ No authentication token found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log("📤 Sending CV for AI review:", cvData);

      const response = await fetch(`${API_BASE_URL}/suggest-cv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cvData),
      });

      console.log("📊 AI Review Response Status:", response.status);
      console.log("📊 AI Review Response OK:", response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log("✅ AI CV review received successfully:", data);
        console.log("✅ Response data keys:", Object.keys(data));
        return {
          success: true,
          data: data,
          message: "CV review completed successfully",
        };
      } else {
        const errorText = await response.text().catch(() => "");
        let errorData = null;
        try {
          if (errorText) {
            errorData = JSON.parse(errorText);
          }
        } catch (e) {
          // If it's not valid JSON, errorData remains null
        }

        console.error("❌ Failed to get CV review:");
        console.error("   Status Code:", response.status);
        console.error("   Error Text/Data:", errorText || errorData);

        // Handle Google AI 503 Overloaded or 429 Too Many Requests errors
        if (
          errorText.includes("ServiceUnavailable") ||
          errorText.includes("currently experiencing high demand") ||
          errorText.includes("RESOURCE_EXHAUSTED") ||
          errorText.includes("TooManyRequests") ||
          (errorData?.error?.status === "UNAVAILABLE") ||
          (errorData?.error?.status === "RESOURCE_EXHAUSTED") ||
          response.status === 429
        ) {
          return {
            success: false,
            message: "Hệ thống AI đang quá tải, vui lòng thử lại vào thời điểm khác.",
            statusCode: response.status,
          };
        }

        // Special handling for 403 Premium expired
        if (response.status === 403) {
          console.error("🚫 403 Forbidden - Premium required or expired");
          console.error("   Full Response:", errorData || errorText);
          return {
            success: false,
            message: "Premium subscription required",
            statusCode: 403,
          };
        }

        return {
          success: false,
          message: errorData?.message || errorData?.error?.message || `Failed to get CV review: ${response.status}`,
          statusCode: response.status,
        };
      }
    } catch (error) {
      console.error("❌ Error getting CV review:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to get CV review",
      };
    }
  }
}

export const aiCvSuggestService = new AICVSuggestService();
