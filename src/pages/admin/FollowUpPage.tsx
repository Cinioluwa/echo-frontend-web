import { useLocation } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { FollowUp } from "../../components/admin/FollowUp";
import { AdminPageProvider, type AdminPage } from "../../contexts/AdminPageContext";

/**
 * FollowUpPage
 * Page wrapper for the Follow Up admin page with sidebar layout
 */
const FollowUpPage: React.FC = () => {
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
            <div className="h-full">
                <AdminLayout />
                <FollowUp />
            </div>
        </AdminPageProvider>
    );
};

export default FollowUpPage;
