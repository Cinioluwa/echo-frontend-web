import { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { commentService } from "../../api/services";
import type { Comment } from "../../api/types";
import CommentItem from "./CommentItem";

interface Props {
    targetType: "ping" | "wave";
    targetId: string;
}

export interface CommentsListHandle {
    refresh: () => void;
    addComment: (comment: Comment) => void;
    getCommentsCount: () => number;
}

const CommentsList = forwardRef<CommentsListHandle, Props>(({ targetType, targetId }, ref) => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchComments = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Using the API endpoint structure: /pings/:pingId/comments or /waves/:waveId/comments
            const response = await commentService.getComments(targetType, targetId, {
                page: 1,
                limit: 20,
            });

            setComments(response.data);
            // Use totalItems as defined in PaginatedResponse type
        } catch (err) {
            console.error("Failed to fetch comments:", err);
            setError("Failed to load comments");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, [targetType, targetId]);

    // Expose refresh and optimistic-add to parent
    useImperativeHandle(ref, () => ({
        refresh: fetchComments,
        addComment: (comment: Comment) => setComments((prev) => [comment, ...prev]),
        getCommentsCount: () => comments.length,
    }));

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F49B31]"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center gap-2 py-8">
                <p className="text-sm text-red-500">{error}</p>
                <button
                    onClick={fetchComments}
                    className="text-sm text-[#F49B31] hover:underline"
                >
                    Try again
                </button>
            </div>
        );
    }

    if (comments.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-8">
                <p className="text-sm text-[#9191A8]">No comments yet</p>
                <p className="text-xs text-[#9191A8]">Be the first to comment!</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-[15px] ">
            {/* Comments list - scrollable */}
            <div className="flex flex-col gap-[15px] max-h-[300px] overflow-y-visible pr-2">
                {comments.map((comment) => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onRefresh={fetchComments}
                        pingId={targetId}
                    />
                ))}
            </div>
        </div>
    );
});

CommentsList.displayName = "CommentsList";

export default CommentsList;
