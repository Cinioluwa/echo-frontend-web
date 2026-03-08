import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AuthLayout,
    AuthCard,
    AuthButton,
    AuthFooter,
} from "../../components/auth";

// Success Icon
const SuccessIcon = () => (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M9 12l2 2 4-4" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/**
 * Request Submitted Screen
 * Success confirmation for organization request
 * Implementation: Phase 4
 * Figma: Desktop (3896:8853) | Mobile (3838:11874)
 */
const RequestSubmitted: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Get organization name from navigation state (if provided)
    const organizationName = location.state?.organizationName || "your institution";

    /**
     * Handle go back button - return to login
     */
    const handleGoBack = () => {
        navigate("/login");
    };

    return (
        <AuthLayout>
            <AuthCard className="max-w-[537px]">
                {/* Success Icon */}
                <div className="flex items-center justify-center">
                    <SuccessIcon />
                </div>

                {/* Title */}
                <div className="text-center w-full">
                    <h1
                        className="text-[32px] font-bold text-[#10b981] mb-[15px]"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Request Submitted!
                    </h1>
                    <p
                        className="text-[14px] text-[#4a504e] font-medium leading-relaxed"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Thank you for your request. We've received your information.
                    </p>
                </div>

                {/* Info Card */}
                <div className="w-full bg-[#f0fdf4] border border-[#86efac] rounded-xl px-5 py-[18px]">
                    <p
                        className="text-[13px] text-[#4a504e] text-center leading-relaxed"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        We've received your request for <span className="font-semibold text-[#f49b31]">{organizationName}</span>.
                        Our team will review it and get back to you shortly.
                    </p>
                </div>

                {/* Additional Information */}
                <div className="w-full bg-white border border-[#e5e5e5] rounded-xl px-5 py-[18px]">
                    <div className="flex flex-col gap-3">
                        <h3 className="text-[14px] font-semibold text-[#4a504e]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            What happens next?
                        </h3>
                        <ul className="text-[13px] text-[#4a504e] leading-relaxed space-y-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            <li className="flex items-start">
                                <span className="mr-2 text-[#f49b31]">•</span>
                                <span>Our team will verify your institution information</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-[#f49b31]">•</span>
                                <span>We'll reach out to you via email with updates</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2 text-[#f49b31]">•</span>
                                <span>Once approved, you'll be able to join and start using Echo</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Go Back Button */}
                <div className="w-full">
                    <AuthButton
                        type="button"
                        onClick={handleGoBack}
                    >
                        Go to Login
                    </AuthButton>
                </div>

                {/* Contact Info */}
                <div className="text-center">
                    <p className="text-[12px] text-[#838383] leading-relaxed" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Have questions? Contact us at{" "}
                        <a href="mailto:support@echo.app" className="text-[#f49b31] hover:underline">
                            support@echo.app
                        </a>
                    </p>
                </div>

                {/* Footer */}
                <AuthFooter />
            </AuthCard>
        </AuthLayout>
    );
};

export default RequestSubmitted;
