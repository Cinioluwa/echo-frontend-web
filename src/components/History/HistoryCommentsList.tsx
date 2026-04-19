/**
 * HistoryCommentsList
 * Figma ref: 3rd frame in S5 (desktop: 4183:17017), 3rd frame in S6 (mobile: 4183:17018)
 * Phase: 4
 *
 * Content for the "Comments" tab on the History page.
 * Shows pings/waves the user has commented on – compact card with
 * the user's comment highlighted below.
 */

import { useState, useEffect } from "react";
import type { Comment } from "../../api/types";
import { categoryImages } from "../CategoryImages";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { EmptyState } from "../shared/EmptyState";
import { userService } from "../../api/services";
import UserAvatar from "../UserAvatar";

// ---------------------------------------------------------------------------
// Extended Comment type that includes embedded ping context from the API
// ---------------------------------------------------------------------------
interface CommentWithContext extends Comment {
    ping?: {
        id: number;
        title: string;
        content: string;
        category?: { id: number; name: string };
        author?: { firstName: string; lastName: string };
        surgeCount?: number;
        createdAt?: string;
        isAnonymous?: boolean;
        anonymousAlias?: string | null;
        anonymousProfilePicture?: string | null;
    };
}

interface HistoryCommentsListProps {
    isLoading?: boolean;
}

const HistoryCommentsList = ({ isLoading: parentIsLoading = false }: HistoryCommentsListProps) => {
    const [comments, setComments] = useState<CommentWithContext[]>([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        userService
            .getMyComments({ page: 1, limit: 20 })
            .then((res) => {
                setComments(res.data as unknown as CommentWithContext[]);
                setHasNextPage(res.pagination.hasNextPage);
            })
            .catch(() => setError("Failed to load your comments"))
            .finally(() => setIsLoading(false));
    }, []);

    const loadMore = async () => {
        const nextPage = page + 1;
        try {
            const res = await userService.getMyComments({ page: nextPage, limit: 20 });
            setComments((prev) => [...prev, ...(res.data as unknown as CommentWithContext[])]);
            setPage(nextPage);
            setHasNextPage(res.pagination.hasNextPage);
        } catch (err) {
            console.error("Failed to load more comments:", err);
        }
    };

    if (parentIsLoading || isLoading || error) {
        return (
            <div className="flex justify-center py-10">
                <LoadingSpinner />
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <EmptyState
                title="No comments yet"
                description="You haven't commented on any pings or waves yet."
            />
        );
    }

    return (
        <div className="flex flex-col gap-[15px]">
            {comments.map((comment) => (
                <CommentedPingCard key={comment.id} comment={comment} />
            ))}
            {hasNextPage && (
                <button
                    onClick={loadMore}
                    className="mt-2 text-sm text-[#F49B31] font-medium self-center cursor-pointer"
                >
                    Load more
                </button>
            )}
        </div>
    );
};

// ---------------------------------------------------------------------------
// CommentedPingCard — compact ping/wave card with user's comment highlighted
// ---------------------------------------------------------------------------
interface CommentedPingCardProps {
    comment: CommentWithContext;
}

const CommentedPingCard = ({ comment }: CommentedPingCardProps) => {
    const ping = comment.ping;

    const pingAuthorName = ping?.isAnonymous && ping?.anonymousAlias
        ? ping.anonymousAlias
        : ping?.author
            ? `${ping.author.firstName} ${ping.author.lastName}`
            : "Anonymous";

    const pingTimestamp = ping?.createdAt
        ? new Date(ping.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";

    const commentTimestamp = new Date(comment.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });

    const categoryName = ping?.category?.name || "";
    const categoryIcon = categoryImages[categoryName];

    return (
        <div className="bg-[#FEFEFE] rounded-[10px] px-5 py-[15px] flex flex-col gap-[13px] w-full">
            {/* ─── Ping header ─────────────────────── */}
            <div className="flex items-center gap-4">
                <UserAvatar
                    user={ping?.author as any}
                    size="lg"
                    responsive
                    bgColor="bg-[#FFC37B]"
                    className="shrink-0"
                />
                <div className="flex flex-col">
                    <span className="font-['Poppins',sans-serif] font-semibold text-[13px] md:text-[15px] text-black leading-normal">
                        {pingAuthorName}
                    </span>
                    <span className="font-['Poppins',sans-serif] font-medium text-[11px] md:text-[13px] text-[#8B8E8D] leading-normal">
                        {pingTimestamp}
                    </span>
                </div>
            </div>

            {/* ─── Category label ─────────────────── */}
            {categoryName && (
                <div className="flex items-center gap-[9px]">
                    {categoryIcon && (
                        <img
                            src={categoryIcon}
                            alt={categoryName}
                            className="w-5 h-5 object-contain"
                        />
                    )}
                    <span className="font-['Poppins',sans-serif] font-medium text-[13px] md:text-[15px] text-[#171717]">
                        {categoryName}
                    </span>
                </div>
            )}

            {/* ─── Ping title ──────────────────────── */}
            {ping?.title && (
                <h3 className="font-['Poppins',sans-serif] font-semibold text-[14px] md:text-[16px] text-black leading-normal">
                    {ping.title}
                </h3>
            )}

            {/* ─── Divider ─────────────────────────── */}
            <div className="border-t border-[#E8E8E8]" />

            {/* ─── User's comment (highlighted) ─────── */}
            <div className="bg-[#FEF5EA] rounded-lg px-[15px] py-2.5 flex flex-col gap-1.5">
                <span className="font-['Poppins',sans-serif] font-semibold text-[11px] text-[#F49B31] uppercase tracking-wide">
                    Your comment · {commentTimestamp}
                </span>
                <p className="font-['Poppins',sans-serif] font-normal text-[13px] md:text-[14px] text-[#171717] leading-normal">
                    {comment.content}
                </p>
                {(comment.replyCount ?? 0) > 0 && (
                    <span className="font-['Poppins',sans-serif] text-[11px] text-[#8B8E8D]">
                        {comment.replyCount}{" "}
                        {comment.replyCount === 1 ? "reply" : "replies"}
                    </span>
                )}
            </div>
        </div>
    );
};

export default HistoryCommentsList;
