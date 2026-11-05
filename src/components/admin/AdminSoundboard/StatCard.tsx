import React from "react";
import TrendArrow, { type TrendDirection } from "../../shared/TrendArrow";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    badge?: {
        label: string;
        direction?: TrendDirection;
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
        green: "bg-[var(--echo-bg-e8f5e9)] text-[var(--echo-text-2e7d32)]",
        red: "bg-[var(--echo-bg-ffebee)] text-[var(--echo-text-c62828)]",
        orange: "bg-[var(--echo-bg-fff3e0)] text-[var(--echo-text-e65100)]",
    };

    return (
        <div
            className={`bg-[var(--echo-surface)] border border-[rgba(244,155,49,0.3)] rounded-xl p-6 flex min-w-0 w-full flex-col justify-between gap-2.5 ${className}`}
            data-node-id="stat-card"
        >
            {/* Title */}
            <div className="text-[var(--echo-text-f49b31)] font-semibold text-[14px] leading-[16.5px]">
                {title}
            </div>

            {/* Value */}
            <div className="flex items-baseline justify-between gap-2">
                <div className="text-[var(--echo-text-primary)] font-bold text-[36px] leading-[normal] text-nowrap">
                    {value}
                </div>
                {badge && (
                    <div
                        className={`rounded-full px-2 py-1 w-fit text-[11px] font-medium leading-[16.5px] text-nowrap truncate ${badgeColorClasses[badge.color]}`}
                    >
                        {badge.direction && <TrendArrow direction={badge.direction} className="me-1 align-[-1px]" />}
                        {badge.label}
                    </div>
                )}
            </div>

            {/* Subtitle or Badge */}
            {subtitle && (
                <div className="text-[var(--echo-text-5e5c58)] font-medium text-[12px] leading-[18px]">
                    {subtitle}
                </div>
            )}
        </div>
    );
};

export default StatCard;
