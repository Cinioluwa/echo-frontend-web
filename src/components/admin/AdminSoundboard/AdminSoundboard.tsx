import React, { useState, useEffect, useCallback } from "react";
import StatCard from "./StatCard";
import SurgeAlertCard, { type SurgeItem } from "./SurgeAlertCard";
import FollowUpQueueCard, { type FollowUpItem } from "./FollowUpQueueCard";
import AdminAnnouncementCard from "./AdminAnnouncementCard";
import IssuesByCategoryCard, { type CategoryData } from "./IssuesByCategoryCard";
import { useUIStore } from "../../../stores";
import PingIndexModal from "./PingIndexModal";
import { motion } from "framer-motion";
import AdminHeader from "../AdminHeader";
import { loadSoundboardSnapshot, buildFollowUps, buildStatCards, type StatCardData } from "./soundboardData";
import { useNavigate } from "react-router-dom";
import { useAdminExport } from "../../../features/export/useAdminExport";

interface AdminSoundboardProps {
    onPublishAnnouncement?: () => void;
    announcementRefreshKey?: number;
}

const iconVariants = {
    initial: {
        filter: "grayscale(1) brightness(1)",
        willChange: "filter"
    },
    hover: {
        filter: "grayscale(1) brightness(1.5)",
        transition: {
            duration: 0.1,
        }
    }
};

const AdminSoundboard: React.FC<AdminSoundboardProps> = ({
    onPublishAnnouncement,
    announcementRefreshKey,
}) => {
    const { isSidebarCollapsed } = useUIStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { canExport, exporting, startExport, toastNode } = useAdminExport("soundboard");

    // Data state
    const [surgeItems, setSurgeItems] = useState<SurgeItem[]>([]);
    const [followUpItems, setFollowUpItems] = useState<FollowUpItem[]>([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
    const [resolutionRate, setResolutionRate] = useState<StatCardData>({ value: "0%" });
    const [avgResolveTime, setAvgResolveTime] = useState<StatCardData>({ value: "N/A" });
    const [overdue, setOverdue] = useState<StatCardData>({ value: "0" });

    const fetchDashboardData = useCallback(async (isSilentRefetch = false) => {
        try {
            if (!isSilentRefetch) {
                setLoading(true);
            }
            setError(null);

            const { overview, surging, issuesByCategory } = await loadSoundboardSnapshot();

            // Surge alerts
            const surges: SurgeItem[] = surging.map((item) => ({
                id: item.pingId.toString(),
                title: item.title,
                velocity: item.currentRatePerHour,
                category: item.category?.name || "Uncategorized",
                onClick: () => {
                    // Navigate to ping details page
                    navigate(`/admin/soundboard/${item.pingId}`);
                }
            }));
            setSurgeItems(surges);

            const activeFollowUps = buildFollowUps(overview);
            setFollowUpItems(activeFollowUps);
            setPendingCount(activeFollowUps.reduce((sum, item) => sum + item.count, 0));

            // Category data (use dedicated endpoint if available, fallback to overview)
            if (issuesByCategory) {
                const cats: CategoryData[] = issuesByCategory.map((item) => ({
                    categoryId: item.categoryId,
                    name: item.categoryName,
                    resolved: item.resolutionRate,
                    openCount: item.openCount,
                    issues: item.topPings.map((p) => ({
                        id: p.id.toString(),
                        title: p.title,
                        postedTime: `Posted ${Math.floor((Date.now() - new Date(p.createdAt).getTime()) / 86400000)}d ago`,
                        count: p.surgeCount,
                    })),
                }));
                setCategoryData(cats);
            } else {
                const cats: CategoryData[] = overview.categoriesStats.map((stat) => ({
                    categoryId: stat.categoryId,
                    name: stat.categoryName,
                    resolved: stat.resolutionPercentage,
                    openCount: stat.openCount,
                    issues: [],
                }));
                setCategoryData(cats);
            }

            // Stat cards
            const stats = buildStatCards(overview);
            setResolutionRate(stats.resolution);
            setAvgResolveTime(stats.avgTime);
            setOverdue(stats.overdue);

        } catch (err: any) {
            setError(err?.response?.data?.error || err.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return (
        <>
            <div className={`flex min-h-screen min-w-0 bg-[#FAE9D4] m-0 ${isSidebarCollapsed ? "min-[1131px]:ms-[102px]" : "min-[1131px]:ms-[230px]"} transition-all duration-300`} data-node-id="admin-soundboard-page">
                <div className="min-w-0 flex-1 bg-[#FAE9D4]">
                    <div className="px-3 sm:px-5 pt-5 sm:pt-[30px] pb-3 sm:pb-5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-0">
                            <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
                                <h1 className="hidden min-[1131px]:block font-poppins font-bold text-[24px] sm:text-[32px] leading-normal text-black">
                                    Soundboard
                                </h1>
                                <AdminHeader title="Soundboard" />
                            </div>

                            <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:w-auto lg:shrink-0">
                                {canExport && (
                                    <motion.button
                                        onClick={startExport}
                                        disabled={exporting}
                                        aria-busy={exporting}
                                        className="min-w-0 whitespace-nowrap border border-[#f49b31] rounded-lg px-1.5 sm:px-3 lg:px-[15px] py-2 sm:py-[9px] flex items-center justify-center gap-1 sm:gap-2 hover:bg-[#F49B31] text-[#f49b31] hover:text-white transition-colors text-[10px] sm:text-xs disabled:cursor-wait disabled:opacity-60"
                                        whileHover="hover"
                                    >
                                        {exporting ? (
                                            <span className="w-[13px] h-[13px] animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        ) : (
                                            <motion.img src="/assets/icon/Export.svg" alt="Export Icon" className="w-[13px] h-[13px]" variants={iconVariants} />
                                        )}
                                        <span className="font-medium">{exporting ? "Exporting…" : "Export"}</span>
                                    </motion.button>
                                )}

                                <button
                                    onClick={onPublishAnnouncement}
                                    className="min-w-0 whitespace-nowrap bg-[#ffc37b] hover:bg-[#ffb347] border border-[#f49b31] rounded-lg px-1.5 sm:px-3 lg:px-[15px] py-2 sm:py-[9px] flex items-center justify-center gap-1 sm:gap-2 transition-colors text-[10px] sm:text-xs"
                                >
                                    <img src="/assets/icon/cross.svg" alt="Announcement Icon" className="w-[13px] h-[13px]" />
                                    <span className="text-[#212121] font-medium">Publish Announcement</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 min-w-0 overflow-y-auto px-3 sm:px-5 py-5 sm:py-[30px]">
                        {loading ? (
                            <div className="flex items-center justify-center h-[400px]">
                                <div className="animate-spin w-12 h-12 border-4 border-[#f49b31] border-t-transparent rounded-full" />
                            </div>
                        ) : error ? (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-[13px]">
                                {error}
                                <button onClick={() => fetchDashboardData()} className="ml-2 underline">Retry</button>
                            </div>
                        ) : (
                            <div className="flex w-full min-w-0 flex-col gap-5 sm:gap-6">
                                <AdminAnnouncementCard
                                    refreshKey={announcementRefreshKey}
                                    onPublish={onPublishAnnouncement}
                                />
                                <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
                                    <SurgeAlertCard
                                        items={surgeItems}
                                        className="lg:col-span-1"
                                    />
                                    <FollowUpQueueCard
                                        items={followUpItems}
                                        pendingCount={pendingCount}
                                        className="lg:col-span-1"
                                    />
                                </div>

                                <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 2xl:grid-cols-3">
                                    <StatCard
                                        title="Resolution Rate"
                                        value={resolutionRate.value}
                                        subtitle="*Of pings resolved"
                                        badge={resolutionRate.badge}
                                    />
                                    <StatCard
                                        title="Average Resolution Time"
                                        value={avgResolveTime.value}
                                        subtitle="*Days to resolve"
                                        badge={avgResolveTime.badge}
                                    />
                                    <StatCard
                                        title="Overdue (>7D)"
                                        value={overdue.value}
                                        subtitle="*Need attention"
                                        badge={overdue.badge}
                                    />
                                </div>

                                {categoryData.length > 0 && (
                                    <IssuesByCategoryCard
                                        categories={categoryData}
                                        onCategoryClick={setSelectedCategory}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {selectedCategory && (
                <PingIndexModal
                    category={selectedCategory}
                    categories={categoryData}
                    onSelectCategory={setSelectedCategory}
                    onClose={() => setSelectedCategory(null)}
                />
            )}

            {toastNode}
        </>
    );
};

export default AdminSoundboard;