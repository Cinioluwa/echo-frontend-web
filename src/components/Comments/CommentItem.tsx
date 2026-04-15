import type { Comment } from "../../api/types";
import { useState } from "react";
import { Send } from "lucide-react";
import api from "../../api/axios.config";
import UserAvatar from "../UserAvatar";
import { useAuthStore } from "../../stores/auth/useAuthStore";
import { commentService } from "../../api/services";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import CommentActionsDropdown from "./CommentActionsDropdown";

interface Props {
    comment: Comment;
    onRefresh?: () => void;
    pingId: string;
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
            return diffInMinutes <= 1 ? "Just now" : `${diffInMinutes}m`;
        }
        return diffInHours === 1 ? "1h" : `${diffInHours}h`;
    }
    if (diffInDays === 1) return "1d";
    if (diffInDays < 7) return `${diffInDays}d`;
    if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return weeks === 1 ? "1w" : `${weeks}w`;
    }
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? "1mo" : `${months}mo`;
};

const getAuthorName = (comment: Comment) => {
    // If anonymous, use the alias
    if (comment.isAnonymous && comment.anonymousAlias) {
        return comment.anonymousAlias;
    }
    // Otherwise use the author's name
    if (comment.author && typeof comment.author === "object") {
        return `${comment.author.firstName ?? ""} ${comment.author.lastName ?? ""}`.trim() || "Anonymous";
    }
    return "Anonymous";
};

// ─── CommentItem Component ──────────────────────────────────────────────────

const CommentItem = ({ comment, onRefresh: _onRefresh, pingId }: Props) => {
    const { user } = useAuthStore();
    const [localSurgeCount, setLocalSurgeCount] = useState<number>(
        comment.surgeCount ?? 0
    );
    const [localHasSurged, setLocalHasSurged] = useState<boolean>(
        comment.hasSurged ?? false
    );
    const [isToggling, setIsToggling] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isRepliesExpanded, setIsRepliesExpanded] = useState(false);
    const [replies, setReplies] = useState<Comment[]>([]);
    const [replyInput, setReplyInput] = useState("");
    const [isPostingReply, setIsPostingReply] = useState(false);

    // Use API's isOwner field for anonymous comments, calculate ownership for non-anonymous
    const isOwner = comment.isAnonymous
        ? (comment.isOwner ?? false)
        : (user?.id === (typeof comment.author === "object" ? comment.author?.id : undefined));
    // Anonymous comments cannot be deleted, even by their author
    const canDelete = isOwner && !comment.isAnonymous;
    const authorName = getAuthorName(comment);

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

    const handleDelete = async () => {
        if (isDeleting || !isOwner || comment.isAnonymous) return;
        setIsDeleting(true);
        try {
            await commentService.deleteComment(String(comment.id));
            setShowDeleteModal(false);
            _onRefresh?.();
        } catch (err) {
            console.error("Error deleting comment:", err);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleShowDeleteModal = () => {
        setShowDeleteModal(true);
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    const handleToggleReplies = () => {
        if (isRepliesExpanded) {
            setIsRepliesExpanded(false);
            return;
        }

        // Expand replies section - replies already loaded from initial comment fetch
        setIsRepliesExpanded(true);
        setReplies(comment.replies || []);
    };

    const handlePostReply = async () => {
        if (!replyInput.trim()) return;

        setIsPostingReply(true);
        try {
            const newReply = await commentService.replyToPingComment(
                pingId,
                String(comment.id),
                replyInput,
                false
            );
            setReplies([...replies, newReply]);
            setReplyInput("");
            _onRefresh?.();
        } catch (err) {
            console.error("Error posting reply:", err);
        } finally {
            setIsPostingReply(false);
        }
    };

    return (
        <>
            <div className="bg-white border border-[#f49b31] rounded-xl p-[7px] w-full overflow-visible" data-node-id="4925:13685">
                <div className="flex gap-[5px] items-start" data-node-id="4923:13601">
                    {/* Avatar */}
                    <div className="shrink-0 size-[23px]" data-node-id="4923:13602">
                        <UserAvatar
                            user={typeof comment.author === "object" ? comment.author : null}
                            size="sm"
                            bgColor="bg-[#f49b31]"
                            pictureUrl={
                                comment.isAnonymous && comment.anonymousProfilePicture
                                    ? comment.anonymousProfilePicture
                                    : undefined
                            }
                        />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-[5px] items-start flex-1 min-w-0" data-node-id="4923:13603">
                        {/* Info row with name, timestamp, and dots button */}
                        <div className="flex items-start justify-between w-full" data-node-id="4923:13604">
                            <div className="flex flex-col gap-0.5" data-node-id="5145:14071">
                                <p className="text-[10px] font-['Poppins',sans-serif] font-semibold text-black leading-none">
                                    {authorName}
                                </p>
                                <p className="text-[8px] font-['Poppins',sans-serif] font-medium text-[#454545] leading-none">
                                    {formatTimestamp(comment.createdAt)}
                                </p>
                            </div>

                            {/* Dots vertical button with dropdown */}
                            <CommentActionsDropdown
                                commentId={comment.id}
                                pingId={pingId}
                                isOwner={canDelete}
                                onDelete={handleShowDeleteModal}
                            />
                        </div>

                        {/* Body */}
                        <div className="flex flex-col gap-[5px] w-full">
                            <p className="text-[9px] font-['Poppins',sans-serif] font-normal text-black leading-normal wrap-break-word">
                                {comment.content}
                            </p>

                            {/* Surge and Comment buttons */}
                            <div className="flex gap-[5px] items-center">
                                {/* Surge button */}
                                <button
                                    type="button"
                                    onClick={handleSurge}
                                    disabled={isToggling}
                                    aria-label={localHasSurged ? "Remove surge" : "Surge"}
                                    className={`flex items-center gap-[2.25px] px-[7.5px] py-[5.25px] rounded-[18px] border-[0.75px] border-black cursor-pointer transition-all duration-200 disabled:opacity-50 text-[9px] font-['Baloo_Bhai_2',sans-serif] font-bold uppercase leading-none ${localHasSurged ? "bg-[#f49b31] text-white border-[#f49b31]" : "bg-white text-black"
                                        }`}
                                    data-node-id="4923:13612"
                                >
                                    <svg
                                        width="7.5"
                                        height="12"
                                        viewBox="0 0 8 13"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="shrink-0"
                                    >
                                        <path
                                            d="M4 1L0.5 7.5H3.5V12L7.5 5.5H4.5L4 1Z"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <span>{localSurgeCount}</span>
                                </button>

                                {/* Comment button */}
                                <button
                                    type="button"
                                    onClick={handleToggleReplies}
                                    aria-label="View replies or write a reply"
                                    className="flex items-center gap-[2.5px] px-[7.5px] py-[5.25px] rounded-[13.5px] border-[0.75px] border-black bg-white text-black cursor-pointer text-[9px] font-['Baloo_Bhai_2',sans-serif] font-bold uppercase leading-none transition-all duration-200"
                                    data-node-id="4923:13613"
                                >
                                    <img src="/assets/icon/comment.svg" alt="Comment icon" className="w-[7.5px] h-3 shrink-0" style={{ filter: 'brightness(0)' }} />
                                    <span>{comment.replyCount ?? 0}</span>
                                </button>
                            </div>
                        </div>

                        {/* Replies Section - Expanded below parent comment */}
                        {isRepliesExpanded && (
                            <div className="flex flex-col gap-[5px] items-start flex-1 w-full mt-[5px]">
                                {/* Replies list */}
                                {replies.length > 0 && (
                                    <div className="w-full flex flex-col gap-[5px]">
                                        {replies.map((reply) => (
                                            <ReplyItem key={reply.id} reply={reply} />
                                        ))}
                                    </div>
                                )}

                                {/* Reply input */}
                                <div className="self-stretch pl-1.5 inline-flex justify-center items-center gap-[5px] mt-[5px] w-full">
                                    <div className="flex justify-start items-center gap-4">
                                        <UserAvatar
                                            user={user && typeof user === "object" ? user : null}
                                            size="sm"
                                            bgColor="bg-[#f49b31]"
                                        />
                                    </div>
                                    <div className="flex-1 h-6 px-2.5 bg-white rounded-[30px] border-[0.75px] border-black flex justify-between items-center gap-2.5">
                                        <input
                                            type="text"
                                            value={replyInput}
                                            onChange={(e) => setReplyInput(e.target.value)}
                                            disabled={isPostingReply}
                                            placeholder="Reply"
                                            className="flex-1 bg-transparent text-black text-[9px] font-normal font-['Poppins'] outline-none placeholder-neutral-500 disabled:opacity-50"
                                        />
                                        <button
                                            type="button"
                                            onClick={handlePostReply}
                                            disabled={isPostingReply || !replyInput.trim()}
                                            aria-label="Send reply"
                                            className="flex items-center justify-center shrink-0 disabled:opacity-50 enabled:hover:text-[#f49b31] transition-colors"
                                        >
                                            <Send size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showDeleteModal && (
                <DeleteConfirmationModal
                    onConfirm={handleDelete}
                    onCancel={handleCancelDelete}
                    isLoading={isDeleting}
                    itemType="Comment"
                />
            )}
        </>
    );
};

export default CommentItem;

// ─── ReplyItem Component ────────────────────────────────────────────────────

interface ReplyItemProps {
    reply: Comment;
}

const ReplyItem = ({ reply }: ReplyItemProps) => {
    const [replyLocalSurgeCount, setReplyLocalSurgeCount] = useState<number>(
        reply.surgeCount ?? 0
    );
    const [replyLocalHasSurged, setReplyLocalHasSurged] = useState<boolean>(
        reply.hasSurged ?? false
    );
    const [isReplyToggling, setIsReplyToggling] = useState(false);

    const replyAuthorName = getAuthorName(reply);

    const handleReplySurge = async () => {
        if (isReplyToggling) return;
        setIsReplyToggling(true);
        try {
            const response = await api.post<{
                message: string;
                surged: boolean;
                surgeCount?: number;
            }>(`/comments/${reply.id}/surge`);
            const data = response.data;
            setReplyLocalHasSurged(data.surged);
            setReplyLocalSurgeCount(
                typeof data.surgeCount === "number"
                    ? data.surgeCount
                    : data.surged
                        ? replyLocalSurgeCount + 1
                        : Math.max(0, replyLocalSurgeCount - 1)
            );
        } catch (err) {
            console.error("Error toggling reply surge:", err);
        } finally {
            setIsReplyToggling(false);
        }
    };

    return (
        <div className="bg-white rounded-xl p-1.5 w-full flex gap-[5px] items-start">
            {/* Reply Avatar */}
            <div className="shrink-0 size-[23px]">
                <UserAvatar
                    user={typeof reply.author === "object" ? reply.author : null}
                    size="sm"
                    bgColor="bg-[#f49b31]"
                    pictureUrl={
                        reply.isAnonymous && reply.anonymousProfilePicture
                            ? reply.anonymousProfilePicture
                            : undefined
                    }
                />
            </div>

            {/* Reply Content */}
            <div className="flex-1 flex flex-col gap-[5px] items-start min-w-0">
                <div className="flex flex-col gap-0.5 w-full">
                    <p className="text-[10px] font-['Poppins',sans-serif] font-semibold text-black leading-none">
                        {replyAuthorName}
                    </p>
                    <p className="text-[8px] font-['Poppins',sans-serif] font-medium text-[#454545] leading-none">
                        {formatTimestamp(reply.createdAt)}
                    </p>
                </div>

                <p className="text-[9px] font-['Poppins',sans-serif] font-normal text-black leading-normal wrap-break-word w-full">
                    {reply.content}
                </p>

                {/* Reply Surge button only (no reply button - one level deep) */}
                <button
                    type="button"
                    onClick={handleReplySurge}
                    disabled={isReplyToggling}
                    aria-label={replyLocalHasSurged ? "Remove surge" : "Surge"}
                    className={`flex items-center gap-[2.25px] px-[7.5px] py-[5.25px] rounded-[18px] border-[0.75px] border-black cursor-pointer transition-all duration-200 disabled:opacity-50 text-[9px] font-['Baloo_Bhai_2',sans-serif] font-bold uppercase leading-none ${replyLocalHasSurged
                        ? "bg-[#f49b31] text-white border-[#f49b31]"
                        : "bg-white text-black"
                        }`}
                >
                    <svg
                        width="7.5"
                        height="12"
                        viewBox="0 0 8 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="shrink-0"
                    >
                        <path
                            d="M4 1L0.5 7.5H3.5V12L7.5 5.5H4.5L4 1Z"
                            fill="currentColor"
                        />
                    </svg>
                    <span>{replyLocalSurgeCount}</span>
                </button>
            </div>
        </div>
    );
};
