import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
    AuthLayout,
    AuthCard,
    AuthButton,
    AuthFooter,
    ErrorBadge,
} from "../../components/auth";
import { useOrganizationStore } from "../../stores/data/useOrganizationStore";
import { useRegistrationStore } from "../../stores/ui/useRegistrationStore";
import type { Organization } from "../../api/types";

/**
 * Find Institution Screen
 * Searchable/selectable institution dropdown for manual organization selection
 * Implementation: Phase 3
 * Figma: Desktop 3885:8689 | Mobile 3835:11716
 */
const FindInstitution: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

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

    // Zustand store access
    const {
        organizations,
        isLoading,
        fetchOrganizations,
        selectOrganization,
        clearError,
    } = useOrganizationStore();

    const { setSelectedOrg, setFormData } = useRegistrationStore();

    // Local state
    const [selectedOrgId, setSelectedOrgIdLocal] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [showDropdown, setShowDropdown] = useState(false);
    const [domainError, setDomainError] = useState<string | null>(null);

    // User email from state or store
    const userEmail = locationState?.email || formData?.email || "";

    // Fetch organizations on mount or when search query changes
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchOrganizations(searchQuery || undefined);
        }, 300); // Debounce search

        return () => clearTimeout(timer);
    }, [searchQuery, fetchOrganizations]);

    // Save form data to store if passed via location state
    useEffect(() => {
        if (locationState?.email && locationState?.userData) {
            setFormData({
                email: locationState.email,
                firstName: locationState.userData.firstName,
                lastName: locationState.userData.lastName,
                password: locationState.userData.password,
            });
        }
    }, [locationState, setFormData]);

    /**
     * Validate email domain matches selected organization
     */
    const validateEmailDomain = (org: Organization, email: string): boolean => {
        if (!email) return false;
        const emailDomain = email.split("@")[1]?.toLowerCase();
        const orgDomain = org.domain.toLowerCase();
        return emailDomain === orgDomain;
    };

    /**
     * Handle organization selection
     */
    const handleSelectOrganization = (org: Organization) => {
        setSelectedOrgIdLocal(org.id);
        setSearchQuery(org.name);
        setShowDropdown(false);
        clearError();
        setDomainError(null);

        // Validate domain match
        if (userEmail && !validateEmailDomain(org, userEmail)) {
            setDomainError(
                `Email does not match the domain of ${org.name}. Expected @${org.domain}`
            );
        }
    };

    /**
     * Handle confirm button click
     */
    const handleConfirm = () => {
        if (!selectedOrgId) {
            return;
        }

        const selectedOrg = organizations.find((org) => org.id === selectedOrgId);
        if (!selectedOrg) {
            return;
        }

        // Check domain validation
        if (userEmail && !validateEmailDomain(selectedOrg, userEmail)) {
            setDomainError(
                `Email does not match the domain of ${selectedOrg.name}. Expected @${selectedOrg.domain}`
            );
            return;
        }

        // Store selected organization
        setSelectedOrg(selectedOrgId);
        selectOrganization(selectedOrgId);

        // Navigate to confirmation screen
        navigate("/institution-found", {
            state: {
                organization: selectedOrg,
                email: userEmail,
            },
        });
    };

    return (
        <AuthLayout>
            <AuthCard className="max-w-[537px]">
                {/* Header */}
                <div className="flex flex-col gap-2.5 items-center text-center w-full">
                    <h1 className="text-[28px] font-semibold text-black leading-9">
                        Find your Institution
                    </h1>
                    <p className="text-[16px] font-medium text-[#4a504e] opacity-69 leading-[21px]">
                        Search for your institution to join the discussion
                    </p>
                </div>

                {/* Error Badge - Domain Mismatch */}
                {domainError && (
                    <div className="w-full">
                        <ErrorBadge message={domainError} variant="error" />
                    </div>
                )}

                {/* Form */}
                <div className="flex flex-col gap-5 items-center w-full">
                    {/* Institution Selector */}
                    <div className="flex flex-col gap-[15px] items-start w-full">
                        <div className="flex flex-col gap-[5px] items-end w-full">
                            {/* Dropdown Input */}
                            <div className="relative w-full">
                                <div
                                    className="bg-[#fbfbfb] border border-[#cacaca] flex h-[59px] items-center justify-between pl-[30px] pr-[21px] py-[11px] rounded-xl w-full cursor-pointer"
                                    onClick={() => setShowDropdown(!showDropdown)}
                                >
                                    <input
                                        type="text"
                                        placeholder="Select Institution"
                                        value={searchQuery}
                                        onChange={(e) => {
                                            setSearchQuery(e.target.value);
                                            setShowDropdown(true);
                                        }}
                                        className="flex-1 bg-transparent text-[13px] font-medium text-[#626665] placeholder:text-[#626665] placeholder:italic outline-none"
                                        disabled={isLoading}
                                    />
                                    <svg
                                        width="20"
                                        height="20"
                                        viewBox="0 0 20 20"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className={`transform transition-transform ${showDropdown ? "rotate-180" : ""
                                            }`}
                                    >
                                        <path
                                            d="M5 7.5L10 12.5L15 7.5"
                                            stroke="#626665"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </div>

                                {/* Dropdown Menu */}
                                {showDropdown && (
                                    <div className="absolute z-10 w-full mt-2 bg-white border border-[#cacaca] rounded-xl shadow-lg max-h-[300px] overflow-y-auto">
                                        {isLoading ? (
                                            <div className="px-[30px] py-[15px] text-[13px] text-[#626665]">
                                                Loading...
                                            </div>
                                        ) : organizations.length === 0 ? (
                                            <div className="px-[30px] py-[15px] text-[13px] text-[#626665]">
                                                No institutions found
                                            </div>
                                        ) : (
                                            organizations.map((org) => (
                                                <div
                                                    key={org.id}
                                                    className="px-[30px] py-[15px] text-[13px] text-[#626665] hover:bg-[#fbfbfb] cursor-pointer border-b border-[#f0f0f0] last:border-b-0"
                                                    onClick={() => handleSelectOrganization(org)}
                                                >
                                                    <div className="font-medium">{org.name}</div>
                                                    <div className="text-[11px] text-[#999] mt-1">
                                                        @{org.domain}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Make Request Link */}
                            <button
                                onClick={() =>
                                    navigate("/make-request", {
                                        state: {
                                            email: userEmail,
                                            userData: formData,
                                        },
                                    })
                                }
                                className="text-[9px] font-medium text-[#f49b31] leading-[13px] hover:underline"
                            >
                                Can't find Institution?{" "}
                                <span className="font-semibold">Make Request</span>
                            </button>
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <AuthButton
                        onClick={handleConfirm}
                        disabled={!selectedOrgId || isLoading || !!domainError}
                        className="w-full"
                    >
                        Confirm
                    </AuthButton>
                </div>

                {/* Footer */}
                <AuthFooter />
            </AuthCard>
        </AuthLayout>
    );
};

export default FindInstitution;
