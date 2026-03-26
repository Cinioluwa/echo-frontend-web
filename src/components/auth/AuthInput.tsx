import React, { forwardRef, useState } from "react";

interface AuthInputProps {
    type?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
    autoComplete?: string;
    className?: string;
    showPasswordToggle?: boolean;
}

// Eye icon (open/visible)
const EyeOpenIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 5C7 5 2.73 8.11 1 12.46c1.73 4.35 6 7.54 11 7.54s9.27-3.19 11-7.54C21.27 8.11 17 5 12 5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor" />
    </svg>
);

// Eye icon (closed/hidden)
const EyeClosedIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.83 9L5.5 2.67A9.978 9.978 0 0112 2c5.52 0 10.74 3.1 13.35 7.6.43.8.43 1.76 0 2.56-1.04 1.93-2.78 3.61-4.88 4.86L12.17 15A3 3 0 0011.83 9zm9.61 8.87l-1.06-1.06a1 1 0 00-1.41 0l-1.41 1.41a1 1 0 000 1.41l1.06 1.06a9.978 9.978 0 01-4.73 1.31c-5.52 0-10.74-3.1-13.35-7.6-.43-.8-.43-1.76 0-2.56 1.04-1.93 2.78-3.61 4.88-4.86L2.44 5.5a1 1 0 000-1.41L3.5 2.44a1 1 0 011.41 0l17.07 17.07a1 1 0 000 1.41l-1.06 1.06a1 1 0 00-1.41 0z" fill="currentColor" />
    </svg>
);

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
          bg-[#fbfbfb] border rounded-xl
          h-[50px] sm:h-[55px] md:h-[59px]
          flex items-center gap-2.5 sm:gap-3 md:gap-[13px]
          px-[15px] sm:px-[18px] md:px-[21px] py-[11px]
          ${error ? "border-red-500" : "border-[#cacaca]"}
          transition-colors duration-200
          focus-within:border-[#f49b31] focus-within:ring-1 focus-within:ring-[#f49b31]
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
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        aria-label={placeholder || name}
                        aria-required={required}
                        aria-invalid={!!error}
                        aria-describedby={errorId}
                        className="
              flex-1 bg-transparent border-none outline-none
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
                                className="shrink-0 w-[22px] h-[22px] sm:w-6 sm:h-6 md:w-[26px] md:h-[26px] flex items-center justify-center text-[#cacaca] hover:text-[#f49b31] transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 rounded-md hover:bg-[#f5f5f5]"
                            >
                                {isPasswordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
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
