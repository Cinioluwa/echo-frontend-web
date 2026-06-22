import React, { useState, useEffect } from "react";
import { ChevronDown, Filter } from "lucide-react";
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
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#F49B31] text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Resolved
            </span>
        );
    }
    if (status === "ACKNOWLEDGED" || status === "IN_PROGRESS" || status === "UNDER_REVIEW") {
        return (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#2D2D2D] text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                Acknowledged
            </span>
        );
    }
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium border border-[#D1D5DB] text-[#212121]">
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
                className="bg-[#FFF8F0] rounded-2xl w-full max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col mx-4"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-center px-6 pt-5 pb-3 relative">
                    <h2 className="text-[22px] text-center w-full font-semibold text-[#212121] font-['Poppins',sans-serif]">
                        Ping Index
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-[#F49B31] absolute right-6 text-[16px] font-medium hover:underline cursor-pointer"
                    >
                        Close
                    </button>
                </div>

                {/* Category Badge + Filters */}
                <div className="flex items-center justify-center px-6 pb-4 relative">
                    <div className=" inline-flex items-center gap-2 bg-[#F49B31] text-white rounded-full px-4 py-1.5">
                        {(() => {
                            const icon = (categoryImages as Record<string, string>)[category.name] || (categoryImages as Record<string, string>).General;
                            return icon ? <img src={icon} alt={category.name} className="w-5 h-5 p-1 object-contain bg-white rounded-full" /> : null;
                        })()}
                        <span className="text-[14px] font-medium">{category.name}</span>
                        <ChevronDown width={14} height={14} className="bg-white text-[#F49B31] rounded-full" />
                    </div>

                    <div className="flex items-center gap-3 absolute right-6">
                        <button className="flex items-center gap-1.5 text-[13px] text-[#6B7280] hover:text-[#212121] cursor-pointer">
                            <Filter size={14} />
                            Filter
                        </button>
                        {/* <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#D1D5DB] bg-white text-[13px] text-[#212121]">
                            <Zap size={12} className="text-[#F49B31]" fill="#F49B31" />
                            Surging now
                        </div> */}
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="mx-6 bg-white rounded-xl border border-[rgba(244,155,49,0.3)] p-4 mb-4">
                    <div className="flex items-center justify-center mb-3 relative">
                        <div className="flex items-center gap-4">
                            <div className="bg-[#FEF5EA] px-4 py-1.5 rounded-full border border-[#F49B31] text-[#F49B31] text-[20px] font-bold">
                                {category.openCount} <span className="font-semibold text-[15px]">Open</span>
                            </div>
                            <div className="bg-[#FEF5EA] px-4 py-1.5 rounded-full border border-[#F49B31] text-[#F49B31] text-[20px] font-bold">
                                {Math.round(category.openCount * category.resolved / Math.max(1, 100 - category.resolved))} <span className="font-semibold text-[15px]">Resolved</span>
                            </div>
                        </div>
                        <div className="text-right absolute right-0 -top-4 text-[13px] text-[#6B7280]">
                            <span className="text-[32px] font-bold text-[#212121]">{category.resolved}%</span>
                            <span className="text-[12px] text-[#6B7280] block leading-tight">resolved</span>
                        </div>
                    </div>
                    <div className="w-full h-2 bg-black rounded-full overflow-hidden">
                        <div
                            className="h-full bg-[#F49B31] rounded-full"
                            style={{ width: `${category.resolved}%` }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="mx-6 mb-6 flex-1 overflow-auto">
                    {/* Table Header */}
                    <div className="grid grid-cols-[1fr_140px_100px_110px] gap-2 px-4 py-2 text-[12px] font-semibold text-[#6B7280] uppercase tracking-wide border-b border-[#E5E7EB]">
                        <span>Ping</span>
                        <span>Admin Signals</span>
                        <span>Surges</span>
                        <span className="text-right">Status</span>
                    </div>

                    {/* Table Body */}
                    {loading ? (
                        <div className="flex items-center justify-center py-10 text-[#6B7280] text-[14px]">
                            Loading pings...
                        </div>
                    ) : pings.length === 0 ? (
                        <div className="flex items-center justify-center py-10 text-[#6B7280] text-[14px]">
                            No pings in this category
                        </div>
                    ) : (
                        <div className="divide-y divide-[#F0E6D9]">
                            {pings.map((ping) => (
                                <a
                                    key={ping.id}
                                    href={`/admin/soundboard/${ping.id}`}
                                    className="grid grid-cols-[1fr_140px_100px_110px] gap-2 px-4 py-3 hover:bg-[#FEF5EA] transition-colors items-center"
                                >
                                    {/* Ping */}
                                    <div className="flex flex-col gap-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[13px] font-medium text-[#212121] truncate">
                                                {ping.title}
                                            </span>
                                            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium bg-[#FEF5EA] text-[#F49B31] border border-[rgba(244,155,49,0.3)]">
                                                {ping.category?.name || category.name}
                                            </span>
                                        </div>
                                        <span className="text-[11px] text-[#9CA3AF]">
                                            {getPostedTime(ping.createdAt)}
                                        </span>
                                    </div>

                                    {/* Admin Signals - empty for now */}
                                    <div />

                                    {/* Surges */}
                                    <div className="flex flex-col">
                                        <span className="text-[13px] font-semibold text-[#F49B31]">
                                            <img src="/assets/images/surge.svg" alt="Surge" className="w-4 h-4 inline-block mr-1" />
                                            {ping.surgeCount}
                                        </span>
                                        <span className="text-[11px] text-[#9CA3AF]">
                                            {getVelocity(ping)}
                                        </span>
                                    </div>

                                    {/* Status */}
                                    <div className="flex justify-end">
                                        {getStatusBadge(ping)}
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
