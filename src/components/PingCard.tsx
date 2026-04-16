/**
 * PingCard
 * Displays ping content card with author, category, title, description, image, and stats
 * Used in PingDetail page
 */

import { useState } from "react";
import { Tooltip } from "./Tooltip";
import UserAvatar from "./UserAvatar";
import { categoryImages } from "./CategoryImages";
import { calculatePingBadge } from "../utils/badgeUtils";
import PingActionsDropdown from "./UnifiedFeed/PingActionsDropdown";
import ImageLightbox from "./shared/ImageLightbox";
import type { Ping, CategoryData } from "../api/types";

interface PingCardProps {
    ping: Ping;
    isLoading: boolean;
    hasSurged: boolean;
    isToggling: boolean;
    surgeCount: number;
    commentCount: number;
    weeklyTop3Ids: number[];
    categories: Record<number, CategoryData>;
    isOwner: boolean;
    onSurge: (e: React.MouseEvent) => void;
    onCommentClick: () => void;
    onDelete: (e: React.MouseEvent) => void;
}

const waveIcon = "/assets/icon/wave.svg";
const commentIcon = "/assets/icon/comment.svg";

const formatTimestamp = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
        const h = Math.floor(diffMs / (1000 * 60 * 60));
        if (h === 0) {
            const m = Math.floor(diffMs / (1000 * 60));
            return m <= 1 ? "Just now" : `${m}m ago`;
        }
        return `${h}h ago`;
    }
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getAuthorName = (ping: Ping) => {
    // If anonymous, use the alias
    if (ping.isAnonymous && ping.anonymousAlias) {
        return ping.anonymousAlias;
    }
    // Otherwise use the author's name
    if (ping.author && typeof ping.author === "object") {
        if (ping.author.firstName || ping.author.lastName) {
            return (
                `${ping.author.firstName ?? ""} ${ping.author.lastName ?? ""}`.trim() || "Anonymous"
            );
        }
    }
    return "Anonymous";
};

const PingCard = ({
    ping,
    isLoading,
    hasSurged,
    isToggling,
    surgeCount,
    commentCount,
    weeklyTop3Ids,
    categories,
    isOwner,
    onSurge,
    onCommentClick,
    onDelete,
}: PingCardProps) => {
    const authorName = getAuthorName(ping);
    const categoryName =
        ping.categoryId && categories[ping.categoryId]
            ? categories[ping.categoryId].name
            : ping.category?.name || "";
    const categoryIcon = categoryImages[categoryName];
    const waveCount = ping._count?.waves || 0;
    const initialHasSurged = ping.hasSurged ?? false;
    const displayedSurgeCount = Math.max(
        0,
        surgeCount + (hasSurged ? 1 : 0) - (initialHasSurged ? 1 : 0),
    );

    // Hook must be declared before any conditional returns
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    if (isLoading) return null;

    return (
        <div className="bg-[#fefefe] rounded-[10px] px-5 py-[15px] flex flex-col gap-[15px] w-full">
            {/* Author row + badge */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <UserAvatar
                        user={
                            typeof ping.author === "object"
                                ? ping.author
                                : null
                        }
                        size="md"
                        pictureUrl={
                            ping.isAnonymous && ping.anonymousProfilePicture
                                ? ping.anonymousProfilePicture
                                : undefined
                        }
                        bgColor="bg-[#ffc37b]"
                    />
                    <div className="flex flex-col">
                        <span className="font-['Poppins',sans-serif] font-semibold text-[14px] text-black">
                            {authorName}
                        </span>
                        <span className="font-['Poppins',sans-serif] font-medium text-[8px] text-black">
                            {formatTimestamp(ping.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Ping status badge (Top 3, Acknowledged, or Resolved) + Actions dropdown */}
                <div className="flex items-center gap-5">
                    {(() => {
                        const badgeConfig = calculatePingBadge(ping, weeklyTop3Ids);
                        if (!badgeConfig) return null;

                        return (
                            <Tooltip
                                content="Current aknowledgement status of this post."
                                position="left"
                                delay={0.2}
                            >
                                <div className="border border-[#626665] rounded-[23px] flex items-center gap-1.5 px-[15px] py-[7px]">
                                    <div
                                        className="w-[5px] h-[5px] rounded-full shrink-0"
                                        style={{ backgroundColor: badgeConfig.color }}
                                    />
                                    <span className="font-['Poppins',sans-serif] font-medium text-[11px] text-black whitespace-nowrap">
                                        {badgeConfig.label}
                                    </span>
                                </div>
                            </Tooltip>
                        );
                    })()}
                    {/* Actions dropdown */}
                    <PingActionsDropdown
                        pingId={ping.id}
                        isOwner={isOwner}
                        onDelete={onDelete}
                    />
                </div>
            </div>

            {/* Category badge */}
            {categoryName && (
                <div className="flex items-center gap-[5px]">
                    {categoryIcon && (
                        <img
                            src={categoryIcon}
                            alt={categoryName}
                            className="w-3 h-3 object-contain"
                        />
                    )}
                    <span className="font-['Poppins',sans-serif] font-medium  text-[13px] text-black">
                        {categoryName}
                    </span>
                </div>
            )}

            {/* Title */}
            <h1 className="font-['Poppins',sans-serif] font-semibold text-[20px] text-black">
                {ping.title}
            </h1>

            {/* Ping image */}
            {ping.media &&
                ping.media.length > 0 &&
                (() => {
                    const pingImage = ping.media.find((media) =>
                        media.mimeType.startsWith("image/"),
                    );
                    return pingImage?.url ? (
                        <div className="mt-3">
                            <button
                                type="button"
                                aria-label="View full image"
                                onClick={() => setLightboxSrc(pingImage.url)}
                                className="block w-full cursor-zoom-in"
                            >
                                <img
                                    src={pingImage.url}
                                    alt={ping.title || "User uploaded image"}
                                    className="w-full h-auto object-contain max-h-[700px] rounded-[14px] border border-black/10"
                                    loading="lazy"
                                />
                            </button>
                            {lightboxSrc && (
                                <ImageLightbox
                                    src={lightboxSrc}
                                    alt={ping.title || "Image"}
                                    onClose={() => setLightboxSrc(null)}
                                />
                            )}
                        </div>
                    ) : null;
                })()}

            {/* Description */}
            {ping.content && (
                <p className="font-['Poppins',sans-serif] font-medium  text-[14px] text-[#626665] text-justify leading-relaxed">
                    {ping.content}
                </p>
            )}

            {/* Stats: surge + comments + waves */}
            <div className="flex items-center justify-between gap-[15px]">
                {/* Surge button */}
                <Tooltip
                    content={
                        hasSurged
                            ? "Remove your surge"
                            : "Surge this post to show it's important!"
                    }
                    position="right"
                    delay={0.2}
                >
                    <button
                        type="button"
                        onClick={onSurge}
                        disabled={isToggling}
                        aria-label={hasSurged ? "Remove surge" : "Surge"}
                        className={`flex items-center gap-[5px] px-2 py-1 rounded-[15px] border border-black cursor-pointer transition-colors disabled:opacity-50 ${hasSurged
                            ? "bg-[#f49b31] text-white border-[#f49b31]"
                            : "bg-[#fef5ea] text-[#4a504e]"
                            }`}
                    >
                        <svg
                            width="10"
                            height="14"
                            viewBox="0 0 12 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                d="M6.5 1L1 9h5l-0.5 6 6-8H7l0.5-6z"
                                fill={hasSurged ? "white" : "#4A504E"}
                            />
                        </svg>
                        <span className="font-['Poppins',sans-serif] font-semibold text-[11px]">
                            {displayedSurgeCount}
                        </span>
                    </button>
                </Tooltip>

                <div className="flex items-center gap-3.5">
                    {/* Wave count */}
                    <div className="flex items-center gap-0">
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
                        onClick={onCommentClick}
                        className="flex items-center gap-1 hover:text-[#F49B31] transition-colors cursor-pointer"
                    >
                        <img
                            src={commentIcon}
                            className=" h-[18px] w-[18px]"
                            alt="commentIcon"
                        />
                        <span className="font-['Inter',sans-serif] font-medium text-[12px] md:text-[14px] text-[#63637B] leading-5">
                            {commentCount} Comments
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PingCard;
