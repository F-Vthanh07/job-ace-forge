import { authService } from "./authService";
import { API_CONFIG } from "../config/api";
import { JobData } from "./jobService";

const API_BASE_URL = `${API_CONFIG.BASE_URL}/Application`;

export interface CreateApplicationRequest {
  postingResponse: JobData;
  candidateProfileId: string;
  cvUrl: string;
  coverLetter: string;
}

export interface ApplicationResponse {
  id: string;
  jobPostingId: string;
  candidateProfileId: string;
  candidateId: string;
  status: string; // "Pending", "Approved", "Rejected", etc.
  profilesSnapshot: string;
  cvUrl: string;
  matchScore: number;
  aiAnalysis: string;
  coverLetter: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
}

class ApplicationService {
  /**
   * Create a new job application
   */
  async createApplication(
    applicationData: CreateApplicationRequest
  ): Promise<ApiResponse<ApplicationResponse>> {
    try {
      const token = authService.getToken();
      if (!token) {
        console.error("❌ No authentication token found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log("📤 Creating job application for job:", applicationData.postingResponse.id);

      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Application created successfully:", data);
        return {
          success: true,
          data: data,
          message: "Application submitted successfully",
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
        
        console.error("❌ Failed to create application:", response.status, errorText || errorData);

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
            message: "Hệ thống AI đang quá tải, vui lòng thử lại vào thời điểm khác."
          };
        }

        return {
          success: false,
          message: errorData?.message || errorData?.error?.message || `Failed to submit application: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("❌ Error creating application:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to submit application",
      };
    }
  }

  /**
   * Get all applications by current candidate
   */
  async getMyApplications(): Promise<ApiResponse<ApplicationResponse[]>> {
    try {
      const token = authService.getToken();
      if (!token) {
        console.error("❌ No authentication token found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log("📤 Fetching candidate applications");

      const response = await fetch(`${API_BASE_URL}/candidate/my-applications`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Applications fetched successfully:", data);
        return {
          success: true,
          data: data,
          message: "Applications fetched successfully",
        };
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("❌ Failed to fetch applications:", response.status, errorData);
        return {
          success: false,
          message: errorData?.message || `Failed to fetch applications: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch applications",
      };
    }
  }

  /**
   * Get job applications by candidate ID
   */
  async getApplicationsByCandidateId(candidateId: string): Promise<ApiResponse<ApplicationResponse[]>> {
    try {
      const token = authService.getToken();
      if (!token) {
        console.error("❌ No authentication token found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log("📤 Fetching applications for candidate:", candidateId);

      const response = await fetch(`${API_BASE_URL}/Get_JobApplications_By_CandidateId/${candidateId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Applications fetched successfully:", data);
        return {
          success: true,
          data: data,
          message: "Applications fetched successfully",
        };
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("❌ Failed to fetch applications:", response.status, errorData);
        return {
          success: false,
          message: errorData?.message || `Failed to fetch applications: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch applications",
      };
    }
  }

  /**
   * Get application by ID
   */
  async getApplicationById(applicationId: string): Promise<ApiResponse<ApplicationResponse>> {
    try {
      const token = authService.getToken();
      if (!token) {
        console.error("❌ No authentication token found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log("📤 Fetching application:", applicationId);

      const response = await fetch(`${API_BASE_URL}/${applicationId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Application fetched successfully:", data);
        return {
          success: true,
          data: data,
          message: "Application fetched successfully",
        };
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("❌ Failed to fetch application:", response.status, errorData);
        return {
          success: false,
          message: errorData?.message || `Failed to fetch application: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("❌ Error fetching application:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch application",
      };
    }
  }

  /**
   * Get all job applications by job posting ID
   */
  async getApplicationsByJobPostingId(jobPostingId: string): Promise<ApiResponse<ApplicationResponse[]>> {
    try {
      const token = authService.getToken();
      if (!token) {
        console.error("❌ No authentication token found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log("📤 Fetching applications for job posting:", jobPostingId);

      const response = await fetch(`${API_BASE_URL}/Get_JobApplications_By_JobPostingId/${jobPostingId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Applications fetched successfully:", data);
        return {
          success: true,
          data: data,
          message: "Applications fetched successfully",
        };
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("❌ Failed to fetch applications:", response.status, errorData);
        return {
          success: false,
          message: errorData?.message || `Failed to fetch applications: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("❌ Error fetching applications:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to fetch applications",
      };
    }
  }

  /**
   * Update application status (e.g., when recruiter views the application)
   */
  async updateApplicationStatus(applicationId: string, status: string): Promise<ApiResponse<ApplicationResponse>> {
    try {
      const token = authService.getToken();
      if (!token) {
        console.error("❌ No authentication token found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log(`📤 Updating application ${applicationId} status to:`, status);

      const response = await fetch(`${API_BASE_URL}/update-status/${applicationId}?status=${status}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const text = await response.text();
        let data = null;
        try {
          if (text) data = JSON.parse(text);
        } catch (e) {
          console.log("Response was not JSON:", text);
        }
        
        console.log("✅ Application status updated successfully:", data || text);
        return {
          success: true,
          data: data,
          message: (!data && typeof text === 'string' && text.length > 0) ? text : "Application status updated successfully",
        };
      } else {
        const errorData = await response.json().catch(() => null);
        console.error("❌ Failed to update application status:", response.status, errorData);
        return {
          success: false,
          message: errorData?.message || `Failed to update status: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("❌ Error updating application status:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update application status",
      };
    }
  }

  /**
   * Analyze AI result for a specific application to get match score and analysis
   */
  async analyzeAIResult(applicationId: string): Promise<ApiResponse<ApplicationResponse>> {
    try {
      const token = authService.getToken();
      if (!token) {
        return {
          success: false,
          message: "Authentication required.",
        };
      }

      console.log(`📤 Requesting AI analysis for application: ${applicationId}`);

      const response = await fetch(`${API_BASE_URL}/analyze-ai-result/${applicationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ AI analysis completed successfully:", data);
        return {
          success: true,
          data: data,
          message: "AI analysis completed successfully",
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

        console.error("❌ AI analysis failed:", response.status, errorText || errorData);

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
            message: "Hệ thống AI đang quá tải, vui lòng thử lại vào thời điểm khác."
          };
        }

        return {
          success: false,
          message: errorData?.message || errorData?.error?.message || `AI analysis failed: ${response.status}`,
        };
      }
    } catch (error) {
      console.error("❌ Error in AI analysis:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "AI analysis failed",
      };
    }
  }
}

export const applicationService = new ApplicationService();
