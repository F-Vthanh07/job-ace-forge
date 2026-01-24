/**
 * Address API Service
 * Handles fetching city, district, and ward data from the backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Backend response interfaces (matching actual API response)
interface CityApiResponse {
  cityCode: string;
  cityName: string;
}

interface DistrictApiResponse {
  districtCode: string;
  districtName: string;
}

interface WardApiResponse {
  wardCode: string;
  wardName: string;
}

// Frontend interfaces (normalized for components)
export interface CityResponse {
  code: string;
  name: string;
}

export interface DistrictResponse {
  code: string;
  name: string;
}

export interface WardResponse {
  code: string;
  name: string;
}

class AddressService {
  /**
   * Get all cities
   */
  async getAllCities(): Promise<CityResponse[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/address/city-name`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch cities");
      }

      const data: CityApiResponse[] = await response.json();

      // Map backend response to frontend interface
      return data.map((city) => ({
        code: city.cityCode,
        name: city.cityName,
      }));
    } catch (error) {
      console.error("Error fetching cities:", error);
      throw error;
    }
  }

  /**
   * Get districts by city code
   */
  async getDistrictsByCityCode(cityCode: string): Promise<DistrictResponse[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/address/district-name/${cityCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch districts");
      }

      const data: DistrictApiResponse[] = await response.json();

      // Map backend response to frontend interface
      return data.map((district) => ({
        code: district.districtCode,
        name: district.districtName,
      }));
    } catch (error) {
      console.error("Error fetching districts:", error);
      throw error;
    }
  }

  /**
   * Get wards by district code
   */
  async getWardsByDistrictCode(districtCode: string): Promise<WardResponse[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/address/ward-name/${districtCode}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch wards");
      }

      const data: WardApiResponse[] = await response.json();

      // Map backend response to frontend interface
      return data.map((ward) => ({
        code: ward.wardCode,
        name: ward.wardName,
      }));
    } catch (error) {
      console.error("Error fetching wards:", error);
      throw error;
    }
  }
}

export const addressService = new AddressService();
