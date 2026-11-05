import React, { useState, useEffect, useCallback } from "react";
import { ChevronDown, Filter, X } from "lucide-react";
import SurgeIcon from "../../shared/SurgeIcon";
import { adminService } from "../../../api/services/admin.service";
import { categoryImages } from "../../CategoryImages";
import type { AdminPing } from "../../../api/types/admin.types";
import type { CategoryData } from "./IssuesByCategoryCard";

interface PingIndexModalProps {
    category: CategoryData;
    categories?: CategoryData[];
    onSelectCategory?: (category: CategoryData) => void;
    onClose: () => void;
}

// ── Status badge ────────────────────────────────────────────────────────────────
const getStatusBadge = (ping: AdminPing) => {
    const status = ping.progressStatus || ping.status;
    if (ping.progressStatus === "RESOLVED" || ping.resolvedAt) {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-semibold bg-[var(--echo-accent)] text-[var(--echo-text-on-accent)] whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--echo-surface)]" />
                Resolved
            </span>
        );
    }
    if (status === "ACKNOWLEDGED" || status === "IN_PROGRESS" || status === "UNDER_REVIEW") {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-semibold bg-[var(--echo-bg-2d2d2d)] text-[var(--echo-text-on-accent)] whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--echo-surface)]" />
                Acknowledged
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] md:text-[10px] font-semibold border border-[var(--echo-border-d1d5db)] text-[var(--echo-text-374151)] whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--echo-bg-374151)]" />
            Open
        </span>
    );
};

// ── Admin signal badges (from Figma: "Surging now" with red indicator) ──────────
const getAdminSignal = (ping: AdminPing): React.ReactNode | null => {
    const ageHours = (Date.now() - new Date(ping.createdAt).getTime()) / 3_600_000;
    const velocity = ageHours > 0 ? ping.surgeCount / ageHours : 0;
    if (velocity >= 5) {
        return (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--echo-bg-ffd7d7)] text-[var(--echo-text-b01212)] text-[9px] font-semibold whitespace-nowrap">
                <SurgeIcon width={10} height={13} fill="var(--echo-text-b01212)" />
                Surging now
            </span>
        );
    }
    if (velocity >= 1) {
        return (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-[var(--echo-surface-soft)] text-[var(--echo-text-f49b31)] text-[9px] font-semibold whitespace-nowrap">
                <SurgeIcon width={10} height={13} fill="var(--echo-text-f49b31)" />
                Rising
            </span>
        );
    }
    return null;
};

type FilterStatus = "ALL" | "OPEN" | "ACKNOWLEDGED" | "RESOLVED";

const FILTER_LABELS: Record<FilterStatus, string> = {
    ALL: "All",
    OPEN: "Open",
    ACKNOWLEDGED: "Acknowledged",
    RESOLVED: "Resolved",
};

const PingIndexModal: React.FC<PingIndexModalProps> = ({ category, categories, onSelectCategory, onClose }) => {
    const [pings, setPings] = useState<AdminPing[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("ALL");
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const [showCategoryMenu, setShowCategoryMenu] = useState(false);

    const fetchPings = useCallback(async () => {
        try {
            setLoading(true);
            // Map our UI filter to the API's progressStatus param
            const progressStatusMap: Record<FilterStatus, string | undefined> = {
                ALL: undefined,
                OPEN: "NONE",
                ACKNOWLEDGED: "ACKNOWLEDGED",
                RESOLVED: "RESOLVED",
            };
            const response = await adminService.getPings({
                category: category.categoryId,
                categoryId: category.categoryId,
                limit: 50,
                progressStatus: progressStatusMap[filterStatus],
            });
            
            // Fallback frontend filter in case the backend ignores the category filter
            const filteredData = response.data.filter(ping => ping.categoryId === category.categoryId);
            
            setPings(filteredData);
        } catch (err) {
            console.error("Failed to fetch pings:", err);
        } finally {
            setLoading(false);
        }
    }, [category.categoryId, filterStatus]);

    useEffect(() => {
        fetchPings();
    }, [fetchPings]);

    const getVelocity = (ping: AdminPing) => {
        const hours = Math.max(1, (Date.now() - new Date(ping.createdAt).getTime()) / 3_600_000);
        return `+${Math.round(ping.surgeCount / hours)}/hr`;
    };

    const getPostedTime = (createdAt: string) => {
        const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86_400_000);
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        return `${days}d ago`;
    };

    const categoryIcon =
        (categoryImages as Record<string, string>)[category.name] ||
        (categoryImages as Record<string, string>).General;

    // Use real resolved count from API data
    const resolvedCount = pings.filter(
        (p) => p.progressStatus === "RESOLVED" || p.resolvedAt
    ).length;

    // Calculate percentage dynamically to fix 0% backend bug
    const totalCount = category.openCount + resolvedCount;
    const resolvedPercentage = totalCount > 0 
        ? Math.round((resolvedCount / totalCount) * 100) 
        : category.resolved;

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40" onClick={onClose}>
            <div
                className="bg-[var(--echo-bg-fff8f0)] rounded-t-2xl md:rounded-2xl w-full max-w-[800px] max-h-[92vh] md:max-h-[88vh] overflow-hidden flex flex-col mx-0 md:mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Handle bar (mobile) */}
                <div className="flex justify-center pt-3 pb-1 md:hidden">
                    <div className="w-10 h-1 bg-[var(--echo-bg-c3cccc)] rounded-full" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-center px-4 md:px-6 pt-3 md:pt-5 pb-2 md:pb-3 relative">
                    <h2 className="text-[17px] md:text-[20px] text-center w-full font-semibold text-[var(--echo-text-primary)] font-['Poppins',sans-serif]">
                        Ping Index
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[var(--echo-text-f49b31)] absolute right-4 md:right-6 cursor-pointer"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Category badge + Filter */}
                <div className="flex items-center justify-center gap-2.5 px-4 md:px-6 pb-3 relative">
                    <div className="relative">
                        <button 
                            className="inline-flex items-center gap-1.5 bg-[var(--echo-accent)] text-[var(--echo-text-on-accent)] rounded-full px-3 md:px-4 py-1 md:py-1.5 cursor-pointer hover:bg-[var(--echo-bg-e08920)] transition"
                            onClick={() => setShowCategoryMenu(!showCategoryMenu)}
                        >
                            {categoryIcon && (
                                <img
                                    src={categoryIcon}
                                    alt={category.name}
                                    className="w-4 h-4 md:w-5 md:h-5 p-0.5 object-contain bg-[var(--echo-surface)] rounded-full"
                                />
                            )}
                            <span className="text-[12px] md:text-[14px] font-medium">{category.name}</span>
                            <ChevronDown width={12} height={12} className="bg-[var(--echo-surface)] text-[var(--echo-text-f49b31)] rounded-full" />
                        </button>
                        
                        {showCategoryMenu && categories && (
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-48 bg-[var(--echo-surface)] border border-gray-100 rounded-xl shadow-lg overflow-hidden z-[60]">
                                {categories.map(cat => (
                                    <button
                                        key={cat.categoryId}
                                        className={`w-full text-left px-4 py-2.5 text-[13px] font-medium transition-colors flex items-center justify-between ${
                                            cat.categoryId === category.categoryId 
                                                ? "bg-[var(--echo-bg-fdf4ea)] text-[var(--echo-text-f49b31)]" 
                                                : "text-gray-700 hover:bg-gray-50"
                                        }`}
                                        onClick={() => {
                                            if (onSelectCategory) {
                                                onSelectCategory(cat);
                                            }
                                            setShowCategoryMenu(false);
                                        }}
                                    >
                                        <span>{cat.name}</span>
                                        {cat.categoryId === category.categoryId && (
                                            <span className="w-1.5 h-1.5 bg-[var(--echo-accent)] rounded-full"></span>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Filter button + dropdown */}
                    <div className="absolute right-4 md:right-6">
                        <div className="relative">
                            <button
                                onClick={() => setShowFilterMenu((v) => !v)}
                                className={`flex items-center gap-1 text-[11px] md:text-[13px] font-medium cursor-pointer transition-colors ${
                                    filterStatus !== "ALL"
                                        ? "text-[var(--echo-text-f49b31)]"
                                        : "text-[var(--echo-text-6b7280)] hover:text-[var(--echo-text-primary)]"
                                }`}
                            >
                                <Filter size={13} />
                                {filterStatus !== "ALL" ? FILTER_LABELS[filterStatus] : "Filter"}
                            </button>

                            {showFilterMenu && (
                                <div className="absolute right-0 top-7 z-10 bg-[var(--echo-surface)] rounded-xl shadow-lg border border-[var(--echo-border-e5e7eb)] overflow-hidden min-w-[140px]">
                                    {(Object.keys(FILTER_LABELS) as FilterStatus[]).map((f) => (
                                        <button
                                            key={f}
                                            onClick={() => { setFilterStatus(f); setShowFilterMenu(false); }}
                                            className={`w-full text-left px-4 py-2.5 text-[12px] font-medium hover:bg-[var(--echo-surface-soft)] transition-colors ${
                                                filterStatus === f ? "text-[var(--echo-text-f49b31)] bg-[var(--echo-surface-soft)]" : "text-[var(--echo-text-374151)]"
                                            }`}
                                        >
                                            {FILTER_LABELS[f]}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats bar — uses real resolved data */}
                <div className="mx-4 md:mx-6 bg-[var(--echo-surface)] rounded-xl border border-[rgba(244,155,49,0.3)] p-3 md:p-4 mb-3 md:mb-4">
                    <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="bg-[var(--echo-surface-soft)] px-3 py-1 rounded-full border border-[var(--echo-border-f49b31)] text-[var(--echo-text-f49b31)] text-[14px] md:text-[18px] font-bold">
                                {category.openCount}{" "}
                                <span className="font-semibold text-[10px] md:text-[13px]">Open</span>
                            </div>
                            <div className="bg-[var(--echo-surface-soft)] px-3 py-1 rounded-full border border-[var(--echo-border-f49b31)] text-[var(--echo-text-f49b31)] text-[14px] md:text-[18px] font-bold">
                                {resolvedCount}{" "}
                                <span className="font-semibold text-[10px] md:text-[13px]">Resolved</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[24px] md:text-[30px] font-bold text-[var(--echo-text-primary)]">
                                {resolvedPercentage}%
                            </span>
                            <span className="text-[10px] md:text-[11px] text-[var(--echo-text-6b7280)] block leading-tight">
                                resolved
                            </span>
                        </div>
                    </div>
                    <div className="w-full h-1.5 md:h-2 bg-black rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[var(--echo-accent)] rounded-full transition-all duration-500"
                            style={{ width: `${resolvedPercentage}%` }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="mx-4 md:mx-6 mb-4 md:mb-6 flex-1 overflow-auto">
                    {/* Desktop header */}
                    <div className="hidden md:grid grid-cols-[1fr_130px_90px_110px] gap-2 px-4 py-2 text-[11px] font-semibold text-[var(--echo-text-6b7280)] uppercase tracking-wide border-b border-[var(--echo-border-e5e7eb)]">
                        <span>Ping</span>
                        <span>Admin Signals</span>
                        <span>Surges</span>
                        <span className="text-right">Status</span>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12 text-[var(--echo-text-6b7280)] text-[13px]">
                            Loading pings...
                        </div>
                    ) : pings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-2">
                            <span className="text-2xl">🔍</span>
                            <span className="text-[var(--echo-text-6b7280)] text-[13px]">No pings found</span>
                        </div>
                    ) : (
                        <div className="divide-y divide-[var(--echo-bg-f0e6d9)]">
                            {pings.map((ping) => {
                                const signal = getAdminSignal(ping);
                                return (
                                    <a
                                        key={ping.id}
                                        href={`/admin/soundboard/${ping.id}`}
                                        className="flex items-center gap-3 md:grid md:grid-cols-[1fr_130px_90px_110px] md:gap-2 px-3 md:px-4 py-3 hover:bg-[var(--echo-surface-soft)] transition-colors"
                                    >
                                        {/* Ping info */}
                                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                                            <span className="inline-flex items-center self-start px-1.5 py-0.5 rounded-full text-[8px] md:text-[9px] font-medium bg-[var(--echo-surface-soft)] text-[var(--echo-text-f49b31)] border border-[rgba(244,155,49,0.3)]">
                                                {ping.category?.name || category.name}
                                            </span>
                                            <span className="text-[12px] md:text-[13px] font-medium text-[var(--echo-text-primary)] truncate">
                                                {ping.title}
                                            </span>
                                            <span className="text-[10px] md:text-[11px] text-[var(--echo-text-9ca3af)]">
                                                {getPostedTime(ping.createdAt)}
                                            </span>
                                        </div>

                                        {/* Mobile: signal + surges + status in one row */}
                                        <div className="flex flex-col items-end gap-1 md:contents flex-shrink-0">
                                            {/* Admin signals */}
                                            <div className="md:flex md:items-center">
                                                {signal ?? (
                                                    <span className="hidden md:block text-[11px] text-[var(--echo-text-d1d5db)]">—</span>
                                                )}
                                                {/* On mobile, show signal inline with stats */}
                                                {signal && <span className="md:hidden">{signal}</span>}
                                            </div>

                                            {/* Surges */}
                                            <div className="flex flex-col md:flex-col">
                                                <span className="text-[12px] md:text-[13px] font-semibold text-[var(--echo-text-f49b31)]">
                                                    <SurgeIcon width={12} height={16} fill="var(--echo-text-f49b31)" className="inline-block mr-0.5" />
                                                    {ping.surgeCount}
                                                </span>
                                                <span className="text-[9px] md:text-[10px] text-[var(--echo-text-9ca3af)]">
                                                    {getVelocity(ping)}
                                                </span>
                                            </div>

                                            {/* Status */}
                                            <div className="flex md:justify-end">
                                                {getStatusBadge(ping)}
                                            </div>
                                        </div>
                                    </a>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PingIndexModal;
