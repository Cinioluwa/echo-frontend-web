import type { Comment } from "../../api/types";
import { useState } from "react";
import api from "../../api/axios.config";
// import { useSurgeStore } from "../../stores";


interface Props {
    comment: Comment;
    onRefresh?: () => void;
}

const CommentItem = ({ comment, onRefresh: _onRefresh }: Props) => {
    // Surge state for comment
    // Initialize with comment data if available, otherwise fallback to 0/false
    const [localSurgeCount, setLocalSurgeCount] = useState<number>(
        comment.surgeCount ?? 0
    );
    const [localHasSurged, setLocalHasSurged] = useState<boolean>(
        false // Backend does not provide hasSurged for comments yet
    );
    const [isToggling, setIsToggling] = useState(false);
    // Surge logic for comments
    const handleSurge = async () => {
        if (isToggling) return;
        setIsToggling(true);
        try {
            // POST /api/comments/:commentId/surge
            const response = await api.post<{ message: string; surged: boolean; surgeCount?: number }>(
                `/comments/${comment.id}/surge`
            );
            const data = response.data;
            setLocalHasSurged(data.surged);
            setLocalSurgeCount(
                typeof data.surgeCount === "number"
                    ? data.surgeCount
                    : data.surged
                        ? localSurgeCount + 1
                        : Math.max(0, localSurgeCount - 1)
            );
            _onRefresh?.();
        } catch (err) {
            console.error("Error toggling comment surge:", err);
        } finally {
            setIsToggling(false);
        }
    };
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
        !comment.author
            ? "Anonymous"
            : typeof comment.author === "string"
                ? comment.author
                : `${comment.author.firstName ?? ""} ${comment.author.lastName ?? ""}`.trim() || "Anonymous";

    return (
        <div className="flex flex-col gap-2.5 bg-white p-2 rounded-xl">
            {/* User info */}
            <div className="flex items-center gap-2">
                {/* Avatar */}
                <div className="w-6 h-6 rounded-full bg-[#f49b31] overflow-hidden flex items-center justify-center">
                    <span className="text-xs text-white font-semibold">
                        {authorName.charAt(0).toUpperCase()}
                    </span>
                </div>

                {/* User details */}
                <div className="flex items-center gap-2 justify-between w-full">
                    <p className="text-sm font-semibold ">{authorName}</p>
                    <p className="text-xs ">{formatTimestamp(comment.createdAt)}</p>
                </div>
            </div>

            <div className="flex justify-between items-end gap-1">
                {/* Comment content */}
                <p className="text-base leading-6 whitespace-pre-wrap">
                    {comment.content}
                </p>

                {/* Surge button */}
                <button
                    type="button"
                    onClick={handleSurge}
                    disabled={isToggling}
                    aria-label={localHasSurged ? "Remove surge" : "Surge"}
                    className={`flex items-center w-12 h-10 gap-[3px] px-2.5 py-[7px] rounded-[15px] border border-black cursor-pointer transition-colors disabled:opacity-50 ${localHasSurged
                        ? "bg-[#f49b31] text-white border-[#f49b31]"
                        : "bg-[#fef5ea] text-[#4a504e]"
                        }`}
                >
                    <svg
                        width="15"
                        height="19"
                        viewBox="0 0 12 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M6.5 1L1 9h5l-0.5 6 6-8H7l0.5-6z"
                            fill={localHasSurged ? "white" : "#4A504E"}
                        />
                    </svg>
                    <span className="font-['Poppins',sans-serif] font-semibold text-[11px]">
                        {localSurgeCount}
                    </span>
                </button>
            </div>

        </div>
    );
};

export default CommentItem;
