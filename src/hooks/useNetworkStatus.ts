import { useState, useEffect } from "react";
import { addNetworkListener } from "../utils/networkUtils";

/**
 * useNetworkStatus Hook - Phase 8 Implementation
 * Monitors network connectivity and provides online/offline status
 *
 * Usage:
 * const { isOnline, isOffline } = useNetworkStatus();
 *
 * @returns Object with isOnline and isOffline boolean flags
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      console.log("Network connection restored");
    };

    const handleOffline = () => {
      setIsOnline(false);
      console.log("Network connection lost");
    };

    // Add listeners and get cleanup function
    const cleanup = addNetworkListener(handleOnline, handleOffline);

    // Cleanup on unmount
    return cleanup;
  }, []);

  return {
    isOnline,
    isOffline: !isOnline,
  };
};
