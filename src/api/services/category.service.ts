import api from "../axios.config";
import type { CategoryData } from "../types/index";

export interface GetCategoriesParams {
  q?: string;
}

export interface CategoriesResponse {
  data: CategoryData[];
}

/**
 * Category Service
 * Handles category management
 */
const categoryService = {
  /**
   * Get all categories for the organization
   * @param params Query parameters for filtering
   */
  getAll: async (params?: GetCategoriesParams): Promise<CategoryData[]> => {
    const response = await api.get<CategoriesResponse>("/categories", {
      params,
    });
    return response.data.data;
  },
};

export default categoryService;
