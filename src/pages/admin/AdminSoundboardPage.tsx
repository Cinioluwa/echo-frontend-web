import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import AnnouncementModal from "../../components/admin/AnnouncementModal";
import AdminSoundboard from "../../components/admin/AdminSoundboard/AdminSoundboard";
import { AdminPageProvider, type AdminPage } from "../../contexts/AdminPageContext";

/**
 * AdminSoundboardPage
 * Admin soundboard page showing overview, surge alerts, and follow-up queue
 */
const AdminSoundboardPage: React.FC = () => {
    const location = useLocation();
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

    const getCurrentPage = (): AdminPage => {
        const path = location.pathname;
        if (path.includes("/admin/soundboard")) return "soundboard";
        if (path.includes("/admin/followUp") || path.includes("/admin/followup")) return "followUp";
        if (path.includes("/admin/moderation")) return "moderation";
        if (path.includes("/admin/settings")) return "settings";
        if (path.includes("/admin/profile")) return "profile";
        return "soundboard";
    };

    const handlePublishAnnouncement = () => {
        setShowAnnouncementModal(true);
    };

    const handleExport = () => {
        // TODO: Implement export functionality
        console.log("Export clicked");
    };

    return (
        <AdminPageProvider initialPage={getCurrentPage()}>
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
        </AdminPageProvider>
    );
};

export default AdminSoundboardPage;
