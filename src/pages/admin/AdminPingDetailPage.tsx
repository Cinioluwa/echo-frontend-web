import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminPingDetail } from "../../components/admin/PingDetail";

/**
 * AdminPingDetailPage
 * Page wrapper for the Admin Ping Detail page with sidebar layout
 */
const AdminPingDetailPage: React.FC = () => {

    return (
        <div className="h-full">
            <AdminLayout />

            <AdminPingDetail />

        </div>
    );
};

export default AdminPingDetailPage;
