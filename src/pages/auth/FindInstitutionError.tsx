import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AuthLayout,
    AuthCard,
    AuthButton,
    AuthFooter,
    ErrorBadge,
} from "../../components/auth";
import type { Organization } from "../../api/types";

interface FindInstitutionErrorProps {
    selectedOrg?: Organization;
    userEmail?: string;
}

/**
 * Find Institution Error Screen
 * Displays error when email domain doesn't match selected organization
 * Implementation: Phase 3
 * Figma: Desktop 3885:8780 | Mobile 3896:9133
 */
const FindInstitutionError: React.FC<FindInstitutionErrorProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const locationState = location.state as {
        selectedOrg?: Organization;
        userEmail?: string;
        error?: string;
    } | null;

    const selectedOrg = locationState?.selectedOrg;
    const userEmail = locationState?.userEmail || "";
    const errorMessage =
        locationState?.error || "EMAIL DOES NOT MATCH THE DOMAIN OF INSTITUTION";

    /**
     * Handle going back to institution selection
     */
    const handleBack = () => {
        navigate("/find-institution", {
            state: {
                email: userEmail,
            },
        });
    };

    return (
        <AuthLayout>
            <AuthCard className="max-w-[537px]">
                {/* Header */}
                <div className="flex flex-col gap-2.5 items-center text-center w-full">
                    <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-black leading-7 sm:leading-8 md:leading-9">
                        Find your Institution
                    </h1>
                    <p className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#4a504e] opacity-69 leading-5 sm:leading-[21px]">
                        Search for your institution to join the discussion
                    </p>
                </div>

                {/* Form */}
                <div className="flex flex-col gap-4 sm:gap-5 items-center w-full">
                    {/* Error Badge */}
                    <ErrorBadge message={errorMessage} variant="error" />

                    {/* Institution Info (if available) */}
                    {selectedOrg && (
                        <div className="w-full bg-[#fbfbfb] border border-[#cacaca] rounded-xl px-5 sm:px-[25px] md:px-[30px] py-3 sm:py-[15px]">
                            <div className="text-[13px] sm:text-[14px] font-medium text-[#626665]">
                                {selectedOrg.name}
                            </div>
                            <div className="text-[11px] sm:text-[12px] text-[#999] mt-1">
                                Expected: @{selectedOrg.domain}
                            </div>
                            {userEmail && (
                                <div className="text-[11px] sm:text-[12px] text-[#999] mt-1">
                                    Your email: {userEmail}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 sm:gap-[15px] w-full">
                        <AuthButton onClick={handleBack} className="w-full">
                            Select Different Institution
                        </AuthButton>

                        <button
                            onClick={() =>
                                navigate("/make-request", {
                                    state: {
                                        email: userEmail,
                                    },
                                })
                            }
                            className="text-[12px] sm:text-[13px] font-medium text-[#f49b31] hover:underline"
                        >
                            Can't find Institution?{" "}
                            <span className="font-semibold">Make Request</span>
                        </button>
                    </div>
                </div>

                {/* Footer */}
                <AuthFooter />
            </AuthCard>
        </AuthLayout>
    );
};

export default FindInstitutionError;
