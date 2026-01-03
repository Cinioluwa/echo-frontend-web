import api from "../axios.config";
import type {
  Ping,
  CreatePingRequest,
  UpdatePingRequest,
  PaginatedResponse,
  PingQueryParams,
} from "../types/index";

/**
 * Ping Service
 * Handles ping (issues/complaints) management
 */
const pingService = {
  /**
   * Get all pings with optional filters
   * @param params Query parameters for filtering and pagination
   * @returns Paginated list of pings
   */
  getPings: async (
    params?: PingQueryParams
  ): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>("/pings", {
      params,
    });
    return response.data;
  },

  /**
   * Get a single ping by ID
   * @param id Ping ID
   * @returns Ping details
   */
  getPingById: async (id: string): Promise<Ping> => {
    const response = await api.get<Ping>(`/pings/${id}`);
    return response.data;
  },

  /**
   * Create a new ping
   * @param data Ping creation data
   * @returns Created ping
   */
  createPing: async (data: CreatePingRequest): Promise<Ping> => {
    const response = await api.post<Ping>("/pings", data);
    return response.data;
  },

  /**
   * Update an existing ping
   * @param id Ping ID
   * @param data Updated ping data
   * @returns Updated ping
   */
  updatePing: async (id: string, data: UpdatePingRequest): Promise<Ping> => {
    const response = await api.patch<Ping>(`/pings/${id}`, data);
    return response.data;
  },

  /**
   * Delete a ping
   * @param id Ping ID
   */
  deletePing: async (id: string): Promise<void> => {
    await api.delete(`/pings/${id}`);
  },

  /**
   * Get pings by category
   * @param category Category name
   * @param params Additional query parameters
   * @returns Paginated list of pings in category
   */
  getPingsByCategory: async (
    category: string,
    params?: PingQueryParams
  ): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>("/pings", {
      params: { ...params, category },
    });
    return response.data;
  },

  /**
   * Get pings created by current user
   * @param params Query parameters
   * @returns Paginated list of user's pings
   */
  getMyPings: async (
    params?: PingQueryParams
  ): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>("/pings/me", {
      params,
    });
    return response.data;
  },

  /**
   * Search pings by keyword
   * @param query Search query
   * @param params Additional query parameters
   * @returns Paginated search results
   */
  searchPings: async (
    query: string,
    params?: PingQueryParams
  ): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>("/pings/search", {
      params: { ...params, q: query },
    });
    return response.data;
  },

  /**
   * Get trending pings (most surges, comments, views)
   * @param limit Number of trending pings to retrieve
   * @returns List of trending pings
   */
  getTrendingPings: async (limit: number = 10): Promise<Ping[]> => {
    const response = await api.get<Ping[]>("/pings/trending", {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get pings that have proposed waves
   * @param params Query parameters
   * @returns Paginated list of pings with waves
   */
  getPingsWithWaves: async (
    params?: PingQueryParams
  ): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>("/pings", {
      params: { ...params, hasWave: true },
    });
    return response.data;
  },

  /**
   * Increment view count for a ping
   * @param id Ping ID
   */
  incrementViewCount: async (id: string): Promise<void> => {
    await api.post(`/pings/${id}/view`);
  },
};

export default pingService;
