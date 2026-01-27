/**
 * Authentication API Service
 * Handles communication with the C# backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Cloudflare Turnstile Configuration
// Use environment variable or fallback to default key
const TURNSTILE_SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAACNx3IfFD1Btqrb3";

// Type definitions for Turnstile
declare global {
  interface Window {
    turnstile: {
      render: (
        selector: string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "timeout-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
      getResponse: (widgetId?: string) => string | undefined;
    };
  }
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  passwordHash: string;
  role: string;
  captchaToken?: string;
}

export interface LoginRequest {
  email: string;
  passwordHash: string;
  captchaToken?: string;
}

export interface CompanyRegisterRequest {
  email: string;
  passwordHash: string;
  captchaToken: string;
}

export interface AddressRequest {
  street?: string;
  cityCode: string;
  districtCode: string;
  wardCode: string;
}

export interface CompanyRegistrationRequest {
  name: string;
  description?: string;
  website?: string;
  logoUrl?: string;
  industry?: string;
  size?: number;
  address: AddressRequest;
  taxCode: string;
  businessLicenseUrl: string;
}

export interface JoinCompanyRequest {
  inviteCode: string;
}

export interface CompanyResponse {
  success: boolean;
  message: string;
  data?: {
    companyId: string;
    name: string;
    status: string;
  };
}

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  role: string;
  createTime: string;
  updateTime: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    accountId: string;
    user: UserData;
  };
}

class AuthService {
  private turnstileWidgetId: string | null = null;

  /**
   * Initialize Turnstile script
   */
  async initTurnstile(): Promise<void> {
    return new Promise((resolve) => {
      if (window.turnstile) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  /**
   * Render Turnstile widget
   */
  async renderTurnstile(containerId: string): Promise<void> {
    await this.initTurnstile();
    try {
      this.turnstileWidgetId = window.turnstile.render(`#${containerId}`, {
        sitekey: TURNSTILE_SITE_KEY,
        callback: (token: string) => {
          console.log("✅ Turnstile token generated:", token);
        },
        "error-callback": () => {
          console.error("❌ Turnstile error");
        },
        "timeout-callback": () => {
          console.warn("⏱️ Turnstile timeout");
        },
      });
      console.log("✅ Turnstile widget rendered, ID:", this.turnstileWidgetId);
    } catch (error) {
      console.error("❌ Failed to render Turnstile:", error);
    }
  }

  /**
   * Get Turnstile token
   */
  getTurnstileToken(): string | undefined {
    if (!window.turnstile) return undefined;
    return window.turnstile.getResponse(this.turnstileWidgetId || undefined);
  }

  /**
   * Reset Turnstile widget
   */
  resetTurnstile(): void {
    if (window.turnstile && this.turnstileWidgetId) {
      window.turnstile.reset(this.turnstileWidgetId);
    }
  }

  /**
   * Remove Turnstile widget
   */
  removeTurnstile(): void {
    if (window.turnstile && this.turnstileWidgetId) {
      window.turnstile.remove(this.turnstileWidgetId);
      this.turnstileWidgetId = null;
    }
  }
  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      console.log("📤 Sending registration request:", data);
      const response = await fetch(`${API_BASE_URL}/Auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Get response text first
      const responseText = await response.text();
      console.log("📥 Response status:", response.status);
      console.log("📥 Response text:", responseText);

      // Try to parse as JSON, if it fails, treat as plain text
      let result: Record<string, unknown> = {};
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        // If response is plain text, wrap it
        result = {
          success: response.ok,
          message: responseText,
        };
      }

      if (!response.ok) {
        // Extract detailed error message from backend
        const errorMessage = String(result.message || result.title || responseText || "Đăng ký không thành công.");
        console.error("❌ Registration failed:", errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      }

      // Save token if returned by backend
      const resultData = result.data as Record<string, unknown> | undefined;
      if (resultData && typeof resultData === "object" && "token" in resultData && typeof resultData.token === "string") {
        localStorage.setItem("authToken", resultData.token);
        console.log("✅ Token saved after registration");
      }

      return {
        success: true,
        message: String(result.message) || "Đăng ký thành công.",
        data: (resultData as AuthResponse['data']) || undefined,
      };
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: "Lỗi kết nối. Vui lòng thử lại.",
      };
    }
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/Auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Get response text first
      const responseText = await response.text();
      console.log("📥 Login response:", responseText);

      if (!response.ok) {
        // Try to parse error message
        let errorMessage = "Đăng nhập không thành công.";
        try {
          const errorResult = JSON.parse(responseText);
          errorMessage = String(errorResult.message || errorResult.title || responseText);
        } catch {
          errorMessage = responseText || errorMessage;
        }
        return {
          success: false,
          message: errorMessage,
        };
      }

      // Parse response - format: "Account Id :uuid token: jwt"
      // Example: "Account Id :6a829265-c93d-42da-b931-fd1d0a2ff1bf token: eyJhbGci..."
      let accountId = "";
      let token = "";

      // Try to extract Account Id and token from the response text
      const accountIdMatch = responseText.match(/Account Id\s*:\s*([a-f0-9-]+)/i);
      const tokenMatch = responseText.match(/token:\s*(\S+)/i);

      if (accountIdMatch) {
        accountId = accountIdMatch[1];
      }
      if (tokenMatch) {
        token = tokenMatch[1];
      }

      console.log("📥 Parsed Account Id:", accountId);
      console.log("📥 Parsed Token:", token ? "✅ Present" : "❌ Missing");

      // Save token to localStorage
      if (token) {
        localStorage.setItem("authToken", token);
        console.log("✅ Token saved to localStorage");
      }
      if (accountId) {
        localStorage.setItem("accountId", accountId);
        console.log("✅ Account Id saved to localStorage");
      }

      // Fetch user data using Account Id
      let userData: UserData | undefined;
      if (accountId) {
        console.log("📤 Fetching user data for Account Id:", accountId);
        userData = await this.getUserById(accountId);
        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("✅ User data saved to localStorage:", userData);

          // If user is a Recruiter, fetch their company data
          if (userData.role === "Recruiter") {
            console.log("👔 User is a Recruiter, fetching company data...");
            try {
              // Dynamically import companyService to avoid circular dependency
              const { companyService } = await import("./companyService");
              const companyResponse = await companyService.getCompanyByRecruiterId(accountId);
              
              if (companyResponse.success && companyResponse.data) {
                console.log("✅ Company data loaded for recruiter:", companyResponse.data.name);
              } else {
                console.warn("⚠️ Failed to load company data:", companyResponse.message);
              }
            } catch (companyError) {
              console.error("❌ Error fetching company data:", companyError);
            }
          }
        }
      }

      return {
        success: true,
        message: "Đăng nhập thành công.",
        data: {
          token,
          accountId,
          user: userData || {
            id: accountId,
            fullName: "",
            email: data.email,
            phoneNumber: "",
            dateOfBirth: "",
            gender: "",
            role: "",
            createTime: "",
            updateTime: "",
          },
        },
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: "Lỗi kết nối. Vui lòng thử lại.",
      };
    }
  }

  /**
   * Get user data by Account Id
   */
  async getUserById(accountId: string): Promise<UserData | undefined> {
    try {
      const response = await fetch(`${API_BASE_URL}/User/Get_User_By_Id/${accountId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("❌ Failed to fetch user data:", response.status);
        return undefined;
      }

      const userData = await response.json();
      console.log("📥 User data fetched:", userData);

      return userData as UserData;
    } catch (error) {
      console.error("❌ Error fetching user data:", error);
      return undefined;
    }
  }

  /**
   * Logout user - clear all user data from localStorage
   */
  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("accountId");
    localStorage.removeItem("user");
    localStorage.removeItem("userData"); // Remove old key for backwards compatibility
    localStorage.removeItem("companyFormData"); // Clear company form data
    localStorage.removeItem("recruiterCompany"); // Clear recruiter company data
    console.log("✅ User logged out, all data cleared from localStorage");
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
  }

  /**
   * Get stored user data
   */
  getUser(): UserData | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr) as UserData;
    } catch {
      return null;
    }
  }

  /**
   * Get stored auth token
   */
  getToken(): string | null {
    return localStorage.getItem("authToken");
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Register a new company
   */
  async registerCompany(
    data: CompanyRegistrationRequest
  ): Promise<CompanyResponse> {
    try {
      const token = this.getToken();
      console.log("🏢 Company registration - Token:", token ? "Present" : "Missing");
      console.log("🏢 Company registration - Data:", JSON.stringify(data, null, 2));

      const response = await fetch(`${API_BASE_URL}/Auth/company-register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const responseText = await response.text();
      console.log("🏢 Company registration - Status:", response.status);
      console.log("🏢 Company registration - Response:", responseText);

      let result: Record<string, unknown> = {};
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        result = {
          success: response.ok,
          message: responseText,
        };
      }

      if (!response.ok) {
        const errorMessage = String(result.message || result.title || result.errors || responseText || "Đăng ký công ty không thành công.");
        console.error("🏢 Company registration failed:", errorMessage);
        return {
          success: false,
          message: errorMessage,
        };
      }

      return {
        success: true,
        message: String(result.message) || "Đăng ký công ty thành công.",
        data: (result.data as CompanyResponse["data"]) || undefined,
      };
    } catch (error) {
      console.error("Company registration error:", error);
      return {
        success: false,
        message: "Lỗi kết nối. Vui lòng thử lại.",
      };
    }
  }

  /**
   * Join an existing company with invite code
   */
  async joinCompanyWithInviteCode(
    inviteCode: string
  ): Promise<CompanyResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/company/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
        body: JSON.stringify({ inviteCode }),
      });

      const responseText = await response.text();
      let result: Record<string, unknown> = {};
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        result = {
          success: response.ok,
          message: responseText,
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: String(result.message) || "Mã mời không hợp lệ.",
        };
      }

      return {
        success: true,
        message: String(result.message) || "Đã tham gia công ty thành công.",
        data: (result.data as CompanyResponse["data"]) || undefined,
      };
    } catch (error) {
      console.error("Join company error:", error);
      return {
        success: false,
        message: "Lỗi kết nối. Vui lòng thử lại.",
      };
    }
  }

  /**
   * Get company approval status
   */
  async getCompanyApprovalStatus(): Promise<CompanyResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/company/approval-status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
      });

      const responseText = await response.text();
      let result: Record<string, unknown> = {};
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        result = {
          success: response.ok,
          message: responseText,
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: String(result.message) || "Không thể lấy trạng thái.",
        };
      }

      return {
        success: true,
        message: String(result.message) || "Lấy trạng thái thành công.",
        data: (result.data as CompanyResponse["data"]) || undefined,
      };
    } catch (error) {
      console.error("Get approval status error:", error);
      return {
        success: false,
        message: "Lỗi kết nối. Vui lòng thử lại.",
      };
    }
  }
}

export const authService = new AuthService();
