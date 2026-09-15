import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import AnnouncementModal from "../../components/admin/AnnouncementModal";
import AdminSoundboard from "../../components/admin/AdminSoundboard/AdminSoundboard";
import { AdminPageProvider, type AdminPage } from "../../contexts/AdminPageContext";
import { analyticsService } from "../../api/services/analytics.service";

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

    const handleExport = async () => {
        const blob = await analyticsService.exportPings();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `pings-export-${new Date().toISOString()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <AdminPageProvider initialPage={getCurrentPage()}>
            <AdminLayout>
                <AdminSoundboard
                    onPublishAnnouncement={handlePublishAnnouncement}
                    onExport={handleExport}
                />

                {showAnnouncementModal && (
                    <AnnouncementModal setAnnouncementModal={setShowAnnouncementModal} />
                )}
            </AdminLayout>
        </AdminPageProvider>
    );
};

export default AdminSoundboardPage;
