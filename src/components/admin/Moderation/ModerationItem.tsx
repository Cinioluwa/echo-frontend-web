import React, { useState, useRef, useEffect } from "react";
import ViolationBadge from "./ViolationBadge";
import type { ModerationItem as ModerationItemType, ModerationActionPayload } from "./types";
import { WarnModal, SuspendConfirmModal, SuspendDurationModal, BanModal } from "./TakeActionModals";
import type { TakeActionType, SuspendDuration } from "./TakeActionModals";
import { Clock, Ban as Bell, XCircle } from "lucide-react";

interface ModerationItemProps {
    item: ModerationItemType;
    onTakeAction?: (id: string, actionPayload: ModerationActionPayload) => void;
    onDismiss?: (id: string) => void;
    actionLoading?: boolean;
}

const ModerationItem: React.FC<ModerationItemProps> = ({ item, onTakeAction, onDismiss, actionLoading }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeModal, setActiveModal] = useState<TakeActionType | "SUSPEND_DURATION" | null>(null);
    const [pendingDeletePost, setPendingDeletePost] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleActionClick = (type: TakeActionType) => {
        setActiveModal(type);
        setIsDropdownOpen(false);
    };

    const confirmAction = (type: TakeActionType, deletePost: boolean, duration?: SuspendDuration) => {
        const payload: ModerationActionPayload = { action: type, deletePost };
        if (type === "SUSPEND" && duration) {
            payload.suspendPreset = duration;
        }
        onTakeAction?.(item.id, payload);
        setActiveModal(null);
    };

    const headerText = item.type === "comment" ? "Comment on:" : item.type === "wave" ? "Wave on:" : null;

    return (
        <div className="flex flex-col items-start w-full">
            {/* Header - Orange background */}
            {headerText ? (
                <div className="bg-[#ffc37b] border border-[#f49b31] border-b-2 w-full px-5 sm:px-[21px] py-2 sm:py-2.5 flex items-center justify-start rounded-t-xl">
                    <p className="font-poppins font-bold text-[14px] sm:text-[16px] text-white whitespace-nowrap">
                        {headerText}&nbsp;
                    </p>
                    <p className="font-poppins font-semibold text-[14px] sm:text-[16px] text-black truncate">
                        {item.subject}
                    </p>
                    <div className="bg-white border border-[#f49b31] rounded-[20px] px-2 py-0.5 ml-2 shrink-0">
                        <p className="font-poppins font-semibold text-[10px] sm:text-[11px] text-[#f49b31] whitespace-nowrap">
                            {item.category}
                        </p>
                    </div>
                </div>) : null}

            {/* Content - White background */}
            <div className={`bg-white w-full px-3 sm:px-[27.5px] py-3 sm:py-5 flex flex-col gap-3 sm:gap-[17px] rounded-b-xl ${headerText ? "" : "rounded-t-xl"}`}>
                {/* Author info */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center sm:justify-between w-full">
                    <div className="flex gap-3 items-center">
                        <img
                            src={item.author.avatar}
                            alt={item.author.name}
                            className="w-[45px] sm:w-[53px] h-[45px] sm:h-[53px] rounded-full object-cover"
                        />
                        <div className="flex flex-col">
                            <p className="font-poppins font-semibold text-[13px] sm:text-[15px] text-black">
                                {item.author.name}
                            </p>
                            <p className="font-poppins font-medium text-[12px] sm:text-[13px] text-[#8b8e8d]">
                                {item.author.timestamp}
                            </p>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto">
                        <ViolationBadge type={item.violationType} />
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px bg-[#e0e0e0] w-full" />

                {/* Content */}
                <p className="font-poppins font-medium text-[12px] sm:text-[14px] text-black text-justify">
                    {item.content}
                </p>

                {/* Image if present */}
                {item.image && (
                    <img
                        src={item.image}
                        alt="Content"
                        className="w-full rounded-lg object-cover max-h-[200px]"
                    />
                )}

                {/* Action buttons */}
                {item.status === "PENDING" && (
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 pt-2">
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto relative" ref={dropdownRef}>
                            {isDropdownOpen && (
                                <div className="flex flex-row items-center gap-1 absolute bottom-full left-0 mb-2 bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-[#e0e0e0]  z-10 font-poppins whitespace-nowrap">
                                    <button
                                        onClick={() => handleActionClick("WARN")}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] sm:text-[13px] text-black-50 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                    >
                                        <Bell className="w-3.5 h-3.5 " />
                                        Warn
                                    </button>
                                    <button
                                        onClick={() => handleActionClick("SUSPEND")}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] sm:text-[13px] text-black-50 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                    >
                                        <Clock className="w-3.5 h-3.5 " />
                                        Suspend
                                    </button>
                                    <button
                                        onClick={() => handleActionClick("BAN")}
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] sm:text-[13px] text-black-50 hover:bg-red-50 rounded-lg font-medium transition-colors"
                                    >
                                        <XCircle className="w-3.5 h-3.5" />
                                        Ban
                                    </button>
                                </div>
                            )}
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                disabled={actionLoading}
                                className="bg-[#f49b31] hover:bg-[#e68a1f] text-white font-poppins font-semibold text-[11px] sm:text-[13px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap disabled:opacity-50"
                            >
                                <img src='/assets/icon/take-action.svg' alt='judge' className="w-[28px] h-[28px]" />
                                {actionLoading ? "..." : "TAKE ACTION"}
                            </button>
                            <button
                                onClick={() => onDismiss?.(item.id)}
                                disabled={actionLoading}
                                className="bg-white border border-[#f49b31] text-[#f49b31] hover:bg-[#fef5ea] font-poppins font-semibold text-[11px] sm:text-[13px] px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap disabled:opacity-50"
                            >
                                <span>✕</span>
                                DISMISS
                            </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-[#eb5050] self-end sm:self-auto">
                            <span className="text-[18px]">🚩</span>
                            <p className="font-poppins font-semibold text-[18px] sm:text-[24px]">
                                {item.reportCount}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {activeModal === "WARN" && (
                <WarnModal
                    onConfirm={(deletePost) => confirmAction("WARN", deletePost)}
                    onCancel={() => setActiveModal(null)}
                    isLoading={actionLoading}
                />
            )}
            {activeModal === "BAN" && (
                <BanModal
                    onConfirm={(deletePost) => confirmAction("BAN", deletePost)}
                    onCancel={() => setActiveModal(null)}
                    isLoading={actionLoading}
                />
            )}
            {activeModal === "SUSPEND" && (
                <SuspendConfirmModal
                    onConfirm={(deletePost) => {
                        setPendingDeletePost(deletePost);
                        setActiveModal("SUSPEND_DURATION");
                    }}
                    onCancel={() => setActiveModal(null)}
                    isLoading={actionLoading}
                />
            )}
            {activeModal === "SUSPEND_DURATION" && (
                <SuspendDurationModal
                    initialDeletePost={pendingDeletePost}
                    onConfirm={(duration, deletePost) => confirmAction("SUSPEND", deletePost, duration)}
                    onCancel={() => setActiveModal(null)}
                    isLoading={actionLoading}
                />
            )}
        </div>
    );
};

export default ModerationItem;
