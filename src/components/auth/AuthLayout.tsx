import React from "react";

interface AuthLayoutProps {
    children: React.ReactNode;
}

/**
 * AuthLayout Component
 * Wrapper with Echo logo and background pattern for all authentication screens
 * Design matches Figma: beige/cream background with orange dot pattern
 */
const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8"
            style={{
                background: 'linear-gradient(135deg, #f5ebe0 0%, #fef5ea 100%)',
                backgroundImage: `
          radial-gradient(circle, #ffc37b 1px, transparent 1px),
          radial-gradient(circle, #ffc37b 1px, transparent 1px)
        `,
                backgroundSize: '50px 50px, 40px 40px',
                backgroundPosition: '0 0, 25px 25px'
            }}
        >
            {/* Main content card */}
            <div className="w-full max-w-[537px]">
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;
