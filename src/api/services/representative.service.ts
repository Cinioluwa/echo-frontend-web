import api from "../axios.config";
import type { Ping, Wave, PaginatedResponse, PaginationParams } from "../types";

export interface GetTopWavesParams {
  days?: number | "all";
  take?: number;
}

export interface ForwardWavesRequest {
  waveIds: number[];
}

export interface ForwardWavesResponse {
  message: string;
  count: number;
}

export interface CreateOfficialResponseRequest {
  content: string;
}

export interface OfficialResponse {
  id: number;
  content: string;
  authorId: number;
  pingId: number;
  organizationId: number;
  createdAt: string;
}

export interface TopWavesResponse {
  data: Wave[];
}

/**
 * Representative Service
 * Handles representative-only operations (requires REPRESENTATIVE role)
 */
const representativeService = {
  /**
   * Get pings submitted for review (status: UNDER_REVIEW)
   * @param params Pagination parameters
   */
  getSubmittedPings: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>(
      "/representatives/pings/submitted",
      { params }
    );
    return response.data;
  },

  /**
   * Get top waves for review (most surged)
   * @param params Query parameters
   */
  getTopWaves: async (params?: GetTopWavesParams): Promise<Wave[]> => {
    const response = await api.get<TopWavesResponse>(
      "/representatives/waves/top",
      { params }
    );
    return response.data.data;
  },

  /**
   * Forward waves for review (flag them)
   * @param data Wave IDs to forward
   */
  forwardWaves: async (
    data: ForwardWavesRequest
  ): Promise<ForwardWavesResponse> => {
    const response = await api.post<ForwardWavesResponse>(
      "/representatives/waves/forward",
      data
    );
    return response.data;
  },

  /**
   * Create official response to a ping
   * @param pingId Ping ID
   * @param data Official response content
   */
  createOfficialResponse: async (
    pingId: number,
    data: CreateOfficialResponseRequest
  ): Promise<OfficialResponse> => {
    const response = await api.post<OfficialResponse>(
      `/pings/${pingId}/official-response`,
      data
    );
    return response.data;
  },
};

export default representativeService;
