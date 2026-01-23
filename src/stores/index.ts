// Re-export all stores
export * from "./auth/useAuthStore";
export * from "./ui/useSearchStore";
export * from "./interactions/useSurgeStore";
export * from "./data/useWavesStore";
export * from "./data/usePingsStore";
export * from "./data/useResolutionsStore";

// Re-export types
export * from "./types";

// Store reset utility (useful for logout)
export const resetAllStores = () => {
  const { useWavesStore } = require("./data/useWavesStore");
  const { usePingsStore } = require("./data/usePingsStore");
  const { useResolutionsStore } = require("./data/useResolutionsStore");
  const { useSurgeStore } = require("./interactions/useSurgeStore");
  const { useSearchStore } = require("./ui/useSearchStore");

  useWavesStore.getState().reset();
  usePingsStore.getState().reset();
  useResolutionsStore.getState().reset();
  useSurgeStore.getState().clearSurges();
  useSearchStore.getState().clearAll();
};
