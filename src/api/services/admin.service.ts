import api from "../axios.config";
import type {
  User,
  Ping,
  Stats,
  AnalyticsData,
  PaginatedResponse,
  PaginationParams,
} from "../types/index";

export interface GetAdminPingsParams extends PaginationParams {
  category?: number;
  status?: "POSTED" | "UNDER_REVIEW" | "ARCHIVED";
}

export interface UpdateUserRoleRequest {
  role: "USER" | "ADMIN" | "REPRESENTATIVE";
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  categoryIds?: number[];
}

export interface UpdateAnnouncementRequest {
  title?: string;
  content?: string;
  categoryIds?: number[];
}

/**
 * Admin Service
 * Handles admin-only operations (requires ADMIN role)
 */
const adminService = {
  /**
   * Get platform statistics
   */
  getStats: async (): Promise<Stats> => {
    const response = await api.get<Stats>("/admin/stats");
    return response.data;
  },

  /**
   * Get all pings (admin view with filters)
   * @param params Query parameters for filtering and pagination
   */
  getAllPings: async (
    params?: GetAdminPingsParams
  ): Promise<PaginatedResponse<Ping>> => {
    const response = await api.get<PaginatedResponse<Ping>>("/admin/pings", {
      params,
    });
    return response.data;
  },

  /**
   * Delete any ping (admin privilege)
   * @param id Ping ID
   */
  deletePing: async (id: number): Promise<void> => {
    await api.delete(`/admin/pings/${id}`);
  },

  /**
   * Get all users in organization
   */
  getAllUsers: async (): Promise<User[]> => {
    const response = await api.get<User[]>("/admin/users");
    return response.data;
  },

  /**
   * Get detailed user info including activity
   * @param id User ID
   */
  getUserById: async (id: number): Promise<User> => {
    const response = await api.get<User>(`/admin/users/${id}`);
    return response.data;
  },

  /**
   * Update user role
   * @param id User ID
   * @param data New role
   */
  updateUserRole: async (
    id: number,
    data: UpdateUserRoleRequest
  ): Promise<User> => {
    const response = await api.patch<User>(`/admin/users/${id}/role`, data);
    return response.data;
  },

  /**
   * Create an announcement
   * @param data Announcement details
   */
  createAnnouncement: async (data: CreateAnnouncementRequest): Promise<any> => {
    const response = await api.post("/admin/announcements", data);
    return response.data;
  },

  /**
   * Update an announcement
   * @param id Announcement ID
   * @param data Updated announcement data
   */
  updateAnnouncement: async (
    id: number,
    data: UpdateAnnouncementRequest
  ): Promise<any> => {
    const response = await api.patch(`/admin/announcements/${id}`, data);
    return response.data;
  },

  /**
   * Delete an announcement
   * @param id Announcement ID
   */
  deleteAnnouncement: async (id: number): Promise<void> => {
    await api.delete(`/admin/announcements/${id}`);
  },

  /**
   * Get ping statistics by student level
   */
  getAnalyticsByLevel: async (): Promise<AnalyticsData[]> => {
    const response = await api.get<AnalyticsData[]>(
      "/admin/analytics/by-level"
    );
    return response.data;
  },

  /**
   * Get ping statistics by category
   */
  getAnalyticsByCategory: async (): Promise<AnalyticsData[]> => {
    const response = await api.get<AnalyticsData[]>(
      "/admin/analytics/by-category"
    );
    return response.data;
  },
};

export default adminService;
