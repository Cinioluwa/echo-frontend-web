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
}

const CommentsPanel = ({ pingId, className = "", isDrawer = false }: Props) => {
  const commentsListRef = useRef<CommentsListHandle>(null);
  const [commentsCount, setCommentsCount] = useState(0);

  // Update count when comments list is ready
  useEffect(() => {
    const timer = setTimeout(() => {
      setCommentsCount(commentsListRef.current?.getCommentsCount() ?? 0);
    }, 100); // Small delay to let CommentsList load first

    return () => clearTimeout(timer);
  }, [pingId]);

  const handleCommentAdded = () => {
    commentsListRef.current?.refresh();
    // Update count from the list
    setCommentsCount(commentsListRef.current?.getCommentsCount() ?? 0);
  };

  return (
    <div
      className={`${"bg-[#FFC37B] rounded-[10px] flex flex-col h-full w-full"}`}>
      <div
        className={`${isDrawer
          ? "bg-[#FFC37B] rounded-t-[30px] flex flex-col h-full w-full p-0 "
          : "bg-[#FFC37B] rounded-[10px] flex flex-col gap-[15px] w-full"
          } ${className}`}
      >
        {/* Header */}
        <h2
          className={`font-[Poppins,sans-serif] font-semibold text-white ${isDrawer ? "text-center mb-2 text-[20px]" : "px-[15px] pt-[17px] bg-[#f49b31] rounded-t-[10px] text-lg pb-1.5"}`}
        >
          Comments
          <span className="ms-1.5 text-[#626665]">{commentsCount}</span>
        </h2>

        {/* Scrollable comments list */}
        <div
          className={`flex-1 overflow-y-auto [scrollbar-width:none] ${isDrawer
            ? "px-[15px] py-0"
            : "max-h-[400px] lg:max-h-[calc(100vh-400px)] h-fit px-[15px]"}
            }`}
        >
          <CommentsList
            ref={commentsListRef}
            targetType="ping"
            targetId={pingId}
          />
        </div>

      </div>
      {/* Comment input */}
      <div
        className={
          isDrawer ? "px-[15px] py-[15px] border-t border-[#e8b35b]" : ""
        }
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
