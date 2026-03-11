/**
 * HistoryCommentsList
 * Figma ref: 3rd frame in S5 (desktop: 4183:17017), 3rd frame in S6 (mobile: 4183:17018)
 * Phase: 4
 *
 * Content for the "Comments" tab on the History page.
 * Shows pings/waves the user has commented on – compact card with
 * the user's comment highlighted below.
 *
 * TODO: API — GET /api/users/me/comments with pagination
 */

import type { Comment } from "../../api/types";
import { categoryImages } from "../CategoryImages";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { EmptyState } from "../shared/EmptyState";

// ---------------------------------------------------------------------------
// Mock data — replace with /api/users/me/comments once available
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
    };
}

const MOCK_COMMENTS: CommentWithContext[] = [
    {
        id: "c-301",
        content:
            "I totally agree. This has been an issue for over three weeks now. Management needs to act fast.",
        author: {
            id: 1,
            firstName: "Felix",
            lastName: "Oluwapelumi",
            email: "felix@echo.com",
            role: "USER",
            organizationId: 1,
            status: "ACTIVE",
            createdAt: "2024-01-01T00:00:00.000Z",
        },
        targetType: "ping",
        targetId: "1",
        replyCount: 2,
        createdAt: "2024-03-01T08:30:00.000Z",
        updatedAt: "2024-03-01T08:30:00.000Z",
        ping: {
            id: 1,
            title: "The water is not stable in the halls",
            content:
                "The water supply in the halls has been inconsistent for the past few weeks.",
            category: { id: 4, name: "Hall" },
            author: { firstName: "Isaac", lastName: "Israel" },
            surgeCount: 674,
            createdAt: "2024-02-29T21:30:00.000Z",
        },
    },
    {
        id: "c-302",
        content:
            "Can we escalate this to the facilities committee? There should be a timeline for repair.",
        author: {
            id: 1,
            firstName: "Felix",
            lastName: "Oluwapelumi",
            email: "felix@echo.com",
            role: "USER",
            organizationId: 1,
            status: "ACTIVE",
            createdAt: "2024-01-01T00:00:00.000Z",
        },
        targetType: "ping",
        targetId: "2",
        replyCount: 0,
        createdAt: "2024-03-11T10:15:00.000Z",
        updatedAt: "2024-03-11T10:15:00.000Z",
        ping: {
            id: 2,
            title: "The chapel PA system needs urgent repair",
            content: "During last Sunday's service, the speakers were crackling badly.",
            category: { id: 3, name: "Chapel" },
            author: { firstName: "Emmanuel", lastName: "Okonkwo" },
            surgeCount: 312,
            createdAt: "2024-03-10T09:00:00.000Z",
        },
    },
];
// ---------------------------------------------------------------------------

interface HistoryCommentsListProps {
    isLoading?: boolean;
}

const HistoryCommentsList = ({ isLoading = false }: HistoryCommentsListProps) => {
    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <LoadingSpinner />
            </div>
        );
    }

    if (MOCK_COMMENTS.length === 0) {
        return (
            <EmptyState
                title="No comments yet"
                description="You haven't commented on any pings or waves yet."
            />
        );
    }

    return (
        <div className="flex flex-col gap-[15px]">
            {MOCK_COMMENTS.map((comment) => (
                <CommentedPingCard key={comment.id} comment={comment} />
            ))}
            {/* TODO: API — pagination when /api/users/me/comments is integrated */}
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

    const pingAuthorName = ping?.author
        ? `${ping.author.firstName} ${ping.author.lastName}`
        : "Anonymous";

    const pingAuthorInitials = pingAuthorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

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
                <div className="w-10 h-10 md:w-[53px] md:h-[53px] rounded-full bg-[#FFC37B] flex items-center justify-center shrink-0">
                    <span className="font-['Poppins',sans-serif] font-bold text-[14px] md:text-[18px] text-white">
                        {pingAuthorInitials}
                    </span>
                </div>
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
                {comment.replyCount > 0 && (
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
