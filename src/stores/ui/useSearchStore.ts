import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export type FilterOption =
  | "top3"
  | "underReview"
  | "submitted"
  | "new"
  | "rejected";

interface SearchState {
  // State
  query: string;
  selectedCategoryId: number | null;
  selectedCategoryName: string | null;
  categoryCounts: Record<number, number>;
  totalCount: number;
  debouncedQuery: string;
  selectedFilters: FilterOption[];

  // Actions
  setQuery: (query: string) => void;
  setDebouncedQuery: (query: string) => void;
  setCategory: (id: number | null, name: string | null) => void;
  setCategoryCounts: (counts: Record<number, number>, total: number) => void;
  incrementCategoryCount: (categoryId: number) => void;
  decrementCategoryCount: (categoryId: number) => void;
  setFilters: (filters: FilterOption[]) => void;
  clearFilters: () => void;
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
        selectedFilters: [],

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

        incrementCategoryCount: (categoryId: number) => {
          set((state) => {
            state.categoryCounts[categoryId] =
              (state.categoryCounts[categoryId] || 0) + 1;
            state.totalCount = state.totalCount + 1;
          });
        },

        decrementCategoryCount: (categoryId: number) => {
          set((state) => {
            if (state.categoryCounts[categoryId]) {
              state.categoryCounts[categoryId] = Math.max(
                0,
                state.categoryCounts[categoryId] - 1,
              );
            }
            state.totalCount = Math.max(0, state.totalCount - 1);
          });
        },

        setFilters: (filters: FilterOption[]) => {
          set((state) => {
            state.selectedFilters = filters;
          });
        },

        clearFilters: () => {
          set((state) => {
            state.selectedFilters = [];
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
            state.selectedFilters = [];
          });
        },
      })),
      {
        name: "search-storage",
        // Don't persist category selection - always start with "All Categories"
        partialize: () => ({}),
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
