import api from "../axios.config";
import type { Comment, PaginatedResponse, PaginationParams } from "../types";

export interface CreateCommentRequest {
  content: string;
}

/**
 * Comment Service
 * Handles comments on pings and waves
 */
const commentService = {
  /**
   * Create a comment on a ping
   * @param pingId Ping ID
   * @param data Comment content
   */
  createOnPing: async (
    pingId: number,
    data: CreateCommentRequest
  ): Promise<Comment> => {
    const response = await api.post<Comment>(`/pings/${pingId}/comments`, data);
    return response.data;
  },

  /**
   * Get all comments for a ping
   * @param pingId Ping ID
   * @param params Pagination parameters
   */
  getByPingId: async (
    pingId: number,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get<PaginatedResponse<Comment>>(
      `/pings/${pingId}/comments`,
      { params }
    );
    return response.data;
  },

  /**
   * Create a comment on a wave
   * @param waveId Wave ID
   * @param data Comment content
   */
  createOnWave: async (
    waveId: number,
    data: CreateCommentRequest
  ): Promise<Comment> => {
    const response = await api.post<Comment>(`/waves/${waveId}/comments`, data);
    return response.data;
  },

  /**
   * Get all comments for a wave
   * @param waveId Wave ID
   * @param params Pagination parameters
   */
  getByWaveId: async (
    waveId: number,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Comment>> => {
    const response = await api.get<PaginatedResponse<Comment>>(
      `/waves/${waveId}/comments`,
      { params }
    );
    return response.data;
  },
};

export default commentService;
