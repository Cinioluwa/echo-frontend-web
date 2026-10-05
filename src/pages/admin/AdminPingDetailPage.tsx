import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { AdminPingDetail } from "../../components/admin/PingDetail";
import { useUIStore } from "../../stores";

const AdminPingDetailPage: React.FC = () => {
    const { isSidebarCollapsed } = useUIStore();

    return (
        <div className="h-full">
            <AdminLayout />
            <div className={`min-w-0 transition-all duration-300 ${isSidebarCollapsed ? "min-[1131px]:ms-[102px]" : "min-[1131px]:ms-[230px]"}`}>
                <AdminPingDetail mode="admin" />
            </div>
        </div>
    );
};

export default AdminPingDetailPage;