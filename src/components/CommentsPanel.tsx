/**
 * CommentsPanel
 * Figma ref: Right column in desktop detail (3643:8353), bottom section mobile (4139:10022)
 * Phase: 3
 *
 * On desktop: rendered in the right-aside slot of Layout.tsx.
 * On mobile: rendered inline below the wave list in PingDetail.
 */
import { useRef, useState, useEffect } from "react";
import { CommentsList, CommentInput } from "./Comments";
import type { CommentsListHandle } from "./Comments/CommentsList";

interface Props {
  pingId: string;
  className?: string;
  isDrawer?: boolean;
  initialCount?: number;
}

const CommentsPanel = ({ pingId, className = "", isDrawer = false, initialCount = 0 }: Props) => {
  const commentsListRef = useRef<CommentsListHandle>(null);
  const [commentsCount, setCommentsCount] = useState(initialCount);

  // Update count when comments list is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setCommentsCount(prev => Math.max(prev, commentsListRef.current?.getCommentsCount() ?? 0));
    }, 100); // Small delay to let CommentsList load first

    return () => clearTimeout(timer);
  }, [pingId]);

  useEffect(() => {
      if (initialCount > commentsCount) {
          setCommentsCount(initialCount);
      }
  }, [initialCount, commentsCount]);

  const handleCommentAdded = (comment: import("../api/types").Comment) => {
    // Optimistic prepend — no refetch, no loading flash
    commentsListRef.current?.addComment(comment);
    setCommentsCount((prev) => prev + 1);
  };

  return (
    <div
      className={`${
        isDrawer ? "bg-[#FFC37B] rounded-t-[30px]" : "bg-[#FFC37B] rounded-[10px]"
      } flex flex-col h-full w-full overflow-hidden ${className}`}
    >
      {/* Header */}
      <h2
        className={`font-[Poppins,sans-serif] font-semibold text-white shrink-0 ${
          isDrawer
            ? "text-center mb-2 text-[20px] pt-[15px] px-[15px]"
            : "px-[15px] pt-[17px] bg-[#f49b31] text-lg pb-1.5"
        }`}
      >
        Comments
        <span className="ms-1.5 text-[#626665]">{commentsCount}</span>
      </h2>

      {/* Scrollable comments list */}
      <div
        className={`flex-1 overflow-y-auto [scrollbar-width:none] px-[15px] ${
          isDrawer ? "" : "min-h-0 pt-3"
        }`}
      >
        <CommentsList
          ref={commentsListRef}
          targetType="ping"
          targetId={pingId}
        />
      </div>

      {/* Comment input */}
      <div
        className={`shrink-0 ${
          isDrawer ? "px-[15px] py-[15px] border-t border-[#e8b35b]" : ""
        }`}
      >
        <CommentInput
          targetType="ping"
          targetId={pingId}
          onCommentAdded={handleCommentAdded}
        />
      </div>
    </div>
  );
};

export default CommentsPanel;
