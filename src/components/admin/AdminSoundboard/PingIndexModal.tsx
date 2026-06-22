import React, { useState, useEffect } from "react";
import { ChevronDown, Filter, X } from "lucide-react";
import { adminService } from "../../../api/services/admin.service";
import { categoryImages } from "../../CategoryImages";
import type { AdminPing } from "../../../api/types/admin.types";
import type { CategoryData } from "./IssuesByCategoryCard";

interface PingIndexModalProps {
    category: CategoryData;
    onClose: () => void;
}

const getStatusBadge = (ping: AdminPing) => {
    const status = ping.progressStatus || ping.status;
    if (status === "RESOLVED" || status === "COMPLETED") {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-[9px] md:text-[10px] font-medium bg-[#F49B31] text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Resolved
            </span>
        );
    }
    if (status === "ACKNOWLEDGED" || status === "IN_PROGRESS" || status === "UNDER_REVIEW") {
        return (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-[9px] md:text-[10px] font-medium bg-[#2D2D2D] text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Acknowledged
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-0.5 rounded-full text-[9px] md:text-[10px] font-medium border border-[#D1D5DB] text-[#212121]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#212121]" />
            Open
        </span>
    );
};

const PingIndexModal: React.FC<PingIndexModalProps> = ({ category, onClose }) => {
    const [pings, setPings] = useState<AdminPing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPings = async () => {
            try {
                setLoading(true);
                const response = await adminService.getPings({ categoryId: category.categoryId, limit: 50 });
                setPings(response.data);
            } catch (err) {
                console.error("Failed to fetch pings:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPings();
    }, [category]);

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

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
            <div
                className="bg-[#FFF8F0] rounded-none md:rounded-2xl w-full max-w-[800px] max-h-screen md:max-h-[90vh] overflow-hidden flex flex-col mx-0 md:mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-center px-4 md:px-6 pt-4 md:pt-5 pb-2 md:pb-3 relative">
                    <h2 className="text-[17px] md:text-[22px] text-center w-full font-semibold text-[#212121] font-['Poppins',sans-serif]">
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

                {/* Category Badge + Filters */}
                <div className=" flex items-center justify-center gap-2.5 md:flex-row md:items-center md:justify-center px-4 md:px-6 pb-3 md:pb-4 relative">
                    <div className="inline-flex items-center gap-1.5 md:gap-2 bg-[#F49B31] text-white rounded-full px-3 md:px-4 py-1 md:py-1.5">
                        {(() => {
                            const icon = (categoryImages as Record<string, string>)[category.name] || (categoryImages as Record<string, string>).General;
                            return icon ? <img src={icon} alt={category.name} className="w-4 h-4 md:w-5 md:h-5 p-0.5 md:p-1 object-contain bg-white rounded-full" /> : null;
                        })()}
                        <span className="text-[12px] md:text-[14px] font-medium">{category.name}</span>
                        <ChevronDown width={12} height={12} className="md:hidden bg-white text-[#F49B31] rounded-full" />
                        <ChevronDown width={14} height={14} className="hidden md:block bg-white text-[#F49B31] rounded-full" />
                    </div>

                    <div className="flex items-center gap-2.5 md:gap-3 absolute right-4 md:right-6">
                        <button className="flex items-center gap-1 md:gap-1.5 text-[11px] md:text-[13px] text-[#6B7280] hover:text-[#212121] cursor-pointer">
                            <Filter size={12} className="md:hidden" />
                            <Filter size={14} className="hidden md:block" />
                            Filter
                        </button>
                        {/* <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D1D5DB] bg-white text-[13px] text-[#212121]">
                            <Zap size={12} className="text-[#F49B31]" fill="#F49B31" />
                            Surging now
                        </div> */}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="mx-4 md:mx-6 bg-white rounded-xl border border-[rgba(244,155,49,0.3)] p-3 md:p-4 mb-3 md:mb-4">
                    <div className="flex items-center justify-center md:justify-center mb-2.5 md:mb-3 relative">
                        <div className="flex items-center gap-2 md:gap-4">
                            <div className="bg-[#FEF5EA] px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-[#F49B31] text-[#F49B31] text-[15px] md:text-[20px] font-bold">
                                {category.openCount} <span className="font-semibold text-[11px] md:text-[15px]">Open</span>
                            </div>
                            <div className="bg-[#FEF5EA] px-3 md:px-4 py-1 md:py-1.5 rounded-full border border-[#F49B31] text-[#F49B31] text-[15px] md:text-[20px] font-bold">
                                {Math.round(category.openCount * category.resolved / Math.max(1, 100 - category.resolved))} <span className="font-semibold text-[11px] md:text-[15px]">Resolved</span>
                            </div>
                        </div>
                        <div className="text-right md:absolute md:right-0 md:-top-4 absolute right-0">
                            <span className="text-[22px] md:text-[32px] font-bold text-[#212121]">{category.resolved}%</span>
                            <span className="text-[10px] md:text-[12px] text-[#6B7280] block leading-tight">resolved</span>
                        </div>
                    </div>
                    <div className="w-full h-1.5 md:h-2 bg-black rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#F49B31] rounded-full"
                            style={{ width: `${category.resolved}%` }}
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
                    ) : pings.length === 0 ? (
                        <div className="flex items-center justify-center py-10 text-[#6B7280] text-[13px] md:text-[14px]">
                            No pings in this category
                        </div>
                    ) : (
                        <div className="divide-y divide-[#F0E6D9]">
                            {pings.map((ping) => (
                                <a
                                    key={ping.id}
                                    href={`/admin/soundboard/${ping.id}`}
                                    className="md:grid md:grid-cols-[1fr_140px_100px_110px] md:gap-2 px-3 md:px-4 py-2.5 md:py-3 hover:bg-[#FEF5EA] transition-colors md:items-center flex flex-col gap-1.5 "
                                >
                                    {/* Ping info - stacks on mobile */}
                                    <div className="flex flex-col gap-0.5 min-w-0 md:col-span-1">
                                        <span className="inline-flex items-center self-start px-1.5 md:px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-medium bg-[#FEF5EA] text-[#F49B31] border border-[rgba(244,155,49,0.3)]">
                                            {ping.category?.name || category.name}
                                        </span>
                                        <span className="text-[12px] md:text-[13px] font-medium text-[#212121] truncate">
                                            {ping.title}
                                        </span>
                                        <span className="text-[10px] md:text-[11px] text-[#9CA3AF]">
                                            {getPostedTime(ping.createdAt)}
                                        </span>
                                    </div>

                                    {/* Admin Signals - empty for now */}
                                    <div className="hidden md:block" />

                                    {/* Surges + Status */}
                                    <div className="flex items-center justify-between md:contents gap-3 md:gap-0">
                                        {/* Surges */}
                                        <div className="flex flex-col">
                                            <span className="text-[12px] md:text-[13px] font-semibold text-[#F49B31]">
                                                <img src="/assets/images/surge.svg" alt="Surge" className="w-3.5 h-3.5 md:w-4 md:h-4 inline-block mr-0.5 md:mr-1" />
                                                {ping.surgeCount}
                                            </span>
                                            <span className="text-[10px] md:text-[11px] text-[#9CA3AF]">
                                                {getVelocity(ping)}
                                            </span>
                                        </div>

                                        {/* Status */}
                                        <div className="flex md:justify-end">
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
