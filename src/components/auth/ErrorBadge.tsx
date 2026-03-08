import React from "react";

interface ErrorBadgeProps {
    message: string;
    className?: string;
    variant?: "error" | "warning";
}

/**
 * ErrorBadge Component
 * Badge for displaying validation or API errors
 * Design matches Figma: Light orange background for warnings, red for errors
 */
const ErrorBadge: React.FC<ErrorBadgeProps> = ({
    message,
    className = "",
    variant = "warning"
}) => {
    const styles = variant === "warning"
        ? {
            bg: "bg-[#fef5ea]",
            border: "border-[#ffcd71]",
            text: "text-black"
        }
        : {
            bg: "bg-red-50",
            border: "border-red-300",
            text: "text-red-800"
        };

    return (
        <div
            className={`
        ${styles.bg} border ${styles.border} rounded-xl
        px-[12px] sm:px-[15px] py-[8px] sm:py-[10px]
        flex items-center justify-center
        ${className}
      `}
            role="alert"
        >
            <p
                className={`${styles.text} text-[8px] sm:text-[9px] font-medium uppercase text-center leading-tight`}
                style={{ fontFamily: 'Poppins, sans-serif', lineHeight: 1.1 }}
            >
                {message}
            </p>
        </div>
    );
};

export default ErrorBadge;
