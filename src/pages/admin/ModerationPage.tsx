import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Moderation } from "../../components/admin/Moderation";

/**
 * ModerationPage
 * Page wrapper for the Moderation admin page with sidebar layout
 */
const ModerationPage: React.FC = () => {

    return (
        <div className="h-full">
            <AdminLayout />
            <Moderation />
        </div>
    );
};

export default ModerationPage;
