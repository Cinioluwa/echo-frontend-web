import React, { forwardRef } from "react";

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
}

/**
 * AuthInput Component
 * Styled input with icon and vertical separator matching Figma design
 * Design: Light gray background (#fbfbfb), gray border (#cacaca), icon with separator line
 * Mobile: Responsive sizing and padding, minimum touch target of 44px
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
        },
        ref
    ) => {
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
                        type={type}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        required={required}
                        disabled={disabled}
                        autoComplete={autoComplete}
                        className="
              flex-1 bg-transparent border-none outline-none
              text-[12px] sm:text-[13px] text-[#4a504e]
              placeholder:text-[#737373] placeholder:italic
              disabled:cursor-not-allowed
            "
                        style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 500 }}
                    />
                </div>
                {error && (
                    <p className="mt-2 text-xs sm:text-sm text-red-600" role="alert" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
