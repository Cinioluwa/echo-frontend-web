import React from "react";

/**
 * LoadingFallback Component - Phase 10 Performance Enhancement
 * Displays while lazy-loaded components are being loaded
 * Matches auth flow design pattern
 */
const LoadingFallback: React.FC = () => {
    return (
        <div
            className="min-h-screen flex items-center justify-center"
            style={{
                background: 'linear-gradient(135deg, #f5ebe0 0%, #fef5ea 100%)',
                backgroundImage: `
                    radial-gradient(circle, #ffc37b 1px, transparent 1px),
                    radial-gradient(circle, #ffc37b 1px, transparent 1px)
                `,
                backgroundSize: '50px 50px, 40px 40px',
                backgroundPosition: '0 0, 25px 25px'
            }}
            role="status"
            aria-live="polite"
            aria-label="Loading"
        >
            <div className="bg-white rounded-[30px] px-[50px] py-[50px] shadow-lg animate-pulse">
                <div className="flex flex-col items-center gap-4">
                    {/* Spinning loader */}
                    <svg
                        className="animate-spin h-12 w-12 text-[#f49b31]"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <p
                        className="text-[#4a504e] text-sm font-medium"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Loading...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoadingFallback;
