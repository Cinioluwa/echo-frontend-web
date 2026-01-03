import api from "../axios.config";
import type { Wave, PaginatedResponse, PaginationParams } from "../types";

export interface CreateWaveRequest {
  solution: string;
}

/**
 * Wave Service
 * Handles waves (solutions) management
 */
const waveService = {
  /**
   * Create a wave (solution) for a ping
   * @param pingId Ping ID
   * @param data Wave solution
   */
  create: async (pingId: number, data: CreateWaveRequest): Promise<Wave> => {
    const response = await api.post<Wave>(`/pings/${pingId}/waves`, data);
    return response.data;
  },

  /**
   * Get all waves for a specific ping
   * @param pingId Ping ID
   * @param params Pagination parameters
   */
  getByPingId: async (
    pingId: number,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Wave>> => {
    const response = await api.get<PaginatedResponse<Wave>>(
      `/pings/${pingId}/waves`,
      { params }
    );
    return response.data;
  },

  /**
   * Get a specific wave by ID (increments view count)
   * @param id Wave ID
   */
  getById: async (id: number): Promise<Wave> => {
    const response = await api.get<Wave>(`/waves/${id}`);
    return response.data;
  },
};

export default waveService;
