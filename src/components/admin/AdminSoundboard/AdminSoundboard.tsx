import React, { useState, useEffect, useCallback } from "react";
import StatCard from "./StatCard";
import SurgeAlertCard, { type SurgeItem } from "./SurgeAlertCard";
import FollowUpQueueCard, { type FollowUpItem } from "./FollowUpQueueCard";
import IssuesByCategoryCard, { type CategoryData } from "./IssuesByCategoryCard";
import { useUIStore } from "../../../stores";
import PingIndexModal from "./PingIndexModal";
import { motion } from "framer-motion";
import AdminHeader from "../AdminHeader";
import { adminService } from "../../../api/services/admin.service";
import { useNavigate } from "react-router-dom";
import { ToastContainer } from "../../shared/Toast";
import type { ToastItem } from "../../shared/Toast";

interface AdminSoundboardProps {
    onPublishAnnouncement?: () => void;
    onExport?: () => void;
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
    onExport,
}) => {
    const { isSidebarCollapsed } = useUIStore();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const pushToast = (variant: ToastItem["variant"]) => {
        const id = `${Date.now()}`;
        setToasts((prev) => [...prev, { id, variant }]);
    };

    // Data state
    const [surgeItems, setSurgeItems] = useState<SurgeItem[]>([]);
    const [surgeCount, setSurgeCount] = useState(0);
    const [followUpItems, setFollowUpItems] = useState<FollowUpItem[]>([]);
    const [pendingCount, setPendingCount] = useState(0);
    const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
    const [resolutionRate, setResolutionRate] = useState({ value: "0%", badge: "" });
    const [avgResolveTime, setAvgResolveTime] = useState({ value: "0 days", badge: "" });
    const [overdue, setOverdue] = useState({ value: "0", badge: "" });

    const fetchDashboardData = useCallback(async (isSilentRefetch = false) => {
        try {
            if (!isSilentRefetch) {
                setLoading(true);
            }
            setError(null);

            const [overview, surging, issuesByCategory] = await Promise.all([
                adminService.getOverview({ months: 1 }),
                adminService.getSurgingIssues({ hours: 72, limit: 3 }),
                // adminService.getPriorityPings({ weeks: 1, limit: 3 }),
                // adminService.getStallingPings({ staleDays: 7, limit: 5 }),
                // adminService.getFollowUpQueue({ staleDays: 7 }).catch(() => null),
                adminService.getIssuesByCategory().catch(() => null),
            ]);

            // Surge alerts
            const surges: SurgeItem[] = surging.items.map((item) => ({
                id: item.pingId.toString(),
                title: item.title,
                velocity: `+${item.currentRatePerHour}/hr`,
                category: item.category?.name || "Uncategorized",
                onClick: () => {
                    // Navigate to ping details page
                    navigate(`/admin/soundboard/${item.pingId}`);
                }
            }));
            setSurgeItems(surges);
            setSurgeCount(surging.count);

            // Follow-up queue (use dedicated endpoint if available, fallback to manual)
            const followUps: FollowUpItem[] = [];
            followUps.push({
                id: "approved-waves",
                title: "Approved waves not being implemented",
                description: `${overview.stalledWavesCount} approved waves require progression`,
                count: overview.stalledWavesCount,
                iconColor: "green",
                icon: "/assets/icon/not-implemented.svg",
            });
            followUps.push({
                id: "awaiting-approval",
                title: "Waves awaiting approval",
                description: `${overview.wavesAwaitingApproval} waves need review`,
                count: overview.wavesAwaitingApproval,
                iconColor: "red",
                icon: "/assets/icon/awaiting-approval.svg",
            });
            followUps.push({
                id: "acknowledged-stalling",
                title: "Acknowledged pings stalling",
                description: `${overview.stalledAcknowledgedPingsCount} acknowledged pings need progression`,
                count: overview.stalledAcknowledgedPingsCount,
                iconColor: "red",
                icon: "/assets/icon/acknowledged-pings.svg",
            });


            setFollowUpItems(followUps);
            setPendingCount(followUps.reduce((sum, i) => sum + i.count, 0));

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
            setResolutionRate({
                value: `${overview.summaryCards.resolutionRate.value}%`,
                badge: `↑ ${overview.summaryCards.resolutionRate.deltaPercentagePoints}% this month`,
            });
            setAvgResolveTime({
                value: `${overview.summaryCards.avgResolveTimeDays.value.toFixed(1)} days`,
                badge: `↓ ${overview.summaryCards.avgResolveTimeDays.deltaDays.toFixed(1)}d improvement`,
            });
            setOverdue({
                value: overview.summaryCards.unresolvedOlderThanDays.value.toString(),
                badge: `↑ +${overview.summaryCards.unresolvedOlderThanDays.deltaAbsolute} this week`,
            });

        } catch (err: any) {
            setError(err?.response?.data?.error || err.message || "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    const handleExportClick = () => {
        if (onExport) {
            onExport();
        } else {
            pushToast("ping");
        }
    };

    return (
        <>
            <div className={`flex min-h-screen min-w-0 bg-[#fcfcfc] m-0 ${isSidebarCollapsed ? "md:ms-[80px]" : "md:ms-[230px]"} transition-all duration-300`} data-node-id="admin-soundboard-page">
                <div className="min-w-0 flex-1 bg-[#fcfcfc]">
                    <div className="px-3 sm:px-5 pt-5 sm:pt-[30px] pb-3 sm:pb-5">
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-0">
                            <div className="flex min-w-0 flex-col gap-1 sm:gap-2">
                                <h1 className="hidden md:block font-poppins font-bold text-[24px] sm:text-[32px] leading-normal text-black">
                                    Soundboard
                                </h1>
                                <AdminHeader title="Soundboard" />
                                <p className="font-poppins font-medium text-[13px] sm:text-[16px] leading-normal text-[#8b8e8d]">
                                    See the issues and community activity that need institutional attention.
                                </p>
                            </div>

                            <div className="grid w-full grid-cols-2 gap-2 lg:w-auto lg:shrink-0">
                                <motion.button
                                    onClick={handleExportClick}
                                    className="min-w-0 whitespace-nowrap border border-[#f49b31] rounded-lg px-1.5 sm:px-3 lg:px-[15px] py-2 sm:py-[9px] flex items-center justify-center gap-1 sm:gap-2 hover:bg-[#F49B31] text-[#f49b31] hover:text-white transition-colors text-[10px] sm:text-xs"
                                    whileHover="hover"
                                >
                                    <motion.img src="/assets/icon/Export.svg" alt="Export Icon" className="w-[13px] h-[13px]" variants={iconVariants} />
                                    <span className="font-medium">Export</span>
                                </motion.button>

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

                    <div className="flex-1 overflow-y-auto px-3 sm:px-5 py-5 sm:py-[30px]">
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
                            <div className="flex flex-col gap-[30px] max-w-[1200px]">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                    <SurgeAlertCard
                                        count={surgeCount}
                                        items={surgeItems}
                                        className="lg:col-span-1"
                                    />
                                    <FollowUpQueueCard
                                        items={followUpItems}
                                        pendingCount={pendingCount}
                                        className="lg:col-span-1"
                                    />
                                </div>

                                <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                                    <StatCard
                                        title="Resolution Rate"
                                        value={resolutionRate.value}
                                        subtitle="*Of pings resolved"
                                        badge={{ label: resolutionRate.badge, color: "green" }}
                                    />
                                    <StatCard
                                        title="Average Resolution Time"
                                        value={avgResolveTime.value}
                                        subtitle="*Days to resolve"
                                        badge={{ label: avgResolveTime.badge, color: "green" }}
                                    />
                                    <StatCard
                                        title="Overdue (>7D)"
                                        value={overdue.value}
                                        subtitle="*Need attention"
                                        badge={{ label: overdue.badge, color: "red" }}
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

            <div className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
                <ToastContainer
                    toasts={toasts}
                    onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
                />
            </div>
        </>
    );
};

export default AdminSoundboard;