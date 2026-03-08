import React from "react";
import EchoLogo from "./EchoLogo";

interface AuthCardProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * AuthCard Component - Phase 10 Enhanced
 * White card container for authentication screens matching Figma design
 * Design: White background, 30px border-radius, responsive padding (30px mobile, 50px desktop)
 * Mobile: Smaller padding, responsive logo size
 * 
 * Phase 10 Enhancements:
 * - Added fade-in animation for smooth entry
 * - Performance optimized with React.memo
 */
const AuthCard: React.FC<AuthCardProps> = React.memo(({ children, className = "" }) => {
    return (
        <div
            className={`
        bg-white rounded-[20px] sm:rounded-[30px]
        px-5 py-[30px] sm:px-10 sm:py-10 md:px-[50px] md:py-[50px]
        flex flex-col gap-5 sm:gap-[25px] md:gap-[30px] items-center
        w-full shadow-lg
        animate-fade-in
        ${className}
      `}
        >
            {/* Echo Logo at the top - responsive sizing */}
            <EchoLogo size="md" className="scale-75 sm:scale-90 md:scale-100" />

            {/* Main content */}
            {children}
        </div>
    );
});

AuthCard.displayName = "AuthCard";

export default AuthCard;
