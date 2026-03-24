import type { Comment } from "../../api/types";
import { useState } from "react";
import api from "../../api/axios.config";
import UserAvatar from "../UserAvatar";
// import { useSurgeStore } from "../../stores";

interface Props {
    comment: Comment;
    onRefresh?: () => void;
}

// ─── Helper Functions (Module-level for performance) ───────────────────────

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

const getAuthorName = (author: Comment["author"]) => {
    if (!author) return "Anonymous";
    if (typeof author === "string") return author;
    return `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim() || "Anonymous";
};

// ─── CommentItem Component ──────────────────────────────────────────────────

const CommentItem = ({ comment, onRefresh: _onRefresh }: Props) => {
    const [localSurgeCount, setLocalSurgeCount] = useState<number>(
        comment.surgeCount ?? 0
    );
    const [localHasSurged, setLocalHasSurged] = useState<boolean>(
        comment.hasSurged ?? false
    );
    const [isToggling, setIsToggling] = useState(false);

    const handleSurge = async () => {
        if (isToggling) return;
        setIsToggling(true);
        try {
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
        } catch (err) {
            console.error("Error toggling comment surge:", err);
        } finally {
            setIsToggling(false);
        }
    };

    const authorName = getAuthorName(comment.author);

    return (
        <div className="flex flex-col gap-2.5 bg-white p-2 rounded-xl">
            {/* User info */}
            <div className="flex items-center gap-2">
                {/* Avatar */}
                <UserAvatar
                    user={typeof comment.author === "object" ? comment.author : null}
                    size="sm"
                    bgColor="bg-[#f49b31]"
                />

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
                    className={`flex items-center w-12 h-10 gap-[3px] px-2.5 py-[7px] rounded-[15px] border border-black cursor-pointer transition-colors duration-300 disabled:opacity-50 ${localHasSurged || comment.hasSurged
                        ? "bg-[#f49b31] text-white border-[#f49b31]"
                        : "bg-[#fef5ea] text-[#4a504e]"
                        }`}
                    style={{ transition: 'background-color 0.3s, color 0.3s, border-color 0.3s' }}
                >
                    <svg
                        width="15"
                        height="19"
                        viewBox="0 0 12 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        style={{ transition: 'filter 0.3s' }}
                    >
                        <path
                            d="M6.5 1L1 9h5l-0.5 6 6-8H7l0.5-6z"
                            fill={localHasSurged || comment.hasSurged ? "white" : "#4A504E"}
                            style={{ transition: 'fill 0.3s' }}
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
