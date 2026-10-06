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

  create: async (name: string): Promise<CategoryData> => {
    const response = await api.post<CategoryData>("/categories", { name });
    return response.data;
  },

  updateName: async (id: number, name: string): Promise<CategoryData> => {
    const response = await api.patch<CategoryData>(`/categories/${id}`, { name });
    return response.data;
  },

  /**
   * Delete a category (admin only).
   * The API responds 409 CATEGORY_HAS_PINGS if pings still reference it.
   */
  remove: async (id: number): Promise<{ message: string; categoryId: number }> => {
    const response = await api.delete<{ message: string; categoryId: number }>(
      `/categories/${id}`,
    );
    return response.data;
  },
};

export default categoryService;
