/**
 * UnifiedPingCard
 * Figma ref: 3657:8934 (desktop), 3919:9099 (mobile)
 * Phase: 2
 *
 * Replaces SoundBoardCard. Shows ping header, category label, body (title + description + image),
 * footer (surge / comment / wave counts), and InlineWavePreview section.
 * Clicking the card navigates to /feed/:pingId.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useSurgeStore, usePingsStore } from "../../stores";
import { pingService } from "../../api/services";
import { calculatePingBadge } from "../../utils/badgeUtils";
import InlineWavePreview from "./InlineWavePreview";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import UserAvatar from "../UserAvatar";
import type { Ping } from "../../api/types";
import { categoryImages } from "../CategoryImages";

const waveIcon = "/assets/icon/wave.svg";
const commentIcon = "/assets/icon/comment.svg";
interface UnifiedPingCardProps {
    ping: Ping;
    isHistoryContext?: boolean;
    weeklyTop3Ids?: number[];
}

const UnifiedPingCard = ({ ping, isHistoryContext = false, weeklyTop3Ids = [] }: UnifiedPingCardProps) => {
    const navigate = useNavigate();
    const currentUser = useAuthStore((state) => state.user);
    const toggleSurge = useSurgeStore((state) => state.toggleSurge);
    const hasSurged = useSurgeStore((state) => state.hasSurged("ping", String(ping.id)));
    const isToggling = useSurgeStore(
        (state) => state.isToggling[`ping-${ping.id}`] || false,
    );

    // Get the latest ping data from store to reflect surge count updates
    const pingFromStore = usePingsStore((state) => state.pingsById[String(ping.id)]);
    const currentPing = pingFromStore || ping;

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwner = currentUser?.id === (typeof currentPing.author === "object" ? currentPing.author?.id : undefined);

    const authorName =
        typeof currentPing.author === "object" && currentPing.author
            ? `${currentPing.author.firstName} ${currentPing.author.lastName}`
            : "Anonymous";

    const timestamp = currentPing.createdAt
        ? new Date(currentPing.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: undefined,
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";

    const categoryName = currentPing.category?.name || "";
    const categoryIcon = categoryImages[categoryName];
    const pingImage = currentPing.media?.find((media) => media.mimeType.startsWith("image/"));

    const surgeCount = currentPing.surgeCount || currentPing._count?.surges || 0;
    const waveCount = currentPing._count?.waves || 0;
    const commentCount = currentPing._count?.comments || 0;

    const handleCardClick = () => {
        navigate(`/feed/${currentPing.id}`);
    };

    const updatePingStore = usePingsStore((state) => state.updatePing);
    const handleSurge = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isToggling) return;
        try {
            // Call backend and get latest surge state/count
            await toggleSurge("ping", String(currentPing.id));
            // Optionally, refetch ping from backend for full consistency
            const latest = await pingService.getPingById(String(currentPing.id));
            updatePingStore(String(currentPing.id), {
                surgeCount: latest.surgeCount,
                hasSurged: latest.hasSurged,
            });
        } catch (error) {
            console.error("Surge failed:", error);
        }
    };

    const handleCommentandWaveClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/feed/${currentPing.id}`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setIsDeleting(true);
        try {
            await pingService.deletePing(String(currentPing.id));
            usePingsStore.getState().removePing(String(currentPing.id));
        } catch (err) {
            console.error("Failed to delete ping:", err);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <>
            <div
                className={[
                    "bg-[#FEFEFE] rounded-[10px] px-5 py-[15px] flex flex-col gap-[15px] cursor-pointer hover:shadow-sm transition-shadow w-full",
                    isHistoryContext ? "max-w-full min-w-0" : "",
                    "text-wrap"
                ].join(" ")}
                onClick={handleCardClick}
                role="article"
            >
                {/* ─── Header ─────────────────────────────── */}
                <div className={["flex flex-col gap-2.5", isHistoryContext ? "min-w-0" : ""].join(" ")}>
                    {/* Author row */}
                    <div className={["flex items-center justify-between", isHistoryContext ? "min-w-0" : ""].join(" ")}>
                        <div className={["flex items-center gap-4", isHistoryContext ? "min-w-0" : ""].join(" ")}>
                            {/* Avatar */}
                            <UserAvatar
                                user={typeof currentPing.author === "object" ? currentPing.author : null}
                                size="lg"
                                responsive
                                bgColor="bg-[#FFC37B]"
                                className="shrink-0"
                            />
                            {/* Name + timestamp */}
                            <div className={["flex flex-col", isHistoryContext ? "min-w-0" : ""].join(" ")}>
                                <span className="font-['Poppins',sans-serif] font-semibold text-[13px] md:text-[15px] text-black leading-normal">
                                    {authorName}
                                </span>
                                <span className="font-['Poppins',sans-serif] font-medium text-[11px] md:text-[13px] text-[#8B8E8D] leading-normal">
                                    {timestamp}
                                </span>
                            </div>
                        </div>

                        {/* Badges: Ping status + delete */}
                        <div className={["flex items-center gap-5", isHistoryContext ? "min-w-0" : ""].join(" ")}>
                            {/* Ping status badge (Top 3, Acknowledged, or Resolved) */}
                            {(() => {
                                // Calculate badge using hierarchy from TAG_AND_STATUS_HIERARCHY.md
                                // Pass weeklyTop3Ids from parent to calculate Top 3 badge when applicable
                                const badgeConfig = calculatePingBadge(currentPing, weeklyTop3Ids);
                                if (!badgeConfig) return null;

                                return (
                                    <div className="border border-[#626665] rounded-[23px] flex items-center gap-1.5 px-[15px] py-[7px]">
                                        <div
                                            className="w-[7px] h-[7px] rounded-full"
                                            style={{ backgroundColor: badgeConfig.color }}
                                        />
                                        <span className="font-['Poppins',sans-serif] font-medium text-[11px] text-black">
                                            {badgeConfig.label}
                                        </span>
                                    </div>
                                );
                            })()}
                            {/* Delete — own pings only */}
                            {isOwner && (
                                <button
                                    onClick={handleDelete}
                                    aria-label="Delete ping"
                                    className="w-[31px] h-8 rounded-full bg-[#FEF5EA] flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#EF4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Category label */}
                    {categoryName && (
                        <div className={["flex items-center gap-[9px]", isHistoryContext ? "min-w-0" : ""].join(" ")}>
                            {categoryIcon && (
                                <img src={categoryIcon} alt={categoryName} className="w-[13px] h-[13px] md:w-5 md:h-5 object-contain" />
                            )}
                            <span className="font-['Poppins',sans-serif] font-medium text-[13px] md:text-[15px] text-[#171717]">
                                {categoryName}
                            </span>
                        </div>
                    )}
                </div>

                {/* ─── Body ────────────────────────────────── */}
                <div className={["flex flex-col gap-[13px]", isHistoryContext ? "min-w-0" : ""].join(" ")}>
                    <h3 className="font-['Poppins',sans-serif] font-semibold text-[14px] md:text-[16px] text-black leading-normal">
                        {currentPing.title}
                    </h3>
                    {currentPing.content && (
                        <p className={["font-['Poppins',sans-serif] font-medium text-[12px] md:text-[14px] text-black/70 leading-relaxed text-wrap line-clamp-3", isHistoryContext ? "break-all truncate" : ""].join(" ")}>
                            {currentPing.content}
                        </p>
                    )}
                    {pingImage?.url && (
                        <div
                            className="overflow-hidden rounded-[14px] border border-black/10 bg-[#F8F7F3] w-full"
                            style={{ aspectRatio: `${pingImage.width} / ${pingImage.height}` }}
                        >
                            <img
                                src={pingImage.url}
                                alt={currentPing.title ? `Attached image for ${currentPing.title}` : "Attached ping image"}
                                className="h-full w-full object-contain"
                                loading="lazy"
                            />
                        </div>
                    )}
                </div>

                {/* ─── Footer: Surge + wave & comment counts ─ */}
                <div className={["flex items-center justify-between", isHistoryContext ? "min-w-0" : ""].join(" ")}>
                    {/* Surge button */}
                    <button
                        onClick={handleSurge}
                        disabled={isToggling}
                        aria-label={hasSurged ? "Remove surge" : "Surge"}
                        className={`flex items-center gap-[5px] px-2.5 py-[5px] rounded-[15px] border border-black cursor-pointer transition-colors disabled:opacity-50 ${hasSurged ? "bg-[#F49B31] text-white border-[#F49B31]" : "bg-[#FEF5EA] text-[#4A504E]"}`}
                    >
                        <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M6.5 1L1 9h5l-0.5 6 6-8H7l0.5-6z" fill={hasSurged ? "white" : "#4A504E"} />
                        </svg>
                        <span className="font-['Poppins',sans-serif] font-semibold text-[12px] md:text-[14px] leading-normal">
                            {surgeCount}
                        </span>
                    </button>

                    {/* Wave + comment counts */}
                    <div className="flex items-center gap-3.5">
                        {/* Wave count */}
                        <div className="flex items-center gap-0" onClick={handleCommentandWaveClick}>
                            <img
                                src={waveIcon}
                                className=" h-[27px] w-[25px]"
                                alt="waveIcon"
                            />
                            <span className="font-['Inter',sans-serif] font-medium text-[12px] md:text-[14px] text-[#63637B] leading-5">
                                {waveCount} Waves Proposed
                            </span>
                        </div>

                        {/* Comment count */}
                        <button
                            onClick={handleCommentandWaveClick}
                            className="flex items-center gap-1 hover:text-[#F49B31] transition-colors cursor-pointer"
                        >
                            <img
                                src={commentIcon}
                                className=" h-[27px] w-[25px]"
                                alt="commentIcon"
                            />
                            <span className="font-['Inter',sans-serif] font-medium text-[12px] md:text-[14px] text-[#63637B] leading-5">
                                {commentCount} Comments
                            </span>
                        </button>
                    </div>
                </div>

                {/* ─── Separator ───────────────────────────── */}
                <div className="h-px w-full bg-black/10" />

                {/* ─── Inline Wave Preview ─────────────────── */}
                <InlineWavePreview pingId={currentPing.id} />
            </div>

            {showDeleteModal && (
                <DeleteConfirmationModal
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setShowDeleteModal(false)}
                    isLoading={isDeleting}
                />
            )}
        </>
    );
};

export default UnifiedPingCard;
