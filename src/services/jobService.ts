/**
 * Job Posting API Service
 * Handles communication with job posting endpoints
 */

import { API_CONFIG } from "../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface JobPostingRequest {
  title: string;
  jobType: string; // "Full-time", "Part-time", "Contract", etc.
  quantity: number;
  minSalary: number;
  maxSalary: number;
  currency: string; // "VND", "USD", etc.
  isNegotiable: boolean;
  description: string;
  requirement: string;
  benefits: string;
  yearsOfExperience: number;
  expiryDate: string; // Format: "YYYY-MM-DD"
  isActive: boolean;
}

export interface JobPostingResponse {
  success: boolean;
  message: string;
  data?: {
    id: string;
    title: string;
    status: string;
  };
}

export interface JobData {
  id: string;
  recruiterId: string;
  companyId: string;
  companyName: string;
  recruiterName: string;
  title: string;
  jobType: string;
  quantity: number;
  minSalary: number;
  maxSalary: number;
  currency: string;
  isNegotiable: boolean;
  description: string;
  requirement: string;
  benefits: string;
  yearsOfExperience: number;
  expiryDate: string;
  isActive: boolean;
  viewCount: number;
  createTime: string;
  updateTime: string;
  address?: {
    cityName: string;
    districtName: string;
    wardName: string;
  };
}

export interface JobListResponse {
  success: boolean;
  message: string;
  data?: JobData[];
}

class JobService {
  /**
   * Get all active jobs (public endpoint - no authentication required)
   */
  async getAllJobs(): Promise<JobListResponse> {
    try {
      console.log("📤 Fetching all active jobs...");

      const response = await fetch(`${API_BASE_URL}/JobPosting/all`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorMessage = `Failed to fetch jobs: ${response.status}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("❌ API Error details:", errorData);
            errorMessage = errorData.message || errorData.title || errorMessage;
          } else {
            const errorText = await response.text();
            console.error("❌ API Error text:", errorText);
            if (errorText) errorMessage = errorText;
          }
        } catch (parseError) {
          console.error("❌ Error parsing error response:", parseError);
        }

        return {
          success: false,
          message: errorMessage,
        };
      }

      const result = await response.json();
      console.log("✅ All jobs fetched successfully, count:", result?.length || 0);

      // API returns array directly
      if (Array.isArray(result)) {
        return {
          success: true,
          message: "Jobs fetched successfully",
          data: result as JobData[],
        };
      }

      return {
        success: true,
        message: "Jobs fetched successfully",
        data: (result.data || result) as JobData[],
      };
    } catch (error) {
      console.error("❌ Error fetching all jobs:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  /**
   * Get job by ID (public endpoint - no authentication required)
   */
  async getJobById(jobId: string): Promise<{
    success: boolean;
    message: string;
    data?: JobData;
  }> {
    try {
      console.log(`📤 Fetching job detail for ID: ${jobId}`);

      const response = await fetch(`${API_BASE_URL}/JobPosting/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorMessage = `Failed to fetch job: ${response.status}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("❌ API Error details:", errorData);
            errorMessage = errorData.message || errorData.title || errorMessage;
          } else {
            const errorText = await response.text();
            console.error("❌ API Error text:", errorText);
            if (errorText) errorMessage = errorText;
          }
        } catch (parseError) {
          console.error("❌ Error parsing error response:", parseError);
        }

        return {
          success: false,
          message: errorMessage,
        };
      }

      const result = await response.json();
      console.log("✅ Job detail fetched successfully:", result);

      return {
        success: true,
        message: "Job fetched successfully",
        data: result as JobData,
      };
    } catch (error) {
      console.error("❌ Error fetching job detail:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  /**
   * Create a new job posting
   */
  async createJobPosting(data: JobPostingRequest): Promise<JobPostingResponse> {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        console.error("❌ Auth token not found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log("📤 Creating job posting:", {
        title: data.title,
        jobType: data.jobType,
        expiryDate: data.expiryDate,
      });

      const response = await fetch(`${API_BASE_URL}/JobPosting/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorMessage = `Failed to create job posting: ${response.status}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("❌ API Error details:", errorData);
            errorMessage = errorData.message || errorData.title || errorMessage;
          } else {
            const errorText = await response.text();
            console.error("❌ API Error text:", errorText);
            if (errorText) errorMessage = errorText;
          }
        } catch (parseError) {
          console.error("❌ Error parsing error response:", parseError);
        }

        return {
          success: false,
          message: errorMessage,
        };
      }

      const result = await response.json();
      console.log("✅ Job posting created successfully:", result);

      return {
        success: true,
        message: "Job posting created successfully",
        data: result,
      };
    } catch (error) {
      console.error("❌ Error creating job posting:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  /**
   * Get all jobs by company ID
   */
  async getJobsByCompanyId(companyId: string): Promise<JobListResponse> {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        console.error("❌ Auth token not found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log(`📤 Fetching jobs for company: ${companyId}`);

      const response = await fetch(`${API_BASE_URL}/JobPosting/company/${companyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorMessage = `Failed to fetch jobs: ${response.status}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("❌ API Error details:", errorData);
            errorMessage = errorData.message || errorData.title || errorMessage;
          } else {
            const errorText = await response.text();
            console.error("❌ API Error text:", errorText);
            if (errorText) errorMessage = errorText;
          }
        } catch (parseError) {
          console.error("❌ Error parsing error response:", parseError);
        }

        return {
          success: false,
          message: errorMessage,
        };
      }

      const result = await response.json();
      console.log("✅ Jobs fetched successfully, count:", result?.length || 0);

      // If result is array, wrap it
      if (Array.isArray(result)) {
        return {
          success: true,
          message: "Jobs fetched successfully",
          data: result as JobData[],
        };
      }

      return {
        success: true,
        message: "Jobs fetched successfully",
        data: (result.data || result) as JobData[],
      };
    } catch (error) {
      console.error("❌ Error fetching jobs:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  /**
   * Update an existing job posting
   */
  async updateJobPosting(jobId: string, data: JobPostingRequest): Promise<JobPostingResponse> {
    try {
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        console.error("❌ Auth token not found");
        return {
          success: false,
          message: "Authentication required. Please login again.",
        };
      }

      console.log(`📤 Updating job posting ${jobId}:`, {
        title: data.title,
        isActive: data.isActive,
      });

      const response = await fetch(`${API_BASE_URL}/JobPosting/update/${jobId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      console.log(`📡 Response status: ${response.status} ${response.statusText}`);

      if (!response.ok) {
        let errorMessage = `Failed to update job posting: ${response.status}`;
        try {
          const contentType = response.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const errorData = await response.json();
            console.error("❌ API Error details:", errorData);
            errorMessage = errorData.message || errorData.title || errorMessage;
          } else {
            const errorText = await response.text();
            console.error("❌ API Error text:", errorText);
            if (errorText) errorMessage = errorText;
          }
        } catch (parseError) {
          console.error("❌ Error parsing error response:", parseError);
        }

        return {
          success: false,
          message: errorMessage,
        };
      }

      // Handle both JSON and text responses
      try {
        const contentType = response.headers.get("content-type");
        let result;
        
        if (contentType && contentType.includes("application/json")) {
          result = await response.json();
          console.log("✅ Job posting updated successfully:", result);
        } else {
          const textResult = await response.text();
          console.log("✅ Job posting updated successfully (text):", textResult);
          result = { message: textResult };
        }

        return {
          success: true,
          message: "Job posting updated successfully",
          data: result,
        };
      } catch (parseError) {
        console.log("✅ Job posting updated (no parseable response)");
        return {
          success: true,
          message: "Job posting updated successfully",
        };
      }
    } catch (error) {
      console.error("❌ Error updating job posting:", error);
      return {
        success: false,
        message: "Network error. Please try again.",
      };
    }
  }

  /**
   * Toggle job active status
   */
  async toggleJobStatus(job: JobData): Promise<JobPostingResponse> {
    const updateData: JobPostingRequest = {
      title: job.title,
      jobType: job.jobType,
      quantity: job.quantity,
      minSalary: job.minSalary,
      maxSalary: job.maxSalary,
      currency: job.currency,
      isNegotiable: job.isNegotiable,
      description: job.description,
      requirement: job.requirement,
      benefits: job.benefits,
      yearsOfExperience: job.yearsOfExperience,
      expiryDate: job.expiryDate,
      isActive: !job.isActive, // Toggle the status
    };

    return this.updateJobPosting(job.id, updateData);
  }
}

export const jobService = new JobService();
