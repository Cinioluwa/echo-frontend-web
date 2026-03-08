/**
 * Network Utilities - Phase 8 Implementation
 * Handles network errors, offline detection, and retry logic
 */

import { AxiosError } from "axios";

/**
 * Check if browser is online
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Network error types
 */
export const NetworkErrorType = {
  OFFLINE: "OFFLINE",
  TIMEOUT: "TIMEOUT",
  SERVER_ERROR: "SERVER_ERROR",
  CLIENT_ERROR: "CLIENT_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  RATE_LIMITED: "RATE_LIMITED",
  UNKNOWN: "UNKNOWN",
} as const;

export type NetworkErrorType =
  (typeof NetworkErrorType)[keyof typeof NetworkErrorType];

/**
 * Structured network error interface
 */
export interface NetworkError {
  type: NetworkErrorType;
  message: string;
  statusCode?: number;
  originalError?: any;
  retryable: boolean;
}

/**
 * Parse Axios error into structured network error
 */
export const parseNetworkError = (error: any): NetworkError => {
  // Check if offline
  if (!navigator.onLine) {
    return {
      type: NetworkErrorType.OFFLINE,
      message:
        "No internet connection. Please check your network and try again.",
      retryable: true,
    };
  }

  // Handle Axios errors
  if (error.isAxiosError) {
    const axiosError = error as AxiosError;

    // Timeout error
    if (
      axiosError.code === "ECONNABORTED" ||
      axiosError.message.includes("timeout")
    ) {
      return {
        type: NetworkErrorType.TIMEOUT,
        message: "Request timed out. Please try again.",
        originalError: error,
        retryable: true,
      };
    }

    // No response (network error)
    if (!axiosError.response) {
      return {
        type: NetworkErrorType.OFFLINE,
        message: "Unable to reach the server. Please check your connection.",
        originalError: error,
        retryable: true,
      };
    }

    // Parse response status
    const status = axiosError.response.status;
    const data = axiosError.response.data as any;
    const message = data?.message || data?.error || axiosError.message;

    switch (status) {
      case 400:
        return {
          type: NetworkErrorType.CLIENT_ERROR,
          message: message || "Invalid request. Please check your input.",
          statusCode: status,
          originalError: error,
          retryable: false,
        };

      case 401:
        return {
          type: NetworkErrorType.UNAUTHORIZED,
          message: message || "Authentication failed. Please log in again.",
          statusCode: status,
          originalError: error,
          retryable: false,
        };

      case 403:
        return {
          type: NetworkErrorType.FORBIDDEN,
          message:
            message || "You don't have permission to access this resource.",
          statusCode: status,
          originalError: error,
          retryable: false,
        };

      case 404:
        return {
          type: NetworkErrorType.NOT_FOUND,
          message: message || "The requested resource was not found.",
          statusCode: status,
          originalError: error,
          retryable: false,
        };

      case 429:
        return {
          type: NetworkErrorType.RATE_LIMITED,
          message:
            message || "Too many requests. Please wait a moment and try again.",
          statusCode: status,
          originalError: error,
          retryable: true,
        };

      case 500:
      case 502:
      case 503:
      case 504:
        return {
          type: NetworkErrorType.SERVER_ERROR,
          message: message || "Server error. Please try again later.",
          statusCode: status,
          originalError: error,
          retryable: true,
        };

      default:
        return {
          type: NetworkErrorType.UNKNOWN,
          message: message || "An unexpected error occurred.",
          statusCode: status,
          originalError: error,
          retryable: false,
        };
    }
  }

  // Unknown error
  return {
    type: NetworkErrorType.UNKNOWN,
    message: error?.message || "An unexpected error occurred.",
    originalError: error,
    retryable: false,
  };
};

/**
 * Get user-friendly error message from network error
 */
export const getErrorMessage = (error: any): string => {
  const networkError = parseNetworkError(error);
  return networkError.message;
};

/**
 * Check if error is retryable
 */
export const isRetryable = (error: any): boolean => {
  const networkError = parseNetworkError(error);
  return networkError.retryable;
};

/**
 * Retry function with exponential backoff
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000,
): Promise<T> => {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Check if error is retryable
      if (!isRetryable(error)) {
        throw error;
      }

      // Don't delay after last attempt
      if (attempt < maxRetries) {
        // Exponential backoff: 1s, 2s, 4s, etc.
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

/**
 * Listen for online/offline events
 */
export const addNetworkListener = (
  onOnline: () => void,
  onOffline: () => void,
): (() => void) => {
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);

  // Return cleanup function
  return () => {
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
  };
};
