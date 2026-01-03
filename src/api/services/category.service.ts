import api from "../axios.config";
import type { Category } from "../types/index";

export interface GetCategoriesParams {
  q?: string;
}

export interface CategoriesResponse {
  data: Category[];
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
  getAll: async (params?: GetCategoriesParams): Promise<Category[]> => {
    const response = await api.get<CategoriesResponse>("/categories", {
      params,
    });
    return response.data.data;
  },
};

export default categoryService;
