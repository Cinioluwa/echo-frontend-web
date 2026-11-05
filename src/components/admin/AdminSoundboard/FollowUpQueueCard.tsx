import React from "react";
import { CheckCircle2 } from "lucide-react";

export interface FollowUpItem {
    id: string;
    title: string;
    description: string;
    count: number;
    iconColor: "red" | "green" | "orange"; // Background color for icon
    icon?: string; // URL to icon image
    onClick?: () => void;
}

interface FollowUpQueueCardProps {
    items: FollowUpItem[];
    pendingCount: number;
    className?: string;
}

const FollowUpQueueCard: React.FC<FollowUpQueueCardProps> = ({
    items,
    pendingCount,
    className = "",
}) => {
    const iconColorClasses = {
        red: "bg-[#f6c0c0]",
        green: "bg-[#c8e6c9]",
        orange: "bg-[#ffe0b2]",
    };

    return (
        <a href="/admin/followUp"
            className={`min-w-0 min-h-[250px] bg-white border border-[rgba(244,155,49,0.4)] rounded-xl p-5 flex flex-col gap-[15px] cursor-pointer hover:border-[rgba(244,155,49,0.6)] transition-all ${className}`}
            data-node-id="followup-queue-card"
        >
            {items.length > 0 ? (
                <>
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="font-poppins text-[#212121] font-semibold text-[18px] leading-6">
                            Follow-up Queue
                        </h3>
                        <div className="bg-[#f49b31] rounded-[20px] px-2.5 py-[3px] flex items-center">
                            <span className="font-poppins text-white font-medium text-[11px] leading-[16.5px] whitespace-nowrap">
                                {pendingCount} pending
                            </span>
                        </div>
                    </div>
                    <div className="flex min-w-0 flex-col gap-2 overflow-y-auto">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="min-w-0 bg-[#fef5ea] border border-[rgba(244,155,49,0.4)] rounded-lg px-3 py-2.5 flex gap-2.5 items-center"
                            >
                                <div
                                    className={`${iconColorClasses[item.iconColor]} rounded-[7px] size-7 flex items-center justify-center shrink-0`}
                                >
                                    {item.icon ? (
                                        <img src={item.icon} alt="" className="size-4 object-contain" />
                                    ) : null}
                                </div>
                                <div className="flex min-w-0 flex-1 flex-col gap-1">
                                    <p className="text-[#212121] font-poppins font-medium text-[12px] leading-[18px]">
                                        {item.title}
                                    </p>
                                    <p className="text-[#5e5c58] font-poppins font-normal text-[11px] leading-[16.5px]">
                                        {item.description}
                                    </p>
                                </div>
                                <div className="bg-[#f6c0c0] border border-[#b01212] rounded-full shrink-0 flex items-center justify-center px-2 py-1">
                                    <span className="text-[#b01212] font-poppins font-semibold text-[11px] whitespace-nowrap">
                                        {item.count}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-3 py-6 text-center">
                    <CheckCircle2 size={32} strokeWidth={1.75} className="text-[#F49B31]" aria-hidden="true" />
                    <p className="font-poppins text-[16px] font-semibold text-[#212121]">
                        No Follow Up.
                    </p>
                </div>
            )}
        </a>
    );
};

export default FollowUpQueueCard;
