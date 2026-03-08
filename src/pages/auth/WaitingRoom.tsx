import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import { useAuthStore } from "../../stores";

/**
 * CheckIcon Component
 * White checkmark icon for the waiting room
 */
const CheckIcon = () => (
    <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M50 15L22.5 42.5L10 30"
            stroke="white"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/**
 * WaitingRoom Component - Phase 5 Implementation
 * Display when user verified email but needs leader approval (REQUIRES_APPROVAL organizations)
 * 
 * Figma References:
 * - Desktop: Node ID 3886:8698
 * - Mobile: Node ID 3896:9237
 * 
 * Features:
 * - Displays "You're in line..." message
 * - Shows dynamic organization name from pendingRequests
 * - No CTA buttons (user must wait for approval)
 * - Terms and Privacy Policy footer links
 * - Mobile responsive (100px icon on desktop, 70px on mobile)
 */
const WaitingRoom: React.FC = () => {
    const navigate = useNavigate();
    const { user, fetchUserProfile, canAccessFeed, isWaitingApproval } = useAuthStore();
    const [organizationName, setOrganizationName] = useState<string>("your institution");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const initializeWaitingRoom = async () => {
            try {
                // Fetch latest user profile to get pending requests
                if (!user) {
                    await fetchUserProfile();
                }
            } catch (error) {
                console.error("Error loading user profile:", error);
                // If there's an auth error, redirect to login
                navigate("/login");
            } finally {
                setIsLoading(false);
            }
        };

        initializeWaitingRoom();
    }, []);

    useEffect(() => {
        if (!isLoading && user) {
            // If user can access feed (status is ACTIVE), redirect to main feed
            if (canAccessFeed()) {
                navigate("/stream");
                return;
            }

            // If user is not waiting for approval, redirect to appropriate screen
            if (!isWaitingApproval()) {
                if (!user.organizationId) {
                    navigate("/find-institution");
                } else {
                    navigate("/verification");
                }
                return;
            }

            // Extract organization name from pending requests
            if (user.pendingRequests && user.pendingRequests.length > 0) {
                const pendingRequest = user.pendingRequests[0];
                setOrganizationName(pendingRequest.organizationName);
            } else if (user.organization) {
                setOrganizationName(user.organization.name);
            }
        }
    }, [user, isLoading, canAccessFeed, isWaitingApproval, navigate]);

    if (isLoading) {
        return (
            <AuthLayout>
                <AuthCard>
                    <div className="w-full text-center py-10">
                        <p className="text-[#4a504e] text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Loading...
                        </p>
                    </div>
                </AuthCard>
            </AuthLayout>
        );
    }

    return (
        <AuthLayout>
            <AuthCard className="px-[30px] sm:px-[50px] py-[50px] gap-5 sm:gap-[30px]">
                {/* Icon Box - Orange circle with white checkmark */}
                <div
                    className="flex items-center justify-center rounded-full bg-[#f49b31] w-[70px] h-[70px] sm:w-[100px] sm:h-[100px] p-[5.6px]"
                    style={{ flexShrink: 0 }}
                >
                    <div className="w-10 h-10 sm:w-[60px] sm:h-[60px]">
                        <CheckIcon />
                    </div>
                </div>

                {/* Header Section */}
                <div className="flex flex-col gap-2.5 items-center w-full">
                    <h1
                        className="text-[24px] sm:text-[28px] font-semibold text-black text-center leading-[30px] sm:leading-9"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        You're in line...
                    </h1>
                </div>

                {/* Message Section */}
                <div className="flex flex-col gap-2.5 items-center w-full">
                    <p
                        className="text-[13px] sm:text-[14px] text-[#4a504e] text-center leading-[21px] font-medium opacity-[0.69]"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Your request to join {organizationName} is pending approval. We'll notify you once you're in.
                    </p>
                </div>

                {/* Footer Section - Terms and Privacy */}
                <div className="flex flex-col gap-[15px] items-center px-5 w-full mt-2.5">
                    <a
                        href="/terms"
                        className="text-[9px] sm:text-[14px] text-[#f49b31] text-center leading-3.5 font-medium hover:text-[#e08a2a] transition-colors"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Terms of Use, Privacy Policy
                    </a>
                </div>
            </AuthCard>
        </AuthLayout>
    );
};

export default WaitingRoom;
