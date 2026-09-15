import React, { useState } from "react";
import { ArrowRight, MessageCircle, X } from "lucide-react";
import UserAvatar from "../../UserAvatar";
import type { Comment } from "../../../api/types";
import api from "../../../api/axios.config";

interface AdminCommentsPanelProps {
    comments: Comment[];
    isDrawer?: boolean;
    showViewAll?: boolean;
    onViewAll?: () => void;
    onClose?: () => void;
}

interface CommentWithReplies extends Comment {
    replies?: Comment[];
}

const formatTimestamp = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        if (diffInHours === 0) {
            const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
            return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes}m ago`;
        }
        return diffInHours === 1 ? "1h ago" : `${diffInHours}h ago`;
    }
    if (diffInDays === 1) return "1d ago";
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return weeks === 1 ? "1w ago" : `${weeks}w ago`;
    }
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "1mo ago" : `${months}mo ago`;
};

const getAuthorName = (comment: Comment) => {
    if (comment.isAnonymous && comment.anonymousAlias) {
        return comment.anonymousAlias;
    }
    if (comment.author && typeof comment.author === "object") {
        return (
            `${comment.author.firstName ?? ""} ${comment.author.lastName ?? ""}`.trim() || "Anonymous"
        );
    }
    return "Anonymous";
};

const getAvatarUrl = (comment: Comment) => {
    if (comment.isAnonymous && comment.anonymousProfilePicture) {
        return comment.anonymousProfilePicture;
    }
    if (comment.author && typeof comment.author === "object" && comment.author.profilePicture) {
        return comment.author.profilePicture;
    }
    return undefined;
};

const SurgeButton = ({ comment }: { comment: Comment }) => {
    const [surgeCount, setSurgeCount] = useState(comment.surgeCount ?? 0);
    const [hasSurged, setHasSurged] = useState(comment.hasSurged ?? false);
    const [isToggling, setIsToggling] = useState(false);

    const handleSurge = async () => {
        if (isToggling) return;
        setIsToggling(true);
        try {
            const response = await api.post<{ surged: boolean; surgeCount?: number }>(
                `/comments/${comment.id}/surge`
            );
            setHasSurged(response.data.surged);
            if (typeof response.data.surgeCount === "number") {
                setSurgeCount(response.data.surgeCount);
            } else {
                setSurgeCount((prev) => prev + (response.data.surged ? 1 : -1));
            }
        } catch (err) {
            console.error("Error toggling comment surge:", err);
        } finally {
            setIsToggling(false);
        }
    };

    return (
        <button
            type="button"
            onClick={handleSurge}
            disabled={isToggling}
            aria-label={hasSurged ? "Remove surge" : "Surge"}
            className={`flex items-center gap-[2.25px] px-[7.5px] py-[5.25px] rounded-[18px] border-[0.75px] border-black cursor-pointer transition-all duration-200 disabled:opacity-50 text-[11px] font-['Baloo_Bhai_2',sans-serif] font-bold uppercase leading-none ${hasSurged
                    ? "bg-[#f49b31] text-white border-[#f49b31]"
                    : "bg-white text-black"
                }`}
        >
            <svg width="7.5" height="12" viewBox="0 0 8 13" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M4 1L0.5 7.5H3.5V12L7.5 5.5H4.5L4 1Z" fill="currentColor" />
            </svg>
            <span>{surgeCount}</span>
        </button>
    );
};

const CommentCard = ({ comment }: { comment: CommentWithReplies }) => {
    const [showReplies, setShowReplies] = useState(false);
    const authorName = getAuthorName(comment);
    const avatarUrl = getAvatarUrl(comment);
    const replyCount = comment.replies?.length ?? 0;

    return (
        <div className="bg-white border border-[#f49b31] rounded-xl p-[7px] w-full">
            <div className="flex gap-[5px] items-start">
                <div className="shrink-0 size-[23px]">
                    <UserAvatar
                        user={typeof comment.author === "object" ? comment.author : null}
                        size="sm"
                        bgColor="bg-[#f49b31]"
                        pictureUrl={avatarUrl}
                    />
                </div>

                <div className="flex flex-col gap-[5px] items-start flex-1 min-w-0">
                    <div className="flex flex-col gap-0.5">
                        <p className="text-[11px] font-['Poppins',sans-serif] font-semibold text-black leading-none">
                            {authorName}
                        </p>
                        <p className="text-[10px] font-['Poppins',sans-serif] font-medium text-[#454545] leading-none">
                            {formatTimestamp(comment.createdAt)}
                        </p>
                    </div>

                    <p className="text-[12px] font-['Poppins',sans-serif] font-normal text-black leading-normal wrap-break-word w-full">
                        {comment.content}
                    </p>

                    <div className="flex gap-[5px] items-center">
                        <SurgeButton comment={comment} />

                        {replyCount > 0 && (
                            <button
                                type="button"
                                onClick={() => setShowReplies(!showReplies)}
                                className="flex items-center gap-[2.5px] px-[7.5px] py-[5.25px] rounded-[13.5px] border-[0.75px] border-black bg-white text-black cursor-pointer text-[11px] font-['Baloo_Bhai_2',sans-serif] font-bold uppercase leading-none transition-all duration-200"
                            >
                                <MessageCircle size={12} />
                                <span>{replyCount}</span>
                            </button>
                        )}
                    </div>

                    {showReplies && comment.replies && comment.replies.length > 0 && (
                        <div className="flex flex-col gap-[5px] items-start w-full mt-[5px]">
                            {comment.replies.map((reply) => (
                                <ReplyCard key={reply.id} reply={reply} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ReplyCard = ({ reply }: { reply: Comment }) => {
    const authorName = getAuthorName(reply);
    const avatarUrl = getAvatarUrl(reply);

    return (
        <div className="bg-white rounded-xl p-1.5 w-full flex gap-[5px] items-start">
            <div className="shrink-0 size-[23px]">
                <UserAvatar
                    user={typeof reply.author === "object" ? reply.author : null}
                    size="sm"
                    bgColor="bg-[#f49b31]"
                    pictureUrl={avatarUrl}
                />
            </div>

            <div className="flex-1 flex flex-col gap-[5px] items-start min-w-0">
                <div className="flex flex-col gap-0.5 w-full">
                    <p className="text-[11px] font-['Poppins',sans-serif] font-semibold text-black leading-none">
                        {authorName}
                    </p>
                    <p className="text-[10px] font-['Poppins',sans-serif] font-medium text-[#454545] leading-none">
                        {formatTimestamp(reply.createdAt)}
                    </p>
                </div>

                <p className="text-[12px] font-['Poppins',sans-serif] font-normal text-black leading-normal wrap-break-word w-full">
                    {reply.content}
                </p>

                <SurgeButton comment={reply} />
            </div>
        </div>
    );
};

const AdminCommentsPanel: React.FC<AdminCommentsPanelProps> = ({ comments, isDrawer = false, showViewAll = true, onViewAll, onClose }) => {
    const [showAllComments, setShowAllComments] = useState(false);
    const topLevelComments = comments.filter(
        (c) => !c.parentCommentId || c.parentCommentId === null
    );

    // Part A.3: the compact card always shows at most 2 comments; the 3rd+
    // is only reachable through the expanded drawer/modal (isDrawer=true),
    // which renders the full scrollable list.
    const visibleTopLevelComments = isDrawer ? topLevelComments : topLevelComments.slice(0, 2);
    const commentsWithReplies: CommentWithReplies[] = visibleTopLevelComments.map((comment) => ({
        ...comment,
        replies: comments.filter((c) => c.parentCommentId === comment.id),
    }));

    return (
        <div className={`bg-[#F49B31] flex flex-col gap-2 sm:gap-3 ${isDrawer ? "rounded-t-[30px] lg:rounded-[20px] h-full" : "rounded-xl"}`}>
            <div className="flex items-center justify-between pt-3 px-3 sm:pt-4 sm:px-4 shrink-0">
            <h3 className="font-poppins font-semibold text-[16px] sm:text-[18px] text-white rounded-t-xl">
                Comments
                {topLevelComments.length > 0 && (
                    <span className="ms-1.5 text-[#626665]">{topLevelComments.length}</span>
                )}
            </h3>
            {isDrawer && onClose && <button type="button" onClick={onClose} aria-label="Close comments" className="p-1 text-white"><X className="w-5 h-5" /></button>}
            </div>
            <div className={`flex flex-col gap-2 px-3 sm:px-4 sm:gap-3 bg-[#ffc37b] py-2 ${isDrawer ? "flex-1 min-h-0 overflow-y-auto" : "overflow-hidden"}`}>
                {commentsWithReplies.length === 0 ? (
                    <p className="text-center text-white text-[13px] py-4">No comments yet</p>
                ) : (
                    commentsWithReplies.map((comment) => (
                        <CommentCard key={comment.id} comment={comment} />
                    ))
                )}
            </div>
            <div className="bg-[#F49B31] rounded-b-xl px-3 sm:px-4 py-2.5 sm:py-3 shrink-0">
            {showViewAll && topLevelComments.length > 2 && (
                <button
                    type="button"
                    onClick={() => onViewAll ? onViewAll() : setShowAllComments((value) => !value)}
                    className="w-full bg-white border border-[#f49b31] rounded-full px-4 py-2 flex items-center justify-center gap-2 text-[11px] sm:text-[12px] font-poppins font-medium text-black whitespace-nowrap hover:bg-[#fff8f0] transition-colors"
                >
                    {showAllComments ? "Collapse comments" : `View all ${topLevelComments.length} Comments`}
                    <ArrowRight className={`w-3.5 h-3.5 transition-transform ${showAllComments ? "rotate-[-90deg]" : ""}`} />
                </button>
            )}
            </div>
        </div>
    );
};

export default AdminCommentsPanel;
