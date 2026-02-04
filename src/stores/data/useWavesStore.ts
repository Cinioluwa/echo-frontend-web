import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import publicService from "../../api/services/public.service";
import searchService from "../../api/services/search.service";
import type { Wave } from "../../api/types/index";
import { DEFAULT_CACHE_CONFIG } from "../types";
import { useSurgeStore } from "../interactions/useSurgeStore";
import { useSearchStore } from "../ui/useSearchStore";
import { calculateWaveCategoryCounts } from "../utils/categoryCounts";

interface FetchParams {
  page?: number;
  limit?: number;
  sort?: "trending" | "new";
  days?: number;
  q?: string;
  category?: number;
}

interface CachedWavesData {
  data: Wave[];
  dataById: Record<string, Wave>;
  timestamp: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
  };
}

interface WavesState {
  // Data
  waves: Wave[];
  wavesById: Record<string, Wave>; // Normalized data

  // Category-based cache for stale-while-revalidate
  cache: Record<string, CachedWavesData>;
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
  fetchWaves: (params?: FetchParams) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  addWave: (wave: Wave) => void;
  updateWave: (id: string, updates: Partial<Wave>) => void;
  removeWave: (id: string) => void;
  invalidateCache: () => void;
  reset: () => void;
}

export const useWavesStore = create<WavesState>()(
  devtools(
    immer((set, get) => ({
      // Initial State
      waves: [],
      wavesById: {},
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
      fetchWaves: async (params: FetchParams = {}) => {
        const {
          page = 1,
          limit = 20,
          sort = "new",
          days = 7,
          q,
          category,
        } = params;

        const state = get();

        // Generate cache key based on category and search query
        const cacheKey = `${category || "all"}_${q || "none"}_${sort}_${days}`;

        // Check if we have cached data for this category/query
        const cachedData = state.cache[cacheKey];
        const hasCachedData = cachedData && cachedData.data.length > 0;

        // Immediately show cached data if available (stale-while-revalidate)
        if (hasCachedData && state.currentCacheKey !== cacheKey) {
          console.log(`✅ Showing cached data for ${cacheKey}`);
          set((state) => {
            state.waves = cachedData.data;
            state.wavesById = cachedData.dataById;
            state.currentPage = cachedData.pagination.currentPage;
            state.totalPages = cachedData.pagination.totalPages;
            state.hasNextPage = cachedData.pagination.hasNextPage;
            state.currentCacheKey = cacheKey;
            state.error = null; // Clear previous errors when showing cached data
          });

          // Sync surge state from cached data
          const surgedWaveIds = cachedData.data
            .filter((wave) => wave.hasSurged)
            .map((wave) => wave.id.toString());
          useSurgeStore.getState().syncFromAPI("wave", surgedWaveIds);
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
            response = await searchService.searchStream({
              q,
              category,
              page,
              limit,
              sort,
            });
          } else {
            response = await publicService.getStream({
              page,
              limit,
              sort,
              days,
            });
          }

          // Build normalized data
          const dataById: Record<string, Wave> = {};
          response.data.forEach((wave) => {
            dataById[wave.id.toString()] = wave;
          });

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
            state.waves = response.data;
            state.wavesById = dataById;
            state.currentPage = page;
            state.totalPages = response.pagination.totalPages || 1;
            state.hasNextPage = response.pagination.hasNextPage || false;
            state.currentCacheKey = cacheKey;

            // Update cache timestamps
            state.lastFetched = Date.now();
            state.lastParams = params;
            state.isLoading = false;
            state.isFetchingInBackground = false;
            state.error = null; // Clear error on successful fetch
          });

          // Calculate and set category counts
          const { counts, total } = calculateWaveCategoryCounts(response.data);
          useSearchStore.getState().setCategoryCounts(counts, total);

          // Sync surge store with hasSurged data from API
          const surgedWaveIds = response.data
            .filter((wave) => wave.hasSurged)
            .map((wave) => wave.id.toString());
          useSurgeStore.getState().syncFromAPI("wave", surgedWaveIds);
        } catch (err: any) {
          console.error("Error fetching waves:", err);
          set((state) => {
            // Keep showing cached data, just update error state
            state.error = err.response?.data?.error || "Failed to load waves";
            state.isLoading = false;
            state.isFetchingInBackground = false;
          });
        }
      },

      fetchNextPage: async () => {
        const state = get();
        if (!state.hasNextPage || state.isLoading) return;

        const nextPage = state.currentPage + 1;
        const params = { ...state.lastParams, page: nextPage };

        await get().fetchWaves(params);
      },

      addWave: (wave: Wave) => {
        set((state) => {
          state.waves.unshift(wave);
          state.wavesById[wave.id.toString()] = wave;
        });

        // Recalculate category counts
        const state = get();
        const { counts, total } = calculateWaveCategoryCounts(state.waves);
        useSearchStore.getState().setCategoryCounts(counts, total);
      },

      updateWave: (id: string, updates: Partial<Wave>) => {
        set((state) => {
          const wave = state.wavesById[id];
          if (wave) {
            state.wavesById[id] = { ...wave, ...updates };

            // Update in array
            const index = state.waves.findIndex((w) => w.id.toString() === id);
            if (index !== -1) {
              state.waves[index] = { ...state.waves[index], ...updates };
            }
          }
        });
      },

      removeWave: (id: string) => {
        set((state) => {
          delete state.wavesById[id];
          state.waves = state.waves.filter((w) => w.id.toString() !== id);
        });

        // Recalculate category counts
        const state = get();
        const { counts, total } = calculateWaveCategoryCounts(state.waves);
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
          state.waves = [];
          state.wavesById = {};
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
    { name: "WavesStore" },
  ),
);

// Selectors
export const selectAllWaves = (state: WavesState) => state.waves;
export const selectWaveById = (id: string) => (state: WavesState) =>
  state.wavesById[id];
export const selectWavesLoading = (state: WavesState) => state.isLoading;
export const selectWavesError = (state: WavesState) => state.error;
export const selectHasNextPage = (state: WavesState) => state.hasNextPage;

// Filtered selectors
export const selectFilteredWaves =
  (categoryId: number | null) => (state: WavesState) => {
    if (!categoryId) return state.waves;

    return state.waves.filter((wave) => {
      const waveCategoryId = wave.category?.id || wave.ping?.category?.id;
      return waveCategoryId === categoryId;
    });
  };
