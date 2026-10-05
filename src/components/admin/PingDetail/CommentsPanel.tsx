import React, { useState } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, X } from "lucide-react";
import UserAvatar from "../../UserAvatar";
import type { Comment } from "../../../api/types";

interface AdminCommentsPanelProps {
    comments: Comment[];
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

            </div>
        </div>
    );
};

const AdminCommentsPanel: React.FC<AdminCommentsPanelProps> = ({ comments }) => {
    const [open, setOpen] = React.useState(false);
    const topLevelComments = comments.filter(
        (c) => !c.parentCommentId || c.parentCommentId === null
    );

    const commentsWithReplies: CommentWithReplies[] = topLevelComments.map((comment) => ({
        ...comment,
        replies: comments.filter((c) => c.parentCommentId === comment.id),
    }));

    React.useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        document.addEventListener("keydown", onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", onKey);
            document.body.style.overflow = prev;
        };
    }, [open]);

    const visible = commentsWithReplies.slice(0, 2);

    return (
        <div className="flex flex-col overflow-hidden rounded-[24px] bg-[#ffc37b] md:rounded-[28px]">
            <h3 className="bg-[#f49b31] px-[14px] py-4 font-poppins text-lg font-semibold text-white">
                Comments
                <span className="ms-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-[13px] font-semibold leading-none tabular-nums text-[#f49b31]">
                    {commentsWithReplies.length}
                </span>
            </h3>
            <div className="flex flex-col gap-2 px-3 pt-3 pb-3">
                {visible.length === 0 ? (
                    <p className="py-4 text-center text-[13px] text-white">No comments yet</p>
                ) : (
                    visible.map((comment) => <CommentCard key={comment.id} comment={comment} />)
                )}
            </div>
            {commentsWithReplies.length > 2 && (
                <div className="flex justify-center bg-[#f49b31] p-3">
                    <button
                        onClick={() => setOpen(true)}
                        className="rounded-[20px] border border-[#ffcd84] bg-white px-4 py-2 font-poppins text-[13px] font-semibold text-[#f49b31]"
                    >
                        View all {commentsWithReplies.length} Comments →
                    </button>
                </div>
            )}

            {open &&
                createPortal(
                    <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center">
                        <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
                        <div className="relative flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-[24px] bg-[#ffc37b] md:max-h-[80vh] md:max-w-[520px] md:rounded-[20px]">
                            <div className="flex items-center justify-between bg-[#f49b31] px-[14px] py-4">
                                <h3 className="font-poppins text-lg font-semibold text-white">
                                    Comments
                                    <span className="ms-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-[13px] font-semibold leading-none tabular-nums text-[#f49b31]">
                                        {commentsWithReplies.length}
                                    </span>
                                </h3>
                                <button
                                    onClick={() => setOpen(false)}
                                    aria-label="Close comments"
                                    className="rounded-full p-1 text-white hover:bg-white/20"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex flex-col gap-2 overflow-y-auto px-3 pt-3 pb-4">
                                {commentsWithReplies.map((comment) => (
                                    <CommentCard key={comment.id} comment={comment} />
                                ))}
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </div>
    );
};
export default AdminCommentsPanel;
