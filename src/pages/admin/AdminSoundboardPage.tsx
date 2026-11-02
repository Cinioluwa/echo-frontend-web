import React, { useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import AnnouncementModal from "../../components/admin/AnnouncementModal";
import AdminSoundboard from "../../components/admin/AdminSoundboard/AdminSoundboard";
import { AdminPageProvider, type AdminPage } from "../../contexts/AdminPageContext";
import { useAuthStore } from "../../stores";

/**
 * AdminSoundboardPage
 * Admin soundboard page showing overview, surge alerts, and follow-up queue
 */
const AdminSoundboardPage: React.FC = () => {
    const location = useLocation();
    const user = useAuthStore((state) => state.user);
    const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
    const [announcementRefreshKey, setAnnouncementRefreshKey] = useState(0);

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

    if (user?.role === "REPRESENTATIVE") {
        return <Navigate to="/inbox" replace />;
    }

    return (
        <AdminPageProvider initialPage={getCurrentPage()}>
            <div className="min-h-full w-full min-w-0">
                <AdminLayout />

                <AdminSoundboard
                    onPublishAnnouncement={handlePublishAnnouncement}
                    announcementRefreshKey={announcementRefreshKey}
                />

                {showAnnouncementModal && (
                    <AnnouncementModal
                        setAnnouncementModal={setShowAnnouncementModal}
                        onPublished={() => setAnnouncementRefreshKey((k) => k + 1)}
                    />
                )}
            </div>
        </AdminPageProvider>
    );
};

export default AdminSoundboardPage;
