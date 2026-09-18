import api from "../axios.config";
import axios from "axios";
import type { Organization } from "../types/index";

// Unauthed axios instance — used for endpoints that must not carry a Bearer token
// (e.g. the claim flow, which is a pre-registration step)
const unauthApi = axios.create({
  baseURL: "https://echo-backend-twvk.onrender.com/api",
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

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

  /**
   * Submit a leadership claim for a preseeded organization.
   * Auth Required: No — uses unauthed axios instance.
   * @param orgId Organization ID
   * @param data Claim payload
   */
  claimOrganization: async (
    orgId: number,
    data: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
      metadata?: { role?: string; department?: string };
    },
  ): Promise<{ message: string }> => {
    const response = await unauthApi.post<{ message: string }>(
      `/users/organizations/${orgId}/claim`,
      data,
    );
    return response.data;
  },

  /**
   * Invite a leader to claim the organization.
   * Requires new backend endpoint: POST /api/organization/:id/invite-leader
   * @param orgId Organization ID
   * @param data Invite payload
   */
  inviteLeader: async (
    orgId: number,
    data: { name: string; email: string; proofLink: string },
  ): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/public/organizations/${orgId}/invite-leader`,
      data,
    );
    return response.data;
  },

  /**
   * Get leader status of an organization.
   * @param orgId Organization ID
   * @returns Object containing hasLeader boolean
   */
  getLeaderStatus: async (
    orgId: number,
  ): Promise<{ hasLeader: boolean }> => {
    const response = await api.get<{ hasLeader: boolean }>(
      `/public/organizations/${orgId}/leader-status`,
    );
    return response.data;
  },
};

export default organizationService;
