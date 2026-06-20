import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { TrendingUp, MessageSquare, Radio, CheckCircle2, ArrowLeft, Send } from "lucide-react";
import { categoryImages } from "../../CategoryImages";
import KPICard from "./KPICard";
import CommentsPanel from "./CommentsPanel";
import StatusTimeline from "./StatusTimeline";
import type { PingComment, StatusEvent, RelatedPing } from "./types";
import AdminPingWaves from "./AdminPingWaves";
import { motion } from "framer-motion";
import pingService from "../../../api/services/ping.service";
import { adminService } from "../../../api/services/admin.service";
import type { Ping } from "../../../api/types/index";

export type AdminBadgeType =
    | "SURGING_NOW"
    | "RISING_QUICKLY"
    | "LONG_OVERDUE"
    | "HIGH_DISCUSSION"
    | "WIDESPREAD"
    | "NEEDS_ATTENTION"
    | "SOLUTION_READY";

interface BadgeConfig {
    label: string;
    bgColor: string;
    textColor: string;
    icon: React.ReactNode;
}

const badgeConfigs: Record<AdminBadgeType, BadgeConfig> = {
    SURGING_NOW: {
        label: "Surging now",
        bgColor: "#ffd7d7",
        textColor: "#b01212",
        icon: <img src="/assets/icon/red-surge.svg" alt="Red lighting Icon" className="w-3 h-3" />
    },
    RISING_QUICKLY: {
        label: "Rising quickly",
        bgColor: "#ffd6a5",
        textColor: "#a3651e",
        icon: <TrendingUp className="w-3.5 h-3.5" />
    },
    LONG_OVERDUE: {
        label: "Long overdue",
        bgColor: "#f7c8b2",
        textColor: "#b04712",
        icon: <img src="/assets/icon/time-alert.svg" alt="Clock alert Icon" className="w-3 h-3" />
    },
    HIGH_DISCUSSION: {
        label: "High discussion",
        bgColor: "#ead9ff",
        textColor: "#531ea3",
        icon: <MessageSquare className="w-3.5 h-3.5" />
    },
    WIDESPREAD: {
        label: "Widespread",
        bgColor: "#b5d0ff",
        textColor: "#0035ac",
        icon: <Radio className="w-3.5 h-3.5" />
    },
    NEEDS_ATTENTION: {
        label: "Needs Attention",
        bgColor: "#cacaca",
        textColor: "#454545",
        icon: <img src="/assets/icon/alert.svg" alt="Alert Icon" className="w-3 h-3" />
    },
    SOLUTION_READY: {
        label: "Solution Ready",
        bgColor: "#b2ffcc",
        textColor: "#067647",
        icon: <CheckCircle2 className="w-3.5 h-3.5" />
    }
};

interface PingDetailData {
    id: string;
    title: string;
    content: string;
    category: { name: string };
    author: { name: string; avatar: string; timestamp: string };
    badges: string[];
    mediaUrl?: string;
    surgeCount: number;
    surgeDelta?: string;
    surgeDeltaIcon?: string;
    unresolvedFor: string;
    comments: PingComment[];
    statusEvents: StatusEvent[];
    relatedPings: RelatedPing[];
    officialResponse?: { content: string; createdAt: string; author: { firstName: string; lastName: string } } | null;
}

interface AdminPingDetailProps {
    pingId?: string;
}

const iconVariants = {
    initial: { filter: "grayscale(1) brightness(1)", willChange: "filter" },
    hover: {
        filter: "grayscale(1) brightness(1.5)",
        transition: { duration: 0.1 }
    }
};

const responseVariants = {
    initial: { height: 50 },
    active: {
        height: 90,
        transition: { duration: 0.1 }
    }
};

const resposeButtonVariants = {
    initial: { opacity: 0, scale: 0.95, pointerEvents: 'none' },
    active: {
        opacity: 1,
        scale: 1,
        pointerEvents: 'auto',
        transition: { duration: 0.1, delay: 0.05 }
    }
};

const AdminPingDetail: React.FC<AdminPingDetailProps> = ({ pingId: propPingId }) => {
    const routeParams = useParams<{ pingId: string }>();
    const pingId = propPingId || routeParams.pingId;

    const [pingData, setPingData] = useState<Ping | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isResponseActive, setIsResponseActive] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [postingResponse, setPostingResponse] = useState(false);

    const fetchPing = useCallback(async () => {
        if (!pingId) return;
        try {
            setLoading(true);
            const data = await pingService.getPingById(pingId);
            setPingData(data);
        } catch (err: any) {
            setError(err?.response?.data?.error || err.message || "Failed to load ping");
        } finally {
            setLoading(false);
        }
    }, [pingId]);

    useEffect(() => {
        fetchPing();
    }, [fetchPing]);

    const mapPingToDetailData = (ping: Ping): PingDetailData => {
        const ageMs = Date.now() - new Date(ping.createdAt).getTime();
        const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
        const diff = ping.surgeCount - (ping._count?.surges ?? 0);

        return {
            id: ping.id.toString(),
            title: ping.title,
            content: ping.content,
            category: { name: ping.category?.name || "General" },
            author: {
                name: ping.author ? `${ping.author.firstName} ${ping.author.lastName}` : (ping.anonymousAlias || "Anonymous"),
                avatar: ping.author?.profilePicture || `https://ui-avatars.com/api/?name=${ping.author?.firstName || "A"}+${ping.author?.lastName || "U"}&background=random`,
                timestamp: new Date(ping.createdAt).toLocaleDateString(),
            },
            badges: ping.surgeCount > 100 ? ["SURGING_NOW"] : [],
            mediaUrl: ping.media?.[0]?.url,
            surgeCount: ping.surgeCount,
            surgeDelta: diff > 0 ? `+${diff} today` : undefined,
            surgeDeltaIcon: diff > 0 ? "↑" : undefined,
            unresolvedFor: `${ageDays} day${ageDays !== 1 ? 's' : ''}`,
            comments: (ping.comments || []).map((c: any) => ({
                id: c.id?.toString() || Math.random().toString(),
                author: c.author ? `${c.author.firstName} ${c.author.lastName}` : "Anonymous",
                avatar: c.author?.profilePicture || `https://ui-avatars.com/api/?name=${c.author?.firstName || "A"}+${c.author?.lastName || "U"}&background=random`,
                text: c.content || "",
                likes: c.surgeCount || 0,
                replies: c.replyCount || 0,
            })),
            statusEvents: [
                { status: "Ping Posted", timestamp: new Date(ping.createdAt).toLocaleString() },
                ...((ping as any).acknowledgedAt ? [{ status: "Acknowledged by Admin", timestamp: new Date((ping as any).acknowledgedAt).toLocaleString() }] : []),
                ...(ping.resolvedAt ? [{ status: "Resolved", timestamp: new Date(ping.resolvedAt).toLocaleString() }] : []),
            ],
            relatedPings: [],
            officialResponse: ping.officialResponse ? {
                content: ping.officialResponse.content,
                createdAt: ping.officialResponse.createdAt,
                author: ping.officialResponse.author,
            } : null,
        };
    };

    const handleGoBack = () => {
        window.history.back();
    };

    const handlePostResponse = async () => {
        if (!responseText.trim() || !pingId) return;
        try {
            setPostingResponse(true);
            await adminService.createOfficialResponse(parseInt(pingId), {
                content: responseText.trim(),
            });
            setResponseText("");
            setIsResponseActive(false);
            await fetchPing();
        } catch (err: any) {
            setError(err?.response?.data?.error || "Failed to post response");
        } finally {
            setPostingResponse(false);
        }
    };

    const handleUpdateWaveStatus = async (id: number, status: "APPROVED" | "REJECTED" | "UNDER_REVIEW", reason?: string) => {
        try {
            await adminService.updateWaveStatus(id, { status, reason });
            await fetchPing();
        } catch (err: any) {
            console.error("Failed to update wave status", err);
            // Optionally, we could set an error state here or show a toast
        }
    };

    if (loading) {
        return (
            <div className="m-0 md:ms-[230px] flex items-center justify-center h-[400px]">
                <div className="animate-spin w-12 h-12 border-4 border-[#f49b31] border-t-transparent rounded-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="m-0 md:ms-[230px] p-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                    <button onClick={fetchPing} className="ml-2 underline">Retry</button>
                </div>
            </div>
        );
    }

    if (!pingData) {
        return (
            <div className="m-0 md:ms-[230px] p-6">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">Ping not found</div>
            </div>
        );
    }

    const detail = mapPingToDetailData(pingData);
    const categoryName = detail.category?.name || "General";
    const categoryIcon = (categoryImages as Record<string, string>)[categoryName] || (categoryImages as Record<string, string>).General;
    return (
        <div className="m-0 md:ms-[230px] flex flex-col gap-4 sm:gap-6 items-start px-3 sm:px-6 py-6 sm:py-8 relative">
            <div className="flex items-center justify-between w-full mb-2">
                <h1 className="font-poppins font-semibold text-[24px] sm:text-[28px] leading-normal text-black">
                    Ping Details
                </h1>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 w-full">
                <div className="flex-1 flex flex-col gap-4 sm:gap-6">
                    <div className="flex items-center justify-between w-full">
                        <button
                            onClick={handleGoBack}
                            className="bg-white hover:bg-[#fef5ea] border border-[#e0e0e0] rounded-[20px] px-4 sm:px-5 py-2 sm:py-2.5 flex items-center gap-2 transition-colors"
                        >
                            <ArrowLeft color="black" size={20} />
                            <p className="font-poppins font-semibold text-[12px] sm:text-[13px] text-black">Go back</p>
                        </button>
                        <motion.button
                            className="border border-[#f49b31] rounded-lg px-3 sm:px-[15px] py-2 sm:py-[9px] flex items-center gap-1 sm:gap-2 hover:bg-[#F49B31] text-[#f49b31] hover:text-white transition-colors text-xs sm:text-[12px]"
                            whileHover="hover"
                        >
                            <motion.img src="/assets/icon/Export.svg" alt="Export Icon" className="w-[13px] h-[13px]" variants={iconVariants} />
                            <span className="font-medium hidden sm:inline">Export</span>
                        </motion.button>
                    </div>

                    <div className="bg-white rounded-[10px] p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4 pb-3 sm:pb-4 border-b border-[#e0e0e0]">
                            <img
                                src={detail.author.avatar}
                                alt={detail.author.name}
                                className="w-[45px] sm:w-[53px] h-[45px] sm:h-[53px] rounded-full object-cover shrink-0"
                            />
                            <div className="flex-1 flex flex-col gap-1">
                                <p className="font-poppins font-semibold text-[13px] sm:text-[15px] text-black">
                                    {detail.author.name}
                                </p>
                                <p className="font-poppins font-medium text-[11px] sm:text-[13px] text-[#8b8e8d]">
                                    {detail.author.timestamp}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                {detail.badges?.map((badgeKey: string) => {
                                    const badge = badgeConfigs[badgeKey as AdminBadgeType];
                                    if (!badge) return null;
                                    return (
                                        <span
                                            key={badgeKey}
                                            className="flex items-center gap-[7.5px] rounded-[28.75px] px-[15px] py-1 font-poppins font-medium text-[10px] sm:text-[11px] whitespace-nowrap transition-all"
                                            style={{ backgroundColor: badge.bgColor, color: badge.textColor }}
                                        >
                                            {badge.icon} {badge.label}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {categoryIcon ? (
                                <img src={categoryIcon} alt={categoryName} className="w-3.5 h-3.5 object-contain" />
                            ) : (
                                <span>📁</span>
                            )}
                            <p className="font-poppins font-medium text-[12px] sm:text-[14px] text-[#626665]">{categoryName}</p>
                        </div>

                        <h2 className="font-poppins font-semibold text-[15px] sm:text-[16px] text-black">{detail.title}</h2>
                        <p className="font-poppins font-medium text-[12px] sm:text-[14px] text-[#626665] text-justify leading-relaxed">{detail.content}</p>

                        {detail.mediaUrl && (
                            <div className="bg-black rounded-lg overflow-hidden aspect-video">
                                <img src={detail.mediaUrl} alt="Ping content" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    <div className="bg-[#FFC37B] rounded-[15px] pt-2.5 sm:pt-2.5 flex flex-col gap-3">
                        <div className="flex items-center gap-2.5 px-2.5 sm:px-2.5">
                            <img src="/assets/icon/official-response.svg" className="w-5 h-5" alt="Official Response Icon" />
                            <h3 className="font-poppins font-semibold text-[14px] sm:text-[18px] text-black">
                                Official Response
                            </h3>
                        </div>

                        {detail.officialResponse ? (
                            <div className="bg-white p-5 rounded-b-[15px]">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-poppins font-semibold text-[13px] text-[#f49b31]">
                                        {detail.officialResponse.author.firstName} {detail.officialResponse.author.lastName}
                                    </span>
                                    <span className="text-[#8b8e8d] text-[11px]">
                                        {new Date(detail.officialResponse.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="font-poppins text-[13px] text-[#212121]">{detail.officialResponse.content}</p>
                            </div>
                        ) : (
                            <div className="relative flex flex-col gap-2 overflow-hidden">
                                <motion.textarea
                                    variants={responseVariants}
                                    onHoverStart={() => setIsResponseActive(true)}
                                    onHoverEnd={() => !responseText && setIsResponseActive(false)}
                                    onFocus={() => setIsResponseActive(true)}
                                    onBlur={() => !responseText && setIsResponseActive(false)}
                                    animate={isResponseActive ? "active" : "initial"}
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    placeholder="Post an update visible to all students"
                                    className="h-[50px] resize-none border border-[#ffc37b] rounded-[20px] ps-4 pe-[170px] py-3 font-poppins font-medium text-[12px] sm:text-[14px] placeholder-[#9e9e9e] outline-none focus:border-[#f49b31]"
                                />
                                <motion.button
                                    variants={resposeButtonVariants}
                                    animate={isResponseActive ? "active" : "initial"}
                                    onClick={handlePostResponse}
                                    disabled={postingResponse || !responseText.trim()}
                                    className="absolute right-1 bottom-1 bg-[#fef5ea] hover:bg-[#fef0e0] border border-[#f49b31] rounded-[20px] px-4 py-2 flex items-center justify-center gap-2 font-poppins font-bold text-[11px] sm:text-[12px] uppercase text-[#f49b31] disabled:opacity-50"
                                >
                                    <Send /> {postingResponse ? "..." : "Post response"}
                                </motion.button>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full">
                        <KPICard icon="⚡" label="Surge count" value={detail.surgeCount} delta={detail.surgeDelta} deltaIcon={detail.surgeDeltaIcon} />
                        <KPICard icon="" label="Unresolved For" value={detail.unresolvedFor} />
                    </div>
                    <div className="w-full">
                        <AdminPingWaves waves={pingData.waves || []} onUpdateWaveStatus={handleUpdateWaveStatus} />
                    </div>
                </div>

                <div className="w-full lg:w-[320px] sm:w-[300px] flex flex-col gap-3 sm:gap-4">
                    <CommentsPanel comments={detail.comments || []} />
                    <StatusTimeline events={detail.statusEvents || []} />
                </div>
            </div>
        </div>
    );
};

export default AdminPingDetail;