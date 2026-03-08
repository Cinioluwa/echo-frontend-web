import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AuthLayout,
    AuthCard,
    AuthButton,
    AuthInput,
    AuthFooter,
    ErrorBadge,
    OfflineIndicator,
} from "../../components/auth";
import { useRegistrationStore } from "../../stores/ui/useRegistrationStore";
import { authService } from "../../api";
import { useNetworkStatus } from "../../hooks";
import { getErrorMessage } from "../../utils/networkUtils";
import { validateOrganizationName, validateUrl } from "../../utils/validationUtils";
import type { OrganizationWaitlistRequest } from "../../api/types";

// Building/Institution Icon
const InstitutionIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 21h18M9 8h1m0 0h1m4 0h1m-5 4h1m0 0h1m4 0h1M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16M9 21v-4a2 2 0 012-2h2a2 2 0 012 2v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Globe/Website Icon
const WebsiteIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// User Role Icon
const RoleIcon = () => (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 11a4 4 0 100-8 4 4 0 000 8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/**
 * Make Request Screen
 * Form to request new organization creation
 * Implementation: Phase 4
 * Figma: Desktop (3890:8697) | Mobile (3896:9441)
 */
const MakeRequest: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { isOffline } = useNetworkStatus();

    // Get registration data from location state or store
    const locationState = location.state as {
        email?: string;
        userData?: {
            firstName: string;
            lastName: string;
            password: string;
        };
    } | null;

    const { formData } = useRegistrationStore();

    // Form state
    const [organizationName, setOrganizationName] = useState("");
    const [website, setWebsite] = useState("");
    const [role, setRole] = useState("");
    const [additionalNotes, setAdditionalNotes] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [validationErrors, setValidationErrors] = useState<{
        organizationName?: string;
        website?: string;
    }>({});

    // User data
    const userEmail = locationState?.email || formData?.email || "";
    const userFirstName = locationState?.userData?.firstName || formData?.firstName || "";
    const userLastName = locationState?.userData?.lastName || formData?.lastName || "";
    const userPassword = locationState?.userData?.password || formData?.password || "";

    // Redirect if no user data
    useEffect(() => {
        if (!userEmail || !userFirstName || !userLastName || !userPassword) {
            navigate("/signup");
        }
    }, [userEmail, userFirstName, userLastName, userPassword, navigate]);

    /**
     * Validate form before submission
     */
    const validateForm = (): boolean => {
        const errors: { organizationName?: string; website?: string } = {};

        // Validate organization name
        const orgNameResult = validateOrganizationName(organizationName);
        if (!orgNameResult.isValid) {
            errors.organizationName = orgNameResult.error;
        }

        // Validate website if provided
        if (website.trim()) {
            const urlResult = validateUrl(website);
            if (!urlResult.isValid) {
                errors.website = urlResult.error;
            }
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    /**
     * Handle form submission
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Check if offline
        if (isOffline) {
            setError("No internet connection. Please check your network and try again.");
            return;
        }

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Check if user data is available
        if (!userEmail || !userFirstName || !userLastName || !userPassword) {
            setError("Missing registration information. Please start from sign up.");
            return;
        }

        setIsLoading(true);

        try {
            // Prepare request data
            const requestData: OrganizationWaitlistRequest = {
                organizationName: organizationName.trim(),
                email: userEmail,
                firstName: userFirstName,
                lastName: userLastName,
                password: userPassword,
                metadata: {
                    website: website.trim() || undefined,
                    role: role.trim() || undefined,
                    additionalNotes: additionalNotes.trim() || undefined,
                },
            };

            // Submit to waitlist API
            await authService.joinOrganizationWaitlist(requestData);

            // Navigate to success screen
            navigate("/request-submitted", {
                state: {
                    organizationName: organizationName.trim(),
                },
            });
        } catch (err: any) {
            console.error("Organization request error:", err);
            const errorMessage = getErrorMessage(err);
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                errorMessage
            );
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Handle going back
     */
    const handleBack = () => {
        navigate("/find-institution", {
            state: {
                email: userEmail,
                userData: {
                    firstName: userFirstName,
                    lastName: userLastName,
                    password: userPassword,
                },
            },
        });
    };

    return (
        <>
            <OfflineIndicator />
            <AuthLayout>
                <AuthCard className="max-w-[537px]">
                    {/* Header */}
                    <div className="flex flex-col gap-2.5 items-center text-center w-full">
                        <h1 className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-black leading-7 sm:leading-8 md:leading-9">
                            Request New Institution
                        </h1>
                        <p className="text-[14px] sm:text-[15px] md:text-[16px] font-medium text-[#4a504e] opacity-69 leading-5 sm:leading-[21px]">
                            Can't find your institution? Request to add it to Echo
                        </p>
                    </div>

                    {/* Error Badge */}
                    {error && (
                        <div className="w-full">
                            <ErrorBadge message={error} variant="error" />
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-5 w-full">
                        {/* Institution Name */}
                        <div className="flex flex-col gap-3 sm:gap-[15px] w-full">
                            <div className="flex flex-col gap-[5px] w-full">
                                <label
                                    htmlFor="organizationName"
                                    className="text-[13px] sm:text-[14px] font-medium text-[#4a504e]"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    Institution Name <span className="text-red-500">*</span>
                                </label>
                                <AuthInput
                                    name="organizationName"
                                    type="text"
                                    value={organizationName}
                                    onChange={(e) => {
                                        setOrganizationName(e.target.value);
                                        if (validationErrors.organizationName) {
                                            setValidationErrors((prev) => ({
                                                ...prev,
                                                organizationName: undefined,
                                            }));
                                        }
                                    }}
                                    placeholder="Enter institution name"
                                    icon={<InstitutionIcon />}
                                    required
                                    error={validationErrors.organizationName}
                                    disabled={isLoading || isOffline}
                                />
                                {validationErrors.organizationName && (
                                    <span className="text-xs text-red-500 ml-2">
                                        {validationErrors.organizationName}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Website */}
                        <div className="flex flex-col gap-3 sm:gap-[15px] w-full">
                            <div className="flex flex-col gap-[5px] w-full">
                                <label
                                    htmlFor="website"
                                    className="text-[13px] sm:text-[14px] font-medium text-[#4a504e]"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    Website (Optional)
                                </label>
                                <AuthInput
                                    name="website"
                                    type="url"
                                    value={website}
                                    onChange={(e) => {
                                        setWebsite(e.target.value);
                                        if (validationErrors.website) {
                                            setValidationErrors(prev => ({ ...prev, website: undefined }));
                                        }
                                    }}
                                    placeholder="https://www.example.edu"
                                    icon={<WebsiteIcon />}
                                    error={validationErrors.website}
                                    disabled={isLoading || isOffline}
                                />
                            </div>
                        </div>

                        {/* Role */}
                        <div className="flex flex-col gap-3 sm:gap-[15px] w-full">
                            <div className="flex flex-col gap-[5px] w-full">
                                <label
                                    htmlFor="role"
                                    className="text-[13px] sm:text-[14px] font-medium text-[#4a504e]"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    Your Role (Optional)
                                </label>
                                <AuthInput
                                    name="role"
                                    type="text"
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder="e.g., Student, Faculty, Staff"
                                    icon={<RoleIcon />}
                                    disabled={isLoading || isOffline}
                                />
                            </div>
                        </div>

                        {/* Additional Notes */}
                        <div className="flex flex-col gap-3 sm:gap-[15px] w-full">
                            <div className="flex flex-col gap-[5px] w-full">
                                <label
                                    htmlFor="additionalNotes"
                                    className="text-[13px] sm:text-[14px] font-medium text-[#4a504e]"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}
                                >
                                    Additional Notes (Optional)
                                </label>
                                <div className="bg-[#fbfbfb] border border-[#cacaca] rounded-xl p-[15px] sm:p-[18px] md:p-[21px] focus-within:border-[#f49b31] focus-within:ring-1 focus-within:ring-[#f49b31] transition-colors duration-200">
                                    <textarea
                                        id="additionalNotes"
                                        name="additionalNotes"
                                        value={additionalNotes}
                                        onChange={(e) => setAdditionalNotes(e.target.value)}
                                        placeholder="Any additional information that might help us..."
                                        rows={4}
                                        disabled={isLoading || isOffline}
                                        className="w-full bg-transparent border-none outline-none text-[12px] sm:text-[13px] text-[#4a504e] placeholder:text-[#737373] placeholder:italic resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                                        style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="w-full">
                            <AuthButton
                                type="submit"
                                disabled={isLoading || isOffline}
                                loading={isLoading}
                            >
                                {isLoading ? "Submitting..." : "Submit Request"}
                            </AuthButton>
                        </div>

                        {/* Back Button */}
                        <div className="w-full">
                            <AuthButton
                                type="button"
                                variant="outline"
                                onClick={handleBack}
                                disabled={isLoading || isOffline}
                            >
                                Back to Find Institution
                            </AuthButton>
                        </div>
                    </form>

                    {/* Footer */}
                    <AuthFooter />
                </AuthCard>
            </AuthLayout>
        </>
    );
};

export default MakeRequest;
