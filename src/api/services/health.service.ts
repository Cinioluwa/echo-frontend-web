import api from "../axios.config";

export interface HealthResponse {
  status: string;
}

/**
 * Health Service
 * Handles health check endpoints
 */
const healthService = {
  /**
   * Check if server is running
   */
  check: async (): Promise<HealthResponse> => {
    const response = await api.get<HealthResponse>("/healthz");
    return response.data;
  },
};

export default healthService;
