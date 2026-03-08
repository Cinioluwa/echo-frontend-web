import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface RegistrationFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface RegistrationState {
  // Temp storage for multi-step registration
  formData: RegistrationFormData | null;

  // Selected org during manual flow
  selectedOrgId: number | null;

  // Actions
  setFormData: (data: RegistrationFormData | null) => void;
  clearFormData: () => void;
  setSelectedOrg: (orgId: number | null) => void;
  clearSelectedOrg: () => void;
  clearAll: () => void;
}

export const useRegistrationStore = create<RegistrationState>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial State
        formData: null,
        selectedOrgId: null,

        // Actions
        setFormData: (data: RegistrationFormData | null) => {
          set((state) => {
            state.formData = data;
          });
        },

        clearFormData: () => {
          set((state) => {
            state.formData = null;
          });
        },

        setSelectedOrg: (orgId: number | null) => {
          set((state) => {
            state.selectedOrgId = orgId;
          });
        },

        clearSelectedOrg: () => {
          set((state) => {
            state.selectedOrgId = null;
          });
        },

        clearAll: () => {
          set((state) => {
            state.formData = null;
            state.selectedOrgId = null;
          });
        },
      })),
      {
        name: "registration-storage",
      },
    ),
    { name: "RegistrationStore" },
  ),
);

// Selectors
export const selectRegistrationFormData = (state: RegistrationState) =>
  state.formData;
export const selectSelectedOrgId = (state: RegistrationState) =>
  state.selectedOrgId;
