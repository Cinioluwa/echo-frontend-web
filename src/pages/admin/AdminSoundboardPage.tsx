import React, { useState } from "react";
import { AdminSoundboard } from "../../components/admin/AdminSoundboard";
import AnnouncementModal from "../../components/admin/AnnouncementModal";

/**
 * AdminSoundboardPage
 * Admin soundboard page showing overview, surge alerts, and follow-up queue
 */
const AdminSoundboardPage: React.FC = () => {
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

    const handlePublishAnnouncement = () => {
        setShowAnnouncementModal(true);
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log("Export clicked");
    };

    return (
        <>
            <AdminSoundboard
                onPublishAnnouncement={handlePublishAnnouncement}
                onExport={handleExport}
            />
            {showAnnouncementModal && (
                <AnnouncementModal setAnnouncementModal={setShowAnnouncementModal} />
            )}
        </>
    );
};

export default AdminSoundboardPage;
