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
  categoryId?: number;
  category?: number;
}

export interface ResolutionLogParams extends PaginationParams {
  top?: number;
  days?: number | "all";
}

export interface ShareMetadata {
  type: "ping" | "wave" | "comment" | "feed";
  id: number;
  title: string;
  description: string;
  imageUrl?: string | null;
  canonicalUrl: string;
  surgeCount?: number;
  waveCount?: number;
  category?: string;
  orgName?: string;
  orgLogoUrl?: string;
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
    const queryParams: Record<string, any> = { ...params };
    const effectiveCategory = params?.categoryId ?? params?.category;
    if (effectiveCategory !== undefined) {
      queryParams.categoryId = effectiveCategory;
      queryParams.category = effectiveCategory;
    }
    const response = await api.get<PaginatedResponse<Ping>>(
      "/public/soundboard",
      { params: queryParams }
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
    const queryParams: Record<string, any> = { ...params };
    const effectiveCategory = params?.categoryId ?? params?.category;
    if (effectiveCategory !== undefined) {
      queryParams.categoryId = effectiveCategory;
      queryParams.category = effectiveCategory;
    }
    const response = await api.get<PaginatedResponse<Wave>>("/public/stream", {
      params: queryParams,
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

  /**
   * Get public metadata for a shared entity
   * @param entity The entity type (e.g. ping, wave, comment)
   * @param id The entity ID
   */
  getShareMetadata: async (
    entity: "ping" | "wave" | "comment" | "feed",
    id: number
  ): Promise<ShareMetadata> => {
    const response = await api.get<ShareMetadata>(`/public/share/${entity}/${id}`);
    return response.data;
  },
};

export default publicService;
