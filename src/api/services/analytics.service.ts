import api from "../axios.config";
import type {
  ActiveUsersAnalytics,
  TrendingAnalytics,
  CategoryStats,
} from "../types/admin.types";

/**
 * Analytics Service
 * Handles analytics and reporting endpoints
 */
export const analyticsService = {
  /**
   * Get active users count for a time period
   * @param params Time window configuration
   */
  async getActiveUsers(params: {
    weeks: number;
    offsetWeeks?: number;
  }): Promise<ActiveUsersAnalytics> {
    const { data } = await api.get("/admin/analytics/active-users", {
      params,
    });
    return data;
  },

  /**
   * Get trending categories with comparison data
   * @param params Time window configuration
   */
  async getTrending(params?: {
    weeks?: number;
    offsetWeeks?: number;
  }): Promise<TrendingAnalytics> {
    const { data } = await api.get("/admin/analytics/trending", {
      params,
    });
    return data;
  },

  /**
   * Get ping statistics grouped by category
   */
  async getCategoryStats(): Promise<CategoryStats[]> {
    const { data } = await api.get("/admin/analytics/by-category");
    return data;
  },

  /**
   * Get ping statistics grouped by student level
   */
  async getLevelStats(): Promise<CategoryStats[]> {
    const { data } = await api.get("/admin/analytics/by-level");
    return data;
  },

  /**
   * Get sentiment analysis data
   * @param params Time window configuration
   */
  async getSentiment(params: {
    weeks: number;
    offsetWeeks?: number;
  }): Promise<any> {
    const { data } = await api.get("/admin/analytics/sentiment", {
      params,
    });
    return data;
  },

  /**
   * Get average response times
   * @param params Days to analyze
   */
  async getResponseTimes(params?: { days?: number }): Promise<any> {
    const { data } = await api.get("/admin/analytics/response-times", {
      params,
    });
    return data;
  },

  /**
   * Get priority pings (high surge count, no resolution, etc.)
   * @param params Query parameters
   */
  async getPriorityPings(params: {
    weeks: number;
    offsetWeeks?: number;
    limit?: number;
  }): Promise<any> {
    const { data } = await api.get("/admin/pings/priority", { params });
    return data;
  },

  /**
   * Export pings data as CSV/Excel
   */
  async exportPings(): Promise<Blob> {
    const { data } = await api.get("/admin/export/pings", {
      responseType: "blob",
    });
    return data;
  },
};

export default analyticsService;
