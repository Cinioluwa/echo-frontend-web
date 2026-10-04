import api from "../axios.config";
import type { Organization } from "../types/index";

export interface InstitutionStatus {
  organizationId: number;
  organizationName: string;
  claimStatus: "UNCLAIMED" | "FOUNDING_PARTNER" | "VERIFIED";
  hasLeader: boolean;
  hasActiveRepresentatives: boolean;
}

const organizationService = {
  getOrganizations: async (query?: string): Promise<Organization[]> => {
    const response = await api.get<{ organizations: Organization[] }>(
      "/users/organizations",
      {
        params: query ? { query } : undefined,
      },
    );
    return response.data.organizations;
  },

  getOrganizationById: async (id: number): Promise<Organization> => {
    const response = await api.get<Organization>(`/users/organizations/${id}`);
    return response.data;
  },

  getInstitutionStatus: async (orgId: number): Promise<InstitutionStatus> => {
    const response = await api.get<InstitutionStatus>(
      `/public/organizations/${orgId}/institution-status`,
    );
    return response.data;
  },

  submitLeadershipClaim: async (
    orgId: number,
    data: { role: string; department?: string },
  ): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/users/organizations/${orgId}/claim-existing`,
      data,
    );
    return response.data;
  },

  nominateAdmin: async (
    orgId: number,
    data: {
      proposedContactName: string;
      proposedContactEmail: string;
      message?: string;
    },
  ): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>(
      `/public/organizations/${orgId}/nominate-admin`,
      data,
    );
    return response.data;
  },
};

export default organizationService;
