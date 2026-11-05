import { FiSearch } from "react-icons/fi";

interface Props {
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    placeholder?: string;
    disabled?: boolean;
}

/**
 * PingSearchInput Component
 * 
 * Search input field with magnifying glass icon and vertical divider.
 * Used in Wave creation flow to search for existing Pings.
 * Features orange border on focus state.
 */
const PingSearchInput = ({
    value,
    onChange,
    onFocus,
    onBlur,
    placeholder = "Search for the ping...",
    disabled = false
}: Props) => {
    return (
        <div className={`
      flex items-center gap-3 px-[15px] py-[11px] 
      border border-black rounded-[10px] 
      transition-all duration-200
      focus-within:border-[#F49B31] focus-within:border-2
      ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'bg-white'}
    `}>
            {/* Search Icon */}
            <FiSearch className="w-4 h-4 text-[#7D7D7D] shrink-0" />

            {/* Vertical Divider */}
            <div className="w-px h-5 bg-[#7D7D7D]" />

            {/* Input Field */}
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={placeholder}
                disabled={disabled}
                className="
          flex-1 outline-none text-[14px] text-[#454545]
          placeholder:italic placeholder:text-[#7D7D7D]
          disabled:cursor-not-allowed disabled:bg-transparent
        "
                aria-label="Search for ping"
            />
        </div>
    );
};

export default PingSearchInput;
