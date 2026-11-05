import React, { useEffect, useState } from "react";
import announcementService from "../../../api/services/announcement.service";
import type { Announcement } from "../../../api/types";
import AnnouncementWidget from "../../UnifiedFeed/AnnouncementWidget";

interface AdminAnnouncementCardProps {
    /** Change this value to re-fetch (e.g. after publishing a new announcement) */
    refreshKey?: number;
    onPublish?: () => void;
    className?: string;
}

const AdminAnnouncementCard: React.FC<AdminAnnouncementCardProps> = ({
    refreshKey = 0,
    onPublish,
    className = "",
}) => {
    const [announcement, setAnnouncement] = useState<Announcement | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let cancelled = false;
        announcementService
            .getAll()
            .then((list) => {
                if (!cancelled) setAnnouncement(list[0] ?? null);
            })
            .catch(() => {
                if (!cancelled) setAnnouncement(null);
            })
            .finally(() => {
                if (!cancelled) setLoaded(true);
            });
        return () => {
            cancelled = true;
        };
    }, [refreshKey]);

    if (!loaded) return null;

    if (!announcement) {
        return (
            <div
                className={`min-w-0 bg-white border border-[#FFC37B] rounded-[15px] px-4 py-4 flex items-center justify-between gap-3 ${className}`}
                data-node-id="admin-announcement-card"
            >
                <p className="font-poppins text-[14px] text-[#626665]">
                    No general announcement is currently live for your institution.
                </p>
                {onPublish && (
                    <button
                        type="button"
                        onClick={onPublish}
                        className="font-poppins text-[13px] font-medium text-[#F49B31] hover:underline cursor-pointer whitespace-nowrap"
                    >
                        Publish one
                    </button>
                )}
            </div>
        );
    }

    return <AnnouncementWidget announcement={announcement} className={className} />;
};

export default AdminAnnouncementCard;
