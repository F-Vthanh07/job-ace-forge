import { authService } from "./authService";
import { API_CONFIG } from "../config/api";

const API_BASE_URL = `${API_CONFIG.BASE_URL}/CandidateCV`;

export interface CVSkill {
  id?: string;
  profileId?: string;
  skillName: string;
  proficiencyLevel: string;
}

export interface CVWorkExperience {
  id?: string;
  profileId?: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CVEducation {
  id?: string;
  profileId?: string;
  schoolName: string;
  degree: string;
  major: string;
  grade: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CVData {
  id?: string;
  fullName: string;
  jobtitle: string;
  aboutMe: string;
  portfolioUrl?: string;
  avatarUrl?: string;
  desiredJobTitle: string;
  workLocation: string;
  jobType: string;
  achievements?: string;
  contacts: string;
  isActive: boolean;
  candidateId: string;
  template: string;
  skills: CVSkill[];
  workExperiences: CVWorkExperience[];
  educations: CVEducation[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

class CVService {
  /**
   * Create a new CV
   */
  async createCV(cvData: CVData): Promise<ApiResponse<CVData>> {
    try {
      const token = authService.getToken();
      if (!token) {
        console.error("❌ No authentication token found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log("📤 Creating CV for candidate:", cvData.candidateId);

      const response = await fetch(`${API_BASE_URL}/create-cv`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cvData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ CV created successfully:", data);
        return {
          success: true,
          data: data,
          message: "CV created successfully",
        };
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("❌ Failed to create CV:", response.status, errorData);
        return {
          success: false,
          message: errorData?.message || `Failed to create CV: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("❌ Error creating CV:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to create CV",
      };
    }
  }

  /**
   * Get all CVs by candidate (current logged in user)
   */
  async getAllCVsByCandidate(): Promise<ApiResponse<CVData[]>> {
    try {
      const token = authService.getToken();
      if (!token) {
        console.error("❌ No authentication token found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log("📤 Fetching all CVs for current candidate");

      const response = await fetch(`${API_BASE_URL}/get-all-cvs-by-candidate`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ CVs fetched successfully:", data);
        return {
          success: true,
          data: data,
          message: "CVs fetched successfully",
        };
      } else if (response.status === 400) {
        // Người dùng chưa có CV
        console.log("ℹ️ User has no CVs yet (400)");
        return {
          success: true,
          data: [],
          message: "You don't have any CVs yet. Create your first CV to get started!",
        };
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("❌ Failed to fetch CVs:", response.status, errorData);
        return {
          success: false,
          message: errorData?.message || `Failed to fetch CVs: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("❌ Error fetching CVs:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch CVs",
      };
    }
  }
}

export const cvService = new CVService();
