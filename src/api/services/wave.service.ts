import api from "../axios.config";
import type {
  Wave,
  CreateWaveRequest,
  UpdateWaveRequest,
  ProposeWaveRequest,
  PaginatedResponse,
  WaveQueryParams,
} from "../types";

/**
 * Wave Service
 * Handles wave (solutions/proposals) management
 */
const waveService = {
  /**
   * Get all waves with optional filters
   * @param params Query parameters for filtering and pagination
   * @returns Paginated list of waves
   */
  getWaves: async (
    params?: WaveQueryParams
  ): Promise<PaginatedResponse<Wave>> => {
    const response = await api.get<PaginatedResponse<Wave>>("/waves", {
      params,
    });
    return response.data;
  },

  /**
   * Get a single wave by ID
   * @param id Wave ID
   * @returns Wave details
   */
  getWaveById: async (id: string): Promise<Wave> => {
    const response = await api.get<Wave>(`/waves/${id}`);
    return response.data;
  },

  /**
   * Create a new wave
   * @param data Wave creation data
   * @returns Created wave
   */
  createWave: async (data: CreateWaveRequest): Promise<Wave> => {
    const response = await api.post<Wave>("/waves", data);
    return response.data;
  },

  /**
   * Propose a wave for a specific ping
   * @param data Wave proposal data (includes pingId)
   * @returns Created wave
   */
  proposeWave: async (data: ProposeWaveRequest): Promise<Wave> => {
    const response = await api.post<Wave>("/waves/propose", data);
    return response.data;
  },

  /**
   * Update an existing wave
   * @param id Wave ID
   * @param data Updated wave data
   * @returns Updated wave
   */
  updateWave: async (id: string, data: UpdateWaveRequest): Promise<Wave> => {
    const response = await api.patch<Wave>(`/waves/${id}`, data);
    return response.data;
  },

  /**
   * Delete a wave
   * @param id Wave ID
   */
  deleteWave: async (id: string): Promise<void> => {
    await api.delete(`/waves/${id}`);
  },

  /**
   * Get waves by category
   * @param category Category name
   * @param params Additional query parameters
   * @returns Paginated list of waves in category
   */
  getWavesByCategory: async (
    category: string,
    params?: WaveQueryParams
  ): Promise<PaginatedResponse<Wave>> => {
    const response = await api.get<PaginatedResponse<Wave>>("/waves", {
      params: { ...params, category },
    });
    return response.data;
  },

  /**
   * Get top ranked waves
   * @param limit Number of top waves to retrieve
   * @returns List of top waves
   */
  getTopWaves: async (limit: number = 3): Promise<Wave[]> => {
    const response = await api.get<Wave[]>("/waves/top", {
      params: { limit },
    });
    return response.data;
  },

  /**
   * Get waves created by current user
   * @param params Query parameters
   * @returns Paginated list of user's waves
   */
  getMyWaves: async (
    params?: WaveQueryParams
  ): Promise<PaginatedResponse<Wave>> => {
    const response = await api.get<PaginatedResponse<Wave>>("/waves/me", {
      params,
    });
    return response.data;
  },

  /**
   * Search waves by keyword
   * @param query Search query
   * @param params Additional query parameters
   * @returns Paginated search results
   */
  searchWaves: async (
    query: string,
    params?: WaveQueryParams
  ): Promise<PaginatedResponse<Wave>> => {
    const response = await api.get<PaginatedResponse<Wave>>("/waves/search", {
      params: { ...params, q: query },
    });
    return response.data;
  },

  /**
   * Get waves for a specific ping
   * @param pingId Ping ID
   * @param params Query parameters
   * @returns Paginated list of waves for the ping
   */
  getWavesForPing: async (
    pingId: string,
    params?: WaveQueryParams
  ): Promise<PaginatedResponse<Wave>> => {
    const response = await api.get<PaginatedResponse<Wave>>(
      `/pings/${pingId}/waves`,
      { params }
    );
    return response.data;
  },
};

export default waveService;
