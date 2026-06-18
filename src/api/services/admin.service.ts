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
  ReportItem,
  ReportActionDto,
  ReportStatusDto,
  OverviewResponse,
  SurgingIssue,
  TopContributor,
  CommunityMood,
  OrgSettings,
  JoinPolicyDto,
  JoinRequest,
  OfficialResponse,
  CreateOfficialResponseDto,
  UpdateOfficialResponseDto,
  StallingPing,
  PriorityPing,
  UpdateOrgSettingsDto,
  OrgRules,
  UpdateOrgRulesDto,
  ReportsAnalytics,
  FollowUpQueue,
  IssueByCategory,
  SuspendUserDto,
  CategoryUpdateDto,
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
    progressStatus?: string;
    categoryId?: number;
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

  /**
   * Get priority-scored unresolved pings
   * @param params Query parameters
   */
  async getPriorityPings(params?: {
    weeks?: number;
    offsetWeeks?: number;
    limit?: number;
  }): Promise<{ window: any; limit: number; data: PriorityPing[] }> {
    const { data } = await api.get("/admin/pings/priority", { params });
    return data;
  },

  /**
   * Get stalling pings (IN_PROGRESS not updated in N days)
   * @param params Query parameters
   */
  async getStallingPings(params?: {
    staleDays?: number;
    limit?: number;
  }): Promise<{ staleDays: number; limit: number; cutoff: string; count: number; data: StallingPing[] }> {
    const { data } = await api.get("/admin/pings/stalling", { params });
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

  // ==================== Reports ====================

  /**
   * Get all reports in the organization
   * @param params Query parameters for filtering and pagination
   */
  async getReports(params?: {
    page?: number;
    limit?: number;
    status?: "PENDING" | "REVIEWED" | "RESOLVED" | "DISMISSED";
  }): Promise<{ data: ReportItem[]; pagination: { total: number; totalPages: number; currentPage: number; limit: number } }> {
    const { data } = await api.get("/reports", { params });
    return data;
  },

  /**
   * Update report status (review, resolve, or dismiss)
   * @param id Report ID
   * @param dto Status update
   */
  async updateReportStatus(id: number, dto: ReportStatusDto): Promise<ReportItem> {
    const { data } = await api.patch(`/reports/${id}/status`, dto);
    return data;
  },

  /**
   * Apply a moderation action to a report
   * @param id Report ID
   * @param dto Action data
   */
  async applyReportAction(id: number, dto: ReportActionDto): Promise<ReportItem> {
    const { data } = await api.post(`/admin/reports/${id}/action`, dto);
    return data;
  },

  // ==================== Overview Dashboard ====================

  /**
   * Get full KPI dashboard payload
   * @param params Query parameters
   */
  async getOverview(params?: {
    months?: number;
    unresolvedDays?: number;
    topPingsLimit?: number;
    oldestLimit?: number;
  }): Promise<OverviewResponse> {
    const { data } = await api.get("/admin/overview", { params });
    return data;
  },

  /**
   * Get pings with unusual surge activity
   * @param params Query parameters
   */
  async getSurgingIssues(params?: {
    hours?: number;
    offsetHours?: number;
    minEvents?: number;
    limit?: number;
  }): Promise<{ window: any; count: number; items: SurgingIssue[] }> {
    const { data } = await api.get("/admin/overview/surging-issues", { params });
    return data;
  },

  /**
   * Get ranked top contributors
   * @param params Query parameters
   */
  async getTopContributors(params?: {
    days?: number;
    limit?: number;
  }): Promise<{ window: { days: number; start: string; end: string }; items: TopContributor[] }> {
    const { data } = await api.get("/admin/overview/top-contributors", { params });
    return data;
  },

  /**
   * Get community mood / comment sentiment trend
   * @param params Query parameters
   */
  async getCommunityMood(params?: { days?: number }): Promise<CommunityMood> {
    const { data } = await api.get("/admin/overview/community-mood", { params });
    return data;
  },

  // ==================== Organization Settings ====================

  /**
   * Get organization join settings
   */
  async getOrgSettings(): Promise<OrgSettings> {
    const { data } = await api.get("/admin/organization/settings");
    return data;
  },

  /**
   * Update organization join policy
   * @param dto Join policy data
   */
  async updateJoinPolicy(dto: JoinPolicyDto): Promise<OrgSettings> {
    const { data } = await api.patch("/admin/organization/join-policy", dto);
    return data;
  },

  /**
   * Get organization join requests
   * @param params Query parameters
   */
  async getJoinRequests(params?: {
    status?: "PENDING" | "APPROVED" | "REJECTED";
  }): Promise<{ requests: JoinRequest[] }> {
    const { data } = await api.get("/admin/organization/join-requests", { params });
    return data;
  },

  /**
   * Approve a pending join request
   * @param id Join request ID
   */
  async approveJoinRequest(id: number): Promise<{ message: string; requestId: number; userId: number }> {
    const { data } = await api.post(`/admin/organization/join-requests/${id}/approve`);
    return data;
  },

  /**
   * Reject a pending join request
   * @param id Join request ID
   * @param reason Optional reason
   */
  async rejectJoinRequest(id: number, reason?: string): Promise<{ message: string; requestId: number }> {
    const { data } = await api.post(`/admin/organization/join-requests/${id}/reject`, { reason });
    return data;
  },

  // ==================== Official Responses ====================

  /**
   * Create an official response for a ping
   * @param pingId Ping ID
   * @param dto Response content
   */
  async createOfficialResponse(pingId: number, dto: CreateOfficialResponseDto): Promise<OfficialResponse> {
    const { data } = await api.post(`/pings/${pingId}/official-response`, dto);
    return data;
  },

  /**
   * Update an existing official response
   * @param pingId Ping ID
   * @param dto Updated response content
   */
  async updateOfficialResponse(pingId: number, dto: UpdateOfficialResponseDto): Promise<OfficialResponse> {
    const { data } = await api.patch(`/pings/${pingId}/official-response`, dto);
    return data;
  },

  // ==================== Organization Settings (General) ====================

  /**
   * Update organization general settings
   * @param dto Settings to update
   */
  async updateOrgSettings(dto: UpdateOrgSettingsDto): Promise<{ id: number; name: string; description: string | null; logoUrl: string | null; domain: string | null }> {
    const { data } = await api.patch("/admin/organization/settings", dto);
    return data;
  },

  // ==================== Organization Rules ====================

  /**
   * Get organization rules
   */
  async getOrgRules(): Promise<OrgRules> {
    const { data } = await api.get("/admin/organization/rules");
    return data;
  },

  /**
   * Update organization rules
   * @param dto Rules to update
   */
  async updateOrgRules(dto: UpdateOrgRulesDto): Promise<OrgRules> {
    const { data } = await api.patch("/admin/organization/rules", dto);
    return data;
  },

  // ==================== Moderation Analytics ====================

  /**
   * Get moderation summary counts
   */
  async getReportsAnalytics(): Promise<ReportsAnalytics> {
    const { data } = await api.get("/admin/reports/analytics");
    return data;
  },

  // ==================== Follow-Up Queue ====================

  /**
   * Get follow-up queue summary
   * @param params Query parameters
   */
  async getFollowUpQueue(params?: { staleDays?: number }): Promise<FollowUpQueue> {
    const { data } = await api.get("/admin/follow-up-queue", { params });
    return data;
  },

  // ==================== Issues by Category ====================

  /**
   * Get categories with ping counts for soundboard dashboard
   */
  async getIssuesByCategory(): Promise<IssueByCategory[]> {
    const { data } = await api.get("/admin/issues-by-category");
    return data;
  },

  // ==================== Member Management ====================

  /**
   * Suspend a member
   * @param id User ID
   * @param dto Suspension details
   */
  async suspendUser(id: number, dto: SuspendUserDto): Promise<{ userId: number; moderationStatus: string; suspendedUntil: string | null }> {
    const { data } = await api.patch(`/admin/users/${id}/suspend`, dto);
    return data;
  },

  /**
   * Unsuspend a member
   * @param id User ID
   */
  async unsuspendUser(id: number): Promise<{ userId: number; moderationStatus: string; suspendedUntil: null }> {
    const { data } = await api.patch(`/admin/users/${id}/unsuspend`);
    return data;
  },

  /**
   * Remove a member from the organization
   * @param id User ID
   */
  async removeMember(id: number): Promise<{ message: string; userId: number }> {
    const { data } = await api.delete(`/admin/users/${id}`);
    return data;
  },

  // ==================== Categories ====================

  /**
   * Create a new category
   * @param name Category name
   */
  async createCategory(name: string): Promise<{ id: number; name: string }> {
    const { data } = await api.post("/categories", { name });
    return data;
  },

  /**
   * Update a category
   * @param id Category ID
   * @param dto Fields to update
   */
  async updateCategory(id: number, dto: CategoryUpdateDto): Promise<{ id: number; name: string; isActive: boolean }> {
    const { data } = await api.patch(`/categories/${id}`, dto);
    return data;
  },

  /**
   * Delete a category
   * @param id Category ID
   */
  async deleteCategory(id: number): Promise<{ message: string }> {
    const { data } = await api.delete(`/categories/${id}`);
    return data;
  },
};

export default adminService;
