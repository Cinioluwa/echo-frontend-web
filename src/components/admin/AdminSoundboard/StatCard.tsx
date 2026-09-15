import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    badge?: {
        label: string;
        color: "green" | "red" | "orange";
    };
    className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    subtitle,
    badge,
    className = "",
}) => {
    const badgeColorClasses = {
        green: "bg-[#e8f5e9] text-[#2e7d32]",
        red: "bg-[#ffebee] text-[#c62828]",
        orange: "bg-[#fff3e0] text-[#e65100]",
    };

    return (
        <div
            className={`bg-white border border-[rgba(244,155,49,0.3)] rounded-xl p-4 sm:p-6 flex flex-col justify-between min-w-0 md:w-4/12 w-full gap-2.5 ${className}`}
            data-node-id="stat-card"
        >
            {/* Title */}
            <div className="text-[#f49b31] font-semibold text-[14px] leading-[16.5px]">
                {title}
            </div>

            {/* Value */}
            <div className="flex items-start justify-between gap-2 flex-wrap">
                <div className="text-[#212121] font-bold text-[clamp(24px,3vw,36px)] leading-none whitespace-nowrap">
                    {value}
                </div>
                {badge && (
                    <div
                        className={`rounded-full px-2 py-1 max-w-full text-[11px] font-medium leading-[16.5px] whitespace-normal ${badgeColorClasses[badge.color]}`}
                    >
                        {badge.label}
                    </div>
                )}
            </div>

            {/* Subtitle or Badge */}
            {subtitle && (
                <div className="text-[#5e5c58] font-medium text-[12px] leading-[18px]">
                    {subtitle}
                </div>
            )}
        </div>
    );
};

export default StatCard;
