import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import publicService from "../../api/services/public.service";
import searchService from "../../api/services/search.service";
import type { Ping } from "../../api/types/index";
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

interface CachedPingsData {
  data: Ping[];
  dataById: Record<string, Ping>;
  timestamp: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

interface PingsState {
  // Data
  pings: Ping[];
  pingsById: Record<string, Ping>;

  // Category-based cache for stale-while-revalidate
  cache: Record<string, CachedPingsData>;
  currentCacheKey: string | null;

  // Pagination
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;

  // Loading & Error
  isLoading: boolean;
  isFetchingInBackground: boolean;
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
      cache: {},
      currentCacheKey: null,
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      isLoading: false,
      isFetchingInBackground: false,
      error: null,
      lastFetched: null,
      lastParams: null,

      // Actions
      fetchPings: async (params: FetchParams = {}) => {
        const { page = 1, limit = 20, sort = "new", q, category } = params;

        const state = get();

        // Generate cache key based on category and search query
        const cacheKey = `${category || "all"}_${q || "none"}_${sort}`;

        // Check if we have cached data for this category/query
        const cachedData = state.cache[cacheKey];
        const hasCachedData = cachedData && cachedData.data.length > 0;

        // Immediately show cached data if available (stale-while-revalidate)
        if (hasCachedData && state.currentCacheKey !== cacheKey) {
          console.log(`✅ Showing cached data for ${cacheKey}`);
          set((state) => {
            state.pings = cachedData.data;
            state.pingsById = cachedData.dataById;
            state.currentPage = cachedData.pagination.currentPage;
            state.totalPages = cachedData.pagination.totalPages;
            state.hasNextPage = cachedData.pagination.hasNextPage;
            state.currentCacheKey = cacheKey;
            state.error = null; // Clear previous errors when showing cached data
          });

          // Sync surge state from cached data
          const surgedPingIds = cachedData.data
            .filter((ping) => ping.hasSurged)
            .map((ping) => ping.id.toString());
          useSurgeStore.getState().syncFromAPI("ping", surgedPingIds);
        }

        // Check if cache is still fresh (no need to refetch)
        const cacheAge = cachedData
          ? Date.now() - cachedData.timestamp
          : Infinity;
        const isCacheFresh = cacheAge < DEFAULT_CACHE_CONFIG.ttl;

        if (
          isCacheFresh &&
          hasCachedData &&
          page === cachedData.pagination.currentPage
        ) {
          console.log(`✅ Cache is fresh for ${cacheKey}, skipping fetch`);
          return;
        }

        // Prevent duplicate concurrent fetches
        if (state.isLoading || state.isFetchingInBackground) return;

        // Set loading state (background if we have cached data, foreground otherwise)
        set((state) => {
          if (hasCachedData) {
            state.isFetchingInBackground = true;
          } else {
            state.isLoading = true;
          }
          // Don't clear error here - keep showing it with stale data
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

          // Build normalized data
          const dataById: Record<string, Ping> = {};
          response.data.forEach((ping) => {
            dataById[ping.id.toString()] = ping;
          });

          // Update cache and current state
          set((state) => {
            // Update cache for this category/query
            state.cache[cacheKey] = {
              data: response.data,
              dataById,
              timestamp: Date.now(),
              pagination: {
                currentPage: page,
                totalPages: response.pagination.totalPages || 1,
                hasNextPage: response.pagination.hasNextPage || false,
              },
            };

            // Update current view
            state.pings = response.data;
            state.pingsById = dataById;
            state.currentPage = page;
            state.totalPages = response.pagination.totalPages || 1;
            state.hasNextPage = response.pagination.hasNextPage || false;
            state.currentCacheKey = cacheKey;
            state.lastFetched = Date.now();
            state.lastParams = params;
            state.isLoading = false;
            state.isFetchingInBackground = false;
            state.error = null; // Clear error on successful fetch
          });

          // Calculate and set category counts ONLY when fetching all categories (no filters)
          // This ensures counts remain stable when switching between categories
          if (!q && !category) {
            const { counts, total } = calculatePingCategoryCounts(
              response.data,
            );
            useSearchStore.getState().setCategoryCounts(counts, total);
          }

          // Sync surge store with hasSurged data from API
          const surgedPingIds = response.data
            .filter((ping) => ping.hasSurged)
            .map((ping) => ping.id.toString());
          useSurgeStore.getState().syncFromAPI("ping", surgedPingIds);
        } catch (err: any) {
          console.error("Error fetching pings:", err);
          set((state) => {
            // Keep showing cached data, just update error state
            state.error = err.response?.data?.error || "Failed to load pings";
            state.isLoading = false;
            state.isFetchingInBackground = false;
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

        // Increment category count for the new ping's category
        if (ping.category?.id) {
          useSearchStore.getState().incrementCategoryCount(ping.category.id);
        }
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
        let removedPing: Ping | undefined;

        set((state) => {
          removedPing = state.pingsById[id];
          delete state.pingsById[id];
          state.pings = state.pings.filter((p) => p.id.toString() !== id);
        });

        // Decrement category count for the removed ping's category
        if (removedPing?.category?.id) {
          useSearchStore
            .getState()
            .decrementCategoryCount(removedPing.category.id);
        }
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
          state.cache = {};
          state.currentCacheKey = null;
          state.currentPage = 1;
          state.totalPages = 1;
          state.hasNextPage = false;
          state.isLoading = false;
          state.isFetchingInBackground = false;
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
