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
import { ArrowLeft } from "lucide-react";

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
        flex gap-2.5 items-center cursor-pointer
        px-5 py-2 rounded-full shadow-xs
        transition-colors duration-200
        ${isActive
                    ? "bg-[#ffc37b] border-[0.8px] border-[#f49b31] text-white"
                    : "bg-[#fefefe] border border-[#f0f0f0] text-black hover:bg-[#ffc37b] hover:border-[#f49b31] hover:text-white"
                }
        ${className ?? ""}
      `}
            aria-label={label}
        >
            <ArrowLeft className={`w-5 h-5 shrink-0 stroke-[2.5] ${isActive ? "text-white" : "text-black"}`} />

            {/* Label */}
            <span className={`font-semibold text-[15px] leading-none whitespace-nowrap font-['Poppins',sans-serif] ${isActive ? "text-white" : "text-black"}`}>
                {label}
            </span>
        </button>
    );
};

export default BackButton;
