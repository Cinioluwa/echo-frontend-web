import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import categoryService from "../../api/services/category.service";

// Define the category interface locally since CategoryData may not be properly exported
interface CategoryAPIResponse {
  id: number;
  name: string;
}

// Local category type with icon mapping
export interface CategoryWithIcon {
  id: number;
  label: string;
  labelIcon?: string;
}

interface CategoriesState {
  // Data
  categories: CategoryWithIcon[];
  categoriesById: Record<number, CategoryWithIcon>;

  // Loading & Error
  isLoading: boolean;
  error: string | null;

  // Cache
  lastFetched: number | null;

  // Actions
  fetchCategories: (iconMapper?: (name: string) => string) => Promise<void>;
  upsertCategory: (category: CategoryWithIcon) => void;
  removeCategory: (id: number) => void;
  invalidateCache: () => void;
  reset: () => void;
}

export const useCategoriesStore = create<CategoriesState>()(
  devtools(
    immer((set, get) => ({
      // Initial State
      categories: [],
      categoriesById: {},
      isLoading: false,
      error: null,
      lastFetched: null,

      // Actions
      fetchCategories: async (iconMapper?: (name: string) => string) => {
        const state = get();

        // Check cache validity - only refetch after 10 minutes
        const CATEGORIES_CACHE_TIME = 10 * 60 * 1000; // 10 minutes
        const cacheValid =
          state.lastFetched &&
          Date.now() - state.lastFetched < CATEGORIES_CACHE_TIME;

        if (cacheValid && state.categories.length > 0) {
          console.log("✅ Using cached categories data");
          return;
        }

        if (state.isLoading) return;

        set((state) => {
          state.isLoading = true;
          state.error = null;
        });

        try {
          const response = await categoryService.getAll();

          // Handle both direct array response and wrapped { data: [...] } response
          const data = Array.isArray(response)
            ? response
            : (response as any)?.data || [];

          set((state) => {
            // Map API data to local category format with optional icons
            const mappedCategories: CategoryWithIcon[] = data.map(
              (cat: CategoryAPIResponse) => ({
                id: cat.id,
                label: cat.name,
                labelIcon: iconMapper ? iconMapper(cat.name) : undefined,
              }),
            );

            state.categories = mappedCategories;

            // Create lookup map by ID for quick access
            state.categoriesById = mappedCategories.reduce(
              (acc, cat) => {
                acc[cat.id] = cat;
                return acc;
              },
              {} as Record<number, CategoryWithIcon>,
            );

            state.lastFetched = Date.now();
            state.isLoading = false;
            state.error = null;
          });

          console.log("✅ Categories fetched successfully");
        } catch (err) {
          console.error("❌ Error fetching categories:", err);

          set((state) => {
            state.error = "Failed to load categories";
            state.isLoading = false;
          });
        }
      },

      upsertCategory: (category) => {
        set((state) => {
          const index = state.categories.findIndex((item) => item.id === category.id);
          if (index === -1) {
            state.categories.push(category);
          } else {
            state.categories[index] = category;
          }
          state.categoriesById[category.id] = category;
        });
      },

      removeCategory: (id) => {
        set((state) => {
          state.categories = state.categories.filter((category) => category.id !== id);
          delete state.categoriesById[id];
        });
      },

      invalidateCache: () => {
        set((state) => {
          state.lastFetched = null;
        });
        console.log("🔄 Categories cache invalidated");
      },

      reset: () => {
        set({
          categories: [],
          categoriesById: {},
          isLoading: false,
          error: null,
          lastFetched: null,
        });
        console.log("🔄 Categories store reset");
      },
    })),
    { name: "CategoriesStore" },
  ),
);
