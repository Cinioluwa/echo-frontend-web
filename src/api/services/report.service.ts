import api from "../axios.config";

export interface CreateReportDto {
  pingId?: number;
  waveId?: number;
  commentId?: number;
  reason: string;
}

const reportService = {
  /**
   * Submit a new report for a ping, wave, or comment
   * @param dto Report details
   */
  submitReport: async (dto: CreateReportDto) => {
    const { data } = await api.post("/reports", dto);
    return data;
  },
};

export default reportService;
