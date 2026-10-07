import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import { TrendingUp, MessageSquare, Radio, CheckCircle2, Send } from "lucide-react";
import { categoryImages } from "../../CategoryImages";
import KPICard from "./KPICard";
import CommentsPanel from "./CommentsPanel";
import StatusTimeline from "./StatusTimeline";
import type { StatusEvent, RelatedPing, PingDetailPermissions, WaveActionStatus } from "./types";
import AdminPingWaves from "./AdminPingWaves";
import { motion } from "framer-motion";
import pingService from "../../../api/services/ping.service";
import { adminService } from "../../../api/services/admin.service";
import type { Ping, User } from "../../../api/types/index";
import { useAuthStore } from "../../../stores";
import representativeService from "../../../api/services/representative.service";
import { usePageTitle } from "../../../hooks/usePageTitle";
import RelatedPings from "./RelatedPings";
import { getRelatedTitleScore } from "./relatedPingMatching";
import BadgeTooltip from "../../BadgeTooltip";
import AssignPingModal from "../../AssignPingModal";
import formatTimeAgo from "../../../utils/formatTimeAgo";

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
    unresolvedFor: string;
    statusEvents: StatusEvent[];
    officialResponse?: { content: string; createdAt: string; author: { firstName: string; lastName: string } } | null;
}

interface AdminPingDetailProps {
    pingId?: string;
    mode?: "admin" | "rep";
}

const iconVariants = {
    initial: { filter: "grayscale(1) brightness(1)", willChange: "filter" },
    hover: {
        filter: "grayscale(1) brightness(1.5)",
        transition: { duration: 0.1 }
    }
};

const ADMIN_PERMISSIONS: PingDetailPermissions = {
    canRespond: true,
    canAcknowledge: true,
    canModerateWaves: true,
    canUpdateWaveProgress: true,
    canUrgeResolve: false,
    canAssign: true,
};

const pingIsInRepresentativeScope = (ping: Ping, user: User | null | undefined) => {
    const profile = user?.representativeProfile;
    if (!user || !profile?.isActive) return false;
    if (
        ping.assignedToUserId === user.id ||
        (!!profile.bodyId && ping.assignedToBodyId === profile.bodyId)
    ) {
        return true;
    }
    const categories =
        profile.responsibilities && profile.responsibilities !== "*"
            ? profile.responsibilities.split(",").map((name) => name.trim()).filter(Boolean)
            : null;
    const departmentId = profile.departmentId ?? profile.body?.departmentId ?? null;
    return (
        (!departmentId || ping.targetDepartmentId === departmentId) &&
        (profile.scopeLevel == null || ping.targetLevel === profile.scopeLevel) &&
        (!profile.scopeHall || ping.targetHall === profile.scopeHall) &&
        (!categories || categories.includes(ping.category?.name ?? ""))
    );
};

const AdminPingDetail: React.FC<AdminPingDetailProps> = ({ pingId: propPingId, mode = "admin" }) => {
    const routeParams = useParams<{ pingId: string }>();
    const pingId = propPingId || routeParams.pingId;
    const user = useAuthStore((s) => s.user);

    const permissions = useMemo<PingDetailPermissions>(() => {
        if (mode === "admin") return ADMIN_PERMISSIONS;
        const profile = user?.representativeProfile;
        const active = !!profile?.isActive;
        return {
            canRespond: active && !!profile?.canRespond,
            canAcknowledge: active && !!profile?.canAcknowledge,
            canModerateWaves: active && !!profile?.canModerateWaves,
            canUpdateWaveProgress: active && !!profile?.canUpdateWaveProgress,
            canUrgeResolve: active,
            canAssign: active && !!profile?.canAssign,
        };
    }, [mode, user]);

    const [pingData, setPingData] = useState<Ping | null>(null);
    usePageTitle(mode === "admin" ? pingData?.title : undefined, mode === "admin");
    const [relatedPings, setRelatedPings] = useState<RelatedPing[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [responseText, setResponseText] = useState("");
    const [responseFocused, setResponseFocused] = useState(false);
    const [postingResponse, setPostingResponse] = useState(false);
    const [acknowledging, setAcknowledging] = useState(false);
    const [urging, setUrging] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const [redirectToUserDetail, setRedirectToUserDetail] = useState(false);

    const fetchPing = useCallback(async () => {
        if (!pingId) return;
        try {
            const data = await pingService.getPingById(pingId);
            if (mode === "rep" && !pingIsInRepresentativeScope(data, user)) {
                setRedirectToUserDetail(true);
                return;
            }
            setPingData(data);
            setError(null);
        } catch (err: any) {
            setError(err?.response?.data?.error || err.message || "Failed to load ping");
        } finally {
            setLoading(false);
        }
    }, [pingId, mode, user]);

    useEffect(() => {
        setLoading(true);
        fetchPing();
    }, [fetchPing]);

    const categoryForRelated = pingData?.category?.name;
    const currentId = pingData?.id;
    const currentTitle = pingData?.title || "";
    useEffect(() => {
        if (!categoryForRelated || !currentId) return;
        let cancelled = false;
        pingService
            .getPingsByCategory(categoryForRelated, { limit: 50 })
            .then((res) => {
                if (cancelled) return;
                const scored = res.data
                    .filter((p) => p.id !== currentId)
                    .map((p) => ({ ping: p, score: getRelatedTitleScore(currentTitle, p.title) }))
                    .filter(({ score }) => score >= 0.3)
                    .sort((a, b) =>
                        b.score - a.score ||
                        b.ping.surgeCount - a.ping.surgeCount ||
                        b.ping.createdAt.localeCompare(a.ping.createdAt),
                    )
                    .slice(0, 3);
                setRelatedPings(
                    scored.map(({ ping }) => ({
                        id: ping.id.toString(),
                        category: ping.category?.name || categoryForRelated,
                        title: ping.title,
                        waveCount: ping.surgeCount,
                    })),
                );
            })
            .catch((relatedError) => {
                console.error("Failed to load related pings:", relatedError);
                if (!cancelled) setRelatedPings([]);
            });
        return () => {
            cancelled = true;
        };
    }, [categoryForRelated, currentId, currentTitle]);

    const mapPingToDetailData = (ping: Ping): PingDetailData => {
        const ageMs = Date.now() - new Date(ping.createdAt).getTime();
        const ageDays = Math.floor(ageMs / (1000 * 60 * 60 * 24));
        const diff = ping.surgeCount - (ping._count?.surges ?? 0);
        const ackBy = mode === "admin" ? "Admin" : "Representative";

        return {
            id: ping.id.toString(),
            title: ping.title,
            content: ping.content,
            category: { name: ping.category?.name || "General" },
            author: {
                name: ping.author ? `${ping.author.firstName} ${ping.author.lastName}` : (ping.anonymousAlias || "Anonymous"),
                avatar: ping.author?.profilePicture || `https://ui-avatars.com/api/?name=${ping.author?.firstName || "A"}+${ping.author?.lastName || "U"}&background=random`,
                timestamp: formatTimeAgo(ping.createdAt),
            },
            badges: ping.surgeCount > 100 ? ["SURGING_NOW"] : [],
            mediaUrl: ping.media?.[0]?.url,
            surgeCount: ping.surgeCount,
            surgeDelta: diff > 0 ? `↑ +${diff} today` : undefined,
            unresolvedFor: `${ageDays} day${ageDays !== 1 ? "s" : ""}`,
            statusEvents: [
                { status: "Ping Posted", timestamp: new Date(ping.createdAt).toLocaleString() },
                ...((ping as any).acknowledgedAt ? [{ status: `Acknowledged by ${ackBy}`, timestamp: new Date((ping as any).acknowledgedAt).toLocaleString() }] : []),
                ...(ping.assignedToUser ? [{ status: `Assigned to ${`${ping.assignedToUser.firstName ?? ""} ${ping.assignedToUser.lastName ?? ""}`.trim() || ping.assignedToUser.email}`, timestamp: (ping as any).assignedAt ? new Date((ping as any).assignedAt).toLocaleString() : "" }] : []),
                ...(ping.assignedToBody ? [{ status: `Assigned to ${ping.assignedToBody.name}`, timestamp: (ping as any).assignedAt ? new Date((ping as any).assignedAt).toLocaleString() : "" }] : []),
                ...(ping.resolvedAt ? [{ status: "Resolved", timestamp: new Date(ping.resolvedAt).toLocaleString() }] : []),
            ],
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
            setResponseFocused(false);
            await fetchPing();
        } catch (err: any) {
            setNotice(err?.response?.data?.error || "Failed to post response");
        } finally {
            setPostingResponse(false);
        }
    };

    const handleAcknowledge = async () => {
        if (!pingId) return;
        try {
            setAcknowledging(true);
            await adminService.acknowledgePing(parseInt(pingId));
            await fetchPing();
        } catch (err: any) {
            setNotice(err?.response?.data?.error || "Failed to acknowledge ping");
        } finally {
            setAcknowledging(false);
        }
    };

    const handleUrgeResolve = async () => {
        if (!pingId) return;
        try {
            setUrging(true);
            const res = await representativeService.urgePingResolution(parseInt(pingId));
            setNotice(res.message || "The author has been asked to mark this ping as resolved.");
        } catch (err: any) {
            setNotice(err?.response?.data?.error || "Failed to send reminder");
        } finally {
            setUrging(false);
        }
    };

    const handleUpdateWaveStatus = async (id: number, status: WaveActionStatus, reason?: string) => {
        try {
            await adminService.updateWaveStatus(id, { status, reason });
            await fetchPing();
        } catch (err: any) {
            console.error("Failed to update wave status", err);
            throw new Error(err?.response?.data?.error || err?.response?.data?.message || "Failed to update wave status");
        }
    };

    if (loading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#f49b31] border-t-transparent" />
            </div>
        );
    }

    if (redirectToUserDetail) {
        return <Navigate to={`/feed/${pingId}`} replace />;
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
                    {error}
                    <button onClick={fetchPing} className="ml-2 underline">Retry</button>
                </div>
            </div>
        );
    }

    if (!pingData) {
        return (
            <div className="p-6">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-gray-500">Ping not found</div>
            </div>
        );
    }

    const detail = mapPingToDetailData(pingData);
    const categoryName = detail.category?.name || "General";
    const categoryIcon = (categoryImages as Record<string, string>)[categoryName] || (categoryImages as Record<string, string>).General;
    const isAcknowledged = !!(pingData as any).acknowledgedAt || (pingData as any).progressStatus === "ACKNOWLEDGED";
    const isResolved = !!pingData.resolvedAt;
    const canPostResponse = permissions.canRespond && !detail.officialResponse;

    return (
        <div className="flex w-full min-w-0 flex-col items-start gap-5 px-3 py-6 sm:px-5">
            <h1 className="font-poppins text-[28px] font-semibold leading-[30.8px] tracking-[-0.5px] text-black">
                Ping Details
            </h1>

            {notice && (
                <div className="flex w-full items-center justify-between rounded-[10px] border border-[#f49b31] bg-[#fef5ea] px-4 py-2 font-poppins text-[13px] font-medium text-[#171717]">
                    <span>{notice}</span>
                    <button onClick={() => setNotice(null)} className="ml-3 text-[#f49b31]">Dismiss</button>
                </div>
            )}

            <div className="flex w-full min-w-0 flex-col gap-[25px] min-[1131px]:flex-row min-[1131px]:items-start">
                <div className="flex min-w-0 flex-1 flex-col gap-5">
                    <div className="flex w-full items-center justify-between">
                        <button
                            onClick={handleGoBack}
                            className="flex items-center gap-2 rounded-[20px] bg-[#fefefe] px-[15px] py-[10px] transition-colors hover:bg-[#fef5ea]"
                        >
                            <img src="/assets/icon/back-arrow.svg" alt="" className="size-5" />
                            <span className="font-poppins text-[13px] font-semibold text-black">Go back</span>
                        </button>
                        <motion.button
                            className="flex items-center gap-2 rounded-lg border border-[#f49b31] bg-[#fef5ea] px-[15px] py-[9px] text-[#f49b31] transition-colors hover:bg-[#f49b31] hover:text-white"
                            whileHover="hover"
                        >
                            <motion.img src="/assets/icon/Export.svg" alt="" className="size-3" variants={iconVariants} />
                            <span className="font-poppins text-[12px] font-medium">Export</span>
                        </motion.button>
                    </div>

                    <div className="flex flex-col gap-[18px] rounded-[10px] bg-[#fefefe] px-5 py-[15px]">
                        <div className="flex min-w-0 items-center gap-2 sm:gap-4 max-[500px]:gap-1">
                            <img
                                src={detail.author.avatar}
                                alt={detail.author.name}
                                className="size-10 shrink-0 rounded-full object-cover sm:size-[53px] max-[500px]:size-8"
                            />
                            <div className="flex min-w-0 flex-1 flex-col items-start">
                                <p className="max-w-full truncate whitespace-nowrap font-poppins text-[13px] font-semibold text-black sm:text-[15px] max-[500px]:text-[11px]">{detail.author.name}</p>
                                <p className="whitespace-nowrap font-poppins text-[9px] font-medium text-[#8b8e8d] sm:text-[13px] max-[500px]:text-[8px]">{detail.author.timestamp}</p>
                            </div>
                            <div className="flex max-w-[44%] shrink-0 flex-nowrap items-center justify-end gap-1">
                                {detail.badges?.map((badgeKey: string) => {
                                    const badge = badgeConfigs[badgeKey as AdminBadgeType];
                                    if (!badge) return null;
                                    return (
                                        <BadgeTooltip key={badgeKey} badgeKey={badgeKey}>
                                            <span
                                                className="flex max-w-full items-center gap-1 overflow-hidden whitespace-nowrap rounded-[28.75px] px-1.5 py-[3px] font-poppins text-[9px] font-medium sm:gap-[7.5px] sm:px-[18.75px] sm:text-[13.75px]"
                                                style={{ backgroundColor: badge.bgColor, color: badge.textColor }}
                                            >
                                                {badge.icon} <span className="truncate">{badge.label}</span>
                                            </span>
                                        </BadgeTooltip>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {categoryIcon && <img src={categoryIcon} alt="" className="size-5 object-contain" />}
                            <p className="font-poppins text-[15px] font-medium text-[#171717]">{categoryName}</p>
                        </div>

                        <h2 className="font-poppins text-[16px] font-semibold text-black">{detail.title}</h2>
                        <p className="text-justify font-poppins text-[15px] font-medium text-[#626665]">{detail.content}</p>

                        {detail.mediaUrl && (
                            <div className="aspect-[4096/2548] w-full overflow-hidden rounded-[10px] bg-black">
                                <img src={detail.mediaUrl} alt="Ping content" className="h-full w-full object-cover" />
                            </div>
                        )}
                    </div>

                    {(canPostResponse || detail.officialResponse) && (
                        <div className="flex flex-col gap-[10px] rounded-[15px] bg-white p-[10px]">
                            <h3 className="font-poppins text-[18px] font-medium text-black">Official Response</h3>
                            {detail.officialResponse ? (
                                <div className="rounded-[15px] bg-[#fef5ea] p-4">
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className="font-poppins text-[13px] font-semibold text-[#f49b31]">
                                            {detail.officialResponse.author.firstName} {detail.officialResponse.author.lastName}
                                        </span>
                                        <span className="text-[11px] text-[#8b8e8d]">
                                            {new Date(detail.officialResponse.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="font-poppins text-[13px] text-[#212121]">{detail.officialResponse.content}</p>
                                </div>
                            ) : (
                                <div
                                    className={`flex w-full gap-2 rounded-[20px] border-2 border-[#ffc37b] bg-[#fefefe] p-[5px] ${
                                        responseFocused ? "flex-col" : "h-[50px] items-center pl-5"
                                    }`}
                                >
                                    <input
                                        value={responseText}
                                        onChange={(e) => setResponseText(e.target.value)}
                                        onFocus={() => setResponseFocused(true)}
                                        onClick={() => setResponseFocused(true)}
                                        placeholder="Post an update visible to all students"
                                        className="min-w-0 flex-1 bg-transparent font-poppins text-[14px] font-medium text-black outline-none placeholder:text-[#9e9e9e]"
                                    />
                                    {responseFocused && (
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handlePostResponse}
                                                disabled={postingResponse || !responseText.trim()}
                                                className="flex shrink-0 items-center gap-1 rounded-[20px] border border-black bg-[#fef5ea] px-[10px] py-[3px] font-['Baloo_Bhai_2',sans-serif] text-[14px] font-bold uppercase text-black disabled:opacity-50"
                                            >
                                                <Send className="size-[22px]" />
                                                {postingResponse ? "..." : "Post response"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="flex w-full flex-col gap-5 sm:flex-row">
                        <KPICard icon="/assets/images/surge.svg" label="Surge count" value={detail.surgeCount} delta={detail.surgeDelta} />
                        <KPICard label="Unresolved for" value={detail.unresolvedFor} />
                    </div>

                    <AdminPingWaves
                        waves={pingData.waves || []}
                        permissions={permissions}
                        onUpdateWaveStatus={handleUpdateWaveStatus}
                    />
                </div>

                <div className="flex w-full min-w-0 flex-col gap-[15px] min-[1131px]:w-[381px] min-[1131px]:shrink-0">
                    <CommentsPanel comments={pingData.comments || []} />
                    <StatusTimeline events={detail.statusEvents || []} />
                    <RelatedPings
                        pings={relatedPings}
                        detailBasePath={mode === "rep" ? "/inbox" : "/admin/soundboard"}
                    />
                    {permissions.canAcknowledge && !isAcknowledged && !isResolved && (
                        <button
                            onClick={handleAcknowledge}
                            disabled={acknowledging}
                            className="flex h-[39px] w-full items-center justify-center gap-2 rounded-[20px] bg-[#f49b31] font-['Baloo_Bhai_2',sans-serif] text-[14px] font-bold uppercase text-white hover:bg-[#e68a1f] disabled:opacity-50"
                        >
                            <img src="/assets/icon/followup-acknowledged.svg" alt="" className="size-5 brightness-0 invert" />
                            {acknowledging ? "..." : "Acknowledge"}
                        </button>
                    )}
                    {permissions.canAssign && (
                        <button
                            onClick={() => setIsAssignModalOpen(true)}
                            className="flex h-[39px] w-full items-center justify-center gap-2 rounded-[20px] border border-[#f49b31] bg-[#fef5ea] font-['Baloo_Bhai_2',sans-serif] text-[14px] font-bold uppercase text-[#f49b31] hover:bg-[#fdebd2]"
                        >
                            Assign Ping
                        </button>
                    )}
                    {permissions.canUrgeResolve && !isResolved && (
                        <button
                            onClick={handleUrgeResolve}
                            disabled={urging}
                            className="flex h-[39px] w-full items-center justify-center gap-2 rounded-[20px] border border-[#f49b31] bg-[#fef5ea] font-['Baloo_Bhai_2',sans-serif] text-[14px] font-bold uppercase text-[#f49b31] hover:bg-[#fdebd2] disabled:opacity-50"
                        >
                            {urging ? "..." : "Urge author to resolve"}
                        </button>
                    )}
                </div>
            </div>

            {isAssignModalOpen && (
                <AssignPingModal
                    ping={pingData}
                    organizationId={user?.organizationId ?? null}
                    onClose={() => setIsAssignModalOpen(false)}
                    onAssigned={(updatedPing) => {
                        setPingData((prev) => (prev ? { ...prev, ...updatedPing } : updatedPing));
                        setNotice("Ping assigned successfully.");
                    }}
                />
            )}
        </div>
    );
};

export default AdminPingDetail;
