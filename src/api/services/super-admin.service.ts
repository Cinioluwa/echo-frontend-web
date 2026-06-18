import api from "../axios.config";
import type {
  SuperAdminStats,
  SuperAdminOrganization,
  SuperAdminUser,
} from "../types/admin.types";

/**
 * Super Admin Service
 * Handles platform-wide super admin operations (requires SUPER_ADMIN role)
 */
export const superAdminService = {
  /**
   * Get platform-wide aggregate stats
   */
  async getStats(): Promise<SuperAdminStats> {
    const { data } = await api.get("/super-admin/stats");
    return data;
  },

  /**
   * List all organizations with user/ping counts
   * @param params Query parameters
   */
  async getOrganizations(params?: {
    status?: "PENDING" | "ACTIVE";
    page?: number;
    limit?: number;
  }): Promise<{
    organizations: SuperAdminOrganization[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { data } = await api.get("/super-admin/organizations", { params });
    return data;
  },

  /**
   * Activate or deactivate an organization
   * @param id Organization ID
   * @param status New status
   */
  async updateOrganizationStatus(
    id: number,
    status: "ACTIVE" | "PENDING",
  ): Promise<{ organization: { id: number; name: string; domain: string | null; status: string } }> {
    const { data } = await api.patch(`/super-admin/organizations/${id}/status`, { status });
    return data;
  },

  /**
   * Edit organization details
   * @param id Organization ID
   * @param dto Fields to update
   */
  async updateOrganization(
    id: number,
    dto: {
      name?: string;
      domain?: string | null;
      joinPolicy?: "OPEN" | "REQUIRES_APPROVAL";
    },
  ): Promise<{ organization: SuperAdminOrganization }> {
    const { data } = await api.patch(`/super-admin/organizations/${id}`, dto);
    return data;
  },

  /**
   * List all users across organizations
   * @param params Query parameters
   */
  async getUsers(params?: {
    orgId?: number;
    role?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    users: SuperAdminUser[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { data } = await api.get("/super-admin/users", { params });
    return data;
  },

  /**
   * Activate or deactivate (ban) a user
   * @param id User ID
   * @param status New status
   */
  async updateUserStatus(
    id: number,
    status: "ACTIVE" | "PENDING",
  ): Promise<{ user: { id: number; email: string; role: string; status: string } }> {
    const { data } = await api.patch(`/super-admin/users/${id}/status`, { status });
    return data;
  },

  /**
   * Set a user's role (unrestricted)
   * @param id User ID
   * @param role New role
   */
  async updateUserRole(
    id: number,
    role: "USER" | "REPRESENTATIVE" | "ADMIN" | "SUPER_ADMIN",
  ): Promise<{ user: { id: number; email: string; firstName: string; lastName: string; role: string; status: string } }> {
    const { data } = await api.patch(`/super-admin/users/${id}/role`, { role });
    return data;
  },

  /**
   * Auto-reject stale organization requests
   * @param params Cleanup parameters
   */
  async cleanupStaleRequests(params?: {
    dryRun?: boolean;
    olderThanDays?: number;
  }): Promise<{
    affected: number;
    dryRun: boolean;
    requests: Array<{
      id: number;
      domain: string | null;
      organizationName: string;
      requesterEmail: string;
      createdAt: string;
    }>;
  }> {
    const { data } = await api.post("/super-admin/maintenance/cleanup-stale-requests", params);
    return data;
  },

  /**
   * Purge expired/used verification tokens
   * @param params Purge parameters
   */
  async purgeExpiredTokens(params?: { dryRun?: boolean }): Promise<{
    dryRun: boolean;
    emailVerificationTokens: { affected: number };
    passwordResetTokens: { affected: number };
  }> {
    const { data } = await api.post("/super-admin/maintenance/purge-expired-tokens", params);
    return data;
  },

  /**
   * Trigger weekly digest generation (fire-and-forget)
   */
  async triggerDigest(): Promise<{ message: string }> {
    const { data } = await api.post("/super-admin/trigger-digest");
    return data;
  },
};

export default superAdminService;
