import React, { useState } from "react";
import type { Wave } from "../../../api/types/index";
import { CheckCircle, FileScan, XCircle } from "lucide-react";
import WaveActionModal from "./WaveActionModal";
import FigmaBadge from "../FigmaBadge";
import { getWaveBadgeName } from "../figmaBadgeUtils";

interface AdminWaveCardProps {
    wave: Wave;
    onUpdateStatus: (id: number, status: "APPROVED" | "REJECTED" | "UNDER_REVIEW", reason?: string) => Promise<void>;
    badgeLabel?: "Community Pick" | "Alternative";
}

const AdminWaveCard: React.FC<AdminWaveCardProps> = ({ wave, onUpdateStatus, badgeLabel }) => {
    const [activeAction, setActiveAction] = useState<"APPROVED" | "REJECTED" | "UNDER_REVIEW" | null>(null);

    const isPending = wave.status === "UNDER_REVIEW";
    const isPosted = wave.status === "POSTED";
    const statusConfig = ({
        POSTED: { label: "Proposed", color: "#A09F9F", icon: "/assets/icon/dot-yellow.svg" },
        UNDER_REVIEW: { label: "Under Review", color: "#4CAF50", icon: "/assets/icon/dot-green.svg" },
        APPROVED: { label: "Approved", color: "#4CAF50", icon: "/assets/icon/dot-green.svg" },
        IN_PROGRESS: { label: "Implementing", color: "#F49B31", icon: "/assets/icon/dot-blue.svg" },
        REJECTED: { label: "Rejected", color: "#FF6B6B", icon: "/assets/icon/dot-yellow.svg" },
        COMPLETED: { label: "Completed", color: "#F49B31", icon: "/assets/icon/dot-blue.svg" },
    } as Record<string, { label: string; color: string; icon: string }>)[wave.status];
    const imageMedia = (wave.media ?? []).filter((media) => media.mimeType?.startsWith("image/"));

    // Format timestamp
    const date = new Date(wave.createdAt);
    const formattedDate = date.toLocaleDateString("en-US", { month: "short", day: "numeric" }) + ", " + date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

    return (
        <div className="bg-white rounded-xl border border-[#CECECE] overflow-hidden flex flex-col w-full">
            <div className="p-4 flex flex-col gap-3">
                {/* Top: Author */}
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 items-center">
                        <img
                            src={wave.author?.profilePicture || `https://ui-avatars.com/api/?name=${wave.author?.firstName || "A"}+${wave.author?.lastName || "U"}&background=random`}
                            alt={wave.author?.firstName || "Anonymous"}
                            className="w-10 h-10 rounded-full"
                        />
                        <div className="flex flex-col">
                            <span className="font-poppins font-semibold text-[14px] text-black">
                                {wave.author ? `${wave.author.firstName} ${wave.author.lastName}` : "Anonymous"}
                            </span>
                            <span className="font-poppins text-[12px] text-[#626665]">
                                {formattedDate}
                            </span>
                        </div>
                    </div>
                    {badgeLabel ? <FigmaBadge label={badgeLabel} /> : statusConfig && <FigmaBadge label={getWaveBadgeName(wave.status)} />}
                </div>

                {/* Body: Solution */}
                <p className="font-poppins text-[14px] text-black">
                    {wave.solution}
                </p>
                {imageMedia.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                        {imageMedia.map((media) => (
                            <img key={media.id} src={media.url} alt="Wave attachment" className="w-full aspect-video rounded-lg object-cover" />
                        ))}
                    </div>
                )}
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-[#CECECE]" />

            {/* Bottom: Actions & Surge Count */}
            <div className="p-3 px-4 flex justify-between items-center bg-[#fefdfa]">
                <div className="flex gap-2">
                    {isPending ? (
                        <>
                            <button
                                onClick={() => setActiveAction("APPROVED")}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#f49b31] rounded-lg hover:bg-[#e68a1f] transition-colors"
                            >
                                <CheckCircle className="w-4 h-4 text-white" />
                                <span className="font-poppins font-semibold text-[12px] text-white">Approve</span>
                            </button>
                            <button
                                onClick={() => setActiveAction("REJECTED")}
                                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#ffb4b4] rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <XCircle className="w-4 h-4 text-[#eb5050]" />
                                <span className="font-poppins font-semibold text-[12px] text-[#eb5050]">Reject</span>
                            </button>
                        </>
                    ) : isPosted ? (
                        <>
                            <button
                                onClick={() => setActiveAction("APPROVED")}
                                className="flex items-center gap-1.5 px-4 py-2 bg-[#f49b31] rounded-lg hover:bg-[#e68a1f] transition-colors"
                            >
                                <CheckCircle className="w-4 h-4 text-white" />
                                <span className="font-poppins font-semibold text-[12px] text-white">Approve</span>
                            </button>
                            <button
                                onClick={() => setActiveAction("REJECTED")}
                                className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#ffb4b4] rounded-lg hover:bg-red-50 transition-colors"
                            >
                                <XCircle className="w-4 h-4 text-[#eb5050]" />
                                <span className="font-poppins font-semibold text-[12px] text-[#eb5050]">Reject</span>
                            </button>
                            <button
                                onClick={() => setActiveAction("UNDER_REVIEW")}
                                className="flex items-center gap-1.5 px-4 py-2 border border-[#f49b31] bg-white rounded-lg hover:bg-[#f49b31]/10 hover:text-[#f49b31] transition-colors"
                            >
                                <FileScan className="w-4 h-4 text-[#f49b31]" />
                                <span className="font-poppins font-semibold text-[12px] text-[#f49b31]">REVIEW</span>
                            </button>
                        </>
                    ) : (
                        <div className="flex items-center">
                            <span className="font-poppins font-medium text-[12px] text-[#626665]">
                                Status: <strong className={`uppercase ${wave.status === 'APPROVED' ? 'text-green-600' : 'text-red-600'}`}>
                                    {wave.status}
                                </strong>
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1.5 bg-[#fef5ea] px-3 py-1.5 rounded-md border border-[#ffd7a8]">
                    <img src="/assets/images/surge.svg" alt="Surge" className="w-4 h-4" />
                    <span className="font-poppins font-bold text-[14px] text-[#f49b31]">
                        {wave.surgeCount}
                    </span>
                </div>
            </div>

            {activeAction && (
                <WaveActionModal
                    action={activeAction}
                    onConfirm={async (reason) => {
                        await onUpdateStatus(wave.id, activeAction, reason);
                    }}
                    onCancel={() => setActiveAction(null)}
                />
            )}
        </div>
    );
};

export default AdminWaveCard;
