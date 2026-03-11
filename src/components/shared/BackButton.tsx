/**
 * BackButton — "← Go back to feed" navigation button
 * Figma ref: 3878:9066 (Back Button variants)
 * Phase: 5
 *
 * Two variants:
 *  - Default  (variant="default"): near-white bg (#fefefe), black text, arrow icon
 *  - Active   (variant="active"):  mid-orange bg (#ffc37b), orange border, white text
 */

import { useNavigate } from "react-router-dom";

interface BackButtonProps {
    variant?: "default" | "active";
    /** Override click handler. If not provided, uses navigate(-1). */
    onClick?: () => void;
    label?: string;
    className?: string;
}

const BackButton = ({
    variant = "default",
    onClick,
    label = "Go back to feed",
    className,
}: BackButtonProps) => {
    const navigate = useNavigate();
    const isActive = variant === "active";

    const handleClick = () => {
        if (onClick) {
            onClick();
        } else {
            navigate(-1);
        }
    };

    return (
        <button
            onClick={handleClick}
            className={`
        flex gap-[5px] items-center
        px-[15px] py-2.5 rounded-[20px]
        transition-colors duration-200
        ${isActive
                    ? "bg-[#ffc37b] border-[0.8px] border-[#f49b31] text-white"
                    : "bg-[#fefefe] border border-[#e0e0e0] text-black hover:bg-[#ffc37b] hover:border-[#f49b31] hover:text-white"
                }
        ${className ?? ""}
      `}
            aria-label={label}
        >
            {/* Back arrow icon — 20×20 */}
            <svg
                className="shrink-0 w-5 h-5"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <path
                    d="M12.5 15L7.5 10L12.5 5"
                    stroke={isActive ? "white" : "black"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>

            {/* Label */}
            <span className={`font-semibold text-[13px] leading-none whitespace-nowrap font-poppins ${isActive ? "text-white" : "text-black"}`}>
                {label}
            </span>
        </button>
    );
};

export default BackButton;
