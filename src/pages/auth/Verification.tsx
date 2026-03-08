import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../stores";
import { authService } from "../../api/services";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthButton from "../../components/auth/AuthButton";
import AuthFooter from "../../components/auth/AuthFooter";

// Email Icon
const EmailIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 sm:w-12 sm:h-12">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#f49b31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <polyline points="22,6 12,13 2,6" stroke="#f49b31" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/**
 * Verification Screen - Phase 2 Implementation
 * Displays email verification instructions and handles verification token from URL
 * Figma: Desktop (3753:8611, 3945:8918) | Mobile (3833:10892, 3982:9027)
 */
const Verification: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);

    // Get email from navigation state or fallback
    const email = location.state?.email || "your email";

    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendError, setResendError] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [verifying, setVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState<string | null>(null);

    // Handle verification token from URL
    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            handleVerifyEmail(token);
        }
    }, [searchParams]);

    // Cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    const handleVerifyEmail = async (token: string) => {
        setVerifying(true);
        setVerifyError(null);

        try {
            await authService.verifyEmail(token);

            // Fetch user profile to determine next step
            await fetchUserProfile();
            const user = useAuthStore.getState().user;

            // Check user's organization join policy and status
            if (user?.status === "ACTIVE" && user?.organizationId) {
                // OPEN policy - user is active
                navigate("/all-verified", {
                    state: { organizationName: user.organization?.name || "your organization" }
                });
            } else if (user?.status === "PENDING" && user?.pendingRequests && user.pendingRequests.length > 0) {
                // REQUIRES_APPROVAL policy - user needs approval
                navigate("/waiting-room", {
                    state: { organizationName: user.pendingRequests[0]?.organizationName || "your organization" }
                });
            } else {
                // Fallback - redirect to all verified
                navigate("/all-verified", {
                    state: { organizationName: user?.organization?.name || "your organization" }
                });
            }
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.response?.data?.error || "Invalid or expired verification link";
            setVerifyError(message);
        } finally {
            setVerifying(false);
        }
    };

    const handleResendVerification = async () => {
        if (resendCooldown > 0 || isResending) return;

        setIsResending(true);
        setResendSuccess(false);
        setResendError(null);

        try {
            await authService.resendVerification(email);
            setResendSuccess(true);
            setResendCooldown(60); // 60 second cooldown
        } catch (err: any) {
            const status = err?.response?.status;
            const message = err?.response?.data?.message || err?.response?.data?.error;

            if (status === 429) {
                setResendError("Too many requests. Please wait before trying again.");
                setResendCooldown(60);
            } else {
                setResendError(message || "Failed to resend verification email");
            }
        } finally {
            setIsResending(false);
        }
    };

    return (
        <AuthLayout>
            <AuthCard>
                {/* Email Icon */}
                <div className="flex items-center justify-center">
                    <EmailIcon />
                </div>

                {/* Title */}
                <div className="text-center w-full">
                    <h1
                        className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-[#4a504e] mb-2.5"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Verify Your Email
                    </h1>
                    <p
                        className="text-[12px] sm:text-[13px] text-[#838383] font-normal leading-relaxed"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        We've sent a verification link to
                    </p>
                    <p
                        className="text-[13px] sm:text-[14px] text-[#f49b31] font-semibold mt-[5px]"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        {email}
                    </p>
                </div>

                {/* Instructions */}
                <div className="w-full bg-[#fef5ea] border border-[#ffcd71] rounded-xl px-4 sm:px-5 py-3 sm:py-[15px]">
                    <p
                        className="text-[12px] text-[#4a504e] text-center leading-relaxed"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        Please check your inbox and click the verification link to complete your registration.
                    </p>
                </div>

                {/* Verification Error */}
                {verifyError && (
                    <div className="w-full">
                        <div className="w-full p-3 bg-red-50 border border-red-300 rounded-lg">
                            <p className="text-red-600 text-sm text-center">{verifyError}</p>
                        </div>
                    </div>
                )}

                {/* Verifying State */}
                {verifying && (
                    <div className="w-full">
                        <div className="w-full p-3 bg-blue-50 border border-blue-300 rounded-lg">
                            <p className="text-blue-600 text-sm text-center">Verifying your email...</p>
                        </div>
                    </div>
                )}

                {/* Resend Success Message */}
                {resendSuccess && (
                    <div className="w-full">
                        <div className="w-full p-3 bg-green-50 border border-green-300 rounded-lg">
                            <p className="text-green-600 text-sm text-center">Verification email sent successfully!</p>
                        </div>
                    </div>
                )}

                {/* Resend Error Message */}
                {resendError && (
                    <div className="w-full">
                        <div className="w-full p-3 bg-red-50 border border-red-300 rounded-lg">
                            <p className="text-red-600 text-sm text-center">{resendError}</p>
                        </div>
                    </div>
                )}

                {/* Resend Verification Button */}
                <div className="w-full">
                    <AuthButton
                        type="button"
                        onClick={handleResendVerification}
                        disabled={isResending || resendCooldown > 0}
                        loading={isResending}
                    >
                        {isResending
                            ? "Sending..."
                            : resendCooldown > 0
                                ? `Resend in ${resendCooldown}s`
                                : "Resend Verification Email"}
                    </AuthButton>
                </div>

                {/* Didn't receive email message */}
                <div className="text-center">
                    <p className="text-[12px] text-[#838383]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Didn't receive the email? Check your spam folder or click resend above.
                    </p>
                </div>

                {/* Footer */}
                <AuthFooter />
            </AuthCard>
        </AuthLayout>
    );
};

export default Verification;

