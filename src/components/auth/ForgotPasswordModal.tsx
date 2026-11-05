import React, { useState } from "react";
import { useForgotPassword } from "../../hooks/useForgotPassword";
import { validateEmail } from "../../utils/validationUtils";

interface ForgotPasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

/**
 * ForgotPasswordModal Component
 * Modal for requesting password reset email
 * Design matches existing auth system: Poppins font, orange accent (#f49b31)
 * Two states: Email input form and success confirmation
 */
const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
    const { loading, error, success, email, requestReset, reset } = useForgotPassword();
    const [inputEmail, setInputEmail] = useState("");
    const [validationError, setValidationError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError(null);

        // Validate email
        if (!inputEmail.trim()) {
            setValidationError("Email is required");
            return;
        }

        const emailValidation = validateEmail(inputEmail);
        if (!emailValidation.isValid) {
            setValidationError(emailValidation.error || "Invalid email");
            return;
        }

        await requestReset(inputEmail);
    };

    const handleClose = () => {
        setInputEmail("");
        setValidationError(null);
        reset();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 z-40 transition-opacity"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                <div
                    className="bg-white rounded-[20px] sm:rounded-[30px] p-6 sm:p-8 md:p-10 max-w-md w-full shadow-lg animate-fade-in"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-400 hover:text-gray-600 transition"
                        aria-label="Close modal"
                    >
                        <svg
                            className="w-5 h-5 sm:w-6 sm:h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>

                    {!success ? (
                        <>
                            {/* Title */}
                            <h2
                                className="text-[22px] sm:text-[24px] font-semibold text-black mb-2"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Forgot Password?
                            </h2>

                            {/* Description */}
                            <p
                                className="text-sm text-gray-500 mb-6"
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                Enter your email address and we'll send you a link to reset your password.
                            </p>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Email Input */}
                                <div>
                                    <input
                                        type="email"
                                        value={inputEmail}
                                        onChange={(e) => {
                                            setInputEmail(e.target.value);
                                            setValidationError(null);
                                        }}
                                        placeholder="Enter your email..."
                                        className="w-full px-4 py-3 border border-orange-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#f49b31] transition"
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                        disabled={loading}
                                        autoComplete="email"
                                    />
                                    {(validationError || error) && (
                                        <p className="text-red-600 text-xs mt-1.5">
                                            {validationError || error}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-[#f49b31] text-white rounded-lg font-medium transition-all duration-200 hover:bg-[#e08a2a] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#f49b31] focus:ring-offset-2"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                    {loading ? "Sending..." : "Send Reset Link"}
                                </button>

                                {/* Cancel Button */}
                                <button
                                    type="button"
                                    onClick={handleClose}
                                    className="w-full py-3 border border-orange-200 text-[#4A3728] rounded-lg font-medium transition-colors hover:bg-orange-50"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            {/* Success State */}
                            <div className="text-center">
                                {/* Success Icon */}
                                <div className="flex justify-center mb-4">
                                    <div className="bg-green-100 rounded-full p-3">
                                        <svg
                                            className="w-6 h-6 text-green-600"
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
                                </div>

                                <h2
                                    className="text-[22px] sm:text-[24px] font-semibold text-black mb-2"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                    Check Your Inbox
                                </h2>

                                <p
                                    className="text-sm text-gray-600 mb-4"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                    If an account exists for <span className="font-semibold text-[#4A3728]">{email}</span>, you will receive a password reset link shortly.
                                </p>

                                <p
                                    className="text-xs text-gray-400 mb-6"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                    The link will expire in 24 hours. If you don't receive an email within a few minutes, please check your spam folder or confirm your email address.
                                </p>

                                {/* Done Button */}
                                <button
                                    onClick={handleClose}
                                    className="w-full py-3 bg-[#f49b31] text-white rounded-lg font-medium transition-all duration-200 hover:bg-[#e08a2a] focus:outline-none focus:ring-2 focus:ring-[#f49b31] focus:ring-offset-2"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                    Done
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};

export default ForgotPasswordModal;
