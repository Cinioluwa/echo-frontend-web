import React from "react";

interface AuthButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
    loading?: boolean;
    variant?: "primary" | "secondary" | "outline";
    fullWidth?: boolean;
    className?: string;
    ariaLabel?: string;
}

/**
 * AuthButton Component - Phase 10 Enhanced
 * Reusable button component for authentication screens
 * Design matches Figma: Orange (#f49b31), rounded-lg, Poppins Medium font
 * Mobile: Smaller padding for better touch targets and visual balance
 * 
 * Phase 10 Enhancements:
 * - Added hover scale effect for better interactivity
 * - Enhanced ARIA labels for accessibility
 * - Performance optimized with React.memo
 */
const AuthButton: React.FC<AuthButtonProps> = React.memo(({
    children,
    onClick,
    type = "button",
    disabled = false,
    loading = false,
    variant = "primary",
    fullWidth = true,
    className = "",
    ariaLabel,
}) => {
    const baseClasses = "px-[20px] py-[12px] sm:px-[35px] sm:py-[14px] md:px-[50px] md:py-[15px] rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed text-[13px] sm:text-sm min-h-[44px] sm:min-h-[50px] active:scale-[0.98] hover:shadow-md";

    const variantClasses = {
        primary: "bg-[#f49b31] text-white hover:bg-[#e08a2a] focus:ring-[#f49b31]",
        secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
        outline: "border-2 border-[#f49b31] text-[#f49b31] hover:bg-[#fef5ea] focus:ring-[#f49b31]",
    };

    const widthClass = fullWidth ? "w-full" : "";

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${variantClasses[variant]} ${widthClass} ${className}`}
            style={{ fontFamily: 'Poppins, sans-serif' }}
            aria-label={ariaLabel}
            aria-busy={loading}
            aria-disabled={disabled || loading}
        >
            {loading ? (
                <div className="flex items-center justify-center">
                    <svg
                        className="animate-spin h-5 w-5 mr-2"
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
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </button>
    );
});

AuthButton.displayName = "AuthButton";

export default AuthButton;
