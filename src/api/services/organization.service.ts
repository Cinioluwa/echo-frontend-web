import api from "../axios.config";
import type { Organization } from "../types/index";

/**
 * Organization Service
 * Handles organization-related API calls
 */
const organizationService = {
  /**
   * Get list of organizations (with optional search)
   * @param query Optional search query
   * @returns Array of organizations
   */
  getOrganizations: async (query?: string): Promise<Organization[]> => {
    const response = await api.get<{ organizations: Organization[] }>(
      "/users/organizations",
      {
        params: query ? { query } : undefined,
      },
    );
    return response.data.organizations;
  },

  /**
   * Get single organization by ID
   * @param id Organization ID
   * @returns Organization details
   */
  getOrganizationById: async (id: number): Promise<Organization> => {
    const response = await api.get<Organization>(`/users/organizations/${id}`);
    return response.data;
  },
};

export default organizationService;
