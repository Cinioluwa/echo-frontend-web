import React from "react";
import EchoLogo from "./EchoLogo";

interface AuthCardProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * AuthCard Component
 * White card container for authentication screens matching Figma design
 * Design: White background, 30px border-radius, responsive padding (30px mobile, 50px desktop)
 * Mobile: Smaller padding, responsive logo size
 */
const AuthCard: React.FC<AuthCardProps> = ({ children, className = "" }) => {
    return (
        <div
            className={`
        bg-white rounded-[20px] sm:rounded-[30px]
        px-5 py-[30px] sm:px-10 sm:py-10 md:px-[50px] md:py-[50px]
        flex flex-col gap-5 sm:gap-[25px] md:gap-[30px] items-center
        w-full shadow-lg
        ${className}
      `}
        >
            {/* Echo Logo at the top - responsive sizing */}
            <EchoLogo size="md" className="scale-75 sm:scale-90 md:scale-100" />

            {/* Main content */}
            {children}
        </div>
    );
};

export default AuthCard;
