import api from "../axios.config";
import type {
  Ping,
  Wave,
  ResolutionLog,
  PaginatedResponse,
  PaginationParams,
} from "../types";

export interface PublicFeedParams extends PaginationParams {
  top?: number;
  sort?: "trending" | "new";
  days?: number | "all";
}

export interface ResolutionLogParams extends PaginationParams {
  top?: number;
  days?: number | "all";
}

/**
 * Public Feed Service
 * Handles public soundboard and stream feeds
 */
const publicService = {
  /**
   * Get trending or new pings (Soundboard view)
   * @param params Query parameters for filtering and pagination
   */
  getSoundboard: async (
    params?: PublicFeedParams
  ): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>(
      "/public/soundboard",
      { params }
    );
    return response.data;
  },

  /**
   * Get trending or new waves (Stream view)
   * @param params Query parameters for filtering and pagination
   */
  getStream: async (
    params?: PublicFeedParams
  ): Promise<PaginatedResponse<Wave>> => {
    const response = await api.get<PaginatedResponse<Wave>>("/public/stream", {
      params,
    });
    return response.data;
  },

  /**
   * Get resolution log - resolved pings with approved solutions
   * @param params Query parameters for filtering and pagination
   */
  getResolutionLog: async (
    params?: ResolutionLogParams
  ): Promise<PaginatedResponse<ResolutionLog>> => {
    const response = await api.get<PaginatedResponse<ResolutionLog>>(
      "/public/resolution-log",
      { params }
    );
    return response.data;
  },
};

export default publicService;
