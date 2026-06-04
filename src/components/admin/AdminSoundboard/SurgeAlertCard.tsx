import React from "react";

export interface SurgeItem {
    id: string;
    title: string;
    velocity: string; // e.g., "+42 surges/hr"
    category: string; // e.g., "General", "Hall"
    onClick?: () => void;
}

interface SurgeAlertCardProps {
    count: number;
    items: SurgeItem[];
    className?: string;
}

const SurgeAlertCard: React.FC<SurgeAlertCardProps> = ({
    count,
    items,
    className = "",
}) => {
    return (
        <div
            className={`bg-[#f49b31] rounded-xl p-5 flex flex-col gap-[15px] ${className}`}
            data-node-id="surge-alert-card"
        >
            {/* Header */}
            <div className="flex flex-col gap-1">
                <h3 className="text-[#fef5ea] font-semibold text-[18px] leading-[18px] uppercase tracking-[0.6px]">
                    {count} Surging Issues need attention today
                </h3>
            </div>

            {/* Surge Items List */}
            <div className="flex flex-col gap-2.5">
                {items.map((item, index) => (
                    <a
                        key={item.id || index}
                        onClick={item.onClick}
                        className="bg-[#fef5ea] rounded-lg px-3 py-5 flex items-center justify-between cursor-pointer hover:bg-opacity-90 transition-all"
                    >
                        {/* Title */}
                        <div className="flex-1">
                            <p className="text-[#212121] font-medium text-[14px] leading-[19.5px]">
                                {item.title}
                            </p>
                        </div>

                        {/* Velocity and Category */}
                        <div className="flex gap-2.5 ml-3">
                            {/* Surge Velocity Badge */}
                            <div className="bg-[#f49b31] rounded-[20px] px-2 py-0.5 flex items-center">
                                <span className="text-[#fef5ea] font-medium text-[11px] leading-[16.5px] whitespace-nowrap">
                                    {item.velocity}
                                </span>
                            </div>

                            {/* Category Badge */}
                            <div className="bg-[#fef5ea] border border-[#f49b31] rounded-[20px] px-2 py-0.5 flex items-center">
                                <span className="text-[#f49b31] font-semibold text-[11px] leading-[16.5px] whitespace-nowrap">
                                    {item.category}
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};

export default SurgeAlertCard;
