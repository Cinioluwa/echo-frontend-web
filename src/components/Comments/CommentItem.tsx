import type { Comment } from "../../api/types";
import CommentRepliesIndicator from "./CommentRepliesIndicator";

interface Props {
    comment: Comment;
    onRefresh?: () => void;
}

const CommentItem = ({ comment, onRefresh: _onRefresh }: Props) => {
    // Format timestamp
    const formatTimestamp = (dateString: string) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInMs = now.getTime() - date.getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) {
            const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
            if (diffInHours === 0) {
                const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
                return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes} minutes ago`;
            }
            return diffInHours === 1 ? "1 hour ago" : `${diffInHours} hours ago`;
        }
        if (diffInDays === 1) return "1 day ago";
        if (diffInDays < 7) return `${diffInDays} days ago`;
        if (diffInDays < 30) {
            const weeks = Math.floor(diffInDays / 7);
            return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
        }
        const months = Math.floor(diffInDays / 30);
        return months === 1 ? "1 month ago" : `${months} months ago`;
    };

    // Get author name
    const authorName =
        typeof comment.author === "string"
            ? comment.author
            : `${comment.author.firstName} ${comment.author.lastName}`;

    return (
        <div className="flex flex-col gap-2">
            {/* User info */}
            <div className="flex items-center gap-2">
                {/* Avatar */}
                <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center">
                    <span className="text-xs text-gray-600 font-semibold">
                        {authorName.charAt(0).toUpperCase()}
                    </span>
                </div>

                {/* User details */}
                <div className="flex items-center gap-2 justify-between w-full">
                    <p className="text-sm font-semibold ">{authorName}</p>
                    <p className="text-xs ">
                        {formatTimestamp(comment.createdAt)}
                    </p>
                </div>
            </div>

            {/* Comment content */}
            <p className="text-base leading-6 whitespace-pre-wrap">
                {comment.content}
            </p>

            {/* Replies indicator */}
            {comment.replyCount > 0 && (
                <CommentRepliesIndicator
                    replyCount={comment.replyCount}
                    commentId={comment.id}
                />
            )}
        </div>
    );
};

export default CommentItem;
