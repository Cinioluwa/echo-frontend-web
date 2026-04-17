/**
 * AnnouncementWidget
 * Figma ref: 3843:12491 (desktop variants — Default & Expanded)
 * Phase: 2
 *
 * Right-column widget for the desktop feed.
 * "GENERAL ANNOUNCEMENT" header (bold, underlined), announcement title, description with "Show more" toggle.
 * Two variants: Default (compact) and Expanded (full text).
 */

import { useState } from "react";
import type { Announcement } from "../../api/types";
import { GoDotFill } from "react-icons/go";

interface AnnouncementWidgetProps {
  announcement?: Announcement | null;
}

const AnnouncementWidget = ({
  announcement = null,
}: AnnouncementWidgetProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  if (!announcement) return null;

  return (
    <div
      className="bg-white border border-[#FFC37B] overflow-hidden rounded-[15px] flex flex-col gap-2.5 w-full lg:w-[300px]"
      style={{ maxHeight: isExpanded ? "400px" : "290px" }}
    >
      {/* Announcement content */}
      {/* Header: "GENERAL ANNOUNCEMENT" */}
      <div className="bg-[#F49B31] w-full p-4 flex justify-between items-center">
        <p className="font-['Inter',sans-serif] font-extrabold text-[14px] flex items-center justify-start gap-1 text-white decoration-solid leading-5">
          <GoDotFill />
          GENERAL ANNOUNCEMENT
        </p>
      </div>
      <div className="pb-8 px-4 w-full">
        <div className="flex flex-col  gap-2.5 w-full text-black">
          <div className="flex flex-col gap-[5px] w-full">
            {/* Title */}
            <p className="font-['Poppins',sans-serif] font-bold  text-[18px] leading-normal text-wrap">
              {announcement.title.toUpperCase()}
            </p>
          </div>
          {/* Description */}
          <div className="w-full">
            <p className="text-[14px] font-['Poppins',sans-serif]">
              <span className="font-medium leading-[1.8] text-black/90">
                {isExpanded || announcement.content.length <= 160
                  ? announcement.content
                  : announcement.content.slice(0, 160) + "..."}
              </span>
            </p>
          </div>
        </div>
        {/* Show more / Show less */}
        {announcement.content.length > 160 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="font-['Poppins',sans-serif] font-medium text-[13px] text-[#F49B31] cursor-pointer hover:underline text-left w-full"
          >
            {isExpanded ? "Show less" : "Show more"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AnnouncementWidget;
