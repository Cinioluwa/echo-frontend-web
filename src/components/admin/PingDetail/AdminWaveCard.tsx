import React, { useState } from "react";
import { X } from "lucide-react";
import type { Wave } from "../../../api/types/index";
import WaveActionModal from "./WaveActionModal";
import BadgeTooltip from "../../BadgeTooltip";
import type { PingDetailPermissions, WaveActionStatus } from "./types";
import formatTimeAgo from "../../../utils/formatTimeAgo";
import { calculateWaveBadge, waveCommunityPick } from "../../../utils/badgeUtils";

interface AdminWaveCardProps {
    wave: Wave;
    rank: 0 | 1;
    permissions: PingDetailPermissions;
    onUpdateStatus: (id: number, status: WaveActionStatus, reason?: string) => Promise<void>;
}

const actionBase =
    "flex h-[39px] w-[123px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[15px] font-poppins text-[13px] font-semibold uppercase transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 max-[500px]:w-[68px] max-[500px]:gap-1 max-[500px]:text-[9px]";

const AdminWaveCard: React.FC<AdminWaveCardProps> = ({ wave, rank, permissions, onUpdateStatus }) => {
    const [activeAction, setActiveAction] = useState<WaveActionStatus | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const status = wave.status || "POSTED";
    const featured = rank === 0;

    const canModerate = permissions.canModerateWaves;
    const canProgress = permissions.canUpdateWaveProgress;
    const canApprove = canModerate && (status === "POSTED" || status === "UNDER_REVIEW");
    const canReject = canModerate && (status === "POSTED" || status === "UNDER_REVIEW");
    const canReview = canModerate && status === "POSTED";
    const canStart = canProgress && status === "APPROVED";
    const canComplete = canProgress && (status === "APPROVED" || status === "IN_PROGRESS");
    const hasActions = canApprove || canReject || canReview || canStart || canComplete;

    const timestamp = formatTimeAgo(wave.createdAt);
    const statusBadge = status === "POSTED" ? null : calculateWaveBadge(wave, []);

    const authorName = wave.author ? `${wave.author.firstName} ${wave.author.lastName}` : "Anonymous";
    const avatar =
        wave.author?.profilePicture ||
        `https://ui-avatars.com/api/?name=${wave.author?.firstName || "A"}+${wave.author?.lastName || "U"}&background=random&size=106`;

    const handleConfirm = async (reason?: string) => {
        if (!activeAction) return;
        try {
            setIsUpdating(true);
            await onUpdateStatus(wave.id, activeAction, reason);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div
            className={`flex w-full min-w-0 flex-col gap-[17px] rounded-[10px] bg-[#fefefe] px-4 py-5 sm:px-[27.5px] sm:py-[23px] ${featured ? "border-[1.5px] border-[#f49b31]" : ""}`}
        >
            <div className="flex min-w-0 items-center gap-2 sm:gap-4 max-[500px]:gap-1">
                <img src={avatar} alt={authorName} className="size-10 shrink-0 rounded-full object-cover sm:size-[53px] max-[500px]:size-8" />
                <div className="flex min-w-0 flex-1 flex-col items-start">
                    <p className="max-w-full truncate whitespace-nowrap font-poppins text-[12px] font-semibold text-black sm:text-[15px] max-[500px]:text-[10px]">{authorName}</p>
                    <p className="whitespace-nowrap font-poppins text-[9px] font-medium text-[#8b8e8d] sm:text-[13px] max-[500px]:text-[8px]">{timestamp}</p>
                </div>
                <div className="flex max-w-[48%] shrink-0 flex-nowrap items-center justify-end gap-1 overflow-hidden sm:max-w-[52%] sm:gap-[5px] max-[500px]:max-w-[46%]">
                    {statusBadge ? (
                        <BadgeTooltip
                            badgeKey={statusBadge.type ?? status}
                            description={status === "REJECTED" && wave.reason
                                ? `Reason: ${wave.reason}`
                                : undefined}
                        >
                            <img
                                src={statusBadge.svg}
                                alt={statusBadge.label}
                                className="h-[22px] w-auto max-w-full shrink-0 object-contain"
                            />
                        </BadgeTooltip>
                    ) : featured ? (
                        <BadgeTooltip badgeKey="COMMUNITY_PICK">
                            <img
                                src={waveCommunityPick}
                                alt="Community Pick"
                                className="h-[22px] w-auto max-w-full shrink-0 object-contain"
                            />
                        </BadgeTooltip>
                    ) : (
                        <BadgeTooltip badgeKey="ALTERNATIVE">
                            <span className="flex min-w-0 items-center gap-0.5 rounded-[23px] border-[1.5px] border-[#626665] bg-[#fefefe] px-1 py-1 font-poppins text-[8px] font-medium text-black sm:gap-[7.5px] sm:px-[16.5px] sm:py-1.5 sm:text-[13.5px]">
                                <img src="/assets/icon/dot-blue.svg" alt="" className="size-[6px] sm:size-[7.5px]" />
                                <span className="truncate whitespace-nowrap">Alternative</span>
                            </span>
                        </BadgeTooltip>
                    )}
                </div>
            </div>

            <p className="whitespace-pre-wrap text-justify font-poppins text-[14px] font-medium text-[#626665]">
                {wave.solution}
            </p>

            {status === "REJECTED" && (wave as any).rejectionReason && (
                <p className="rounded-[10px] border border-[#eb5050] bg-[rgba(255,132,132,0.15)] px-3 py-2 font-poppins text-[12px] text-[#b01212]">
                    Reason: {(wave as any).rejectionReason}
                </p>
            )}

            <div className="h-px w-full bg-[#ffc37b]/60" />

            <div className="flex min-w-0 flex-row items-center gap-2">
                <div className="flex min-w-0 flex-1 flex-nowrap items-center gap-[10px] overflow-x-auto pb-1 max-[500px]:gap-1.5">
                    {canApprove && (
                        <button
                            onClick={() => setActiveAction("APPROVED")}
                            disabled={isUpdating}
                            className={`${actionBase} bg-[#f49b31] text-white`}
                        >
                            <img src="/assets/images/approve.svg" alt="" className="size-4 max-[500px]:size-3" />
                            Approve
                        </button>
                    )}
                    {canReject && (
                        <button
                            onClick={() => setActiveAction("REJECTED")}
                            disabled={isUpdating}
                            className={`${actionBase} border border-[#eb5050] bg-[rgba(255,132,132,0.15)] text-[#eb5050]`}
                        >
                            <X className="size-4 max-[500px]:size-3" />
                            Reject
                        </button>
                    )}
                    {canReview && (
                        <button
                            onClick={() => setActiveAction("UNDER_REVIEW")}
                            disabled={isUpdating}
                            className={`${actionBase} border border-[#f49b31] bg-[#fef5ea] text-[#f49b31]`}
                        >
                            <img src="/assets/icon/review.svg" alt="" className="size-4 max-[500px]:size-3" />
                            Review
                        </button>
                    )}
                    {canStart && (
                        <button
                            onClick={() => setActiveAction("IN_PROGRESS")}
                            disabled={isUpdating}
                            className={`${actionBase} w-auto border border-[#f49b31] bg-[#fef5ea] px-4 text-[#f49b31]`}
                        >
                            Mark in progress
                        </button>
                    )}
                    {canComplete && (
                        <button
                            onClick={() => setActiveAction("COMPLETED")}
                            disabled={isUpdating}
                            className={`${actionBase} w-auto bg-[#f49b31] px-4 text-white`}
                        >
                            Mark completed
                        </button>
                    )}
                    {!hasActions && <span className="font-poppins text-[12px] font-medium text-[#8b8e8d]" />}
                </div>

                <div className="ml-auto flex shrink-0 items-center gap-1">
                    <img src="/assets/images/surge.svg" alt="Surges" className="h-[23px] w-[14px]" />
                    <span className="font-poppins text-[28px] font-semibold leading-none text-[#f49b31]">
                        {wave.surgeCount}
                    </span>
                </div>
            </div>

            {activeAction && (
                <WaveActionModal
                    action={activeAction}
                    onConfirm={handleConfirm}
                    onCancel={() => setActiveAction(null)}
                />
            )}
        </div>
    );
};

export default AdminWaveCard;
