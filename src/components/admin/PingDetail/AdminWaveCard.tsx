import React, { useState } from "react";
import type { Wave } from "../../../api/types/index";
import { CheckCircle, FileScan, XCircle, Clock, Zap, CheckCheck } from "lucide-react";
import WaveActionModal from "./WaveActionModal";

interface AdminWaveCardProps {
    wave: Wave;
    onUpdateStatus: (id: number, status: "APPROVED" | "REJECTED" | "UNDER_REVIEW", reason?: string) => Promise<void>;
}

type WaveStatus = "POSTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD";

/**
 * Status badge config — matches the Wave Indicators Figma component (node 4291:9699)
 * Labels and descriptions taken directly from the Figma design.
 */
const statusConfig: Record<WaveStatus, { label: string; bg: string; text: string; description: string }> = {
    POSTED: {
        label: "Proposed",
        bg: "#EEF2FF",
        text: "#4F46E5",
        description: "Submitted and waiting to be reviewed.",
    },
    UNDER_REVIEW: {
        label: "Under Review",
        bg: "#FEF9C3",
        text: "#92400E",
        description: "Currently being evaluated by leadership.",
    },
    APPROVED: {
        label: "Approved",
        bg: "#DCFCE7",
        text: "#166534",
        description: "Greenlit for action by leadership.",
    },
    IN_PROGRESS: {
        label: "In Progress",
        bg: "#DBEAFE",
        text: "#1E40AF",
        description: "Work has begun. Change is on the way.",
    },
    REJECTED: {
        label: "Rejected",
        bg: "#FEE2E2",
        text: "#991B1B",
        description: "Leadership decided not to move forward.",
    },
    COMPLETED: {
        label: "Completed",
        bg: "#F0FDF4",
        text: "#14532D",
        description: "Fully implemented. The community made this happen.",
    },
    ON_HOLD: {
        label: "On Hold",
        bg: "#F3F4F6",
        text: "#374151",
        description: "Paused — no action currently being taken.",
    },
};

const AdminWaveCard: React.FC<AdminWaveCardProps> = ({ wave, onUpdateStatus }) => {
    const [activeAction, setActiveAction] = useState<"APPROVED" | "REJECTED" | "UNDER_REVIEW" | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const status = (wave.status || "POSTED") as WaveStatus;
    const config = statusConfig[status] || statusConfig.POSTED;

    // Only allow status changes on actionable states
    const canApprove = status === "POSTED" || status === "UNDER_REVIEW";
    const canReject = status === "POSTED" || status === "UNDER_REVIEW" || status === "APPROVED";
    const canReview = status === "POSTED";

    const date = new Date(wave.createdAt);
    const formattedDate =
        date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) +
        ", " +
        date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

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
        <div className="bg-white rounded-xl border border-[#ECECEC] overflow-hidden flex flex-col w-full shadow-sm">
            <div className="p-4 flex flex-col gap-3">
                {/* Top: Author + Status Badge */}
                <div className="flex justify-between items-start">
                    <div className="flex gap-2.5 items-center">
                        <img
                            src={
                                wave.author?.profilePicture ||
                                `https://ui-avatars.com/api/?name=${wave.author?.firstName || "A"}+${wave.author?.lastName || "U"}&background=random&size=80`
                            }
                            alt={wave.author?.firstName || "Anonymous"}
                            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col">
                            <span className="font-poppins font-semibold text-[13px] text-black leading-tight">
                                {wave.author
                                    ? `${wave.author.firstName} ${wave.author.lastName}`
                                    : "Anonymous"}
                            </span>
                            <span className="font-poppins text-[11px] text-[#8b8e8d]">{formattedDate}</span>
                        </div>
                    </div>

                    {/* Status badge — per Figma Wave Indicators spec */}
                    <span
                        className="flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full font-poppins font-semibold text-[10px] tracking-wide"
                        style={{ backgroundColor: config.bg, color: config.text }}
                    >
                        {status === "COMPLETED" && <CheckCheck className="w-3 h-3" />}
                        {status === "IN_PROGRESS" && <Zap className="w-3 h-3" />}
                        {status === "UNDER_REVIEW" && <Clock className="w-3 h-3" />}
                        {config.label}
                    </span>
                </div>

                {/* Body: Solution text */}
                <p className="font-poppins text-[13px] text-[#1a1a1a] leading-relaxed whitespace-pre-wrap">{wave.solution}</p>

                {/* Status description — from Figma Wave Indicators */}
                <p className="font-poppins text-[11px] text-[#8b8e8d] italic leading-snug">{config.description}</p>

                {/* Rejection reason if applicable */}
                {status === "REJECTED" && (wave as any).rejectionReason && (
                    <div className="bg-[#fef2f2] border border-[#fca5a5] rounded-lg px-3 py-2">
                        <span className="font-poppins text-[11px] text-[#991b1b]">
                            Reason: {(wave as any).rejectionReason}
                        </span>
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-[#F0F0F0]" />

            {/* Bottom: Actions + Surge Count */}
            <div className="p-3 px-4 flex justify-between items-center bg-[#fefdfa]">
                <div className="flex gap-2 flex-wrap">
                    {canApprove && (
                        <button
                            onClick={() => setActiveAction("APPROVED")}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f49b31] rounded-lg hover:bg-[#e68a1f] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                            <span className="font-poppins font-semibold text-[11px] text-white">Approve</span>
                        </button>
                    )}
                    {canReview && (
                        <button
                            onClick={() => setActiveAction("UNDER_REVIEW")}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 border border-[#f49b31] bg-white rounded-lg hover:bg-[#fef5ea] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <FileScan className="w-3.5 h-3.5 text-[#f49b31]" />
                            <span className="font-poppins font-semibold text-[11px] text-[#f49b31]">Review</span>
                        </button>
                    )}
                    {canReject && (
                        <button
                            onClick={() => setActiveAction("REJECTED")}
                            disabled={isUpdating}
                            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-white border border-[#fca5a5] rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <XCircle className="w-3.5 h-3.5 text-[#ef4444]" />
                            <span className="font-poppins font-semibold text-[11px] text-[#ef4444]">Reject</span>
                        </button>
                    )}
                    {/* Terminal states — no further actions */}
                    {(status === "COMPLETED" || status === "ON_HOLD") && (
                        <span className="font-poppins text-[11px] text-[#8b8e8d] italic self-center">
                            No further actions available
                        </span>
                    )}
                </div>

                {/* Surge count */}
                <div className="flex items-center gap-1.5 bg-[#fef5ea] px-3 py-1.5 rounded-md border border-[#ffd7a8] flex-shrink-0">
                    <img src="/assets/images/surge.svg" alt="Surge" className="w-3.5 h-3.5" />
                    <span className="font-poppins font-bold text-[13px] text-[#f49b31]">{wave.surgeCount}</span>
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
