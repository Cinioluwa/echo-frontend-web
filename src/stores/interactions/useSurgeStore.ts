import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import surgeService from "../../api/services/surge.service";
import { usePingsStore } from "../data/usePingsStore";
import { useWavesStore } from "../data/useWavesStore";

type SurgeType = "wave" | "ping";

interface SurgeState {
  // State
  surgedWaves: Set<string>;
  surgedPings: Set<string>;
  isToggling: Record<string, boolean>; // Track ongoing requests

  // Actions
  toggleSurge: (type: SurgeType, id: string) => Promise<boolean>;
  hasSurged: (type: SurgeType, id: string) => boolean;
  addSurge: (type: SurgeType, id: string) => void;
  removeSurge: (type: SurgeType, id: string) => void;
  clearSurges: () => void;
  syncFromAPI: (type: SurgeType, surgedIds: string[]) => void;
}

export const useSurgeStore = create<SurgeState>()(
  devtools(
    persist(
      immer((set, get) => ({
        // Initial State
        surgedWaves: new Set<string>(),
        surgedPings: new Set<string>(),
        isToggling: {},

        // Actions
        toggleSurge: async (type: SurgeType, id: string) => {
          const key = `${type}-${id}`;

          // Prevent duplicate requests
          if (get().isToggling[key]) {
            return get().hasSurged(type, id);
          }

          // Mark as toggling
          set((state) => {
            state.isToggling[key] = true;
          });

          const setKey = type === "wave" ? "surgedWaves" : "surgedPings";
          const currentSurgeSet = get()[setKey];
          const wasSurged = currentSurgeSet.has(id);

          // Optimistic update
          set((state) => {
            if (wasSurged) {
              state[setKey].delete(id);
            } else {
              state[setKey].add(id);
            }
          });

          try {
            const response = await surgeService.toggleSurge(type, id);

            // Sync with API response
            set((state) => {
              if (response.surged) {
                state[setKey].add(id);
              } else {
                state[setKey].delete(id);
              }
              delete state.isToggling[key];
            });

            // Update surge count and hasSurged in the data stores
            // When surging: increment count, when unsurging: decrement count
            if (type === "ping") {
              const ping = usePingsStore.getState().pingsById[id];
              if (ping) {
                const countChange = response.surged ? 1 : -1;
                const newSurgeCount = Math.max(
                  0,
                  ping.surgeCount + countChange,
                );
                usePingsStore.getState().updatePing(id, {
                  surgeCount: newSurgeCount,
                  hasSurged: response.surged,
                });
              }
            } else if (type === "wave") {
              const wave = useWavesStore.getState().wavesById[id];
              if (wave) {
                const countChange = response.surged ? 1 : -1;
                const newSurgeCount = Math.max(
                  0,
                  wave.surgeCount + countChange,
                );
                useWavesStore.getState().updateWave(id, {
                  surgeCount: newSurgeCount,
                  hasSurged: response.surged,
                });
              }
            }

            return response.surged;
          } catch (error) {
            console.error(`Error toggling ${type} surge:`, error);

            // Revert on error
            set((state) => {
              if (wasSurged) {
                state[setKey].add(id);
              } else {
                state[setKey].delete(id);
              }
              delete state.isToggling[key];
            });

            throw error;
          }
        },

        hasSurged: (type: SurgeType, id: string) => {
          const setKey = type === "wave" ? "surgedWaves" : "surgedPings";
          return get()[setKey].has(id);
        },

        addSurge: (type: SurgeType, id: string) => {
          set((state) => {
            const setKey = type === "wave" ? "surgedWaves" : "surgedPings";
            state[setKey].add(id);
          });
        },

        removeSurge: (type: SurgeType, id: string) => {
          set((state) => {
            const setKey = type === "wave" ? "surgedWaves" : "surgedPings";
            state[setKey].delete(id);
          });
        },

        clearSurges: () => {
          set((state) => {
            state.surgedWaves.clear();
            state.surgedPings.clear();
          });
        },

        syncFromAPI: (type: SurgeType, surgedIds: string[]) => {
          set((state) => {
            const setKey = type === "wave" ? "surgedWaves" : "surgedPings";
            state[setKey] = new Set(surgedIds);
          });
        },
      })),
      {
        name: "surge-storage",
        // Custom serialization for Sets
        storage: {
          getItem: (name) => {
            const str = localStorage.getItem(name);
            if (!str) return null;
            const parsed = JSON.parse(str);
            return {
              state: {
                surgedWaves: new Set(parsed.state?.surgedWaves || []),
                surgedPings: new Set(parsed.state?.surgedPings || []),
                isToggling: {},
              },
            };
          },
          setItem: (name, value) => {
            const serialized = {
              state: {
                surgedWaves: Array.from(value.state.surgedWaves),
                surgedPings: Array.from(value.state.surgedPings),
              },
            };
            localStorage.setItem(name, JSON.stringify(serialized));
          },
          removeItem: (name) => localStorage.removeItem(name),
        },
      },
    ),
    { name: "SurgeStore" },
  ),
);

// Selectors
export const selectHasSurgedWave = (id: string) => (state: SurgeState) =>
  state.surgedWaves.has(id);

export const selectHasSurgedPing = (id: string) => (state: SurgeState) =>
  state.surgedPings.has(id);

export const selectIsToggling =
  (type: SurgeType, id: string) => (state: SurgeState) =>
    state.isToggling[`${type}-${id}`] || false;
