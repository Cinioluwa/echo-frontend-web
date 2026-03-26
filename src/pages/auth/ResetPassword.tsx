import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import passwordService from "../../api/services/password.service";
import { AuthLayout, AuthCard, AuthButton } from "../../components/auth";

/**
 * ResetPassword Page
 * Handles password reset process with token from email link
 * URL: /reset-password?token={resetToken}
 */
const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [validationErrors, setValidationErrors] = useState<{
        password?: string;
        confirmPassword?: string;
    }>({});

    // Validate token on mount
    useEffect(() => {
        if (!token) {
            setError("Invalid reset link. Please request a new password reset.");
        }
    }, [token]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear validation error for this field
        if (validationErrors[name as keyof typeof validationErrors]) {
            setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
        }
        // Clear general error
        if (error) setError(null);
    };

    const validateForm = (): boolean => {
        const errors: typeof validationErrors = {};

        if (!formData.password) {
            errors.password = "Password is required";
        } else if (formData.password.length < 8) {
            errors.password = "Password must be at least 8 characters";
        }

        if (!formData.confirmPassword) {
            errors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            errors.confirmPassword = "Passwords do not match";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;
        if (!token) {
            setError("Invalid reset link. Please request a new password reset.");
            return;
        }

        setLoading(true);

        try {
            await passwordService.resetPassword(token, formData.password);
            setSuccess(true);

            // Redirect to login after 2 seconds
            setTimeout(() => {
                navigate("/login", { state: { message: "Password reset successful. Please log in." } });
            }, 2000);
        } catch (err: any) {
            const errorMessage =
                err?.response?.data?.error ||
                err?.response?.data?.message ||
                "Failed to reset password. Please try again.";

            // Handle specific error codes
            if (err?.response?.status === 400) {
                setError("The reset link has expired. Please request a new one.");
            } else {
                setError(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <AuthCard>
                {!success ? (
                    <>
                        {/* Header Section */}
                        <div className="flex flex-col gap-2.5 items-center text-center w-full">
                            <h1
                                className="text-[22px] sm:text-[26px] md:text-[28px] leading-7 sm:leading-8 md:leading-9 text-black"
                                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 600 }}
                            >
                                Reset Password
                            </h1>
                            <p
                                className="text-[14px] sm:text-base leading-5 sm:leading-[21px] text-[#4a504e] opacity-[0.69]"
                                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 500 }}
                            >
                                Enter a new password for your account
                            </p>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-600 text-sm text-center">{error}</p>
                            </div>
                        )}

                        {/* Form Section */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 sm:gap-6 md:gap-[30px] items-center w-full">
                            {/* Password Input */}
                            <div className="flex flex-col gap-3.5 sm:gap-4 md:gap-5 items-start w-full">
                                {/* New Password */}
                                <div className="w-full">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="New Password"
                                        disabled={loading}
                                        className="w-full px-4 py-3 border border-orange-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f49b31] transition"
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                        minLength={8}
                                        required
                                        autoComplete="new-password"
                                    />
                                    {validationErrors.password && (
                                        <p className="text-red-600 text-xs mt-1.5">{validationErrors.password}</p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="w-full">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm Password"
                                        disabled={loading}
                                        className="w-full px-4 py-3 border border-orange-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f49b31] transition"
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                        minLength={8}
                                        required
                                        autoComplete="new-password"
                                    />
                                    {validationErrors.confirmPassword && (
                                        <p className="text-red-600 text-xs mt-1.5">{validationErrors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <AuthButton
                                type="submit"
                                disabled={loading}
                                loading={loading}
                                fullWidth
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </AuthButton>

                            {/* Back to Login Link */}
                            <p
                                className="text-xs sm:text-sm text-center text-gray-600"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Remember your password?{" "}
                                <Link
                                    to="/login"
                                    className="text-[#f49b31] hover:text-[#e08a2a] transition-colors font-medium"
                                >
                                    Log in
                                </Link>
                            </p>
                        </form>
                    </>
                ) : (
                    <>
                        {/* Success State */}
                        <div className="flex flex-col gap-6 items-center text-center w-full">
                            {/* Success Icon */}
                            <div className="bg-green-100 rounded-full p-4">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>

                            <div>
                                <h2
                                    className="text-[22px] sm:text-[26px] font-semibold text-black mb-2"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                    Password Reset Successful
                                </h2>
                                <p
                                    className="text-sm text-gray-500"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                    Your password has been updated. Redirecting to login...
                                </p>
                            </div>
                        </div>
                    </>
                )}
            </AuthCard>
        </AuthLayout>
    );
};

export default ResetPassword;
