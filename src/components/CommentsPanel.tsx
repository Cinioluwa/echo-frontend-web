/**
 * CommentsPanel
 * Figma ref: Right column in desktop detail (3643:8353), bottom section mobile (4139:10022)
 * Phase: 3
 *
 * On desktop: rendered in the right-aside slot of Layout.tsx.
 * On mobile: rendered inline below the wave list in PingDetail.
 */
import { useRef } from "react";
import { CommentsList, CommentInput } from "./Comments";
import type { CommentsListHandle } from "./Comments/CommentsList";

interface Props {
    pingId: string;
    className?: string;
}

const CommentsPanel = ({ pingId, className = "" }: Props) => {
    const commentsListRef = useRef<CommentsListHandle>(null);

    const handleCommentAdded = () => {
        commentsListRef.current?.refresh();
    };

    return (
        <div
            className={`bg-[#FFC37B] rounded-[10px] flex flex-col gap-[15px] p-[15px] w-full ${className}`}
        >
            {/* Header */}
            <h2 className="font-[Poppins,sans-serif] font-semibold text-[20px] text-black">
                Comments
            </h2>

            {/* Scrollable comments list */}
            <div className="flex-1 overflow-y-auto [scrollbar-width:none] max-h-[400px] lg:max-h-[calc(100vh-300px)]">
                <CommentsList
                    ref={commentsListRef}
                    targetType="ping"
                    targetId={pingId}
                />
            </div>

            {/* Comment input */}
            <CommentInput
                targetType="ping"
                targetId={pingId}
                onCommentAdded={handleCommentAdded}
            />
        </div>
    );
};

export default CommentsPanel;
