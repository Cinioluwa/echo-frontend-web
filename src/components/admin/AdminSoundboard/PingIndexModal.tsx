import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Filter, X, Check, Search } from "lucide-react";
import { adminService } from "../../../api/services/admin.service";
import categoryService from "../../../api/services/category.service";
import { categoryImages } from "../../CategoryImages";
import type { AdminPing } from "../../../api/types/admin.types";
import type { CategoryData } from "./IssuesByCategoryCard";
import FigmaBadge from "../FigmaBadge";
import { getPingBadgeName } from "../figmaBadgeUtils";

interface PingIndexModalProps {
    category: CategoryData;
    onClose: () => void;
}

interface FilterBadge {
    id: string;
    label: string;
    bgColor: string;
    textColor: string;
    icon: string;
}

const FILTER_BADGES: FilterBadge[] = [
    { id: "solution-ready", label: "Solution Ready", bgColor: "#B2FFCC", textColor: "#067647", icon: "check-circle" },
    { id: "needs-attention", label: "Needs Attention", bgColor: "#CACACA", textColor: "#454545", icon: "attention" },
    { id: "widespread", label: "Widespread", bgColor: "#B5D0FF", textColor: "#0035AC", icon: "antenna" },
    { id: "high-discussion", label: "High discussion", bgColor: "#EAD9FF", textColor: "#531EA3", icon: "chat" },
    { id: "long-overdue", label: "Long overdue", bgColor: "#F7C8B2", textColor: "#B04712", icon: "time-alert" },
    { id: "rising-quickly", label: "Rising quickly", bgColor: "#FFD6A5", textColor: "#A3651E", icon: "graph-up" },
    { id: "surging-now", label: "Surging now", bgColor: "#FFD7D7", textColor: "#B01212", icon: "surging" },
];

const getStatusBadge = (ping: AdminPing) => {
    return <FigmaBadge label={getPingBadgeName(ping.progressStatus, ping.status)} />;
};

const PingIndexModal: React.FC<PingIndexModalProps> = ({ category: initialCategory, onClose }) => {
    const [pings, setPings] = useState<AdminPing[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState<CategoryData>(initialCategory);
    const [allCategories, setAllCategories] = useState<Array<{ id: number; name: string }>>([]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
    const [tempSelectedFilters, setTempSelectedFilters] = useState<string[]>([]);
    const categoryDropdownRef = useRef<HTMLDivElement>(null);
    const filterRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchPings = async () => {
            try {
                setLoading(true);
                const response = await adminService.getPings({ categoryId: activeCategory.categoryId, limit: 50 });
                setPings(response.data);
            } catch (err) {
                console.error("Failed to fetch pings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPings();
    }, [activeCategory]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await categoryService.getAll();
                setAllCategories(cats);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
                setIsCategoryDropdownOpen(false);
            }
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const getVelocity = (ping: AdminPing) => {
        const created = new Date(ping.createdAt);
        const now = new Date();
        const hours = Math.max(1, (now.getTime() - created.getTime()) / (1000 * 60 * 60));
        const velocity = Math.round(ping.surgeCount / hours);
        return `+${velocity}/hr`;
    };

    const getPostedTime = (createdAt: string) => {
        const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / 86400000);
        if (days === 0) return "Posted today";
        return `Posted ${days}d ago`;
    };

    const handleCategorySelect = (cat: { id: number; name: string }) => {
        setActiveCategory({
            categoryId: cat.id,
            name: cat.name,
            resolved: activeCategory.resolved,
            openCount: activeCategory.openCount,
            issues: activeCategory.issues,
        });
        setIsCategoryDropdownOpen(false);
    };

    const handleFilterToggle = (filterId: string) => {
        setTempSelectedFilters(prev =>
            prev.includes(filterId) ? prev.filter(id => id !== filterId) : [...prev, filterId]
        );
    };

    const handleApplyFilters = () => {
        setSelectedFilters(tempSelectedFilters);
        setIsFilterOpen(false);
    };

    const handleClearFilters = () => {
        setTempSelectedFilters([]);
        setSelectedFilters([]);
        setIsFilterOpen(false);
    };

    const getFilterBadgeIcon = (iconName: string) => {
        // Bug 2/4: icons exported from the Figma Badges frame (5478:14446)
        const iconMap: Record<string, string> = {
            "check-circle": "/assets/icon/badges/solution-ready.svg",
            "attention": "/assets/icon/badges/needs-attention.svg",
            "antenna": "/assets/icon/badges/widespread.svg",
            "chat": "/assets/icon/badges/high-discussion.svg",
            "time-alert": "/assets/icon/badges/long-overdue.svg",
            "graph-up": "/assets/icon/badges/rising-quickly.svg",
            "surging": "/assets/icon/badges/surging-now.svg",
        };
        return iconMap[iconName] || "/assets/icon/badges/needs-attention.svg";
    };

    // Badge filter ids → backend adminBadge keys (from appendAdminPingBadges)
    const FILTER_ID_TO_BADGE_KEY: Record<string, string> = {
        "solution-ready": "SOLUTION_READY",
        "needs-attention": "NEEDS_ATTENTION",
        "widespread": "WIDESPREAD",
        "high-discussion": "HIGH_DISCUSSION",
        "long-overdue": "LONG_OVERDUE",
        "rising-quickly": "RISING_QUICKLY",
        "surging-now": "SURGING_NOW",
    };

    // Root cause (badge-filter half of Bug 3): selectedFilters was stored but
    // never applied to the rendered list. Filter pings by their adminBadges.
    const visiblePings = selectedFilters.length === 0
        ? pings
        : pings.filter((ping) => {
            const keys = (ping.adminBadges ?? []).map((b: { key: string }) => b.key);
            return selectedFilters.some((f) => keys.includes(FILTER_ID_TO_BADGE_KEY[f]));
        });

    return (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40" onClick={onClose}>
            <div
            className="bg-[#FFF8F0] rounded-t-[24px] md:rounded-[20px] w-full max-w-[1000px] h-[75vh] md:h-[90vh] overflow-y-auto flex flex-col mx-0 md:mx-4 animate-[admin-sheet-up_220ms_ease-out]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-center px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3 relative">
                    <h2 className="text-[20px] md:text-[26px] text-center w-full font-semibold text-[#212121] font-['Poppins',sans-serif]">
                        Ping Index
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#F49B31] absolute right-4 md:right-6 text-[14px] md:text-[16px] font-medium cursor-pointer"
                    >
                        <X size={18} className="md:hidden" />
                        <X size={20} className="hidden md:block" />
                    </button>
                </div>

                {/* Category + Filter Bar */}
                <div className="flex items-center justify-between px-4 md:px-6 pb-3 md:pb-4 relative">
                    <div ref={categoryDropdownRef} className="relative">
                        <button
                            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                            className="inline-flex items-center gap-1.5 md:gap-2 bg-[#F49B31] text-white rounded-full px-3 md:px-4 py-1 md:py-1.5 cursor-pointer hover:bg-[#e88a20] transition-colors"
                        >
                            {(() => {
                                const icon = (categoryImages as Record<string, string>)[activeCategory.name] || (categoryImages as Record<string, string>).General;
                                return icon ? <img src={icon} alt={activeCategory.name} className="w-4 h-4 md:w-5 md:h-5 p-0.5 md:p-1 object-contain bg-white rounded-full" /> : null;
                            })()}
                            <span className="text-[12px] md:text-[14px] font-medium whitespace-nowrap">{activeCategory.name}</span>
                            <ChevronDown width={12} height={12} className="md:hidden bg-white text-[#F49B31] rounded-full" />
                            <ChevronDown width={14} height={14} className="hidden md:block bg-white text-[#F49B31] rounded-full" />
                        </button>

                        {isCategoryDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] z-50 min-w-[180px] overflow-hidden">
                                <div className="p-4 flex flex-col gap-3">
                                    {allCategories.map((cat) => {
                                        const isActive = activeCategory.categoryId === cat.id;
                                        const catIcon = (categoryImages as Record<string, string>)[cat.name] || (categoryImages as Record<string, string>).General;
                                        return (
                                            <button
                                                key={cat.id}
                                                onClick={() => handleCategorySelect(cat)}
                                                className={`flex items-center gap-3 w-full text-left hover:opacity-80 transition-opacity ${isActive ? 'opacity-100' : 'opacity-70'}`}
                                            >
                                                <div className={`w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center shrink-0 ${isActive ? 'border-[#F49B31] bg-[#F49B31]' : 'border-[#D1D5DB]'}`}>
                                                    {isActive && <Check size={12} className="text-white" />}
                                                </div>
                                                {catIcon && (
                                                    <img src={catIcon} alt={cat.name} className="w-[21px] h-[21px] object-contain" />
                                                )}
                                                <span className="text-[15px] font-semibold text-[#212121] font-['Poppins',sans-serif]">
                                                    {cat.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div ref={filterRef} className="relative">
                        <button
                            onClick={() => {
                                setTempSelectedFilters(selectedFilters);
                                setIsFilterOpen(!isFilterOpen);
                            }}
                            className={`flex items-center gap-1 md:gap-1.5 text-[11px] md:text-[13px] cursor-pointer px-2 py-1 rounded-md transition-colors ${selectedFilters.length > 0 ? 'text-[#F49B31] bg-[#FEF5EA]' : 'text-[#6B7280] hover:text-[#212121]'}`}
                        >
                            <Filter size={12} className="md:hidden" />
                            <Filter size={14} className="hidden md:block" />
                            Filter
                            {selectedFilters.length > 0 && (
                                <span className="w-4 h-4 rounded-full bg-[#F49B31] text-white text-[9px] flex items-center justify-center font-semibold">
                                    {selectedFilters.length}
                                </span>
                            )}
                        </button>

                        {isFilterOpen && (
                            <div className="absolute top-full right-0 mt-2 bg-white rounded-[10px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] z-50 w-[min(280px,calc(100vw-24px))] max-h-[min(520px,calc(100vh-96px))] overflow-y-auto">
                                <div className="p-[10px_5px] flex flex-col">
                                    <div className="px-2.5 pb-2 border-b border-[#E5E7EB] mb-2">
                                        <span className="text-[13.75px] font-medium text-[#212121] font-['Poppins',sans-serif]">Badges</span>
                                    </div>
                                    <div className="flex flex-col gap-2.5 px-2.5 max-h-[300px] overflow-y-auto">
                                        {FILTER_BADGES.map((badge) => {
                                            const isSel = tempSelectedFilters.includes(badge.id);
                                            return (
                                                <button
                                                    key={badge.id}
                                                    onClick={() => handleFilterToggle(badge.id)}
                                                    className="flex items-center gap-2 w-full text-left hover:opacity-80 transition-opacity py-0.5"
                                                >
                                                    <div className={`w-[18px] h-[18px] rounded-full border-2 flex items-center justify-center shrink-0 ${isSel ? 'border-[#F49B31] bg-[#F49B31]' : 'border-[#D1D5DB]'}`}>
                                                        {isSel && <Check size={10} className="text-white" />}
                                                    </div>
                                                    <span
                                                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                                                        style={{ backgroundColor: badge.bgColor, color: badge.textColor }}
                                                    >
                                                        <img src={getFilterBadgeIcon(badge.icon)} alt="" className="w-3 h-3" />
                                                        {badge.label}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex items-center justify-between px-2.5 pt-3 mt-2 border-t border-[#E5E7EB]">
                                        <button
                                            onClick={handleClearFilters}
                                            className="text-[12px] font-medium text-[#6B7280] hover:text-[#212121] cursor-pointer"
                                        >
                                            Clear all
                                        </button>
                                        <button
                                            onClick={handleApplyFilters}
                                            className="text-[12px] font-semibold text-white bg-[#F49B31] hover:bg-[#e88a20] px-3 py-1 rounded-full cursor-pointer transition-colors"
                                        >
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="mx-4 md:mx-6 bg-white rounded-[10px] border border-[#F49B31] p-3 md:p-4 mb-3 md:mb-4">
                    <div className="flex items-center justify-center md:justify-center mb-2.5 md:mb-3 relative">
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="bg-[#FEF5EA] px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-[#F49B31] text-[#F49B31] text-[15px] md:text-[20px] font-bold">
                                {activeCategory.openCount} <span className="font-semibold text-[11px] md:text-[15px]">Open</span>
                            </div>
                            <div className="bg-[#FEF5EA] px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-[#F49B31] text-[#F49B31] text-[15px] md:text-[20px] font-bold">
                                {Math.round(activeCategory.openCount * activeCategory.resolved / Math.max(1, 100 - activeCategory.resolved))} <span className="font-semibold text-[11px] md:text-[15px]">Resolved</span>
                            </div>
                        </div>
                        <div className="text-right md:absolute md:right-0 md:-top-4 absolute right-0">
                            <span className="text-[22px] md:text-[32px] font-bold text-[#212121]">{activeCategory.resolved}%</span>
                            <span className="text-[10px] md:text-[12px] text-[#6B7280] block leading-tight">resolved</span>
                        </div>
                    </div>
                    <div className="w-full h-1.5 md:h-2 bg-black rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#F49B31] rounded-full"
                            style={{ width: `${activeCategory.resolved}%` }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="mx-4 md:mx-6 mb-4 md:mb-6 flex-1 overflow-auto">
                    {/* Table Header - hidden on mobile */}
                    <div className="hidden md:grid grid-cols-[1fr_140px_100px_110px] gap-2 px-4 py-2 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide border-b border-[#E5E7EB]">
                        <span>Ping</span>
                        <span>Admin Signals</span>
                        <span>Surges</span>
                        <span className="text-right">Status</span>
                    </div>

                    {/* Table Body */}
                    {loading ? (
                        <div className="flex items-center justify-center py-10 text-[#6B7280] text-[13px] md:text-[14px]">
                            Loading pings...
                        </div>
                    ) : visiblePings.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-[#6B7280] text-[13px] md:text-[14px]">
                            <Search size={48} className="mb-3 opacity-40" />
                            <span>No pings found in this category</span>
                        </div>
                    ) : (
                        <div className="divide-y divide-[#F0E6D9]">
                            {visiblePings.map((ping) => (
                                <a
                                    key={ping.id}
                                    href={`/admin/soundboard/${ping.id}`}
                                    className="grid grid-cols-[1.35fr_0.9fr_0.55fr_0.8fr] md:grid-cols-[1fr_140px_100px_110px] gap-1 md:gap-2 px-2 md:px-4 py-2 md:py-3 hover:bg-[#FEF5EA] transition-colors items-center"
                                >
                                    {/* Ping info - stacks on mobile */}
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <span className="inline-flex items-center self-start px-1.5 md:px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-medium bg-[#FEF5EA] text-[#F49B31] border border-[rgba(244,155,49,0.3)]">
                                            {ping.category?.name || activeCategory.name}
                                        </span>
                                        <span className="text-[11px] md:text-[13px] font-medium text-[#212121] line-clamp-2 md:truncate leading-tight">
                                            {ping.title}
                                        </span>
                                        <span className="text-[10px] md:text-[11px] text-[#9CA3AF]">
                                            {getPostedTime(ping.createdAt)}
                                        </span>
                                    </div>

                                    {/* Admin Signals — badge chips with Figma icons */}
                                    <div className="flex flex-col gap-1 min-w-0">
                                        {(ping.adminBadges ?? []).slice(0, 2).map((badge) => {
                                            const meta = FILTER_BADGES.find((b) => FILTER_ID_TO_BADGE_KEY[b.id] === badge.key);
                                            if (!meta) return null;
                                            return (
                                                <span
                                                    key={badge.key}
                                                    className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] md:text-[10px] font-medium whitespace-nowrap max-w-full truncate"
                                                    style={{ backgroundColor: meta.bgColor, color: meta.textColor }}
                                                >
                                                    <img src={getFilterBadgeIcon(meta.icon)} alt="" className="w-3 h-3" />
                                                    {badge.label}
                                                </span>
                                            );
                                        })}
                                    </div>

                                    {/* Surges + Status */}
                                    <div className="contents">
                                        {/* Surges */}
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-[11px] md:text-[13px] font-semibold text-[#F49B31] whitespace-nowrap">
                                                <img src="/assets/images/surge.svg" alt="Surge" className="w-3.5 h-3.5 md:w-4 md:h-4 inline-block mr-0.5 md:mr-1" />
                                                {ping.surgeCount}
                                            </span>
                                            <span className="text-[8px] md:text-[11px] text-[#9CA3AF] whitespace-nowrap">
                                                {getVelocity(ping)}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <div className="flex justify-end">
                                            {getStatusBadge(ping)}
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PingIndexModal;
