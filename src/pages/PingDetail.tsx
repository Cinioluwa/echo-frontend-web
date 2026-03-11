/**
 * PingDetail
 * Figma ref: 4139:10022 (mobile), 3643:8353 (desktop layout)
 * Phase: 3
 *
 * Full detail view for a Ping. Displays:
 * - Back button
 * - ProposeWaveBar
 * - Ping content card (author, category, title, description, stats)
 * - Wave cards list with rank/status badges
 * - MarkAsResolvedBar (ping author or admin only, when waves exist)
 * - CommentsPanel inline on mobile (desktop version lives in Layout right-aside)
 */
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore, useSurgeStore } from "../stores";
import ProposeWaveBar from "../components/ProposeWaveBar";
import MarkAsResolvedBar from "../components/MarkAsResolvedBar";
import CommentsPanel from "../components/CommentsPanel";
import { categoryImages } from "../components/CategoryImages";
import type { Ping, Wave } from "../api/types";

// TODO: API — GET /api/pings/:pingId
const MOCK_PING: Ping = {
    id: 1,
    title: "Poor Wi-Fi Coverage in Engineering Block D",
    content:
        "The Wi-Fi signal in Engineering Block D has been extremely weak for the past two weeks. Students are unable to access online resources or submit assignments on time. This affects both lectures and independent study sessions. Please look into extending the router coverage or installing additional access points.",
    category: { id: 2, name: "Academics" },
    hashtag: "#wifi #engineering",
    author: {
        id: 42,
        firstName: "Kofi",
        lastName: "Mensah",
        email: "kofi@uni.edu",
        role: "USER",
        organizationId: 1,
        status: "ACTIVE",
        createdAt: "2025-01-10T09:00:00Z",
    },
    status: "POSTED",
    surgeCount: 27,
    hasSurged: false,
    createdAt: "2025-06-01T10:30:00Z",
    _count: { waves: 3, comments: 12, surges: 27 },
};

// TODO: API — GET /api/pings/:pingId/waves
const MOCK_WAVES: Wave[] = [
    {
        id: 101,
        solution:
            "Install additional Wi-Fi access points in every lecture room and study hall in Block D. The IT department should conduct a signal audit first.",
        author: {
            id: 55,
            firstName: "Ama",
            lastName: "Owusu",
            email: "ama@uni.edu",
            role: "USER",
            organizationId: 1,
            status: "ACTIVE",
            createdAt: "2025-01-15T00:00:00Z",
        },
        surgeCount: 18,
        viewCount: 0,
        hasSurged: false,
        rank: 1,
        status: "POSTED",
        createdAt: "2025-06-02T08:15:00Z",
        _count: { surges: 18, comments: 5 },
    },
    {
        id: 102,
        solution:
            "Negotiate with the ISP to increase bandwidth allocation to the Engineering Block. The current pipeline is shared among over 400 students simultaneously.",
        author: {
            id: 60,
            firstName: "Kwame",
            lastName: "Asante",
            email: "kwame@uni.edu",
            role: "USER",
            organizationId: 1,
            status: "ACTIVE",
            createdAt: "2025-02-01T00:00:00Z",
        },
        surgeCount: 12,
        viewCount: 0,
        hasSurged: false,
        rank: 2,
        status: "UNDER_REVIEW",
        createdAt: "2025-06-02T11:00:00Z",
        _count: { surges: 12, comments: 2 },
    },
    {
        id: 103,
        solution:
            "Provide offline access to key learning materials via a local server so students can work even with poor connectivity.",
        author: {
            id: 73,
            firstName: "Abena",
            lastName: "Frimpong",
            email: "abena@uni.edu",
            role: "USER",
            organizationId: 1,
            status: "ACTIVE",
            createdAt: "2025-03-20T00:00:00Z",
        },
        surgeCount: 7,
        viewCount: 0,
        hasSurged: false,
        status: "UNDER_REVIEW",
        createdAt: "2025-06-03T14:30:00Z",
        _count: { surges: 7, comments: 1 },
    },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

const formatTimestamp = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
        const h = Math.floor(diffMs / (1000 * 60 * 60));
        if (h === 0) {
            const m = Math.floor(diffMs / (1000 * 60));
            return m <= 1 ? "Just now" : `${m}m ago`;
        }
        return `${h}h ago`;
    }
    if (diffDays < 30) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const getAuthorName = (author: Wave["author"]) => {
    if (!author) return "Anonymous";
    if (typeof author === "string") return author;
    return `${author.firstName} ${author.lastName}`;
};

const getAuthorInitials = (name: string) =>
    name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

// ─── WaveCard ────────────────────────────────────────────────────────────────

interface WaveCardProps {
    wave: Wave;
    isOwner: boolean;
    onDelete?: (id: number) => void;
}

const WaveCard = ({ wave, isOwner, onDelete }: WaveCardProps) => {
    const toggleSurge = useSurgeStore((state) => state.toggleSurge);
    const hasSurged = useSurgeStore((state) => state.hasSurged("wave", String(wave.id)));
    const isToggling = useSurgeStore(
        (state) => state.isToggling[`wave-${wave.id}`] || false,
    );

    const authorName = getAuthorName(wave.author);
    const initials = getAuthorInitials(authorName);
    const surgeCount = wave.surgeCount || wave._count?.surges || 0;

    const handleSurge = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isToggling) return;
        try {
            await toggleSurge("wave", String(wave.id));
        } catch (err) {
            console.error("Wave surge failed:", err);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        // TODO: API — DELETE /api/waves/:waveId
        onDelete?.(wave.id);
    };

    // Badge logic: rank 1-3 = Top 3, UNDER_REVIEW = Under Review, POSTED = Posted
    const badge =
        wave.rank && wave.rank <= 3
            ? { label: "Top 3", color: "#f49b31" }
            : wave.status === "UNDER_REVIEW"
                ? { label: "Under Review", color: "#f5c518" }
                : wave.status === "POSTED"
                    ? { label: "Posted", color: "#22c55e" }
                    : null;

    return (
        <div className="bg-white rounded-[10px] px-[27.5px] py-[23px] flex flex-col gap-[17px] w-full">
            {/* Header: avatar + name/time + badge */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#ffc37b] flex items-center justify-center shrink-0 overflow-hidden">
                        <span className="font-semibold text-[13px] text-white">{initials}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-black">
                            {authorName}
                        </span>
                        <span className="font-['Poppins:Medium',sans-serif] text-[8px] text-[#8b8e8d]">
                            {formatTimestamp(wave.createdAt)}
                        </span>
                    </div>
                </div>

                {badge && (
                    <div className="border border-[#626665] rounded-[23px] flex items-center gap-1.5 px-[11px] py-1">
                        <div
                            className="w-[5px] h-[5px] rounded-full shrink-0"
                            style={{ backgroundColor: badge.color }}
                        />
                        <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-black">
                            {badge.label}
                        </span>
                    </div>
                )}
            </div>

            {/* Body: solution text + surge + optional delete */}
            <div className="flex items-start justify-between gap-2.5">
                <p className="flex-1 font-['Poppins:Medium',sans-serif] text-[12px] text-black leading-relaxed">
                    {wave.solution}
                </p>

                <div className="flex flex-col items-center gap-2 shrink-0">
                    {/* Surge button */}
                    <button
                        type="button"
                        onClick={handleSurge}
                        disabled={isToggling}
                        aria-label={hasSurged ? "Remove surge" : "Surge"}
                        className={`flex items-center gap-[5px] px-2 py-[5px] rounded-[15px] border border-black cursor-pointer transition-colors disabled:opacity-50 ${hasSurged
                            ? "bg-[#f49b31] text-white border-[#f49b31]"
                            : "bg-[#fef5ea] text-[#4a504e]"
                            }`}
                    >
                        <svg
                            width="10"
                            height="14"
                            viewBox="0 0 12 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                d="M6.5 1L1 9h5l-0.5 6 6-8H7l0.5-6z"
                                fill={hasSurged ? "white" : "#4A504E"}
                            />
                        </svg>
                        <span className="font-['Poppins:SemiBold',sans-serif] text-[11px]">
                            {surgeCount}
                        </span>
                    </button>

                    {/* Delete — own waves only */}
                    {isOwner && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            aria-label="Delete wave"
                            className="w-7 h-7 rounded-full bg-[#fef5ea] flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer"
                        >
                            <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                            >
                                <path
                                    d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                                    stroke="#EF4444"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

// ─── PingDetail Page ─────────────────────────────────────────────────────────

const PingDetail = () => {
    const { pingId } = useParams<{ pingId: string }>();
    const navigate = useNavigate();
    const currentUser = useAuthStore((state) => state.user);
    const toggleSurge = useSurgeStore((state) => state.toggleSurge);
    const hasSurged = useSurgeStore((state) =>
        state.hasSurged("ping", String(MOCK_PING.id)),
    );
    const isToggling = useSurgeStore(
        (state) => state.isToggling[`ping-${MOCK_PING.id}`] || false,
    );

    // TODO: API — replace with pingService.getPing(pingId) + wavesService.getWaves(pingId)
    const ping = MOCK_PING;
    const waves = MOCK_WAVES;

    const pingAuthorId =
        typeof ping.author === "object" ? ping.author?.id : undefined;
    const isAuthor = currentUser?.id === pingAuthorId;
    const isAdmin =
        currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
    const canResolve = isAuthor || isAdmin;

    const authorName = getAuthorName(ping.author);
    const authorInitials = getAuthorInitials(authorName);
    const categoryName = ping.category?.name || "";
    const categoryIcon = categoryImages[categoryName];
    const surgeCount = ping.surgeCount || ping._count?.surges || 0;
    const commentCount = ping._count?.comments || 0;
    const waveCount = ping._count?.waves || waves.length || 0;

    const handleSurge = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isToggling) return;
        try {
            await toggleSurge("ping", String(ping.id));
        } catch (err) {
            console.error("Surge failed:", err);
        }
    };

    return (
        <div className="flex flex-col gap-[15px] pb-[30px]">
            {/* ── Back button ───────────────────────────── */}
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/feed")}
                    className="bg-[#fefefe] rounded-[18px] w-[59px] h-[25px] px-2 flex items-center gap-1 cursor-pointer border border-[#e0e0e0]"
                >
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M15 18l-6-6 6-6"
                            stroke="#171717"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="font-['Poppins:Medium',sans-serif] text-[10px] text-black">
                        Back
                    </span>
                </button>
            </div>

            {/* ── ProposeWaveBar ────────────────────────── */}
            <ProposeWaveBar
                pingId={pingId ?? String(ping.id)}
                pingTitle={ping.title}
                pingCreatedAt={ping.createdAt}
            />

            {/* ── Ping Card ─────────────────────────────── */}
            <div className="bg-[#fefefe] rounded-[10px] px-5 py-[15px] flex flex-col gap-[15px] w-full">
                {/* Author row */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-[#ffc37b] flex items-center justify-center shrink-0 overflow-hidden">
                            <span className="font-semibold text-[13px] text-white">
                                {authorInitials}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-['Poppins:SemiBold',sans-serif] text-[13px] text-black">
                                {authorName}
                            </span>
                            <span className="font-['Poppins:Medium',sans-serif] text-[8px] text-[#8b8e8d]">
                                {formatTimestamp(ping.createdAt)}
                            </span>
                        </div>
                    </div>

                    {/* Category badge */}
                    {categoryName && (
                        <div className="flex items-center gap-[5px]">
                            {categoryIcon && (
                                <img
                                    src={categoryIcon}
                                    alt={categoryName}
                                    className="w-3 h-3 object-contain"
                                />
                            )}
                            <span className="font-['Poppins:Medium',sans-serif] text-[13px] text-[#171717]">
                                {categoryName}
                            </span>
                        </div>
                    )}
                </div>

                {/* Title */}
                <h1 className="font-['Poppins:SemiBold',sans-serif] text-[12px] text-black">
                    {ping.title}
                </h1>

                {/* Description */}
                {ping.content && (
                    <p className="font-['Poppins:Medium',sans-serif] text-[12px] text-[#626665] text-justify leading-relaxed">
                        {ping.content}
                    </p>
                )}

                {/* Stats: surge + comments + waves */}
                <div className="flex items-center gap-[15px]">
                    {/* Surge button */}
                    <button
                        type="button"
                        onClick={handleSurge}
                        disabled={isToggling}
                        aria-label={hasSurged ? "Remove surge" : "Surge"}
                        className={`flex items-center gap-[5px] px-2 py-1 rounded-[15px] border border-black cursor-pointer transition-colors disabled:opacity-50 ${hasSurged
                            ? "bg-[#f49b31] text-white border-[#f49b31]"
                            : "bg-[#fef5ea] text-[#4a504e]"
                            }`}
                    >
                        <svg
                            width="10"
                            height="14"
                            viewBox="0 0 12 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                        >
                            <path
                                d="M6.5 1L1 9h5l-0.5 6 6-8H7l0.5-6z"
                                fill={hasSurged ? "white" : "#4A504E"}
                            />
                        </svg>
                        <span className="font-['Poppins:SemiBold',sans-serif] text-[11px]">
                            {surgeCount}
                        </span>
                    </button>

                    <span className="font-['Inter:Medium',sans-serif] text-[11px] text-[#63637b]">
                        {commentCount} Comments
                    </span>
                    <span className="font-['Inter:Medium',sans-serif] text-[11px] text-[#63637b]">
                        {waveCount} Waves Proposed
                    </span>
                </div>
            </div>

            {/* ── Wave Cards ────────────────────────────── */}
            {waves.length > 0 && (
                <div className="flex flex-col gap-2.5">
                    {waves.map((wave) => (
                        <WaveCard
                            key={wave.id}
                            wave={wave}
                            isOwner={
                                currentUser?.id ===
                                (typeof wave.author === "object" ? wave.author?.id : undefined)
                            }
                        />
                    ))}
                </div>
            )}

            {/* ── Mark as Resolved bar ─────────────────── */}
            {waves.length > 0 && canResolve && (
                <MarkAsResolvedBar pingId={pingId ?? String(ping.id)} />
            )}

            {/* ── CommentsPanel (mobile only — desktop uses Layout right-aside) ── */}
            <div className="lg:hidden">
                <CommentsPanel pingId={pingId ?? String(ping.id)} />
            </div>
        </div>
    );
};

export default PingDetail;
