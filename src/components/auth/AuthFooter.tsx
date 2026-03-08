import React from "react";
import { Link } from "react-router-dom";

interface AuthFooterProps {
    showTerms?: boolean;
    className?: string;
}

/**
 * AuthFooter Component
 * Footer with Terms of Use and Privacy Policy links matching Figma design
 * Design: Gray text with orange links, divider line, Poppins Medium font
 */
const AuthFooter: React.FC<AuthFooterProps> = ({
    showTerms = true,
    className = ""
}) => {
    return (
        <div className={`flex flex-col gap-2.5 items-center px-5 w-full ${className}`}>
            {showTerms && (
                <div
                    className="flex flex-col gap-2.5 items-center text-center text-sm leading-3.5"
                    style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
                >
                    <p className="text-[#838383]">
                        By creating an account, you agree to Echo
                    </p>
                    <Link
                        to="/terms"
                        className="text-[#f49b31] hover:text-[#e08a2a] transition-colors"
                    >
                        Terms of Use, Privacy Policy
                    </Link>
                </div>
            )}

            {/* Divider line */}
            <div className="w-full h-px bg-[#e0e0e0]" />
        </div>
    );
};

export default AuthFooter;
