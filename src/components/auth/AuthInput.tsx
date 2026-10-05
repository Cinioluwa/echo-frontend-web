import React, { forwardRef, useState } from "react";

interface AuthInputProps {
    type?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    autoComplete?: string;
    className?: string;
    showPasswordToggle?: boolean;
}

// Animated Eye Icon Component
const AnimatedEyeIcon = ({ isOpen }: { isOpen: boolean }) => {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="overflow-visible"
            style={{
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
        >
            <style>{`
                @keyframes eyeOpen {
                    from {
                        opacity: 0;
                        stroke-width: 1.5;
                    }
                    to {
                        opacity: 1;
                        stroke-width: 1.5;
                    }
                }
                @keyframes eyeClosed {
                    from {
                        opacity: 0;
                        stroke-width: 1.5;
                    }
                    to {
                        opacity: 1;
                        stroke-width: 1.5;
                    }
                }
                .eye-open-path {
                    opacity: ${isOpen ? 1 : 0};
                    transition: opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .eye-closed-path {
                    opacity: ${isOpen ? 0 : 1};
                    transition: opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .eye-pupil {
                    opacity: ${isOpen ? 1 : 0};
                    transition: opacity 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
            `}</style>

            {/* Open eye - outer shape and pupil */}
            <path
                className="eye-open-path"
                d="M12 5C7 5 2.73 8.11 1 12.46c1.73 4.35 6 7.54 11 7.54s9.27-3.19 11-7.54C21.27 8.11 17 5 12 5z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
            />
            <circle className="eye-pupil" cx="12" cy="12.46" r="2.5" fill="currentColor" />

            {/* Closed eye - top eyelid */}
            <path
                className="eye-closed-path"
                d="M1 12.46c1.73-4.35 6-7.46 11-7.46s9.27 3.11 11 7.46"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
            />
            {/* Closed eye - bottom eyelid */}
            <path
                className="eye-closed-path"
                d="M1 12.46c1.73 4.35 6 7.54 11 7.54s9.27-3.19 11-7.54"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
            />
        </svg>
    );
};

/**
 * AuthInput Component - Phase 10 Enhanced
 * Styled input with icon and vertical separator matching Figma design
 * Design: Light gray background (#fbfbfb), gray border (#cacaca), icon with separator line
 * Mobile: Responsive sizing and padding, minimum touch target of 44px
 * 
 * Phase 10 Enhancements:
 * - Enhanced ARIA labels and descriptions for screen readers
 * - Improved error messaging with aria-live regions
 * - Better focus management and keyboard navigation
 * - Password visibility toggle for password fields
 */
const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    (
        {
            type = "text",
            name,
            value,
            onChange,
            onBlur,
            onKeyDown,
            placeholder,
            error,
            required = false,
            disabled = false,
            icon,
            autoComplete,
            className = "",
            showPasswordToggle = false,
        },
        ref
    ) => {
        const [isPasswordVisible, setIsPasswordVisible] = useState(false);
        const errorId = error ? `${name}-error` : undefined;

        // Determine actual input type based on password visibility
        const inputType = showPasswordToggle && isPasswordVisible ? "text" : type;

        return (
            <div className={className}>
                <div className={`
          w-full min-w-0 box-border bg-[#fbfbfb] border rounded-xl
          h-[50px] sm:h-[55px] md:h-[59px]
          flex items-center gap-2.5 sm:gap-3 md:gap-[13px]
          px-[15px] sm:px-[18px] md:px-[21px] py-[11px]
          ${error ? "border-red-500" : "border-[#cacaca]"}
          transition-colors duration-200
          focus-within:border-[#f49b31]
        `}>
                    {icon && (
                        <>
                            <div className="shrink-0 w-[22px] h-[22px] sm:w-6 sm:h-6 md:w-[26px] md:h-[26px] flex items-center justify-center text-[#cacaca]">
                                {icon}
                            </div>
                            {/* Vertical separator line */}
                            <div className="w-0 h-8 sm:h-9 md:h-[38px] flex items-center justify-center">
                                <div className="h-full w-px bg-[#e0e0e0]"></div>
                            </div>
                        </>
                    )}
                    <input
                        ref={ref}
                        id={name}
                        name={name}
                        type={inputType}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        onKeyDown={onKeyDown}
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        aria-label={placeholder || name}
                        aria-required={required}
                        aria-invalid={!!error}
                        aria-describedby={errorId}
                        className="
              min-w-0 flex-1 bg-transparent border-none outline-none
              text-[12px] sm:text-[13px] text-[#4a504e]
              placeholder:text-[#737373] placeholder:italic
              disabled:cursor-not-allowed
            "
                        style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
                    />

                    {/* Password visibility toggle button */}
                    {showPasswordToggle && (
                        <>
                            {/* Vertical separator before eye icon */}
                            <div className="w-0 h-8 sm:h-9 md:h-[38px] flex items-center justify-center">
                                <div className="h-full w-px bg-[#e0e0e0]"></div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                disabled={disabled}
                                aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                                className="shrink-0 w-[22px] h-[22px] sm:w-6 sm:h-6 md:w-[26px] md:h-[26px] flex items-center justify-center text-[#f49b31] hover:text-[#f49b31] transition-all duration-300 ease-in-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 rounded-md hover:bg-[#f5f5f5]"
                            >
                                <AnimatedEyeIcon isOpen={isPasswordVisible} />
                            </button>
                        </>
                    )}
                </div>
                {error && (
                    <p
                        id={errorId}
                        className="mt-2 text-xs sm:text-sm text-red-600 animate-slide-up"
                        role="alert"
                        aria-live="polite"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
