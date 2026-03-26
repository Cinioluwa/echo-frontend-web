import { useState } from "react";
import passwordService from "../api/services/password.service";

export const useForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");

  const requestReset = async (userEmail: string) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await passwordService.requestPasswordReset(userEmail);
      setEmail(userEmail);
      setSuccess(true);
    } catch (err: any) {
      const errorMessage =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Failed to send password reset email. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setSuccess(false);
    setEmail("");
  };

  return { loading, error, success, email, requestReset, reset };
};
