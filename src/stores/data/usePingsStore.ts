import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import publicService from "../../api/services/public.service";
import searchService from "../../api/services/search.service";
import type { Ping } from "../../api/types";
import { DEFAULT_CACHE_CONFIG } from "../types";
import { useSurgeStore } from "../interactions/useSurgeStore";
import { useSearchStore } from "../ui/useSearchStore";
import { calculatePingCategoryCounts } from "../utils/categoryCounts";

interface FetchParams {
  page?: number;
  limit?: number;
  sort?: "trending" | "new";
  q?: string;
  category?: number;
}

interface PingsState {
  // Data
  pings: Ping[];
  pingsById: Record<string, Ping>;

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
  fetchPings: (params?: FetchParams) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  addPing: (ping: Ping) => void;
  updatePing: (id: string, updates: Partial<Ping>) => void;
  removePing: (id: string) => void;
  invalidateCache: () => void;
  reset: () => void;
}

export const usePingsStore = create<PingsState>()(
  devtools(
    immer((set, get) => ({
      // Initial State
      pings: [],
      pingsById: {},
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      isLoading: false,
      error: null,
      lastFetched: null,
      lastParams: null,

      // Actions
      fetchPings: async (params: FetchParams = {}) => {
        const { page = 1, limit = 20, sort = "trending", q, category } = params;

        const state = get();

        // Check cache validity
        const cacheValid =
          state.lastFetched &&
          Date.now() - state.lastFetched < DEFAULT_CACHE_CONFIG.ttl &&
          JSON.stringify(state.lastParams) === JSON.stringify(params);

        if (cacheValid && state.pings.length > 0) {
          console.log("✅ Using cached pings data");
          return;
        }

        if (state.isLoading) return;

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          let response;

          if (q || category) {
            response = await searchService.searchSoundboard({
              q,
              category,
              page,
              limit,
              sort,
            });
          } else {
            response = await publicService.getSoundboard({
              page,
              limit,
              sort,
            });
          }

          set((state) => {
            state.pings = response.data;

            response.data.forEach((ping) => {
              state.pingsById[ping.id.toString()] = ping;
            });

            state.currentPage = page;
            state.totalPages = response.pagination.totalPages || 1;
            state.hasNextPage = response.pagination.hasNextPage || false;
            state.lastFetched = Date.now();
            state.lastParams = params;
            state.isLoading = false;
          });

          // Calculate and set category counts
          const { counts, total } = calculatePingCategoryCounts(response.data);
          useSearchStore.getState().setCategoryCounts(counts, total);

          // Sync surge store with hasSurged data from API
          const surgedPingIds = response.data
            .filter((ping) => ping.hasSurged)
            .map((ping) => ping.id.toString());
          useSurgeStore.getState().syncFromAPI("ping", surgedPingIds);
        } catch (err: any) {
          console.error("Error fetching pings:", err);
          set((state) => {
            state.error = err.response?.data?.error || "Failed to load pings";
            state.isLoading = false;
          });
        }
      },

      fetchNextPage: async () => {
        const state = get();
        if (!state.hasNextPage || state.isLoading) return;

        const nextPage = state.currentPage + 1;
        await get().fetchPings({ ...state.lastParams, page: nextPage });
      },

      addPing: (ping: Ping) => {
        set((state) => {
          state.pings.unshift(ping);
          state.pingsById[ping.id.toString()] = ping;
        });

        // Recalculate category counts
        const state = get();
        const { counts, total } = calculatePingCategoryCounts(state.pings);
        useSearchStore.getState().setCategoryCounts(counts, total);
      },

      updatePing: (id: string, updates: Partial<Ping>) => {
        set((state) => {
          const ping = state.pingsById[id];
          if (ping) {
            state.pingsById[id] = { ...ping, ...updates };

            const index = state.pings.findIndex((p) => p.id.toString() === id);
            if (index !== -1) {
              state.pings[index] = { ...state.pings[index], ...updates };
            }
          }
        });
      },

      removePing: (id: string) => {
        set((state) => {
          delete state.pingsById[id];
          state.pings = state.pings.filter((p) => p.id.toString() !== id);
        });

        // Recalculate category counts
        const state = get();
        const { counts, total } = calculatePingCategoryCounts(state.pings);
        useSearchStore.getState().setCategoryCounts(counts, total);
      },

      invalidateCache: () => {
        set((state) => {
          state.lastFetched = null;
          state.lastParams = null;
        });
      },

      reset: () => {
        set((state) => {
          state.pings = [];
          state.pingsById = {};
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
    { name: "PingsStore" },
  ),
);

// Selectors
export const selectAllPings = (state: PingsState) => state.pings;
export const selectPingById = (id: string) => (state: PingsState) =>
  state.pingsById[id];
export const selectPingsLoading = (state: PingsState) => state.isLoading;
export const selectPingsError = (state: PingsState) => state.error;
export const selectPingsHasNextPage = (state: PingsState) => state.hasNextPage;

export const selectFilteredPings =
  (categoryId: number | null) => (state: PingsState) => {
    if (!categoryId) return state.pings;
    return state.pings.filter((ping) => ping.category?.id === categoryId);
  };
