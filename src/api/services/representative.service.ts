import api from "../axios.config";
import type {
  Ping,
  Wave,
  PaginatedResponse,
  PaginationParams,
} from "../types/index";

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

export interface AssignPingRequest {
  assignedToUserId?: number;
  assignedToBodyId?: number;
}

export interface RepresentativeRosterMember {
  profileId: number;
  userId: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  body?: { id: number; name: string } | null;
  department?: { id: number; name: string; code: string } | null;
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

  assignPing: async (
    pingId: number,
    data: AssignPingRequest,
  ): Promise<{ message: string; ping: Ping }> => {
    const response = await api.post<{ message: string; ping: Ping }>(
      `/representatives/pings/${pingId}/assign`,
      data,
    );
    return response.data;
  },

  getAssignedPings: async (
    params?: PaginationParams & { status?: string },
  ): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>(
      "/representatives/pings/submitted",
      { params: { ...params, assigned: "me" } },
    );
    return response.data;
  },

  getAssignedWaves: async (params?: { limit?: number; status?: string }): Promise<any[]> => {
    const response = await api.get<{ data: any[] }>("/representatives/waves/assigned", { params });
    return response.data.data;
  },

  urgePingResolution: async (pingId: number): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/representatives/pings/${pingId}/urge-resolve`,
    );
    return response.data;
  },

  getRoster: async (): Promise<RepresentativeRosterMember[]> => {
    const response = await api.get<{ data: RepresentativeRosterMember[] }>(
      "/representatives/roster",
    );
    return response.data.data;
  },
};

export default representativeService;
