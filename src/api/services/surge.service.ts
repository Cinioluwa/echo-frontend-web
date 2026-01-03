import api from "../axios.config";

export interface SurgeResponse {
  message: string;
  surged: boolean;
}

/**
 * Surge Service
 * Handles surges (likes) on pings and waves
 */
const surgeService = {
  /**
   * Toggle surge (like/unlike) on a ping
   * @param pingId Ping ID
   */
  toggleOnPing: async (pingId: number): Promise<SurgeResponse> => {
    const response = await api.post<SurgeResponse>(`/pings/${pingId}/surge`);
    return response.data;
  },

  /**
   * Toggle surge (like/unlike) on a wave
   * @param waveId Wave ID
   */
  toggleOnWave: async (waveId: number): Promise<SurgeResponse> => {
    const response = await api.post<SurgeResponse>(`/waves/${waveId}/surge`);
    return response.data;
  },
};

export default surgeService;
