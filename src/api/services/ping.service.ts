import api from "../axios.config";
import type { Ping, PaginatedResponse, PaginationParams } from "../types";

export interface CreatePingRequest {
  title: string;
  content: string;
  categoryId: number;
  hashtag?: string;
}

export interface UpdatePingRequest {
  title?: string;
  content?: string;
}

export interface UpdatePingStatusRequest {
  status: "POSTED" | "UNDER_REVIEW" | "ARCHIVED";
}

export interface UpdateProgressStatusRequest {
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED" | "WONT_FIX";
}

export interface GetPingsParams extends PaginationParams {
  category?: number;
  status?: "POSTED" | "UNDER_REVIEW" | "ARCHIVED";
}

export interface SearchPingsParams extends PaginationParams {
  hashtag?: string;
  q?: string;
}

/**
 * Ping Service
 * Handles pings (posts/issues) management
 */
const pingService = {
  /**
   * Create a new ping
   * @param data Ping details
   */
  create: async (data: CreatePingRequest): Promise<Ping> => {
    const response = await api.post<Ping>("/pings", data);
    return response.data;
  },

  /**
   * Get all pings in organization with filters
   * @param params Query parameters for filtering and pagination
   */
  getAll: async (params?: GetPingsParams): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>("/pings", {
      params,
    });
    return response.data;
  },

  /**
   * Search pings by hashtag or text query
   * @param params Search parameters
   */
  search: async (
    params: SearchPingsParams
  ): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>("/pings/search", {
      params,
    });
    return response.data;
  },

  /**
   * Get current user's pings
   * @param params Pagination parameters
   */
  getMyPings: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>("/pings/me", {
      params,
    });
    return response.data;
  },

  /**
   * Get a specific ping by ID with full details
   * @param id Ping ID
   */
  getById: async (id: number): Promise<Ping> => {
    const response = await api.get<Ping>(`/pings/${id}`);
    return response.data;
  },

  /**
   * Update a ping (author only)
   * @param id Ping ID
   * @param data Updated ping data
   */
  update: async (id: number, data: UpdatePingRequest): Promise<Ping> => {
    const response = await api.patch<Ping>(`/pings/${id}`, data);
    return response.data;
  },

  /**
   * Delete a ping (author only)
   * @param id Ping ID
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/pings/${id}`);
  },

  /**
   * Update ping status (admin only)
   * @param id Ping ID
   * @param data New status
   */
  updateStatus: async (
    id: number,
    data: UpdatePingStatusRequest
  ): Promise<Ping> => {
    const response = await api.patch<Ping>(`/pings/${id}/status`, data);
    return response.data;
  },

  /**
   * Submit ping for review (representative only)
   * @param id Ping ID
   */
  submitForReview: async (id: number): Promise<Ping> => {
    const response = await api.patch<Ping>(`/pings/${id}/submit`);
    return response.data;
  },

  /**
   * Update ping progress status (admin only)
   * @param id Ping ID
   * @param data New progress status
   */
  updateProgressStatus: async (
    id: number,
    data: UpdateProgressStatusRequest
  ): Promise<Ping> => {
    const response = await api.patch<Ping>(
      `/pings/${id}/progress-status`,
      data
    );
    return response.data;
  },
};

export default pingService;
