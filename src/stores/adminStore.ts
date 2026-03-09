import { create } from "zustand";
import type {
  PlatformStats,
  AdminPing,
  AdminWave,
  PaginationMeta,
} from "../api/types/admin.types";

interface AdminState {
  // Stats
  stats: PlatformStats | null;
  statsLoading: boolean;
  statsError: string | null;

  // Pings
  pings: AdminPing[];
  pingsLoading: boolean;
  pingsError: string | null;
  pingsPagination: PaginationMeta | null;

  // Waves
  waves: AdminWave[];
  wavesLoading: boolean;
  wavesError: string | null;
  wavesPagination: PaginationMeta | null;

  // Actions
  setStats: (stats: PlatformStats) => void;
  setStatsLoading: (loading: boolean) => void;
  setStatsError: (error: string | null) => void;

  setPings: (pings: AdminPing[], pagination?: PaginationMeta) => void;
  setPingsLoading: (loading: boolean) => void;
  setPingsError: (error: string | null) => void;

  setWaves: (waves: AdminWave[], pagination?: PaginationMeta) => void;
  setWavesLoading: (loading: boolean) => void;
  setWavesError: (error: string | null) => void;

  updateWaveInList: (id: number, updates: Partial<AdminWave>) => void;
  updatePingInList: (id: number, updates: Partial<AdminPing>) => void;
  removePingFromList: (id: number) => void;

  reset: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  // Initial state
  stats: null,
  statsLoading: false,
  statsError: null,

  pings: [],
  pingsLoading: false,
  pingsError: null,
  pingsPagination: null,

  waves: [],
  wavesLoading: false,
  wavesError: null,
  wavesPagination: null,

  // Stats Actions
  setStats: (stats) => set({ stats, statsError: null }),
  setStatsLoading: (loading) => set({ statsLoading: loading }),
  setStatsError: (error) => set({ statsError: error }),

  // Pings Actions
  setPings: (pings, pagination) =>
    set({ pings, pingsPagination: pagination ?? null, pingsError: null }),
  setPingsLoading: (loading) => set({ pingsLoading: loading }),
  setPingsError: (error) => set({ pingsError: error }),

  // Waves Actions
  setWaves: (waves, pagination) =>
    set({ waves, wavesPagination: pagination ?? null, wavesError: null }),
  setWavesLoading: (loading) => set({ wavesLoading: loading }),
  setWavesError: (error) => set({ wavesError: error }),

  // Update Actions
  updateWaveInList: (id, updates) =>
    set((state) => ({
      waves: state.waves.map((wave) =>
        wave.id === id ? { ...wave, ...updates } : wave,
      ),
    })),

  updatePingInList: (id, updates) =>
    set((state) => ({
      pings: state.pings.map((ping) =>
        ping.id === id ? { ...ping, ...updates } : ping,
      ),
    })),

  removePingFromList: (id) =>
    set((state) => ({
      pings: state.pings.filter((ping) => ping.id !== id),
    })),

  // Reset
  reset: () =>
    set({
      stats: null,
      pings: [],
      waves: [],
      statsLoading: false,
      pingsLoading: false,
      wavesLoading: false,
      statsError: null,
      pingsError: null,
      wavesError: null,
      pingsPagination: null,
      wavesPagination: null,
    }),
}));
