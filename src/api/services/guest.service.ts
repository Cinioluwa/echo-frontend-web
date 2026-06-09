import api from "../axios.config";

/**
 * Guest Service
 * Handles Guest OTP Surge flow and guest authentication
 */
const guestService = {
  /**
   * Send an OTP code to a guest's email
   * @param email Guest email address
   * @param pingId ID of the ping they want to surge
   */
  sendOtp: async (email: string, pingId: number): Promise<{ message: string }> => {
    const response = await api.post<{ message: string }>("/guest/otp/send", {
      email,
      pingId,
    });
    return response.data;
  },

  /**
   * Verify the OTP code and obtain a Guest JWT
   * @param email Guest email address
   * @param code 6-digit OTP code
   * @param pingId ID of the ping
   */
  verifyOtp: async (
    email: string,
    code: string,
    pingId: number
  ): Promise<{ token: string; message: string }> => {
    const response = await api.post<{ token: string; message: string }>(
      "/guest/otp/verify",
      {
        email,
        code,
        pingId,
      }
    );
    return response.data;
  },

  /**
   * Surge a ping using a Guest JWT
   * @param pingId ID of the ping
   * @param guestToken Guest JWT obtained from verifyOtp
   */
  guestSurgePing: async (
    pingId: number,
    guestToken: string
  ): Promise<{ surged: boolean; message: string; surgeCount: number }> => {
    const response = await api.post<{ surged: boolean; message: string; surgeCount: number }>(
      `/guest/surge/${pingId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${guestToken}`,
        },
      }
    );
    return response.data;
  },
};

export default guestService;
