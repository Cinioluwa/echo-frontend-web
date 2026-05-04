// Import stores directly for reset utility
import { useWavesStore } from "./data/useWavesStore";
import { usePingsStore } from "./data/usePingsStore";
import { useResolutionsStore } from "./data/useResolutionsStore";
import { useCategoriesStore } from "./data/useCategoriesStore";
import { useOrganizationStore } from "./data/useOrganizationStore";
import { useSurgeStore } from "./interactions/useSurgeStore";
import { useSearchStore } from "./ui/useSearchStore";
import { useRegistrationStore } from "./ui/useRegistrationStore";
import { useAdminStore } from "./adminStore";

// Re-export all stores
export * from "./auth/useAuthStore";
export * from "./ui/useSearchStore";
export * from "./ui/useRegistrationStore";
export * from "./interactions/useSurgeStore";
export * from "./data/useWavesStore";
export * from "./data/usePingsStore";
export * from "./data/useResolutionsStore";
export * from "./data/useCategoriesStore";
export * from "./data/useOrganizationStore";
export * from "./adminStore";
export * from "./ui/useNotificationStore";

// Re-export types
export * from "./types";

// Store reset utility (useful for logout)
export const resetAllStores = () => {
  useWavesStore.getState().reset();
  usePingsStore.getState().reset();
  useResolutionsStore.getState().reset();
  useCategoriesStore.getState().reset();
  useSurgeStore.getState().clearSurges();
  useSearchStore.getState().clearAll();
  useOrganizationStore.getState().clearSelection();
  useOrganizationStore.getState().clearError();
  useRegistrationStore.getState().clearAll();
  useAdminStore.getState().reset();
};
