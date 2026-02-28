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

      if (response.ok) {
        const data = await response.json();
        console.log("✅ AI CV review received:", data);
        return {
          success: true,
          data: data,
          message: "CV review completed successfully",
        };
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("❌ Failed to get CV review:", response.status, errorData);
        return {
          success: false,
          message: errorData?.message || `Failed to get CV review: ${response.status}`,
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
