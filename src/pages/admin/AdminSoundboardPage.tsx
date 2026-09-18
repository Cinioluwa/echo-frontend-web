import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import AnnouncementModal from "../../components/admin/AnnouncementModal";
import AdminSoundboard from "../../components/admin/AdminSoundboard/AdminSoundboard";
import { AdminPageProvider, type AdminPage } from "../../contexts/AdminPageContext";
import { adminService } from "../../api/services/admin.service";

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
        try {
            const result = await adminService.getPings({ limit: 500 });
            const pings = result.data;

            if (!pings || pings.length === 0) {
                alert("No pings to export.");
                return;
            }

            // Build CSV
            const headers = ["ID", "Title", "Category", "Status", "Author", "Surges", "Waves", "Created At"];
            const rows = pings.map((p: any) => [
                p.id,
                `"${(p.title || "").replace(/"/g, '""')}"`,
                `"${(p.category?.name || "Uncategorized").replace(/"/g, '""')}"`,
                p.status || "",
                `"${(p.author?.firstName ? `${p.author.firstName} ${p.author.lastName}` : "Anonymous").replace(/"/g, '""')}"`,
                p.surgeCount ?? 0,
                p.wavesCount ?? 0,
                new Date(p.createdAt).toLocaleDateString(),
            ]);

            const csv = [headers.join(","), ...rows.map((r: any[]) => r.join(","))].join("\n");
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `echo-pings-${new Date().toISOString().slice(0, 10)}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Export failed:", err);
            alert("Export failed. Please try again.");
        }
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
