/**
 * Company API Service
 * Handles communication with company-related endpoints
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export interface CompanyAddress {
  cityName: string;
  districtName: string;
  wardName: string;
}

export interface CompanyData {
  id: string;
  name: string;
  description: string;
  website: string;
  logoUrl: string;
  industry: string;
  size: number;
  address: CompanyAddress;
  taxCode: string;
  businessLicenseUrl: string;
  verificationStatus: string;
  createTime: string;
}

export interface CompaniesResponse {
  success: boolean;
  message: string;
  data?: CompanyData[];
}

class CompanyService {
  /**
   * Get all companies (Admin only)
   */
  async getAllCompanies(): Promise<CompaniesResponse> {
    try {
      const token = localStorage.getItem("authToken");
      console.log("📤 Fetching all companies...");

      const response = await fetch(`${API_BASE_URL}/Company/Get_All_Companies`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error("❌ Failed to fetch companies:", response.status);
        return {
          success: false,
          message: `Failed to fetch companies: ${response.status}`,
        };
      }

      const data = await response.json();
      console.log("📥 Companies fetched:", data);

      // If response is an array, wrap it
      if (Array.isArray(data)) {
        return {
          success: true,
          message: "Companies fetched successfully",
          data: data as CompanyData[],
        };
      }

      // If response has data property
      return {
        success: true,
        message: "Companies fetched successfully",
        data: (data.data || data) as CompanyData[],
      };
    } catch (error) {
      console.error("❌ Error fetching companies:", error);
      return {
        success: false,
        message: "Lỗi kết nối. Vui lòng thử lại.",
      };
    }
  }

  /**
   * Get company by ID
   */
  async getCompanyById(companyId: string): Promise<{ success: boolean; message: string; data?: CompanyData }> {
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/Company/Get_Company_By_Id/${companyId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return {
          success: false,
          message: `Failed to fetch company: ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        message: "Company fetched successfully",
        data: data as CompanyData,
      };
    } catch (error) {
      console.error("❌ Error fetching company:", error);
      return {
        success: false,
        message: "Lỗi kết nối. Vui lòng thử lại.",
      };
    }
  }

  /**
   * Get company by recruiter ID
   * @param recruiterId - Account ID of the recruiter
   */
  async getCompanyByRecruiterId(recruiterId: string): Promise<{ success: boolean; message: string; data?: CompanyData }> {
    try {
      const token = localStorage.getItem("authToken");
      console.log(`📤 Fetching company for recruiter: ${recruiterId}`);

      const response = await fetch(
        `${API_BASE_URL}/Company/get-company-by-recruiterId/${recruiterId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("❌ Failed to fetch company by recruiter ID:", response.status);
        return {
          success: false,
          message: `Failed to fetch company: ${response.status}`,
        };
      }

      const data = await response.json();
      console.log("✅ Company fetched successfully:", data);

      // Save company data to localStorage
      this.saveCompanyToLocalStorage(data);

      return {
        success: true,
        message: "Company fetched successfully",
        data: data as CompanyData,
      };
    } catch (error) {
      console.error("❌ Error fetching company by recruiter ID:", error);
      return {
        success: false,
        message: "Lỗi kết nối. Vui lòng thử lại.",
      };
    }
  }

  /**
   * Verify company (Admin only)
   * @param companyId - Company ID
   * @param verificationStatus - Status: Verified, Pending, or Rejected
   * @param notiMess - Notification message (required if status is Rejected)
   */
  async verifyCompany(
    companyId: string,
    verificationStatus: string,
    notiMess: string = ""
  ): Promise<{ success: boolean; message: string }> {
    try {
      const token = localStorage.getItem("authToken");
      console.log(`📤 Verifying company ${companyId} with status: ${verificationStatus}`);

      const response = await fetch(
        `${API_BASE_URL}/Company/Verify_Company/${companyId}?verificationStatus=${verificationStatus}&mess=${encodeURIComponent(notiMess)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("❌ Failed to verify company:", response.status);
        return {
          success: false,
          message: `Failed to verify company: ${response.status}`,
        };
      }

      console.log("✅ Company verification updated successfully");
      return {
        success: true,
        message: "Company verification updated successfully",
      };
    } catch (error) {
      console.error("❌ Error verifying company:", error);
      return {
        success: false,
        message: "Lỗi kết nối. Vui lòng thử lại.",
      };
    }
  }

  /**
   * Save company data to localStorage
   */
  saveCompanyToLocalStorage(companyData: CompanyData): void {
    try {
      localStorage.setItem("recruiterCompany", JSON.stringify(companyData));
      console.log("💾 Company data saved to localStorage");
    } catch (error) {
      console.error("❌ Error saving company to localStorage:", error);
    }
  }

  /**
   * Get company data from localStorage
   */
  getCompanyFromLocalStorage(): CompanyData | null {
    try {
      const companyData = localStorage.getItem("recruiterCompany");
      if (companyData) {
        return JSON.parse(companyData) as CompanyData;
      }
      return null;
    } catch (error) {
      console.error("❌ Error getting company from localStorage:", error);
      return null;
    }
  }

  /**
   * Clear company data from localStorage
   */
  clearCompanyFromLocalStorage(): void {
    try {
      localStorage.removeItem("recruiterCompany");
      console.log("🗑️ Company data cleared from localStorage");
    } catch (error) {
      console.error("❌ Error clearing company from localStorage:", error);
    }
  }
}

export const companyService = new CompanyService();
