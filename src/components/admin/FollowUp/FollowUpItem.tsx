import React from "react";
import type { FollowUpItem as FollowUpItemType } from "./types";

interface FollowUpItemProps {
    item: FollowUpItemType;
}

const getButtonStylesAndIcon = (label: string, variant?: string) => {
    const cleanLabel = label.toLowerCase().trim();
    
    // Default fallback values
    let bgClass = "bg-[#f49b31] text-[#fef5ea] border-none hover:bg-[#e28a20]";
    let iconUrl = "http://localhost:3845/assets/0cb055c3c24b2a96bedce746e16115d77960a7ac.svg"; // checklist
    let iconSizeClass = "w-[20px] h-[20px]";

    if (cleanLabel.includes("completed") || cleanLabel.includes("approve")) {
        bgClass = "bg-[#f49b31] text-[#fef5ea] border-none hover:bg-[#e28a20]";
        iconUrl = "http://localhost:3845/assets/0cb055c3c24b2a96bedce746e16115d77960a7ac.svg";
    } else if (cleanLabel.includes("implementing")) {
        bgClass = "bg-[#fef5ea] border border-[#f49b31] text-[#f49b31] hover:bg-[#fdecd8]";
        iconUrl = "http://localhost:3845/assets/f4151cf839767ae1239407890b59a6e69b8afb6d.svg"; // gear
        iconSizeClass = "w-[18.75px] h-[18.75px]";
    } else if (cleanLabel.includes("reject")) {
        bgClass = "bg-[rgba(255,132,132,0.15)] border border-[#eb5050] text-[#eb5050] hover:bg-[rgba(255,132,132,0.25)]";
        iconUrl = "http://localhost:3845/assets/97d9527743ac955f498d617d2b114f5a8ccf4e0b.svg"; // reject
    } else if (cleanLabel.includes("review")) {
        bgClass = "bg-[#fef5ea] border border-[#f49b31] text-[#f49b31] hover:bg-[#fdecd8]";
        iconUrl = "http://localhost:3845/assets/89183796c9b3b9f342a65d60580ae6d214b07610.svg"; // review
        iconSizeClass = "w-[20.3px] h-[19.1px]";
    } else {
        if (variant === "red") {
            bgClass = "bg-[rgba(255,132,132,0.15)] border border-[#eb5050] text-[#eb5050] hover:bg-[rgba(255,132,132,0.25)]";
            iconUrl = "http://localhost:3845/assets/97d9527743ac955f498d617d2b114f5a8ccf4e0b.svg";
        } else if (variant === "outline-orange") {
            bgClass = "bg-[#fef5ea] border border-[#f49b31] text-[#f49b31] hover:bg-[#fdecd8]";
            iconUrl = "http://localhost:3845/assets/f4151cf839767ae1239407890b59a6e69b8afb6d.svg";
            iconSizeClass = "w-[18.75px] h-[18.75px]";
        }
    }

    return { bgClass, iconUrl, iconSizeClass };
};

const getStatusBadgeConfig = (status: string) => {
    switch (status) {
        case "approved":
            return {
                label: "Approved",
                dotUrl: "http://localhost:3845/assets/d86163f4316e2cbdaa2e8d1a26f930d3da34d241.svg",
            };
        case "under-review":
            return {
                label: "Under Review",
                dotUrl: "http://localhost:3845/assets/e8ecd75796921f226b8fc98bbc9b6e96a8b57d1b.svg",
            };
        case "implementing":
            return {
                label: "In Progress",
                dotUrl: "http://localhost:3845/assets/fec48d01d24ac4a6a9f3cf985caefdcadf20d397.svg",
            };
        case "acknowledged":
            return {
                label: "Community Pick",
                dotUrl: "http://localhost:3845/assets/50ef0c75760e4bdf69002bec4b0a81453d3af11f.svg",
            };
        case "completed":
            return {
                label: "Completed",
                dotUrl: "http://localhost:3845/assets/d86163f4316e2cbdaa2e8d1a26f930d3da34d241.svg",
            };
        default:
            return {
                label: status,
                dotUrl: "http://localhost:3845/assets/d86163f4316e2cbdaa2e8d1a26f930d3da34d241.svg",
            };
    }
};

const FollowUpItem: React.FC<FollowUpItemProps> = ({ item }) => {
    const statusConfig = getStatusBadgeConfig(item.status);

    return (
        <div
            className="flex flex-col items-start relative shrink-0 w-full rounded-[10px] overflow-hidden"
            data-node-id={`followup-item-${item.id}`}
        >
            {/* Header section */}
            {item.status === "acknowledged" && item.pingAuthor ? (
                /* Acknowledged Ping Detailed Header */
                <div 
                    className="bg-[#ffc37b] border-b border-l border-r border-[#f49b31] border-solid flex flex-col md:flex-row items-start md:items-center justify-between gap-3 md:gap-0 pb-[9px] pl-3 pr-3 md:pl-[21px] md:pr-[11px] pt-[8px] relative rounded-tl-[10px] rounded-tr-[10px] shrink-0 w-full"
                    data-node-id="5627:18000"
                >
                    <div className="flex gap-[16px] items-center shrink-0 max-w-full">
                        <img 
                            src={item.pingAuthor.avatar} 
                            alt={item.pingAuthor.name} 
                            className="w-[45px] h-[45px] rounded-full object-cover shrink-0"
                            data-node-id="5627:18003"
                        />
                        <div className="flex flex-col items-start justify-center min-w-0">
                            <span 
                                className="font-poppins font-medium text-[13px] leading-normal text-[#fef5ea] truncate"
                                data-node-id="5627:18005"
                            >
                                {item.pingAuthor.name} · {item.pingAuthor.timestamp}
                            </span>
                            <div className="flex gap-[10px] items-center w-full flex-wrap">
                                <h3 
                                    className="font-poppins font-semibold text-[14px] sm:text-[16px] leading-[19.5px] text-black truncate"
                                    data-node-id="5627:18007"
                                >
                                    {item.title}
                                </h3>
                                <span 
                                    className="bg-[#fef5ea] border border-[#f49b31] border-solid flex items-center justify-center px-2 py-0.5 rounded-[20px] shrink-0 text-xs font-semibold text-[#f49b31]"
                                    data-node-id="5627:18008"
                                >
                                    {item.category}
                                </span>
                            </div>
                            {item.surgeCount !== undefined && (
                                <div className="flex gap-[2.5px] items-center w-full" data-node-id="5627:18010">
                                    <img 
                                        src="http://localhost:3845/assets/a09d358700a9d473614cda9b6e4b77f3efa7e435.svg" 
                                        alt="surge" 
                                        className="h-[10.6px] w-[8.1px] shrink-0" 
                                    />
                                    <span className="font-poppins font-medium text-[13px] leading-normal text-[#454545]">
                                        {item.surgeCount} surges
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Acknowledged Badge */}
                    <div 
                        className="bg-[#fefefe] border-[#626665] border-[1.5px] border-solid flex gap-[9px] items-center justify-center px-[16.5px] py-[6px] relative rounded-[23px] shrink-0 self-end md:self-auto"
                        data-node-id="5627:18014"
                    >
                        <img 
                            src="http://localhost:3845/assets/e8ecd75796921f226b8fc98bbc9b6e96a8b57d1b.svg" 
                            alt="" 
                            className="w-[7.5px] h-[7.5px]" 
                        />
                        <span className="font-poppins font-medium text-[13.5px] leading-normal text-black text-right whitespace-nowrap">
                            Acknowledged
                        </span>
                    </div>
                </div>
            ) : (
                /* Standard Header (Approved, In Progress, Under Review) */
                <div 
                    className="bg-[#ffc37b] border-b border-l border-r border-[#f49b31] border-solid flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 pb-2 sm:pb-[11px] pt-2 sm:pt-2.5 px-3 sm:px-[21px] relative rounded-tl-[10px] rounded-tr-[10px] shrink-0 w-full"
                    data-node-id="5701:15607"
                >
                    <div className="flex gap-2 sm:gap-2.5 items-center flex-1 flex-wrap">
                        <h3 
                            className="font-poppins font-semibold text-[14px] sm:text-[16px] leading-[17px] sm:leading-[19.5px] text-black"
                            data-node-id="5701:15609"
                        >
                            {item.title}
                        </h3>
                        <span 
                            className="bg-[#fef5ea] border border-[#f49b31] border-solid flex items-center justify-center px-1.5 sm:px-2 py-0.5 rounded-[20px] shrink-0 text-xs sm:text-sm"
                            data-node-id="5701:15610"
                        >
                            <span className="font-poppins font-semibold text-[10px] sm:text-[11px] leading-[15px] sm:leading-[16.5px] text-[#f49b31]">
                                {item.category}
                            </span>
                        </span>
                    </div>
                </div>
            )}

            {/* Content area with gradient background */}
            <div className="bg-linear-to-r from-[#fefefe] to-[#fefefe] flex flex-col gap-3 sm:gap-[17px] items-start px-3 sm:px-[27.5px] py-3 sm:py-5 relative rounded-bl-[10px] rounded-br-[10px] shrink-0 w-full border-b border-l border-r border-[#f49b31]/40 border-solid" data-node-id="5701:15612">
                {/* Top section: Author info and status */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0 relative shrink-0 w-full" data-node-id="5701:15613">
                    <div className="flex gap-2 sm:gap-5 items-start sm:items-center" data-node-id="5701:15614">
                        <img
                            src={item.author.avatar}
                            alt={item.author.name}
                            className="w-[45px] sm:w-[53px] h-[45px] sm:h-[53px] rounded-full object-cover"
                            data-node-id="5701:15615"
                        />
                        <div className="flex flex-col items-start justify-center" data-node-id="5701:15616">
                            <h4 className="font-poppins font-semibold text-[13px] sm:text-[15px] leading-normal text-black" data-node-id="5701:15617">
                                {item.author.name}
                            </h4>
                            <p className="font-poppins font-medium text-[11px] sm:text-[13px] leading-normal text-[#8b8e8d]" data-node-id="5701:15618">
                                {item.author.timestamp}
                            </p>
                        </div>
                    </div>

                    {/* Status badge */}
                    <div
                        className="bg-[#fefefe] border-[#626665] border-[1.5px] border-solid flex gap-[9px] items-center justify-center px-[16.5px] py-[6px] relative rounded-[23px] shrink-0"
                        data-node-id="5701:15619"
                    >
                        <img
                            src={statusConfig.dotUrl}
                            alt=""
                            className="w-[7.5px] h-[7.5px] rounded-full shrink-0"
                        />
                        <span className="font-poppins font-medium text-[13.5px] leading-normal text-black text-right whitespace-nowrap capitalize">
                            {statusConfig.label}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <div className="flex flex-col items-start relative shrink-0 w-full" data-node-id="5701:15620">
                    <p className="font-poppins font-medium text-[12px] sm:text-[14px] leading-normal text-black text-justify" data-node-id="5701:15622">
                        {item.description}
                    </p>
                </div>

                {/* Demarcator Line */}
                <div className="h-px w-full relative shrink-0" data-node-id="5701:15623">
                    <img 
                        src="http://localhost:3845/assets/6082f1429a56a3b7509ad74c423b473af665d5b2.svg" 
                        alt="" 
                        className="w-full h-px opacity-30 object-cover" 
                    />
                </div>

                {/* Bottom section: Action buttons and wave count */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 relative shrink-0 w-full" data-node-id="5701:15624">
                    <div className="flex gap-2 sm:gap-[10px] items-center flex-wrap" data-node-id="5701:15626">
                        {item.actions.primary && (() => {
                            const { bgClass, iconUrl, iconSizeClass } = getButtonStylesAndIcon(item.actions.primary.label, item.actions.primary.variant);
                            return (
                                <button
                                    onClick={item.actions.primary.onClick}
                                    className={`flex gap-[10px] h-[39px] items-center justify-center px-[15px] py-[11px] rounded-[15px] font-poppins font-semibold text-[13px] leading-[0.94] uppercase transition-all whitespace-nowrap border-solid border ${bgClass}`}
                                >
                                    <img src={iconUrl} alt="" className={`${iconSizeClass} shrink-0`} />
                                    <span>{item.actions.primary.label}</span>
                                </button>
                            );
                        })()}
                        {item.actions.secondary && (() => {
                            const { bgClass, iconUrl, iconSizeClass } = getButtonStylesAndIcon(item.actions.secondary.label, item.actions.secondary.variant);
                            return (
                                <button
                                    onClick={item.actions.secondary.onClick}
                                    className={`flex gap-[10px] h-[39px] items-center justify-center px-[15px] py-[11px] rounded-[15px] font-poppins font-semibold text-[13px] leading-[0.94] uppercase transition-all whitespace-nowrap border-solid border ${bgClass}`}
                                >
                                    <img src={iconUrl} alt="" className={`${iconSizeClass} shrink-0`} />
                                    <span>{item.actions.secondary.label}</span>
                                </button>
                            );
                        })()}
                        {item.actions.tertiary && (() => {
                            const { bgClass, iconUrl, iconSizeClass } = getButtonStylesAndIcon(item.actions.tertiary.label, item.actions.tertiary.variant);
                            return (
                                <button
                                    onClick={item.actions.tertiary.onClick}
                                    className={`flex gap-[10px] h-[39px] items-center justify-center px-[15px] py-[11px] rounded-[15px] font-poppins font-semibold text-[13px] leading-[0.94] uppercase transition-all whitespace-nowrap border-solid border ${bgClass}`}
                                >
                                    <img src={iconUrl} alt="" className={`${iconSizeClass} shrink-0`} />
                                    <span>{item.actions.tertiary.label}</span>
                                </button>
                            );
                        })()}
                    </div>

                    {/* Wave count */}
                    <div className="flex items-center gap-[5px] self-end sm:self-auto" data-node-id="5701:15638">
                        <img 
                            src="http://localhost:3845/assets/0daa806674cfb6c05e40002d4183f7416853396d.svg" 
                            alt="waves" 
                            className="h-[26px] w-[20px] shrink-0" 
                            data-node-id="5701:15639"
                        />
                        <span 
                            className="font-poppins font-semibold text-[24px] leading-none text-[#f49b31]"
                            data-node-id="5701:15640"
                        >
                            {item.waveCount}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FollowUpItem;
