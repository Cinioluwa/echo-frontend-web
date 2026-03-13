import api from "../axios.config";
import type { CategoryData } from "../types/index";

export interface GetCategoriesParams {
  q?: string;
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
    const response = await api.get<CategoryData[]>("/categories", {
      params,
    });
    // Handle both direct array response and wrapped { data: [...] } response
    const data = Array.isArray(response.data)
      ? response.data
      : (response.data as any)?.data || [];
    return data;
  },
};

export default categoryService;
