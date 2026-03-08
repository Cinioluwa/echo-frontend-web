import React from "react";
import EchoLogo from "./EchoLogo";

interface AuthCardProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * AuthCard Component
 * White card container for authentication screens matching Figma design
 * Design: White background, 30px border-radius, 50px padding, max-width 537px
 */
const AuthCard: React.FC<AuthCardProps> = ({ children, className = "" }) => {
    return (
        <div
            className={`
        bg-white rounded-[30px] p-[50px]
        flex flex-col gap-[30px] items-center
        w-full shadow-lg
        ${className}
      `}
        >
            {/* Echo Logo at the top */}
            <EchoLogo size="md" />

            {/* Main content */}
            {children}
        </div>
    );
};

export default AuthCard;
