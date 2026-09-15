import React from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { Moderation } from "../../components/admin/Moderation";
import { AdminPageProvider, type AdminPage } from "../../contexts/AdminPageContext";

/**
 * ModerationPage
 * Page wrapper for the Moderation admin page with sidebar layout
 */
const ModerationPage: React.FC = () => {
    const location = useLocation();

    const getCurrentPage = (): AdminPage => {
        const path = location.pathname;
        if (path.includes("/admin/soundboard")) return "soundboard";
        if (path.includes("/admin/followUp") || path.includes("/admin/followup")) return "followUp";
        if (path.includes("/admin/moderation")) return "moderation";
        if (path.includes("/admin/settings")) return "settings";
        if (path.includes("/admin/profile")) return "profile";
        return "soundboard";
    };

    return (
        <AdminPageProvider initialPage={getCurrentPage()}>
            <AdminLayout>
                <Moderation />
            </AdminLayout>
        </AdminPageProvider>
    );
};

export default ModerationPage;
