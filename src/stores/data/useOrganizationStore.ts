import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { organizationService, authService } from "../../api/services";
import type {
  Organization,
  OrganizationWaitlistRequest,
} from "../../api/types/index";

interface OrganizationState {
  // Data
  organizations: Organization[];
  selectedOrganization: Organization | null;

  // Loading
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchOrganizations: (query?: string) => Promise<void>;
  selectOrganization: (orgId: number) => void;
  clearSelection: () => void;
  requestNewOrganization: (data: OrganizationWaitlistRequest) => Promise<void>;
  clearError: () => void;
}

export const useOrganizationStore = create<OrganizationState>()(
  devtools(
    immer((set, get) => ({
      // Initial State
      organizations: [],
      selectedOrganization: null,
      isLoading: false,
      error: null,

      // Actions
      fetchOrganizations: async (query?: string) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const organizations =
            await organizationService.getOrganizations(query);
          set((state) => {
            state.organizations = organizations;
            state.isLoading = false;
          });
        } catch (err: any) {
          console.error("Error fetching organizations:", err);
          const errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to load organizations";
          set((state) => {
            state.error = errorMessage;
            state.isLoading = false;
          });
          throw err;
        }
      },

      selectOrganization: (orgId: number) => {
        const org = get().organizations.find((o) => o.id === orgId);
        if (org) {
          set((state) => {
            state.selectedOrganization = org;
          });
        }
      },

      clearSelection: () => {
        set((state) => {
          state.selectedOrganization = null;
        });
      },

      requestNewOrganization: async (data: OrganizationWaitlistRequest) => {
        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          await authService.joinOrganizationWaitlist(data);
          set((state) => {
            state.isLoading = false;
          });
        } catch (err: any) {
          console.error("Error requesting new organization:", err);
          const errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            "Failed to submit request";
          set((state) => {
            state.error = errorMessage;
            state.isLoading = false;
          });
          throw err;
        }
      },

      clearError: () => {
        set((state) => {
          state.error = null;
        });
      },
    })),
    { name: "OrganizationStore" },
  ),
);

// Selectors
export const selectOrganizations = (state: OrganizationState) =>
  state.organizations;
export const selectSelectedOrganization = (state: OrganizationState) =>
  state.selectedOrganization;
export const selectOrganizationLoading = (state: OrganizationState) =>
  state.isLoading;
export const selectOrganizationError = (state: OrganizationState) =>
  state.error;
