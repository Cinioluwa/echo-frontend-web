import React from "react";
import type { ViolationType } from "./types";

interface ViolationBadgeProps {
    type: ViolationType;
    className?: string;
}

const ViolationBadge: React.FC<ViolationBadgeProps> = ({ type, className = "" }) => {
    const getStyles = (violationType: ViolationType) => {
        switch (violationType) {
            case "inappropriate-content":
                return {
                    bg: "bg-[#ffd7d7]",
                    text: "text-[#b01212]",
                    iconSrc: "/assets/icon/eye-off.svg",
                    label: "Inappropriate content",
                };
            case "threats":
                return {
                    bg: "bg-[#ffd7d7]",
                    text: "text-[#b01212]",
                    iconSrc: "/assets/icon/alert.svg",
                    label: "Threats",
                };
            case "misinformation":
                return {
                    bg: "bg-[#ffd6a5]",
                    text: "text-[#a3651e]",
                    iconSrc: "/assets/icon/x-circle.svg",
                    label: "Misinformation",
                };
            default:
                return {
                    bg: "bg-[#ffd7d7]",
                    text: "text-[#b01212]",
                    iconSrc: "/assets/icon/eye-off.svg",
                    label: violationType,
                };
        }
    };

    const styles = getStyles(type);

    return (
        <div className={`${styles.bg} ${className} rounded-[28.75px] px-[18.75px] py-[3px] flex gap-[7.5px] items-center justify-center`}>
            {styles.iconSrc && <img src={styles.iconSrc} alt="" className="w-[20px] h-[20px]" />}
            <p className={`font-poppins font-medium text-[13.75px] ${styles.text} whitespace-nowrap`}>
                {styles.label}
            </p>
        </div>
    );
};

export default ViolationBadge;
