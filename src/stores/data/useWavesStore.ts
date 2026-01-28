import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import publicService from "../../api/services/public.service";
import searchService from "../../api/services/search.service";
import type { Wave } from "../../api/types";
import { DEFAULT_CACHE_CONFIG } from "../types";
import { useSurgeStore } from "../interactions/useSurgeStore";

interface FetchParams {
  page?: number;
  limit?: number;
  sort?: "trending" | "new";
  days?: number;
  q?: string;
  category?: number;
}

interface WavesState {
  // Data
  waves: Wave[];
  wavesById: Record<string, Wave>; // Normalized data

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
      currentPage: 1,
      totalPages: 1,
      hasNextPage: false,
      isLoading: false,
      error: null,
      lastFetched: null,
      lastParams: null,

      // Actions
      fetchWaves: async (params: FetchParams = {}) => {
        const {
          page = 1,
          limit = 20,
          sort = "trending",
          days = 7,
          q,
          category,
        } = params;

        const state = get();

        // Check cache validity
        const cacheValid =
          state.lastFetched &&
          Date.now() - state.lastFetched < DEFAULT_CACHE_CONFIG.ttl &&
          JSON.stringify(state.lastParams) === JSON.stringify(params);

        if (cacheValid && state.waves.length > 0) {
          console.log("✅ Using cached waves data");
          return;
        }

        // Prevent duplicate concurrent fetches
        if (state.isLoading) return;

        set((state) => {
          state.isLoading = true;
          state.error = null;
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

          set((state) => {
            // Store as array
            state.waves = response.data;

            // Normalize into object for quick lookups
            response.data.forEach((wave) => {
              state.wavesById[wave.id.toString()] = wave;
            });

            // Update pagination
            state.currentPage = page;
            state.totalPages = response.pagination.totalPages || 1;
            state.hasNextPage = response.pagination.hasNextPage || false;

            // Update cache
            state.lastFetched = Date.now();
            state.lastParams = params;
            state.isLoading = false;
          });

          // Sync surge store with hasSurged data from API
          const surgedWaveIds = response.data
            .filter((wave) => wave.hasSurged)
            .map((wave) => wave.id.toString());
          useSurgeStore.getState().syncFromAPI("wave", surgedWaveIds);
        } catch (err: any) {
          console.error("Error fetching waves:", err);
          set((state) => {
            state.error = err.response?.data?.error || "Failed to load waves";
            state.isLoading = false;
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
