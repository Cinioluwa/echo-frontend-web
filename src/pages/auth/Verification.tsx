import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../../stores";
import { authService } from "../../api/services";
import AuthLayout from "../../components/auth/AuthLayout";
import AuthCard from "../../components/auth/AuthCard";
import AuthButton from "../../components/auth/AuthButton";
import AuthFooter from "../../components/auth/AuthFooter";
import OfflineIndicator from "../../components/auth/OfflineIndicator";
import { useNetworkStatus } from "../../hooks";

const EmailIcon = () => (
    <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-10 h-10 sm:w-12 sm:h-12"
    >
        <path
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
            stroke="#f49b31"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <polyline
            points="22,6 12,13 2,6"
            stroke="#f49b31"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Verification: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const fetchUserProfile = useAuthStore((state) => state.fetchUserProfile);
    const authEmail = useAuthStore((state) => state.user?.email);
    const { isOffline } = useNetworkStatus();

    const emailFromState =
        typeof location.state?.email === "string" ? location.state.email : "";
    const emailFromQuery = searchParams.get("email") || "";
    const organizationIdFromQuery = Number(searchParams.get("organizationId") || "");
    const organizationIdFromState = Number(location.state?.organizationId || "");
    const organizationId =
        Number.isFinite(organizationIdFromState) && organizationIdFromState > 0
            ? organizationIdFromState
            : Number.isFinite(organizationIdFromQuery) && organizationIdFromQuery > 0
                ? organizationIdFromQuery
                : undefined;
    const email = emailFromState || emailFromQuery || authEmail || "";
    const emailDisplay = email || "your registered email";
    const hasValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const [isResending, setIsResending] = useState(false);
    const [resendSuccess, setResendSuccess] = useState(false);
    const [resendError, setResendError] = useState<string | null>(null);
    const [resendCooldown, setResendCooldown] = useState(0);
    const [verifying, setVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get("token");
        if (token) {
            void handleVerifyEmail(token);
        }
    }, [searchParams]);

    useEffect(() => {
        if (resendCooldown <= 0) return;

        const timer = setTimeout(() => {
            setResendCooldown((prev) => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleVerifyEmail = async (token: string) => {
        setVerifying(true);
        setVerifyError(null);

        try {
            await authService.verifyEmail(token);
            await fetchUserProfile();
            const user = useAuthStore.getState().user;

            const pendingJoinRequest =
                user?.pendingJoinRequest?.status === "PENDING"
                    ? user.pendingJoinRequest
                    : null;
            const legacyPendingRequest =
                user?.pendingRequests?.find((request) => request.status === "PENDING") ||
                null;

            if (pendingJoinRequest || legacyPendingRequest) {
                navigate("/waiting-room", {
                    state: {
                        organizationName:
                            pendingJoinRequest?.organization?.name ||
                            legacyPendingRequest?.organizationName ||
                            user?.organization?.name ||
                            "your institution",
                    },
                });
                return;
            }

            if (user?.status === "ACTIVE" && user?.organizationId) {
                navigate("/all-verified", {
                    state: {
                        organizationName:
                            user.organization?.name ||
                            user.pendingJoinRequest?.organization?.name ||
                            "your institution",
                        fromVerification: true,
                    },
                });
                return;
            }

            if (!user?.organizationId) {
                navigate("/find-institution", {
                    state: {
                        email,
                    },
                });
                return;
            }

            navigate("/verification", {
                state: {
                    email,
                },
            });
        } catch (err: any) {
            console.error("Email verification error:", err);
            const status = err?.response?.status;

            if (status === 400 || status === 404 || status === 410) {
                setVerifyError(
                    "This verification link is invalid or expired. Request a new one below.",
                );
            } else {
                setVerifyError("We couldn't verify your email right now. Please try again.");
            }
        } finally {
            setVerifying(false);
        }
    };

    const handleResendVerification = async () => {
        if (resendCooldown > 0 || isResending || isOffline) return;

        if (!hasValidEmail) {
            setResendError("We could not detect your email. Return to login and try again.");
            return;
        }

        setIsResending(true);
        setResendSuccess(false);
        setResendError(null);

        try {
            await authService.resendVerification({
                email,
                organizationId,
            });
            setResendSuccess(true);
            setResendCooldown(60);
        } catch (err: any) {
            console.error("Resend verification error:", err);
            const status = err?.response?.status;

            if (status === 429) {
                setResendError("Too many requests. Please wait before trying again.");
                setResendCooldown(60);
            } else if (status === 400) {
                setResendError(
                    "Please check the email details and try again.",
                );
            } else {
                setResendError("We couldn't send another link right now. Please try again.");
            }
        } finally {
            setIsResending(false);
        }
    };

    return (
        <>
            <OfflineIndicator />
            <AuthLayout>
                <AuthCard>
                    <div className="flex items-center justify-center">
                        <EmailIcon />
                    </div>

                    <div className="text-center w-full">
                        <h1
                            className="text-[22px] sm:text-[26px] md:text-[28px] font-semibold text-[#4a504e] mb-2.5"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                            Verify Your Email
                        </h1>
                        <p
                            className="text-[12px] sm:text-[13px] text-[#838383] font-normal leading-relaxed"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                            We&apos;ve sent a verification link to
                        </p>
                        <p
                            className="text-[13px] sm:text-[14px] text-[#f49b31] font-semibold mt-[5px]"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                            {emailDisplay}
                        </p>
                    </div>

                    <div className="w-full bg-[#fef5ea] border border-[#ffcd71] rounded-xl px-4 sm:px-5 py-3 sm:py-[15px]">
                        <p
                            className="text-[12px] text-[#4a504e] text-center leading-relaxed"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                            Please check your inbox and click the verification link to complete your registration.
                        </p>
                    </div>

                    {verifyError && (
                        <div className="w-full p-3 bg-red-50 border border-red-300 rounded-lg">
                            <p className="text-red-600 text-sm text-center">{verifyError}</p>
                        </div>
                    )}

                    {verifying && (
                        <div className="w-full p-3 bg-blue-50 border border-blue-300 rounded-lg">
                            <p className="text-blue-600 text-sm text-center">Confirming your email...</p>
                        </div>
                    )}

                    {resendSuccess && (
                        <div className="w-full p-3 bg-green-50 border border-green-300 rounded-lg">
                            <p className="text-green-600 text-sm text-center">
                                If an account exists for that email, a verification link will arrive shortly.
                            </p>
                        </div>
                    )}

                    {resendError && (
                        <div className="w-full p-3 bg-red-50 border border-red-300 rounded-lg">
                            <p className="text-red-600 text-sm text-center">{resendError}</p>
                        </div>
                    )}

                    {!hasValidEmail && (
                        <div className="w-full p-3 bg-amber-50 border border-amber-300 rounded-lg">
                            <p className="text-amber-700 text-sm text-center">
                                We could not identify the email address for this session.
                            </p>
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="mt-2 text-sm text-amber-800 font-semibold underline w-full text-center"
                            >
                                Go to Login
                            </button>
                        </div>
                    )}

                    <div className="w-full">
                        <AuthButton
                            type="button"
                            onClick={handleResendVerification}
                            disabled={
                                isResending || resendCooldown > 0 || isOffline || !hasValidEmail
                            }
                            loading={isResending}
                        >
                            {isResending
                                ? "Sending..."
                                : resendCooldown > 0
                                    ? `Resend in ${resendCooldown}s`
                                    : "Resend Verification Email"}
                        </AuthButton>
                    </div>

                    <div className="text-center">
                        <p
                            className="text-[12px] text-[#838383]"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                            Didn&apos;t receive the email? Check your spam folder or click resend above.
                        </p>
                    </div>

                    <AuthFooter />
                </AuthCard>
            </AuthLayout>
        </>
    );
};

export default Verification;
