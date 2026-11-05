import React from "react";
import { useNetworkStatus } from "../../hooks/useNetworkStatus";

/**
 * OfflineIndicator Component - Phase 8 Implementation
 * Displays a banner when user is offline
 * Automatically shows/hides based on network status
 * 
 * Usage:
 * <OfflineIndicator />
 */
const OfflineIndicator: React.FC = () => {
    const { isOffline } = useNetworkStatus();

    if (!isOffline) {
        return null;
    }

    return (
        <div
            className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white py-2 px-4 text-center animate-slide-down"
            role="alert"
            aria-live="assertive"
        >
            <div className="flex items-center justify-center gap-2">
                {/* Offline Icon */}
                <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                    />
                </svg>

                <span className="text-sm font-medium" style={{ fontFamily: "Poppins, sans-serif" }}>
                    No internet connection. Please check your network.
                </span>
            </div>
        </div>
    );
};

export default OfflineIndicator;
