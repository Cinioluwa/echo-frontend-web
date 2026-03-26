import { useState } from "react";

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

interface InputGroupProps {
  placeholder: string;
  iconSrc: string;
  type: string;
  name?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
          className="pr-5 py-1 flex items-center justify-center text-[#CACACA] hover:text-[#f49b31] transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPasswordVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
        </button>
      )}
    </div>
  );
};

export default InputGroup;
