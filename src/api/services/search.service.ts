import api from "../axios.config";
import type { Ping, Wave, PaginatedResponse, PaginationParams } from "../types";

export interface SearchParams extends PaginationParams {
  q?: string; // Text search query
  hashtag?: string; // Hashtag search
  category?: number; // Filter by category
  sort?: "trending" | "new"; // Sort order
}

/**
 * Search Service
 * Handles search functionality across pings and waves
 */
const searchService = {
  /**
   * Search pings by hashtag or text query
   * @param params Search parameters
   * @returns Paginated search results
   */
  searchPings: async (
    params: SearchParams
  ): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>("/pings/search", {
      params,
    });
    return response.data;
  },

  /**
   * Search in soundboard (pings) using public endpoint
   * @param params Search parameters including query string
   * @returns Paginated search results
   */
  searchSoundboard: async (
    params: SearchParams
  ): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>(
      "/public/soundboard",
      { params }
    );
    return response.data;
  },

  /**
   * Search in stream (waves) using public endpoint
   * @param params Search parameters including query string
   * @returns Paginated search results
   */
  searchStream: async (
    params: SearchParams
  ): Promise<PaginatedResponse<Wave>> => {
    const response = await api.get<PaginatedResponse<Wave>>("/public/stream", {
      params,
    });
    return response.data;
  },
};

export default searchService;
