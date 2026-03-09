/**
 * Error Handling Utilities
 * Centralized error handling and user notification functions
 */

export const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    const message = error.response.data?.error || error.response.data?.message;
    return message || `Error: ${error.response.status}`;
  } else if (error.request) {
    // Request made but no response
    return "No response from server. Please check your connection.";
  } else {
    // Something else happened
    return error.message || "An unexpected error occurred";
  }
};

export const showErrorToast = (error: any) => {
  const message = handleApiError(error);
  // Integrate with your toast library
  console.error(message);
  alert(message); // Replace with proper toast notification
};

export const showSuccessToast = (message: string) => {
  // Integrate with your toast library
  console.log(message);
  alert(message); // Replace with proper toast notification
};
