/**
 * UnifiedPingCard
 * Figma ref: 3657:8934 (desktop), 3919:9099 (mobile)
 * Phase: 2
 *
 * Replaces SoundBoardCard. Shows ping header, category label, body (title + description + image),
 * footer (surge / comment / wave counts), and InlineWavePreview section.
 * Clicking the card navigates to /feed/:pingId.
 */

import { useNavigate } from "react-router-dom";
import { useAuthStore, useSurgeStore } from "../../stores";
import InlineWavePreview from "./InlineWavePreview";
import type { Ping, Wave } from "../../api/types";
import { categoryImages } from "../CategoryImages";

interface UnifiedPingCardProps {
    ping: Ping;
    waves?: Wave[];
}

// TODO: API — surge toggle via useSurgeStore.toggleSurge()
// TODO: API — delete ping via pingService.deletePing()

const UnifiedPingCard = ({ ping, waves = [] }: UnifiedPingCardProps) => {
    const navigate = useNavigate();
    const currentUser = useAuthStore((state) => state.user);
    const toggleSurge = useSurgeStore((state) => state.toggleSurge);
    const hasSurged = useSurgeStore((state) => state.hasSurged("ping", String(ping.id)));
    const isToggling = useSurgeStore(
        (state) => state.isToggling[`ping-${ping.id}`] || false,
    );

    const isOwner = currentUser?.id === (typeof ping.author === "object" ? ping.author?.id : undefined);

    const authorName =
        typeof ping.author === "object" && ping.author
            ? `${ping.author.firstName} ${ping.author.lastName}`
            : "Anonymous";

    const authorInitials = authorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const timestamp = ping.createdAt
        ? new Date(ping.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: undefined,
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";

    const categoryName = ping.category?.name || "";
    const categoryIcon = categoryImages[categoryName];

    const surgeCount = ping.surgeCount || ping._count?.surges || 0;
    const commentCount = ping._count?.comments || 0;
    const waveCount = ping._count?.waves || waves.length || 0;

    const handleCardClick = () => {
        navigate(`/feed/${ping.id}`);
    };

    const handleSurge = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isToggling) return;
        try {
            await toggleSurge("ping", String(ping.id));
        } catch (error) {
            console.error("Surge failed:", error);
        }
    };

    const handleCommentClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/feed/${ping.id}`);
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: API — delete ping via pingService.deletePing()
        console.log("Delete ping:", ping.id);
    };

    return (
        <div
            className="bg-[#FEFEFE] rounded-[10px] px-5 py-[15px] flex flex-col gap-[15px] cursor-pointer hover:shadow-sm transition-shadow w-full"
            onClick={handleCardClick}
            role="article"
        >
            {/* ─── Header ─────────────────────────────── */}
            <div className="flex flex-col gap-2.5">
                {/* Author row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className="w-7 h-7 md:w-[53px] md:h-[53px] rounded-full bg-[#FFC37B] flex items-center justify-center shrink-0 overflow-hidden">
                            <span className="font-['Poppins',sans-serif] font-bold text-[10px] md:text-[18px] text-white">
                                {authorInitials}
                            </span>
                        </div>
                        {/* Name + timestamp */}
                        <div className="flex flex-col">
                            <span className="font-['Poppins',sans-serif] font-semibold text-[13px] md:text-[15px] text-black leading-normal">
                                {authorName}
                            </span>
                            <span className="font-['Poppins',sans-serif] font-medium text-[11px] md:text-[13px] text-[#8B8E8D] leading-normal">
                                {timestamp}
                            </span>
                        </div>
                    </div>

                    {/* Badges: Top 3 + delete */}
                    <div className="flex items-center gap-5">
                        {/* "Top 3" badge — shown if ping is in top */}
                        {(ping as Ping & { isTop3?: boolean }).isTop3 && (
                            <div className="border border-[#626665] rounded-[23px] flex items-center gap-1.5 px-[15px] py-[7px]">
                                <div className="w-[7px] h-[7px] rounded-full bg-[#F49B31]" />
                                <span className="font-['Poppins',sans-serif] font-medium text-[11px] text-black">
                                    Top 3
                                </span>
                            </div>
                        )}
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
                    <div className="flex items-center gap-[9px]">
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
            <div className="flex flex-col gap-[13px]">
                <h3 className="font-['Poppins',sans-serif] font-semibold text-[14px] md:text-[16px] text-black leading-normal">
                    {ping.title}
                </h3>
                {ping.content && (
                    <p className="font-['Poppins',sans-serif] font-medium text-[12px] md:text-[14px] text-black/70 leading-relaxed line-clamp-3">
                        {ping.content}
                    </p>
                )}
                {/* Image placeholder — real image URL from ping would go here */}
            </div>

            {/* ─── Footer: Surge + wave & comment counts ─ */}
            <div className="flex items-center justify-between">
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
                    <div className="flex items-center gap-0" onClick={(e) => e.stopPropagation()}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <rect width="32" height="32" rx="6" fill="#FEF5EA" />
                            <path d="M5 16c2-4 4-4 6 0s4 4 6 0 4-4 6 0" stroke="#F49B31" strokeWidth="1.8" strokeLinecap="round" />
                        </svg>
                        <span className="font-['Inter',sans-serif] font-medium text-[12px] md:text-[14px] text-[#63637B] leading-5">
                            {waveCount} Waves Proposed
                        </span>
                    </div>

                    {/* Comment count */}
                    <button
                        onClick={handleCommentClick}
                        className="flex items-center gap-0 hover:text-[#F49B31] transition-colors cursor-pointer"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M14 1H2a1 1 0 00-1 1v9a1 1 0 001 1h2v3l4-3h6a1 1 0 001-1V2a1 1 0 00-1-1z" stroke="#63637B" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span className="font-['Inter',sans-serif] font-medium text-[12px] md:text-[14px] text-[#63637B] leading-5">
                            {commentCount} Comments
                        </span>
                    </button>
                </div>
            </div>

            {/* ─── Separator ───────────────────────────── */}
            <div className="h-px w-full bg-black/10" />

            {/* ─── Inline Wave Preview ─────────────────── */}
            <InlineWavePreview waves={waves} />
        </div>
    );
};

export default UnifiedPingCard;
