import api from "../axios.config";
import type { Announcement } from "../types";

export interface GetAnnouncementsParams {
  categoryId?: number;
}

/**
 * Announcement Service
 * Handles announcements management
 */
const announcementService = {
  /**
   * Get all announcements for the organization
   * @param params Query parameters for filtering
   */
  getAll: async (params?: GetAnnouncementsParams): Promise<Announcement[]> => {
    const response = await api.get<Announcement[]>("/announcements", {
      params,
    });
    return response.data;
  },
};

export default announcementService;
