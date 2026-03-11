/**
 * CommentCountButton — Reusable comment count display button
 * Figma ref: 3869:8737 (Comment Button variants)
 * Phase: 5
 *
 * Two states:
 *  - Default (active=false): black bordered pill, white bg, black text
 *  - Active  (active=true):  orange bg (#f49b31), white text
 */

interface CommentCountButtonProps {
    count: number;
    active?: boolean;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
}

const CommentCountButton = ({
    count,
    active = false,
    onClick,
    disabled = false,
    className,
}: CommentCountButtonProps) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            aria-pressed={active}
            aria-label={`Comments — ${count} comments`}
            className={`
        flex gap-[3px] items-center justify-center
        px-2.5 rounded-[18px] transition-colors duration-200
        ${active
                    ? "bg-[#f49b31] border border-[#f49b31] py-[7px]"
                    : "border border-black py-[7px]"
                }
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className ?? ""}
      `}
        >
            {/* Comment / lightning icon — 10×16px default, 10×14px active */}
            <svg
                className={`shrink-0 w-2.5 ${active ? "h-3.5" : "h-4"}`}
                viewBox="0 0 10 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    d="M5.5 1L0.5 8.5H5L4.5 15L9.5 7.5H5L5.5 1Z"
                    fill={active ? "white" : "black"}
                    stroke={active ? "white" : "black"}
                    strokeWidth="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Count */}
            <span
                className={`font-bold uppercase leading-[0.94] whitespace-nowrap
          ${active ? "text-[14px] text-white" : "text-[12px] text-black"}
          font-['Baloo_Bhai_2',sans-serif]`}
            >
                {count}
            </span>
        </button>
    );
};

export default CommentCountButton;
