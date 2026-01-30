import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import publicService from "../../api/services/public.service";
import type { ResolutionLog } from "../../api/types/index";
import { DEFAULT_CACHE_CONFIG } from "../types";

interface FetchParams {
  page?: number;
  limit?: number;
  days?: "all" | number;
}

interface ResolutionsState {
  // Data
  resolutions: ResolutionLog[];
  resolutionsById: Record<string, ResolutionLog>;

  // Pagination
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;

  // Loading & Error
  isLoading: boolean;
  error: string | null;

  // Cache
  lastFetched: number | null;
  lastParams: FetchParams | null;

  // Actions
  fetchResolutions: (params?: FetchParams) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  addResolution: (resolution: ResolutionLog) => void;
  invalidateCache: () => void;
  reset: () => void;
}

export const useResolutionsStore = create<ResolutionsState>()(
  devtools(
    immer((set, get) => ({
      // Initial State
      resolutions: [],
      resolutionsById: {},
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      isLoading: false,
      error: null,
      lastFetched: null,
      lastParams: null,

      // Actions
      fetchResolutions: async (params: FetchParams = {}) => {
        const { page = 1, limit = 20, days = "all" } = params;

        const state = get();

        // Check cache
        const cacheValid =
          state.lastFetched &&
          Date.now() - state.lastFetched < DEFAULT_CACHE_CONFIG.ttl &&
          JSON.stringify(state.lastParams) === JSON.stringify(params);

        if (cacheValid && state.resolutions.length > 0) {
          console.log("✅ Using cached resolutions data");
          return;
        }

        if (state.isLoading) return;

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await publicService.getResolutionLog({
            page,
            limit,
            days,
          });

          set((state) => {
            state.resolutions = response.data;

            response.data.forEach((resolution) => {
              state.resolutionsById[resolution.id.toString()] = resolution;
            });

            state.currentPage = page;
            state.totalPages = response.pagination.totalPages || 1;
            state.hasNextPage = response.pagination.hasNextPage || false;
            state.lastFetched = Date.now();
            state.lastParams = params;
            state.isLoading = false;
          });
        } catch (err: any) {
          console.error("Error fetching resolutions:", err);
          set((state) => {
            state.error =
              err.response?.data?.error || "Failed to load resolution history";
            state.isLoading = false;
          });
        }
      },

      fetchNextPage: async () => {
        const state = get();
        if (!state.hasNextPage || state.isLoading) return;

        const nextPage = state.currentPage + 1;
        await get().fetchResolutions({ ...state.lastParams, page: nextPage });
      },

      addResolution: (resolution: ResolutionLog) => {
        set((state) => {
          state.resolutions.unshift(resolution);
          state.resolutionsById[resolution.id.toString()] = resolution;
        });
      },

      invalidateCache: () => {
        set((state) => {
          state.lastFetched = null;
          state.lastParams = null;
        });
      },

      reset: () => {
        set((state) => {
          state.resolutions = [];
          state.resolutionsById = {};
          state.currentPage = 1;
          state.totalPages = 1;
          state.hasNextPage = false;
          state.isLoading = false;
          state.error = null;
          state.lastFetched = null;
          state.lastParams = null;
        });
      },
    })),
    { name: "ResolutionsStore" },
  ),
);

// Selectors
export const selectAllResolutions = (state: ResolutionsState) =>
  state.resolutions;
export const selectResolutionById = (id: string) => (state: ResolutionsState) =>
  state.resolutionsById[id];
export const selectResolutionsLoading = (state: ResolutionsState) =>
  state.isLoading;
export const selectResolutionsError = (state: ResolutionsState) => state.error;

export const selectFilteredResolutions =
  (categoryId: number | null) => (state: ResolutionsState) => {
    if (!categoryId) return state.resolutions;
    return state.resolutions.filter((r) => r.category?.id === categoryId);
  };

// Grouped by date selector
export const selectGroupedResolutions =
  (categoryId: number | null) => (state: ResolutionsState) => {
    const filtered = selectFilteredResolutions(categoryId)(state);
    const groups: { [key: string]: ResolutionLog[] } = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filtered.forEach((resolution) => {
      const resolutionDate = new Date(resolution.resolvedAt);
      resolutionDate.setHours(0, 0, 0, 0);

      const diffTime = today.getTime() - resolutionDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      let dateLabel: string;
      if (diffDays === 0) {
        dateLabel = "Today";
      } else if (diffDays === 1) {
        dateLabel = "Yesterday";
      } else {
        dateLabel = resolutionDate.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      }

      if (!groups[dateLabel]) {
        groups[dateLabel] = [];
      }
      groups[dateLabel].push(resolution);
    });

    return groups;
  };
