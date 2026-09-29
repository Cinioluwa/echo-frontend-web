import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { commentService } from "../../api/services";
import type { Comment } from "../../api/types";
import CommentItem from "./CommentItem";

interface Props {
    targetType: "ping" | "wave";
    targetId: string;
    onCommentDeleted?: (commentId: string | number, newTotal?: number) => void;
    onCommentsLoaded?: (totalCount: number, comments: Comment[]) => void;
}

export interface CommentsListHandle {
    refresh: (silent?: boolean) => void;
    addComment: (comment: Comment) => void;
    removeComment: (commentId: string | number) => void;
    getCommentsCount: () => number;
}

const CommentsList = forwardRef<CommentsListHandle, Props>(({ targetType, targetId, onCommentDeleted, onCommentsLoaded }, ref) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
    const [hasLoadError, setHasLoadError] = useState(false);

    const calcTotalCount = (list: Comment[]) => {
        return list.reduce((acc, c) => {
            const repliesCount = c.replyCount ?? (Array.isArray(c.replies) ? c.replies.length : 0);
            return acc + 1 + repliesCount;
        }, 0);
    };

    const fetchComments = async (silent = false) => {
        if (!silent && !hasLoadedOnce) {
            setIsLoading(true);
        }
        setHasLoadError(false);

        try {
            // Using the API endpoint structure: /pings/:pingId/comments or /waves/:waveId/comments
            const response = await commentService.getComments(targetType, targetId, {
                page: 1,
                limit: 50,
            });

            const loaded: Comment[] = response.data || [];
            setComments(loaded);
            setHasLoadedOnce(true);

            const count = calcTotalCount(loaded);
            onCommentsLoaded?.(count, loaded);
        } catch (err) {
            console.error("Failed to fetch comments:", err);
            if (!silent && !hasLoadedOnce) {
                setHasLoadError(true);
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        setHasLoadedOnce(false);
        fetchComments();
    }, [targetType, targetId]);

    const handleDeleteComment = (commentId: string | number) => {
        setComments((prev) => {
            const next = prev.filter((c) => String(c.id) !== String(commentId));
            const count = calcTotalCount(next);
            onCommentDeleted?.(commentId, count);
            return next;
        });
    };

    // Expose refresh, optimistic-add, and optimistic-remove to parent
    useImperativeHandle(ref, () => ({
        refresh: (silent = true) => fetchComments(silent),
        addComment: (comment: Comment) => setComments((prev) => [comment, ...prev]),
        removeComment: (commentId: string | number) => handleDeleteComment(commentId),
        getCommentsCount: () => calcTotalCount(comments),
    }));

    if (isLoading && !hasLoadedOnce) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F49B31]"></div>
            </div>
        );
    }

    if (hasLoadError && !hasLoadedOnce) {
        return (
            <div className="flex flex-col items-center justify-center gap-1.5 py-7 text-center">
                <p className="text-[14px] text-white">Failed to load comments</p>
                <button
                    onClick={() => fetchComments(false)}
                    className="text-xs text-white underline hover:opacity-80"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center gap-1.5 py-7 md:py-8 text-center">
                <p className="text-[15px] font-semibold text-white tracking-wide">No comments yet</p>
                <p className="text-[13px] font-medium text-white/90">Be the first to comment!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-[15px] pr-1">
            {comments.map((comment) => (
                <CommentItem
                    key={comment.id}
                    comment={comment}
                    onRefresh={() => fetchComments(true)}
                    onDelete={handleDeleteComment}
                    pingId={targetId}
                />
            ))}
        </div>
    );
});

CommentsList.displayName = "CommentsList";

export default CommentsList;
