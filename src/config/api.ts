/**
 * API Configuration
 * Centralized API URL configuration
 * To change the API URL, update VITE_API_URL in .env file
 */

export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  TURNSTILE_SITE_KEY: import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAACNx3IfFD1Btqrb3",
} as const;

// Helper function to build endpoint URL
export const getApiUrl = (endpoint: string): string => {
  const baseUrl = API_CONFIG.BASE_URL;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};
