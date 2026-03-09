import api from "../axios.config";
import type {
  PlatformStats,
  AdminPing,
  AdminWave,
  PaginatedResponse,
  Announcement,
  CreateAnnouncementDto,
  UpdateWaveStatusDto,
  UpdatePingProgressDto,
} from "../types/admin.types";
import type { User } from "../types/index";

/**
 * Admin Service
 * Handles admin-only operations (requires ADMIN role)
 */
export const adminService = {
  // ==================== Stats ====================

  /**
   * Get platform statistics
   */
  async getStats(): Promise<PlatformStats> {
    const { data } = await api.get("/admin/stats");
    return data;
  },

  // ==================== Pings ====================

  /**
   * Get all pings (admin view with filters)
   * @param params Query parameters for filtering and pagination
   */
  async getPings(params?: {
    page?: number;
    limit?: number;
    category?: number;
    status?: string;
  }): Promise<PaginatedResponse<AdminPing>> {
    const { data } = await api.get("/admin/pings", { params });
    return data;
  },

  /**
   * Delete any ping (admin privilege)
   * @param id Ping ID
   */
  async deletePing(id: number): Promise<void> {
    await api.delete(`/admin/pings/${id}`);
  },

  /**
   * Acknowledge a ping (mark as seen/acknowledged by admin)
   * @param id Ping ID
   */
  async acknowledgePing(id: number): Promise<AdminPing> {
    const { data } = await api.post(`/admin/pings/${id}/acknowledge`);
    return data;
  },

  /**
   * Mark a ping as resolved
   * @param id Ping ID
   */
  async resolvePing(id: number): Promise<AdminPing> {
    const { data } = await api.post(`/admin/pings/${id}/resolve`);
    return data;
  },

  /**
   * Update ping progress status
   * @param id Ping ID
   * @param dto Status update data
   */
  async updatePingProgress(
    id: number,
    dto: UpdatePingProgressDto,
  ): Promise<AdminPing> {
    const { data } = await api.patch(`/admin/pings/${id}/progress-status`, dto);
    return data;
  },

  // ==================== Waves ====================

  /**
   * Get all waves (admin view with filters)
   * @param params Query parameters for filtering and pagination
   */
  async getWaves(params?: {
    page?: number;
    limit?: number;
    status?: "POSTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
  }): Promise<PaginatedResponse<AdminWave>> {
    const { data } = await api.get("/admin/waves", { params });
    return data;
  },

  /**
   * Update wave status (approve, reject, etc.)
   * @param id Wave ID
   * @param dto Status update data
   */
  async updateWaveStatus(
    id: number,
    dto: UpdateWaveStatusDto,
  ): Promise<AdminWave> {
    const { data } = await api.patch(`/admin/waves/${id}/status`, dto);
    return data;
  },

  // ==================== Announcements ====================

  /**
   * Create an announcement
   * @param dto Announcement details
   */
  async createAnnouncement(dto: CreateAnnouncementDto): Promise<Announcement> {
    const { data } = await api.post("/admin/announcements", dto);
    return data;
  },

  /**
   * Update an announcement
   * @param id Announcement ID
   * @param dto Updated announcement data
   */
  async updateAnnouncement(
    id: number,
    dto: Partial<CreateAnnouncementDto>,
  ): Promise<Announcement> {
    const { data } = await api.patch(`/admin/announcements/${id}`, dto);
    return data;
  },

  /**
   * Delete an announcement
   * @param id Announcement ID
   */
  async deleteAnnouncement(id: number): Promise<void> {
    await api.delete(`/admin/announcements/${id}`);
  },

  // ==================== Users ====================

  /**
   * Get all users in organization
   */
  async getUsers(): Promise<User[]> {
    const { data } = await api.get("/admin/users");
    return data;
  },

  /**
   * Get detailed user info including activity
   * @param id User ID
   */
  async getUserById(id: number): Promise<User> {
    const { data } = await api.get(`/admin/users/${id}`);
    return data;
  },

  /**
   * Update user role
   * @param id User ID
   * @param role New role
   */
  async updateUserRole(
    id: number,
    role: "USER" | "ADMIN" | "REPRESENTATIVE",
  ): Promise<User> {
    const { data } = await api.patch(`/admin/users/${id}/role`, {
      role,
    });
    return data;
  },
};

export default adminService;
