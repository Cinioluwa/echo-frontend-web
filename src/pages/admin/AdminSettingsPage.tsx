import React from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import AdminSettings from "../../components/admin/AdminSettings/AdminSettings";
import { AdminPageProvider, type AdminPage } from "../../contexts/AdminPageContext";

import AnnouncementModal from "../../components/admin/AnnouncementModal";

/**
 * AdminSettingsPage
 * Page wrapper for the Admin Settings page with sidebar layout
 */
const AdminSettingsPage: React.FC = () => {
    const location = useLocation();
    const [showAnnouncementModal, setShowAnnouncementModal] = React.useState(false);

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
        alert("Settings exported");
    };

    return (
        <AdminPageProvider initialPage={getCurrentPage()}>
            <div className="h-full relative ">
                <AdminLayout />
                <AdminSettings 
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

export default AdminSettingsPage;
