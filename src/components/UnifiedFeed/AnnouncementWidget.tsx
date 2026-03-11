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

interface Announcement {
    id: number;
    title: string;
    description: string;
}

interface AnnouncementWidgetProps {
    announcement?: Announcement;
}

// TODO: API — fetch announcements from announcementService

const MOCK_ANNOUNCEMENT: Announcement = {
    id: 1,
    title: "BAN OF SHUTTLE TO EIE",
    description:
        "Starting from 23rd of May shuttles can no longer drop students at engineering buildings. Shuttles must now drop at Cafeteria 2. Only Welfare Shuttles are exempted from this new policy.",
};

const AnnouncementWidget = ({ announcement = MOCK_ANNOUNCEMENT }: AnnouncementWidgetProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div
            className="bg-white border-2 border-[#FFC37B] rounded-[15px] flex flex-col gap-[10px] items-start px-[15px] py-[20px] w-[276px]"
            style={{ maxHeight: isExpanded ? "400px" : "290px" }}
        >
            {/* Announcement content */}
            <div className="flex flex-col gap-[10px] w-full text-black">
                <div className="flex flex-col gap-[5px] whitespace-nowrap">
                    {/* Header: "GENERAL ANNOUNCEMENT" */}
                    <p className="font-['Inter',sans-serif] font-extrabold text-[16px] underline decoration-solid leading-[20px]">
                        GENERAL ANNOUNCEMENT
                    </p>
                    {/* Title */}
                    <p className="font-['Poppins',sans-serif] font-medium text-[18px] leading-normal">
                        {announcement.title}
                    </p>
                </div>

                {/* Description */}
                <div className="font-extrabold text-[0px] min-w-full w-min">
                    <p className="text-[14px] font-['Poppins',sans-serif]">
                        <span className="font-medium leading-[1.8]">
                            {isExpanded ? announcement.description : announcement.description.slice(0, 160) + (announcement.description.length > 160 ? "..." : "")}
                        </span>
                    </p>
                </div>
            </div>

            {/* Show more / Show less */}
            {announcement.description.length > 160 && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="font-['Poppins',sans-serif] font-medium text-[13px] text-[#F49B31] cursor-pointer hover:underline text-left w-full"
                >
                    {isExpanded ? "Show less" : "Show more"}
                </button>
            )}
        </div>
    );
};

export default AnnouncementWidget;
