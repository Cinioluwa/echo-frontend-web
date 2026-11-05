import React from "react";

/**
 * SkipLink Component - Phase 10 Accessibility Enhancement
 * Provides keyboard users ability to skip to main content
 * Invisible until focused for better keyboard navigation
 * 
 * Usage:
 * <SkipLink />
 * 
 * Accessibility:
 * - Only visible on keyboard focus
 * - Allows screen reader and keyboard users to skip navigation
 * - WCAG 2.1 Level A requirement
 */
const SkipLink: React.FC = () => {
    return (
        <a
            href="#main-content"
            className="
                sr-only focus:not-sr-only
                focus:absolute focus:top-4 focus:left-4 focus:z-50
                focus:px-4 focus:py-2
                focus:bg-[#f49b31] focus:text-white
                focus:rounded-lg focus:shadow-lg
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f49b31]
                font-medium text-sm
                transition-opacity duration-200
            "
            style={{ fontFamily: 'Poppins, sans-serif' }}
        >
            Skip to main content
        </a>
    );
};

export default SkipLink;
