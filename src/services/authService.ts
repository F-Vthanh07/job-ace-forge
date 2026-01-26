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

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      fullName: string;
    };
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

      // Try to parse as JSON, if it fails, treat as plain text
      let result: Record<string, unknown> = {};
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        // If response is plain text or JWT token, wrap it
        result = {
          success: response.ok,
          message: responseText,
          data: response.ok ? { token: responseText } : undefined,
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: String(result.message) || "Đăng nhập không thành công.",
        };
      }

      const resultData = result.data as Record<string, unknown> | undefined;
      if (resultData && typeof resultData === "object" && "token" in resultData) {
        localStorage.setItem("authToken", String(resultData.token));
      }

      return {
        success: true,
        message: String(result.message) || "Đăng nhập thành công.",
        data: (resultData as AuthResponse['data']) || undefined,
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
   * Logout user
   */
  logout(): void {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
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
