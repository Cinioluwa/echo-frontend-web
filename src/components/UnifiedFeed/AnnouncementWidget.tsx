/**
 * AnnouncementWidget
 * Figma ref: 3843:12491 (Default & Expanded variants)
 *
 * "GENERAL ANNOUNCEMENT" card shown in the feed (below the ping creator)
 * and on the admin soundboard. Header with megaphone icon + published time,
 * title, description with "Show more" toggle, and the author.
 */

import { useState } from "react";
import { Megaphone } from "lucide-react";
import type { Announcement } from "../../api/types";
import formatTimeAgo from "../../utils/formatTimeAgo";

interface AnnouncementWidgetProps {
  announcement?: Announcement | null;
  className?: string;
}

const PREVIEW_LENGTH = 160;

const AnnouncementWidget = ({
  announcement = null,
  className = "",
}: AnnouncementWidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!announcement) return null;

  const isLong = announcement.content.length > PREVIEW_LENGTH;

  return (
    <div
      className={`bg-white border border-[#FFC37B] overflow-hidden rounded-[15px] flex flex-col w-full ${className}`}
      data-node-id="general-announcement-card"
    >
      <div className="bg-[#F49B31] w-full px-4 py-3 flex justify-between items-center gap-2">
        <p className="font-['Inter',sans-serif] font-extrabold text-[14px] flex items-center gap-2 text-white leading-5">
          <Megaphone size={16} aria-hidden="true" />
          GENERAL ANNOUNCEMENT
        </p>
        <span className="font-['Poppins',sans-serif] font-medium text-[11px] text-white/90 whitespace-nowrap">
          Published {formatTimeAgo(announcement.createdAt)}
        </span>
      </div>

      <div className="p-4 flex flex-col gap-2.5 w-full text-black">
        <p className="font-['Poppins',sans-serif] font-bold text-[18px] leading-normal wrap-break-word">
          {announcement.title.toUpperCase()}
        </p>
        <p className="text-[14px] font-['Poppins',sans-serif] font-medium leading-[1.8] text-black/90 whitespace-pre-wrap wrap-break-word">
          {isExpanded || !isLong
            ? announcement.content
            : announcement.content.slice(0, PREVIEW_LENGTH) + "..."}
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => setIsExpanded((v) => !v)}
            className="font-['Poppins',sans-serif] font-medium text-[13px] text-[#F49B31] cursor-pointer hover:underline text-left w-fit"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
        {announcement.author && (
          <span className="font-['Poppins',sans-serif] text-[12px] text-[#626665]">
            By {announcement.author.firstName} {announcement.author.lastName}
          </span>
        )}
      </div>
    </div>
  );
};

export default AnnouncementWidget;
