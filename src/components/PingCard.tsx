/**
 * PingCard
 * Displays ping content card with author, category, title, description, image, and stats
 * Used in PingDetail page
 */

import { Tooltip } from "./Tooltip";
import UserAvatar from "./UserAvatar";
import { categoryImages } from "./CategoryImages";
import { calculatePingBadge } from "../utils/badgeUtils";
import PingActionsDropdown from "./UnifiedFeed/PingActionsDropdown";
import ImageCarousel from "./shared/ImageCarousel";
import type { Ping, CategoryData } from "../api/types";
import { useEditWindow } from "../hooks";
import { getEditErrorMessage } from "../utils/editErrors";
import { EditedLabel } from "../utils/editedLabel";
import { useState } from "react";
import { pingService } from "../api/services";
import { useAuthStore } from "../stores";
import SurgeIcon from "./shared/SurgeIcon";

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
    onRefresh?: () => void;
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
    onRefresh,
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

    const { isEditable, countdownLabel } = useEditWindow(ping.createdAt);
    const canEdit = isOwner && !ping.isAnonymous && isEditable;

    const [isEditing, setIsEditing] = useState(false);
    const [editInput, setEditInput] = useState(ping.content || "");
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const handleSaveEdit = async () => {
        const trimmed = editInput.trim();
        if (!trimmed || trimmed === ping.content) {
            setIsEditing(false);
            return;
        }

        setIsSavingEdit(true);
        setActionError(null);
        try {
            await pingService.updatePing(String(ping.id), { content: trimmed });
            setIsEditing(false);
            onRefresh?.();
        } catch (err) {
            setActionError(getEditErrorMessage(err));
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditInput(ping.content || "");
        setActionError(null);
    };

    if (isLoading) return null;

    return (
        <div className="bg-[#fefefe] rounded-[10px] px-3 sm:px-5 py-3 sm:py-[15px] flex flex-col gap-[15px] w-full">
            {/* Author row + badge */}
            <div className="flex items-center justify-between gap-1.5 sm:gap-2">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
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
                                : isOwner && !ping.isAnonymous && useAuthStore.getState().user?.profilePicture
                                  ? useAuthStore.getState().user?.profilePicture
                                  : undefined
                        }
                        bgColor="bg-[#ffc37b]"
                    />
                    <div className="flex flex-col min-w-0">
                        <span
                            title={authorName}
                            className="font-['Poppins',sans-serif] font-semibold text-[14px] text-black truncate whitespace-nowrap max-w-[95px] xs:max-w-[140px] sm:max-w-none"
                        >
                            {authorName}
                        </span>
                        <span className="font-['Poppins',sans-serif] font-medium text-[8px] text-black whitespace-nowrap">
                            {formatTimestamp(ping.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Ping status badge (Top 3, Acknowledged, or Resolved) + Actions dropdown */}
                <div className="flex items-center gap-1 md:gap-2.5 shrink-0">
                    {(() => {
                        const badgeConfig = calculatePingBadge(ping, weeklyTop3Ids);
                        if (!badgeConfig) return null;

                        return (
                            <Tooltip
                                content="Current acknowledgement status of this post."
                                position="left"
                                delay={0.2}
                            >
                                <img
                                    src={badgeConfig.svg}
                                    alt={badgeConfig.label}
                                    className="h-[22px] sm:h-[28px] md:h-[33px] w-auto shrink-0 select-none object-contain"
                                />
                            </Tooltip>
                        );
                    })()}
                    {/* Actions dropdown */}
                    <PingActionsDropdown
                        pingId={ping.id}
                        isOwner={isOwner}
                        canEdit={canEdit}
                        onEdit={() => setIsEditing(true)}
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
                {ping.isEdited && <EditedLabel />}
            </h1>

            {/* Ping image */}
            {ping.media &&
                ping.media.length > 0 &&
                (() => {
                    const pingImages = ping.media.filter((media) =>
                        media.mimeType.startsWith("image/"),
                    );
                    return pingImages.length > 0 ? (
                        <div className="mt-3">
                            <ImageCarousel images={pingImages} altText={ping.title || "User uploaded image"} />
                        </div>
                    ) : null;
                })()}

            {/* Description */}
            {ping.content && (
                isEditing ? (
                    <div className="flex flex-col gap-2 w-full mt-1">
                        <textarea
                            value={editInput}
                            onChange={(e) => setEditInput(e.target.value)}
                            disabled={isSavingEdit}
                            className="w-full text-[14px] font-['Poppins',sans-serif] font-medium p-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#f49b31] resize-y min-h-[100px]"
                            autoFocus
                        />
                        {actionError && <p className="text-red-500 text-sm">{actionError}</p>}
                        <div className="flex justify-between items-center">
                            <span className="text-[12px] text-gray-500">
                                {countdownLabel ? `Edit window closes in ${countdownLabel}` : "Edit window closed"}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCancelEdit}
                                    disabled={isSavingEdit}
                                    className="text-[12px] px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSaveEdit}
                                    disabled={isSavingEdit || !editInput.trim()}
                                    className="text-[12px] px-3 py-1.5 bg-[#f49b31] text-white rounded-md disabled:opacity-50"
                                >
                                    {isSavingEdit ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="font-['Poppins',sans-serif] font-medium  text-[14px] text-[#626665] text-justify leading-relaxed whitespace-pre-wrap">
                        {ping.content}
                    </p>
                )
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
                        className={`flex items-center gap-[5px] px-2.5 md:px-3 py-1 md:py-[5px] rounded-[15px] border border-black cursor-pointer transition-colors disabled:opacity-50 ${hasSurged
                            ? "bg-[#f49b31] text-white"
                            : "bg-[#fef5ea] text-[#4A504E]"
                            }`}
                    >
                        <SurgeIcon
                            width={12}
                            height={16}
                            fill={hasSurged ? "#FFFFFF" : "#F49B31"}
                        />
                        <span className="font-['Poppins',sans-serif] font-semibold text-[13px] md:text-[14px] leading-normal">
                            {displayedSurgeCount}
                        </span>
                    </button>
                </Tooltip>

                <div className="flex items-center gap-1.5 md:gap-3.5 flex-wrap justify-end">
                    {/* Wave count */}
                    <div className="flex items-center gap-0">
                        <img
                            src={waveIcon}
                            className="h-[20px] w-[18px] md:h-[27px] md:w-[25px]"
                            alt="waveIcon"
                        />
                        <span className="font-['Inter',sans-serif] font-medium text-[11px] md:text-[14px] text-[#63637B] leading-5 whitespace-nowrap">
                            {waveCount} <span className="md:hidden">Waves</span><span className="hidden md:inline">Waves Proposed</span>
                        </span>
                    </div>

                    {/* Comment count */}
                    <button
                        onClick={onCommentClick}
                        className="flex items-center gap-1 hover:text-[#F49B31] transition-colors cursor-pointer"
                    >
                        <img
                            src={commentIcon}
                            className="h-[14px] w-[14px] md:h-[18px] md:w-[18px]"
                            alt="commentIcon"
                        />
                        <span className="font-['Inter',sans-serif] font-medium text-[11px] md:text-[14px] text-[#63637B] leading-5 whitespace-nowrap">
                            {commentCount} Comments
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PingCard;
