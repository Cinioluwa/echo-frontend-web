import React from "react";
import SkipLink from "./SkipLink";

interface AuthLayoutProps {
    children: React.ReactNode;
}

/**
 * AuthLayout Component - Phase 10 Enhanced
 * Wrapper with Echo logo and background pattern for all authentication screens
 * Design matches Figma: beige/cream background with orange dot pattern
 * 
 * Phase 10 Enhancements:
 * - Added SkipLink for keyboard navigation
 * - Semantic HTML with proper landmarks
 * - Enhanced ARIA labels
 */
const AuthLayout: React.FC<AuthLayoutProps> = React.memo(({ children }) => {
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
            {/* Skip to main content link for keyboard users */}
            <SkipLink />

            {/* Main content card with proper landmarks */}
            <main
                id="main-content"
                className="w-full max-w-[537px]"
                role="main"
                aria-label="Authentication form"
            >
                {children}
            </main>
        </div>
    );
});

AuthLayout.displayName = "AuthLayout";

export default AuthLayout;
