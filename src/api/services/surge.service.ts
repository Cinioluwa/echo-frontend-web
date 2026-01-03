import api from "../axios.config";
import type {
  Surge,
  CreateSurgeRequest,
  PaginatedResponse,
  PaginationParams,
} from "../types";

/**
 * Surge Service
 * Handles surges (likes/upvotes) on pings and waves
 */
const surgeService = {
  /**
   * Get surges for a specific ping or wave
   * @param targetType Type of target (ping or wave)
   * @param targetId Target ID
   * @param params Pagination parameters
   * @returns Paginated list of surges
   */
  getSurges: async (
    targetType: "ping" | "wave",
    targetId: string,
    params?: PaginationParams
  ): Promise<PaginatedResponse<Surge>> => {
    const response = await api.get<PaginatedResponse<Surge>>(
      `/${targetType}s/${targetId}/surges`,
      { params }
    );
    return response.data;
  },

  /**
   * Add a surge to a ping or wave
   * @param data Surge creation data
   * @returns Created surge
   */
  addSurge: async (data: CreateSurgeRequest): Promise<Surge> => {
    const response = await api.post<Surge>("/surges", data);
    return response.data;
  },

  /**
   * Remove a surge from a ping or wave
   * @param targetType Type of target (ping or wave)
   * @param targetId Target ID
   */
  removeSurge: async (
    targetType: "ping" | "wave",
    targetId: string
  ): Promise<void> => {
    await api.delete(`/surges/${targetType}/${targetId}`);
  },

  /**
   * Toggle surge on a ping or wave (add if not surged, remove if already surged)
   * @param targetType Type of target (ping or wave)
   * @param targetId Target ID
   * @returns True if surge was added, false if removed
   */
  toggleSurge: async (
    targetType: "ping" | "wave",
    targetId: string
  ): Promise<boolean> => {
    try {
      const hasSurged = await surgeService.checkIfSurged(targetType, targetId);
      
      if (hasSurged) {
        await surgeService.removeSurge(targetType, targetId);
        return false;
      } else {
        await surgeService.addSurge({ targetType, targetId });
        return true;
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Check if current user has surged a ping or wave
   * @param targetType Type of target (ping or wave)
   * @param targetId Target ID
   * @returns True if user has surged
   */
  checkIfSurged: async (
    targetType: "ping" | "wave",
    targetId: string
  ): Promise<boolean> => {
    const response = await api.get<{ hasSurged: boolean }>(
      `/surges/${targetType}/${targetId}/check`
    );
    return response.data.hasSurged;
  },

  /**
   * Get all surges by current user
   * @param params Pagination parameters
   * @returns Paginated list of user's surges
   */
  getMySurges: async (
    params?: PaginationParams
  ): Promise<PaginatedResponse<Surge>> => {
    const response = await api.get<PaginatedResponse<Surge>>("/surges/me", {
      params,
    });
    return response.data;
  },

  /**
   * Get surge count for a ping or wave
   * @param targetType Type of target (ping or wave)
   * @param targetId Target ID
   * @returns Surge count
   */
  getSurgeCount: async (
    targetType: "ping" | "wave",
    targetId: string
  ): Promise<number> => {
    const response = await api.get<{ count: number }>(
      `/${targetType}s/${targetId}/surges/count`
    );
    return response.data.count;
  },
};

export default surgeService;
