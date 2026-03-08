import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AuthLayout,
    AuthCard,
    AuthButton,
    AuthFooter,
} from "../../components/auth";
import { useRegistrationStore } from "../../stores/ui/useRegistrationStore";
import { authService } from "../../api/services";
import type { Organization } from "../../api/types";

/**
 * Institution Found Screen
 * Confirmation screen showing matched institution before joining
 * Implementation: Phase 3
 * Figma: Desktop 3774:8202 | Mobile 3896:9339
 */
const InstitutionFound: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const locationState = location.state as {
        organization?: Organization;
        email?: string;
    } | null;

    const organization = locationState?.organization;
    const { formData, clearAll } = useRegistrationStore();

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Handle join organization button click
     * Triggers registration with organizationId
     */
    const handleJoinOrganization = async () => {
        if (!organization || !formData) {
            setError("Missing required information. Please try again.");
            navigate("/find-institution");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Register with the selected organization
            await authService.signup({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                organizationId: organization.id,
            });

            // Clear registration store after successful signup
            clearAll();

            // Navigate to verification screen
            navigate("/verification", {
                state: {
                    email: formData.email,
                    organizationName: organization.name,
                },
            });
        } catch (err: any) {
            console.error("Registration error:", err);
            const errorMessage =
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to complete registration. Please try again.";
            setError(errorMessage);
            setIsLoading(false);
        }
    };

    // If no organization data, redirect back
    if (!organization) {
        return (
            <AuthLayout>
                <AuthCard className="max-w-[537px]">
                    <div className="text-center">
                        <p className="text-[16px] text-[#4a504e] mb-4">
                            No institution selected. Please try again.
                        </p>
                        <AuthButton
                            onClick={() => navigate("/find-institution")}
                            className="w-full"
                        >
                            Back to Find Institution
                        </AuthButton>
                    </div>
                </AuthCard>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <AuthCard className="max-w-[537px]">
                {/* Success Icon */}
                <div className="flex flex-col gap-[15px] items-center w-full">
                    <div className="bg-[#f49b31] rounded-full w-[100px] h-[100px] flex items-center justify-center">
                        <svg
                            width="60"
                            height="60"
                            viewBox="0 0 60 60"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M10 30L25 45L50 15"
                                stroke="white"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>

                    {/* Header */}
                    <h1 className="text-[28px] font-semibold text-black leading-9 text-center min-w-full">
                        We Found Your Institution
                    </h1>

                    {/* Description */}
                    <p className="text-[14px] font-medium text-[#4a504e] opacity-69 leading-[21px] text-center min-w-full">
                        You're just one step away from joining {organization.name}. Hit
                        the button and dive right in.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="w-full bg-red-50 border border-red-300 rounded-xl px-5 py-[15px]">
                        <p className="text-[13px] text-red-800 text-center">{error}</p>
                    </div>
                )}

                {/* Join Button */}
                <div className="flex flex-col gap-[15px] items-center w-full">
                    <AuthButton
                        onClick={handleJoinOrganization}
                        disabled={isLoading}
                        className="w-full"
                    >
                        {isLoading ? "Joining..." : `Join ${organization.name}`}
                    </AuthButton>
                </div>

                {/* Footer */}
                <AuthFooter />
            </AuthCard>
        </AuthLayout>
    );
};

export default InstitutionFound;
