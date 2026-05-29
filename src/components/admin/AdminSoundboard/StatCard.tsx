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
            className={`bg-white border border-[rgba(244,155,49,0.3)] rounded-xl p-6 flex flex-col gap-3 ${className}`}
            data-node-id="stat-card"
        >
            {/* Title */}
            <div className="text-[#f49b31] font-semibold text-[14px] leading-[16.5px]">
                {title}
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-2">
                <div className="text-[#212121] font-bold text-[36px] leading-[normal]">
                    {value}
                </div>
            </div>

            {/* Subtitle or Badge */}
            {subtitle && (
                <div className="text-[#5e5c58] font-medium text-[12px] leading-[18px]">
                    {subtitle}
                </div>
            )}

            {badge && (
                <div
                    className={`rounded-full px-2 py-1 w-fit text-[11px] font-medium leading-[16.5px] ${badgeColorClasses[badge.color]}`}
                >
                    {badge.label}
                </div>
            )}
        </div>
    );
};

export default StatCard;
