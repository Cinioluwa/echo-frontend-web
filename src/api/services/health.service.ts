import api, { API_BASE_URL } from "../axios.config";

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
    // The health routes are mounted at the server ROOT (`app.use(healthRoutes)`),
    // not under `/api`. Requesting the default `/api/healthz` returns 404, so strip
    // the `/api` suffix and call the root path with an absolute URL.
    const rootBase = API_BASE_URL.replace(/\/api\/?$/, "");
    const response = await api.get<HealthResponse>(`${rootBase}/healthz`, {
      baseURL: "",
    });
    return response.data;
  },
};

export default healthService;
