import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthButton from "../../components/auth/AuthButton";
import AuthFooter from "../../components/auth/AuthFooter";
import { useAuthStore } from "../../stores";

// Success Icon
const SuccessIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16">
        <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/**
 * AllVerified Component - Phase 2 Implementation
 * Success screen after email verification (OPEN policy organizations)
 * Figma: Desktop (3819:8192) | Mobile (3835:11221)
 */
const AllVerified: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // Get organization name from navigation state or fallback
    const organizationName = location.state?.organizationName || "your organization";

    const handleGoToFeed = () => {
        // Redirect admin users to admin feed, regular users to soundboard
        if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
            navigate("/admin/feed");
        } else {
            navigate("/soundBoard");
        }
    };

    return (
        <AuthLayout>
            <AuthCard>
                {/* Success Icon */}
                <div className="flex items-center justify-center">
                    <SuccessIcon />
                </div>

                {/* Title */}
                <div className="text-center w-full">
                    <h1
                        className="text-[26px] sm:text-[30px] md:text-[32px] font-bold text-[#10b981] mb-3 sm:mb-[15px]"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        All Verified!
                    </h1>
                    <p
                        className="text-[13px] sm:text-[14px] text-[#4a504e] font-medium leading-relaxed"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Your email has been successfully verified.
                    </p>
                </div>

                {/* Welcome Message */}
                <div className="w-full bg-[#f0fdf4] border border-[#86efac] rounded-xl px-4 sm:px-5 py-4 sm:py-[18px]">
                    <p
                        className="text-[12px] sm:text-[13px] text-[#4a504e] text-center leading-relaxed"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Welcome to <span className="font-semibold text-[#f49b31]">{organizationName}</span>!
                        You can now access your feed and start creating waves.
                    </p>
                </div>

                {/* Go to Feed Button */}
                <div className="w-full">
                    <AuthButton
                        type="button"
                        onClick={handleGoToFeed}
                    >
                        Go to Feed
                    </AuthButton>
                </div>

                {/* Additional Info */}
                <div className="text-center">
                    <p className="text-[11px] sm:text-[12px] text-[#838383] leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Start making your voice heard by creating pings, proposing waves, and engaging with your community.
                    </p>
                </div>

                {/* Footer */}
                <AuthFooter />
            </AuthCard>
        </AuthLayout>
    );
};

export default AllVerified;

