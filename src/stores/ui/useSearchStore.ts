import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface SearchState {
  // State
  query: string;
  selectedCategoryId: number | null;
  selectedCategoryName: string | null;
  categoryCounts: Record<number, number>;
  totalCount: number;
  debouncedQuery: string;

  // Actions
  setQuery: (query: string) => void;
  setDebouncedQuery: (query: string) => void;
  setCategory: (id: number | null, name: string | null) => void;
  setCategoryCounts: (counts: Record<number, number>, total: number) => void;
  clearCategory: () => void;
  clearSearch: () => void;
  clearAll: () => void;
}

export const useSearchStore = create<SearchState>()(
  devtools(
    persist(
      immer((set) => ({
        // Initial State
        query: "",
        selectedCategoryId: null,
        selectedCategoryName: null,
        categoryCounts: {},
        totalCount: 0,
        debouncedQuery: "",

        // Actions
        setQuery: (query: string) => {
          set((state) => {
            state.query = query;
          });
        },

        setDebouncedQuery: (query: string) => {
          set((state) => {
            state.debouncedQuery = query;
          });
        },

        setCategory: (id: number | null, name: string | null) => {
          set((state) => {
            state.selectedCategoryId = id;
            state.selectedCategoryName = name;
          });
        },

        setCategoryCounts: (counts: Record<number, number>, total: number) => {
          set((state) => {
            state.categoryCounts = counts;
            state.totalCount = total;
          });
        },

        clearCategory: () => {
          set((state) => {
            state.selectedCategoryId = null;
            state.selectedCategoryName = null;
          });
        },

        clearSearch: () => {
          set((state) => {
            state.query = "";
            state.debouncedQuery = "";
          });
        },

        clearAll: () => {
          set((state) => {
            state.query = "";
            state.debouncedQuery = "";
            state.selectedCategoryId = null;
            state.selectedCategoryName = null;
          });
        },
      })),
      {
        name: "search-storage",
        // Persist user's search preferences
        partialize: (state) => ({
          selectedCategoryId: state.selectedCategoryId,
          selectedCategoryName: state.selectedCategoryName,
        }),
      },
    ),
    { name: "SearchStore" },
  ),
);

// Selectors
export const selectSearchQuery = (state: SearchState) => state.query;
export const selectDebouncedQuery = (state: SearchState) =>
  state.debouncedQuery;
export const selectSelectedCategory = (state: SearchState) => ({
  id: state.selectedCategoryId,
  name: state.selectedCategoryName,
});
export const selectCategoryCounts = (state: SearchState) =>
  state.categoryCounts;
