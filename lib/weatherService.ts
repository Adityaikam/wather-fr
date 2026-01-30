import axios from "axios";

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9091/api/cities";

// Backend response types (matching Spring Boot)
interface CityBackendResponse {
  id: number;
  cityName: string;
  minTempAlert: number | null;
  maxTempAlert: number | null;
  lastKnownTemp: number;
  alert: boolean;
  lastUpdated: string | null;
}

// Frontend types
export interface Weather {
  city: string;
  temperature: number;
  description: string;
}

export interface FavoriteCity {
  id: number;
  city: string;
  temperature: number;
  alert: boolean;
  minTemp?: number;
  maxTemp?: number;
  lastUpdated?: string | null;
}

export interface CreateFavoriteCityRequest {
  cityName: string;
  minTempAlert?: number;
  maxTempAlert?: number;
}

export interface SyncResponse {
  syncedCities: number;
  timestamp: string;
}

// Mapper function to convert backend response to frontend format
function mapBackendToFrontend(backendCity: CityBackendResponse): FavoriteCity {
  return {
    id: backendCity.id,
    city: backendCity.cityName,
    temperature: backendCity.lastKnownTemp,
    alert: backendCity.alert,
    minTemp: backendCity.minTempAlert ?? undefined,
    maxTemp: backendCity.maxTempAlert ?? undefined,
    lastUpdated: backendCity.lastUpdated,
  };
}

// Weather API Service
export const weatherService = {
  // Get weather for a specific city
  async getWeather(city: string): Promise<Weather> {
    try {
      const response = await axios.get<Weather>(`${API_BASE_URL}/weather/${encodeURIComponent(city)}`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch weather for ${city}`);
    }
  },

  // Get all favorite cities
  async getFavoriteCities(): Promise<FavoriteCity[]> {
    try {
      const response = await axios.get<CityBackendResponse[]>(`${API_BASE_URL}/favorites`);
      return response.data.map(mapBackendToFrontend);
    } catch (error) {
      throw new Error("Failed to fetch favorite cities");
    }
  },

  // Add a new favorite city
  async addFavoriteCity(city: string, minTemp?: number, maxTemp?: number): Promise<FavoriteCity> {
    const request: CreateFavoriteCityRequest = {
      cityName: city,
      ...(minTemp !== undefined && { minTempAlert: minTemp }),
      ...(maxTemp !== undefined && { maxTempAlert: maxTemp }),
    };

    try {
      const response = await axios.post<CityBackendResponse>(`${API_BASE_URL}/favorites`, request);
      return mapBackendToFrontend(response.data);
    } catch (error) {
      throw new Error("Failed to add favorite city");
    }
  },

  // Delete a favorite city
  async deleteFavoriteCity(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/favorites/${id}`);
    } catch (error) {
      throw new Error("Failed to delete favorite city");
    }
  },

  // Sync weather for all cities (optional cron endpoint)
  async syncWeather(): Promise<SyncResponse> {
    try {
      const response = await axios.post<SyncResponse>(`${API_BASE_URL}/sync`);
      return response.data;
    } catch (error) {
      throw new Error("Failed to sync weather");
    }
  },
};
