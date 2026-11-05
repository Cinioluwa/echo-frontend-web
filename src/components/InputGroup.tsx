import { useState } from "react";

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

interface InputGroupProps {
  placeholder: string;
  iconSrc: string;
  type: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  required?: boolean;
  disabled?: boolean;
  showPasswordToggle?: boolean;
}

const InputGroup = ({
  placeholder,
  iconSrc,
  type,
  name,
  value,
  onChange,
  onKeyDown,
  required = true,
  disabled = false,
  showPasswordToggle = false,
}: InputGroupProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const inputType = showPasswordToggle && isPasswordVisible ? "text" : type;

  return (
    <div className="mb-4.5 w-full flex items-center bg-[#FBFBFB] italic text-[#CACACA] justify-start h-16 relative border overflow-hidden border-[#CACACA] rounded-xl">
      <span className="w-7 pr-2 left-5 py-1 absolute flex items-center justify-center border-r border-r-[#CACACA]">
        <img src={iconSrc} alt="" />
      </span>
      <input
        className="pl-15 text-[12px] h-full flex-1 outline-0 disabled:opacity-50 disabled:cursor-not-allowed"
        type={inputType}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        required={required}
        disabled={disabled}
      />

      {/* Password visibility toggle button */}
      {showPasswordToggle && (
        <button
          type="button"
          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          disabled={disabled}
          aria-label={isPasswordVisible ? "Hide password" : "Show password"}
          className="pr-5 py-1 flex items-center justify-center text-[#f49b31] hover:text-[#f49b31] transition-all duration-300 ease-in-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          <AnimatedEyeIcon isOpen={isPasswordVisible} />
        </button>
      )}
    </div>
  );
};

export default InputGroup;
