import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";

interface ErrorBannerProps {
    error: string | null;
    onDismiss?: () => void;
    autoDismissAfter?: number; // milliseconds
}

export const ErrorBanner = ({
    error,
    onDismiss,
    autoDismissAfter = 5000
}: ErrorBannerProps) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (error) {
            setIsVisible(true);

            if (autoDismissAfter > 0) {
                const timer = setTimeout(() => {
                    setIsVisible(false);
                    if (onDismiss) {
                        setTimeout(onDismiss, 300); // Wait for fade out animation
                    }
                }, autoDismissAfter);

                return () => clearTimeout(timer);
            }
        } else {
            setIsVisible(false);
        }
    }, [error, autoDismissAfter, onDismiss]);

    const handleDismiss = () => {
        setIsVisible(false);
        if (onDismiss) {
            setTimeout(onDismiss, 300); // Wait for fade out animation
        }
    };

    if (!error) return null;

    return (
        <div
            className={`
        fixed top-4 left-1/2 -translate-x-1/2 z-50 
        max-w-md w-full mx-4
        transition-all duration-300 ease-in-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}
      `}
        >
            <div className="bg-red-50 border border-red-200 rounded-lg shadow-lg p-4 flex items-start gap-3">
                <div className="shrink-0">
                    <svg
                        className="w-5 h-5 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>

                <div className="flex-1">
                    <h3 className="text-sm font-medium text-red-800">
                        Error Loading Data
                    </h3>
                    <p className="mt-1 text-sm text-red-700">
                        {error}
                    </p>
                    <p className="mt-1 text-xs text-red-600">
                        Check your connection and try again.
                    </p>
                </div>

                {onDismiss && (
                    <button
                        onClick={handleDismiss}
                        className="shrink-0 text-red-400 hover:text-red-600 transition-colors"
                        aria-label="Dismiss"
                    >
                        <IoMdClose className="w-5 h-5" />
                    </button>
                )}
            </div>
        </div>
    );
};
