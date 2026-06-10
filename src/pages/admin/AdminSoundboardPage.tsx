import React, { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import AnnouncementModal from "../../components/admin/AnnouncementModal";
import { AdminSoundboard } from "../../components/admin/AdminSoundboard";

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
        <div className="min-h-full w-screen">
            <AdminLayout />

            <AdminSoundboard
                onPublishAnnouncement={handlePublishAnnouncement}
                onExport={handleExport}
            />


            {showAnnouncementModal && (
                <AnnouncementModal setAnnouncementModal={setShowAnnouncementModal} />
            )}
        </div>
    );
};

export default AdminSoundboardPage;
