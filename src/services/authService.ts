/**
 * Authentication API Service
 * Handles communication with the C# backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Cloudflare Turnstile Configuration
const TURNSTILE_SITE_KEY = "0x4AAAAAACNx3IfFD1Btqrb3";

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
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
        // If response is plain text, wrap it
        result = {
          success: response.ok,
          message: responseText,
        };
      }

      if (!response.ok) {
        return {
          success: false,
          message: String(result.message) || "Đăng ký không thành công.",
        };
      }

      return {
        success: true,
        message: String(result.message) || "Đăng ký thành công.",
        data: (result.data as AuthResponse['data']) || undefined,
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
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
}

export const authService = new AuthService();
