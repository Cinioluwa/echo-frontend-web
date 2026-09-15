import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { usePageTitle } from "../../../hooks/usePageTitle";
import { ArrowLeft, Send } from "lucide-react";
import { categoryImages } from "../../CategoryImages";
import KPICard from "./KPICard";
import CommentsPanel from "./CommentsPanel";
import StatusTimeline from "./StatusTimeline";
import RelatedPings from "./RelatedPings";
import AdminWaveCard from "./AdminWaveCard";
import AdminPingWaves from "./AdminPingWaves";
import type { StatusEvent, RelatedPing } from "./types";
import pingService from "../../../api/services/ping.service";
import { adminService } from "../../../api/services/admin.service";
import type { Ping } from "../../../api/types/index";

/** One 24h surge window returned by /admin/overview/surging-issues. */
interface SurgeWindowPoint {
    pingId: number;
    title: string;
    categoryId: number | null;
    categoryName: string | null;
    surges: number;
}

/**
 * Extra fields the API returns on the admin ping-detail payload that are not
 * part of the shared `Ping` type: the server-computed triage badges
 * (`adminBadges`), the acknowledgement timestamp and the related-ping list.
 */
type PingDetailPayload = Ping & {
    acknowledgedAt?: string | null;
    adminBadges?: Array<{ key: string; label: string; group?: string }>;
    _related?: RelatedPingRecord[];
    relatedPings?: RelatedPingRecord[];
};

interface RelatedPingRecord {
    id: number;
    title: string;
    surgeCount?: number;
    category?: { name?: string } | null;
    _count?: { surges?: number };
}

/** Normalises axios/Error throws without resorting to `any`. */
const getApiErrorMessage = (err: unknown, fallback: string): string => {
    if (typeof err === "object" && err !== null) {
        const response = (err as { response?: { data?: { error?: string } } }).response;
        if (response?.data?.error) return response.data.error;
        const message = (err as { message?: string }).message;
        if (message) return message;
    }
    return fallback;
};

/**
 * Triage-badge icon. The backend sends SCREAMING_SNAKE keys
 * (e.g. SURGING_NOW) and the Figma-exported badge set (5478:14446) is stored
 * as kebab-case files, so SURGING_NOW → /assets/icon/badges/surging-now.svg.
 */
const adminBadgeIcon = (key: string) =>
    `/assets/icon/badges/${key.toLowerCase().replace(/_/g, "-")}.svg`;

const getAdminBadgeClasses = (key: string) => {
    const classes: Record<string, string> = {
        SOLUTION_READY: "bg-[#B2FFCC] text-[#067647]",
        NEEDS_ATTENTION: "bg-[#CACACA] text-[#454545]",
        WIDESPREAD: "bg-[#B5D0FF] text-[#0035AC]",
        HIGH_DISCUSSION: "bg-[#EAD9FF] text-[#531EA3]",
        LONG_OVERDUE: "bg-[#F7C8B2] text-[#B04712]",
        RISING_QUICKLY: "bg-[#FFD6A5] text-[#A3651E]",
        SURGING_NOW: "bg-[#FFD7D7] text-[#B01212]",
    };
    return classes[key] || "bg-[#FEF5EA] text-[#F49B31]";
};

/**
 * Surge sparkline. The ping payload carries no surge timestamps, so the series
 * is built from the admin surging-issues endpoint: one 24h window per day for
 * the last 4 days, oldest window first.
 */
const SurgeSparkline: React.FC<{ series: number[] }> = ({ series }) => {
    if (series.length < 2 || series.every((value) => value === 0)) {
        return (
            <p className="font-poppins text-[12px] text-[#5e5c58]">
                No surge activity recorded in the last 4 days.
            </p>
        );
    }

    const max = Math.max(...series, 1);
    const stepX = 100 / (series.length - 1);
    const coordinates = series.map((value, index) => ({
        x: index * stepX,
        y: 31 - (value / max) * 25,
    }));
    const line = coordinates
        .map((point) => `${point.x.toFixed(2)},${point.y.toFixed(2)}`)
        .join(" ");

    return (
        <svg
            viewBox="0 0 100 32"
            preserveAspectRatio="none"
            className="w-full h-[92px]"
            role="img"
            aria-label="Surges per day over the last four days"
        >
            <line x1="0" y1="5" x2="100" y2="5" stroke="#F0E6D9" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1="18" x2="100" y2="18" stroke="#F0E6D9" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1="31" x2="100" y2="31" stroke="#F0E6D9" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            <polygon points={`0,31 ${line} 100,31`} fill="rgba(244,155,49,0.14)" />
            <polyline
                points={line}
                fill="none"
                stroke="#F49B31"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
            />
            {coordinates.map((point, index) => (
                <circle key={index} cx={point.x} cy={point.y} r="2" fill="#F49B31" stroke="#fff" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            ))}
        </svg>
    );
};

interface PingDetailData {
    id: string;
    title: string;
    content: string;
    category: { name: string };
    author: { name: string; avatar: string; timestamp: string };
    mediaUrl?: string;
    surgeCount: number;
    surgeDelta?: string;
    surgeDeltaIcon?: string;
    unresolvedFor: string;
    statusEvents: StatusEvent[];
    relatedPings: RelatedPing[];
    officialResponse?: { content: string; createdAt: string; author: { firstName: string; lastName: string } } | null;
}

interface AdminPingDetailProps {
    pingId?: string;
}

const AdminPingDetail: React.FC<AdminPingDetailProps> = ({ pingId: propPingId }) => {
    const routeParams = useParams<{ pingId: string }>();
    const pingId = propPingId || routeParams.pingId;

    const [pingData, setPingData] = useState<Ping | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isResponseActive, setIsResponseActive] = useState(false);
    const [responseText, setResponseText] = useState("");
    const [postingResponse, setPostingResponse] = useState(false);
    const [acknowledging, setAcknowledging] = useState(false);
    // Four 24h surge windows (oldest → newest) powering the sparkline and the
    // same-category "related pings" list.
    const [surgeWindows, setSurgeWindows] = useState<SurgeWindowPoint[][]>([]);
    const [showCommentsDrawer, setShowCommentsDrawer] = useState(false);

    usePageTitle(pingData?.title);

    useEffect(() => () => {
        document.title = "Echo";
    }, []);

    const fetchPing = useCallback(async () => {
        if (!pingId) return;
        try {
            setLoading(true);
            const data = await pingService.getPingById(pingId);
            setPingData(data);
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to load ping"));
        } finally {
            setLoading(false);
        }
    }, [pingId]);

    useEffect(() => {
        fetchPing();
    }, [fetchPing]);

    // Surge sparkline + related pings. The ping payload carries no surge
    // timestamps, so we ask the admin surging-issues endpoint for four 24h
    // windows (oldest → newest) and read this ping's surge count in each.
    useEffect(() => {
        const numericPingId = Number(pingId);
        if (!pingId || Number.isNaN(numericPingId)) return;

        let cancelled = false;
        const dayOffsets = [72, 48, 24, 0];

        Promise.all(
            dayOffsets.map((offsetHours) =>
                adminService
                    .getSurgingIssues({ hours: 24, offsetHours, minEvents: 1, limit: 100 })
                    .then((response): SurgeWindowPoint[] =>
                        response.items.map((item) => ({
                            pingId: item.pingId,
                            title: item.title,
                            categoryId: item.category?.id ?? null,
                            categoryName: item.category?.name ?? null,
                            surges: item.currentSurges,
                        })),
                    )
                    .catch((): SurgeWindowPoint[] => []),
            ),
        ).then((windows) => {
            if (!cancelled) setSurgeWindows(windows);
        });

        return () => {
            cancelled = true;
        };
    }, [pingId]);

    const mapPingToDetailData = (ping: Ping): PingDetailData => {
        const payload = ping as PingDetailPayload;
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
            mediaUrl: ping.media?.[0]?.url,
            surgeCount: ping.surgeCount,
            surgeDelta: diff > 0 ? `+${diff} today` : undefined,
            surgeDeltaIcon: diff > 0 ? "↑" : undefined,
            unresolvedFor: `${ageDays} day${ageDays !== 1 ? 's' : ''}`,
            statusEvents: [
                { status: "Ping Posted", timestamp: new Date(ping.createdAt).toLocaleString() },
                ...(payload.acknowledgedAt ? [{ status: "Acknowledged by Admin", timestamp: new Date(payload.acknowledgedAt).toLocaleString() }] : []),
                ...(ping.resolvedAt ? [{ status: "Resolved", timestamp: new Date(ping.resolvedAt).toLocaleString() }] : []),
            ],
            relatedPings: (payload._related || payload.relatedPings || []).map(
                (related): RelatedPing => ({
                    id: String(related.id),
                    category: related.category?.name || "General",
                    title: related.title,
                    waveCount: related.surgeCount ?? related._count?.surges ?? 0,
                }),
            ),
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
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to post response"));
        } finally {
            setPostingResponse(false);
        }
    };

    const handleAcknowledge = async () => {
        if (!pingId || acknowledging) return;
        try {
            setAcknowledging(true);
            await adminService.acknowledgePing(Number(pingId));
            setPingData((current) => current ? { ...current, progressStatus: "ACKNOWLEDGED" } : current);
        } catch (err) {
            setError(getApiErrorMessage(err, "Failed to acknowledge ping"));
        } finally {
            setAcknowledging(false);
        }
    };

    const handleUpdateWaveStatus = async (id: number, status: "APPROVED" | "REJECTED" | "UNDER_REVIEW", reason?: string) => {
        try {
            await adminService.updateWaveStatus(id, { status, reason });
            await fetchPing();
        } catch (err) {
            console.error("Failed to update wave status", err);
            // Optionally, we could set an error state here or show a toast
        }
    };

    if (loading) {
        return (
            <div className="flex-1 min-w-0 flex items-center justify-center h-[400px]">
                <div className="animate-spin w-12 h-12 border-4 border-[#f49b31] border-t-transparent rounded-full" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 min-w-0 p-4 sm:p-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                    <button onClick={fetchPing} className="ml-2 underline">Retry</button>
                </div>
            </div>
        );
    }

    if (!pingData) {
        return (
            <div className="flex-1 min-w-0 p-4 sm:p-6">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">Ping not found</div>
            </div>
        );
    }

    const detail = mapPingToDetailData(pingData);
    const categoryName = detail.category?.name || "General";
    const categoryIcon = (categoryImages as Record<string, string>)[categoryName] || (categoryImages as Record<string, string>).General;
    // Server-computed triage badges (max 2, already priority-ordered) plus the
    // Community Pick (top wave by surge share) and same-category related pings.
    const adminBadges = (pingData as PingDetailPayload).adminBadges || [];
    const allWaves = pingData.waves || [];
    const sortedWaves = [...allWaves].sort((a, b) => (b.surgeCount ?? 0) - (a.surgeCount ?? 0));
    const communityPick = sortedWaves[0] || null;
    const alternativeWaves = sortedWaves.slice(1);

    // Sparkline: this ping's surge count in each of the last four 24h windows.
    const numericPingId = Number(pingId);
    const surgeSeries = surgeWindows.map(
        (window) => window.find((item) => item.pingId === numericPingId)?.surges ?? 0,
    );
    // Related pings = same-category siblings from the most recent surge window,
    // falling back to anything the API attached to the ping itself.
    const latestSurgeWindow = surgeWindows[surgeWindows.length - 1] || [];
    const categoryId = pingData.category?.id ?? pingData.categoryId;
    const surgeRelatedPings = latestSurgeWindow
        .filter((item) => item.pingId !== numericPingId && item.categoryId === categoryId)
        .slice(0, 3)
        .map((item) => ({
            id: String(item.pingId),
            category: item.categoryName || "General",
            title: item.title,
            waveCount: item.surges,
        }));
    const relatedPings: RelatedPing[] = surgeRelatedPings.length > 0
        ? surgeRelatedPings
        : detail.relatedPings.length > 0
            ? detail.relatedPings
            : allWaves
                .map((wave) => wave.ping)
                .filter((parent): parent is NonNullable<typeof parent> => Boolean(parent && parent.id !== numericPingId))
                .slice(0, 3)
                .map((parent) => ({
                    id: String(parent.id),
                    category: categoryName,
                    title: parent.title,
                    waveCount: 0,
                }));

    const isResolved = pingData.progressStatus === "RESOLVED" || Boolean(pingData.resolvedAt);
    const urgencyTitle = isResolved ? "Resolved" : `Unresolved for ${detail.unresolvedFor}`;
    const urgencyDescription = isResolved
        ? "This ping has been marked as resolved — the full history is in the status timeline."
        : adminBadges.length > 0
            ? `Triage signals: ${adminBadges.map((badge) => badge.label).join(" · ")}`
            : "No triage signals yet — keep an eye on the surge activity below.";

    return (
        <div className="flex-1 min-w-0 flex flex-col gap-4 sm:gap-6 px-3 sm:px-6 py-6 sm:py-8 relative" data-node-id="admin-ping-detail-page">
            {/* Header row: back button + admin triage signals (Figma 5802:28489) */}
            <div className="flex items-start justify-between flex-wrap gap-3">
                <div className="flex flex-col gap-2">
                    <h1 className="hidden sm:block font-poppins font-semibold text-[24px] sm:text-[28px] leading-none text-black">Ping Details</h1>
                    <button
                        onClick={handleGoBack}
                        className="bg-white hover:bg-[#fef5ea] border border-[#e0e0e0] rounded-[20px] px-4 py-2 flex items-center gap-2 transition-colors"
                    >
                        <ArrowLeft color="black" size={20} />
                        <p className="font-poppins font-semibold text-[12px] sm:text-[13px] text-black">Go back</p>
                    </button>
                </div>
            </div>

            {/* Two-column body (Figma 5802:28424): main column + 300px sidebar */}
            <div className="flex flex-col lg:flex-row items-start gap-5 lg:gap-[25px] w-full">
                {/* Main content column — flex-1 min-w-0 so it shrinks, never overlaps the sidebar */}
                <div className="flex-1 min-w-0 w-full flex flex-col gap-4 sm:gap-5" data-node-id="admin-ping-detail-main">
                    {/* Ping content card */}
                    <div className="order-1 bg-white border border-[rgba(244,155,49,0.3)] rounded-[10px] p-3 sm:p-5 flex flex-col gap-3 sm:gap-4">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                                <img src={detail.author.avatar} alt={detail.author.name} className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0" />
                                <div className="flex flex-col min-w-0">
                                    <span className="font-poppins font-semibold text-[11px] sm:text-[13px] text-black truncate">{detail.author.name}</span>
                                    <span className="font-poppins font-medium text-[9px] sm:text-[10px] text-[#8b8e8d] whitespace-nowrap">{detail.author.timestamp}</span>
                                </div>
                            </div>
                            {adminBadges.length > 0 && (
                                <div className="flex items-center justify-end gap-1.5 flex-wrap max-w-[58%]" data-node-id="admin-ping-detail-badges">
                                    {adminBadges.map((badge) => (
                                        <span
                                            key={badge.key}
                                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 font-poppins font-medium text-[9px] sm:text-[11px] whitespace-nowrap ${getAdminBadgeClasses(badge.key)}`}
                                        >
                                            <img src={adminBadgeIcon(badge.key)} alt="" className="w-3 h-3" />
                                            {badge.label}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            {categoryIcon ? <img src={categoryIcon} alt={categoryName} className="w-3.5 h-3.5 object-contain" /> : <span>📁</span>}
                            <p className="font-poppins font-medium text-[12px] sm:text-[14px] text-[#626665]">{categoryName}</p>
                        </div>
                        <h2 className="font-poppins font-semibold text-[15px] sm:text-[16px] text-black">{detail.title}</h2>
                        <p className="font-poppins font-medium text-[12px] sm:text-[14px] text-[#626665] text-justify leading-relaxed">{detail.content}</p>
                        {detail.mediaUrl && (
                            <div className="bg-black rounded-lg overflow-hidden aspect-[1.65/1]">
                                <img src={detail.mediaUrl} alt="Ping content" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>

                    {/* Urgency banner */}
                    <div
                        className={`hidden rounded-xl border px-4 py-3 items-start gap-3 ${isResolved ? "bg-[#EAF7EF] border-[#067647]/40" : "bg-[#FFF4E4] border-[#F49B31]"}`}
                        data-node-id="admin-ping-detail-urgency"
                    >
                        <img
                            src={isResolved ? "/assets/icon/badge-check.svg" : "/assets/icon/time-alert.svg"}
                            alt=""
                            className="w-4 h-4 mt-0.5 shrink-0"
                        />
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                            <p className={`font-poppins font-semibold text-[13px] ${isResolved ? "text-[#067647]" : "text-[#B04712]"}`}>
                                {urgencyTitle}
                            </p>
                            <p className="font-poppins text-[12px] text-[#626665]">{urgencyDescription}</p>
                        </div>
                    </div>

                    {/* KPI cards (Figma 5802:28511) */}
                    <div className="order-3 flex flex-col sm:flex-row gap-3 sm:gap-5 w-full">
                        <KPICard icon={<img src="/assets/images/surge.svg" className="w-4 h-4" alt="" />} label="Surge count" value={detail.surgeCount} delta={detail.surgeDelta} deltaIcon={detail.surgeDeltaIcon} />
                        <KPICard icon={<img src="/assets/icon/time-alert.svg" className="w-4 h-4" alt="" />} label="Unresolved for" value={detail.unresolvedFor} />
                    </div>

                    {/* Surge sparkline */}
                    <div
                        className="hidden bg-white border border-[rgba(244,155,49,0.3)] rounded-xl px-4 sm:px-5 py-4 flex-col gap-2"
                        data-node-id="admin-ping-detail-sparkline"
                    >
                        <div className="flex items-center justify-between gap-2">
                            <p className="font-poppins font-medium text-[13px] sm:text-[15px] text-[#f49b31]">Surge activity</p>
                            <p className="font-poppins font-medium text-[11px] sm:text-[12px] text-[#626665]">
                                last 4 days · {detail.surgeCount} total
                            </p>
                        </div>
                                <div className="flex items-center justify-between text-[10px] text-[#8b8e8d] font-poppins">
                                    <span>Quiet</span>
                                    <span>Current pace</span>
                                </div>
                        <SurgeSparkline series={surgeSeries} />
                        <div className="flex items-center justify-between font-poppins text-[10px] text-[#8b8e8d]">
                            <span>4 days ago</span>
                            <span>Today</span>
                        </div>
                    </div>

                    {/* Waves: Community Pick + one Alternative (Figma 5802:28525-28556).
                        Wave 1 is the highlighted community-pick card; Wave 2 is
                        the single plain alternative card. */}
                        <div className="order-4 flex flex-col gap-3 sm:gap-4 w-full" data-node-id="admin-ping-detail-waves">
                        <h2 className="font-poppins font-bold text-[22px] sm:text-[30px] text-black">Waves</h2>
                        {communityPick && (
                        <div data-node-id="admin-ping-detail-community-pick">
                            <AdminWaveCard wave={communityPick} badgeLabel="Community Pick" onUpdateStatus={handleUpdateWaveStatus} />
                        </div>
                    )}

                    {/* One alternative wave (Figma: plain Wave 2 card) */}
                    {alternativeWaves.slice(0, 1).map((wave) => (
                        <AdminWaveCard key={wave.id} wave={wave} badgeLabel="Alternative" onUpdateStatus={handleUpdateWaveStatus} />
                    ))}

                    {/* Remaining waves keep the full triage tabs */}
                    {alternativeWaves.length > 1 && (
                        <AdminPingWaves waves={alternativeWaves.slice(1)} onUpdateWaveStatus={handleUpdateWaveStatus} />
                    )}

                    {!communityPick && alternativeWaves.length === 0 && (
                        <p className="font-poppins text-[13px] text-[#626665]">No waves have been proposed on this ping yet.</p>
                    )}
                    </div>

                    {/* Official response / post response */}
                    <div className="order-2 bg-[#FFC37B] rounded-[15px] pt-2.5 flex flex-col gap-3">
                        <div className="flex items-center gap-2.5 px-2.5">
                            <img src="/assets/icon/official-response.svg" className="w-5 h-5" alt="Official Response Icon" />
                            <h3 className="font-poppins font-semibold text-[14px] sm:text-[18px] text-black">Official Response</h3>
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
                                <textarea
                                    onFocus={() => setIsResponseActive(true)}
                                    onBlur={() => !responseText && setIsResponseActive(false)}
                                    value={responseText}
                                    onChange={(e) => setResponseText(e.target.value)}
                                    placeholder="Post an update visible to all students"
                                    className="bg-white h-[50px] resize-none border border-[#ffc37b] rounded-[15px] ps-4 pe-[170px] py-3 font-poppins font-medium text-[12px] sm:text-[14px] placeholder-[#9e9e9e] outline-none focus:border-[#f49b31]"
                                />
                                {isResponseActive && (
                                    <button
                                        onClick={handlePostResponse}
                                        disabled={postingResponse || !responseText.trim()}
                                        className="self-end bg-[#fef5ea] hover:bg-[#fef0e0] border border-[#f49b31] rounded-[20px] px-4 py-2 flex items-center justify-center gap-2 font-poppins font-bold text-[11px] sm:text-[12px] uppercase text-[#f49b31] disabled:opacity-50"
                                    >
                                        <Send /> {postingResponse ? "..." : "Post response"}
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar column — Figma 300px rail (5802:28586): comments,
                    status timeline, related pings. Rendered on every
                    breakpoint (not desktop-only) so mobile/tablet also get
                    the 2-comment preview card; only its width/position is
                    responsive. */}
                <aside className="flex w-full lg:w-[300px] shrink-0 flex-col gap-3 sm:gap-4" data-node-id="admin-ping-detail-sidebar">
                    <CommentsPanel comments={pingData.comments || []} onViewAll={() => setShowCommentsDrawer(true)} />
                    <StatusTimeline events={detail.statusEvents || []} />
                    {relatedPings.length > 0 && <RelatedPings pings={relatedPings} />}
                    <button
                        type="button"
                        onClick={handleAcknowledge}
                        disabled={acknowledging || pingData.progressStatus === "ACKNOWLEDGED"}
                        className="w-full h-10 rounded-full bg-[#F49B31] text-white font-poppins font-semibold text-[11px] uppercase flex items-center justify-center gap-2 hover:bg-[#e88a20] transition-colors disabled:opacity-60"
                    >
                        <img src="/assets/figma/admin/acknowledge-eye.svg" alt="" className="w-4 h-4 brightness-0 invert" />
                        {acknowledging ? "Acknowledging..." : pingData.progressStatus === "ACKNOWLEDGED" ? "Acknowledged" : "Acknowledge"}
                    </button>
                </aside>
            </div>
            {showCommentsDrawer && (
                <div className="fixed inset-0 z-[70] bg-black/40" onClick={() => setShowCommentsDrawer(false)}>
                    <div className="absolute inset-x-0 bottom-0 h-[75vh] lg:inset-0 lg:m-auto lg:w-[560px] lg:h-[680px] lg:max-h-[85vh]" onClick={(event) => event.stopPropagation()}>
                        <CommentsPanel
                            comments={pingData.comments || []}
                            isDrawer
                            showViewAll={false}
                            onClose={() => setShowCommentsDrawer(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );

};

export default AdminPingDetail;