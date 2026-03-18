import { useState } from "react";
import { passwordService } from "../api/services";

const usePasswordChange = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const changePassword = async (
    currentPassword: string,
    newPassword: string,
  ) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await passwordService.changePassword(currentPassword, newPassword);
      setSuccess(true);
    } catch (err: any) {
      setError(
        err?.response?.data?.error ||
          err?.message ||
          "Failed to change password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, success, changePassword };
};

export default usePasswordChange;
