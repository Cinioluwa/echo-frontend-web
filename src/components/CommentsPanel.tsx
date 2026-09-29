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
import { usePingsStore } from "../stores";

interface Props {
  pingId: string;
  className?: string;
  isDrawer?: boolean;
  initialCount?: number;
}

const CommentsPanel = ({ pingId, className = "", isDrawer = false, initialCount = 0 }: Props) => {
  const commentsListRef = useRef<CommentsListHandle>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [commentsCount, setCommentsCount] = useState(initialCount);
  const updatePing = usePingsStore((state) => state.updatePing);

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

  // Prevent outer page scrolling when there's nothing to scroll in the comment section
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const onWheel = (e: WheelEvent) => {
      const el = scrollContainerRef.current;
      if (!el) return;

      const isScrollable = el.scrollHeight > el.clientHeight + 1;
      if (!isScrollable) {
        // Nothing to scroll through — prevent outer page from scrolling
        e.preventDefault();
      }
    };

    panel.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      panel.removeEventListener("wheel", onWheel);
    };
  }, []);

  const handleCommentAdded = (comment: import("../api/types").Comment) => {
    // Optimistic prepend — no refetch, no loading flash
    commentsListRef.current?.addComment(comment);
    setCommentsCount((prev) => prev + 1);

    const currentPing = usePingsStore.getState().pingsById[pingId];
    if (!currentPing) return;

    const currentComments = currentPing._count?.comments ?? 0;
    updatePing(pingId, {
      _count: {
        ...(currentPing._count || { waves: 0, surges: 0, comments: 0 }),
        comments: currentComments + 1,
      },
    });
  };

  const handleCommentsLoaded = (count: number) => {
    setCommentsCount(count);
    const currentPing = usePingsStore.getState().pingsById[pingId];
    if (currentPing) {
      updatePing(pingId, {
        _count: {
          ...(currentPing._count || { waves: 0, surges: 0, comments: 0 }),
          comments: count,
        },
      });
    }
  };

  const handleCommentDeleted = (_commentId: string | number, newTotal?: number) => {
    const updated = typeof newTotal === "number" ? newTotal : Math.max(0, commentsCount - 1);
    setCommentsCount(updated);

    const currentPing = usePingsStore.getState().pingsById[pingId];
    if (!currentPing) return;

    updatePing(pingId, {
      _count: {
        ...(currentPing._count || { waves: 0, surges: 0, comments: 0 }),
        comments: updated,
      },
    });
  };

  return (
    <div
      ref={panelRef}
      className={`${
        isDrawer ? "bg-[#FFC37B] rounded-t-[30px] h-full" : "bg-[#FFC37B] rounded-[24px] md:rounded-[28px] h-auto"
      } flex flex-col w-full overflow-hidden overscroll-contain ${className}`}
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
        ref={scrollContainerRef}
        className={`flex-1 min-h-0 overflow-y-auto overscroll-contain [scrollbar-width:none] px-[15px] ${
          isDrawer ? "" : "pt-3"
        }`}
      >
        <CommentsList
          ref={commentsListRef}
          targetType="ping"
          targetId={pingId}
          onCommentDeleted={handleCommentDeleted}
          onCommentsLoaded={handleCommentsLoaded}
        />
      </div>

      {/* Comment input */}
      <div
        className={`shrink-0 bg-[#f49b31] ${
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
