/**
 * User API Service
 * Handles user-related API communications
 */

import { API_CONFIG } from "../config/api";

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface User {
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

/**
 * Fetch all users from the API
 * @returns Promise with array of all users
 */
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/User/Get_All_Users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }

    const data: User[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

/**
 * Fetch all users excluding admin role
 * @returns Promise with array of non-admin users
 */
export const getAllNonAdminUsers = async (): Promise<User[]> => {
  try {
    const allUsers = await getAllUsers();
    // Filter out users with admin role (case-insensitive)
    return allUsers.filter(user => user.role.toLowerCase() !== "admin");
  } catch (error) {
    console.error("Error fetching non-admin users:", error);
    throw error;
  }
};

export interface JoinCompanyResponse {
  success: boolean;
  message?: string;
  data?: {
    companyId?: string;
    companyName?: string;
  };
}

/**
 * Join a company using invite code
 * @param inviteCode - The invite code provided by the company
 * @returns Promise with join company response
 */
export const joinCompanyByCode = async (inviteCode: string): Promise<JoinCompanyResponse> => {
  try {
    // Get token from localStorage
    const token = localStorage.getItem("authToken");
    
    if (!token) {
      return {
        success: false,
        message: "Vui lòng đăng nhập để tiếp tục.",
      };
    }

    console.log("🔄 Joining company with code:", inviteCode);
    
    const response = await fetch(`${API_BASE_URL}/User/Join_Company_By_Code/${inviteCode}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    const responseText = await response.text();
    console.log("📥 Join company response status:", response.status);
    console.log("📥 Join company response text:", responseText);

    if (!response.ok) {
      let errorMessage = "Failed to join company";
      try {
        const errorData = JSON.parse(responseText);
        errorMessage = errorData.message || errorMessage;
      } catch {
        errorMessage = responseText || errorMessage;
      }
      return {
        success: false,
        message: errorMessage,
      };
    }

    // Try to parse JSON response
    try {
      const data = JSON.parse(responseText);
      return {
        success: true,
        message: data.message || "Successfully joined company",
        data: data.data || data,
      };
    } catch {
      // If response is plain text
      return {
        success: true,
        message: responseText || "Successfully joined company",
      };
    }
  } catch (error) {
    console.error("❌ Error joining company:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An error occurred while joining company",
    };
  }
};
