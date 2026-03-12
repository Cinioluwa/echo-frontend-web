/**
 * SurgeButton — Reusable surge/upvote button
 * Figma ref: 3677:10637 (Feed Button variants)
 * Phase: 5
 *
 * Two states:
 *  - Default (surged=false): light yellow bg (#fef5ea), black border, dark text
 *  - Active  (surged=true):  orange bg (#f49b31), white text
 *
 */

interface SurgeButtonProps {
    count: number;
    surged?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

const SurgeButton = ({
    count,
    surged = false,
    onClick,
    disabled = false,
    className,
}: SurgeButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-pressed={surged}
            aria-label={`Surge — ${count} surges`}
            className={`
        border border-solid flex gap-[5px] items-center justify-center
        px-2.5 py-[5px] rounded-[15px] transition-colors duration-200
        ${surged
                    ? "bg-[#f49b31] border-[#f49b31] text-white"
                    : "bg-[#fef5ea] border-black text-[#4a504e]"
                }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className ?? ""}
      `}
        >
            {/* Lightning bolt icon — 12×16px */}
            <svg
                className="shrink-0 w-3 h-4"
                viewBox="0 0 12 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    d="M7 1L1 9H6L5 15L11 7H6L7 1Z"
                    fill={surged ? "white" : "#4a504e"}
                    stroke={surged ? "white" : "#4a504e"}
                    strokeWidth="1"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Count */}
            <span className={`font-semibold text-[14px] leading-normal text-right whitespace-nowrap font-poppins ${surged ? "text-white" : "text-[#4a504e]"}`}>
                {count}
            </span>
        </button>
    );
};

export default SurgeButton;
