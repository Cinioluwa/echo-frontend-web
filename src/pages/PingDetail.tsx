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
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore, useSurgeStore } from "../stores";
import { pingService, waveService, categoryService } from "../api/services";
import ProposeWaveBar from "../components/ProposeWaveBar";
import MarkAsResolvedBar from "../components/MarkAsResolvedBar";
import CommentsPanel from "../components/CommentsPanel";
import { categoryImages } from "../components/CategoryImages";
import { getSocket } from "../api/socket";
import type { Ping, Wave, CategoryData } from "../api/types";


const waveIcon = "/assets/icon/wave.svg";
const commentIcon = "/assets/icon/comment.svg";

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
    // Handle author object - use firstName and lastName if available
    if (author.firstName || author.lastName) {
        return `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim() || "Anonymous";
    }
    return "Anonymous";
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

    // Debug log
    console.log(`🌊 WaveCard [ID: ${wave.id}]`, {
        authorRaw: wave.author,
        authorName,
        solution: wave.solution?.substring(0, 50),
    });

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
                        <span className="font-['Poppins',sans-serif] font-semibold text-[14px] text-black">
                            {authorName}
                        </span>
                        <span className="font-['Poppins',sans-serif] font-medium  text-[10px] text-black">
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
                        <span className="font-['Poppins',sans-serif] font-medium  text-[14px] text-black">
                            {badge.label}
                        </span>
                    </div>
                )}
            </div>

            {/* Body: solution text + surge + optional delete */}
            <div className="flex items-start justify-between gap-2.5">
                <p className="flex-1 font-['Poppins',sans-serif] font-medium  text-[12px] text-black leading-relaxed">
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
                        <span className="font-['Poppins',sans-serif] font-semibold text-[11px]">
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
        state.hasSurged("ping", pingId ?? ""),
    );
    const isToggling = useSurgeStore(
        (state) => state.isToggling[`ping-${pingId}`] || false,
    );

    const [ping, setPing] = useState<Ping | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [waves, setWaves] = useState<Wave[]>([]);
    const [wavesPage, setWavesPage] = useState(1);
    const [categories, setCategories] = useState<Record<number, CategoryData>>({});

    useEffect(() => {
        if (!pingId) return;
        setIsLoading(true);
        pingService
            .getPingById(pingId)
            .then((data) => {
                console.log("🔍 Ping fetched:", data);
                console.log("📂 Category:", data.category);
                console.log("🌊 Waves:", data.waves);
                setPing(data);
                setWaves(data.waves ?? []);
                if (data.hasSurged) {
                    useSurgeStore.getState().addSurge("ping", pingId);
                }
            })
            .catch(() => setError("Failed to load ping"))
            .finally(() => setIsLoading(false));
    }, [pingId]);

    // Fetch categories for category name lookup
    useEffect(() => {
        categoryService.getAll().then((cats) => {
            const catMap = cats.reduce(
                (acc, cat) => {
                    acc[cat.id] = cat;
                    return acc;
                },
                {} as Record<number, CategoryData>
            );
            setCategories(catMap);
        });
    }, []);

    const loadMoreWaves = async () => {
        if (!pingId) return;
        const nextPage = wavesPage + 1;
        const res = await waveService.getWavesForPing(pingId, {
            page: nextPage,
            limit: 10,
        });
        console.log("🌊 More waves loaded:", res.data);
        console.log("📍 First wave author:", res.data[0]?.author);
        setWaves((prev) => [...prev, ...res.data]);
        setWavesPage(nextPage);
    };

    // ── WebSocket event wiring (Phase 11) ───────────────────────────────────────
    useEffect(() => {
        if (!pingId) return;

        const socket = getSocket();
        if (!socket) return;

        // Subscribe to ping room
        socket.emit("join:ping", { pingId: Number(pingId) });

        // Listen for surge updates on this ping
        socket.on("ping:surgeUpdate", ({ pingId: id, surgeCount }) => {
            setPing((prev) => (prev && prev.id === Number(id)
                ? { ...prev, surgeCount }
                : prev));
        });

        // Listen for surge updates on waves
        socket.on("wave:surgeUpdate", ({ waveId, surgeCount }) => {
            setWaves((prev) =>
                prev.map((wave) =>
                    wave.id === Number(waveId)
                        ? { ...wave, surgeCount }
                        : wave
                )
            );
        });

        return () => {
            socket.off("ping:surgeUpdate");
            socket.off("wave:surgeUpdate");
            socket.emit("leave:ping", { pingId: Number(pingId) });
        };
    }, [pingId]);

    const handleDeleteWave = async (waveId: number) => {
        try {
            await waveService.deleteWave(String(waveId));
            setWaves((prev) => prev.filter((w) => w.id !== waveId));
        } catch (err) {
            console.error("Failed to delete wave:", err);
        }
    };

    if (isLoading) return <p className="text-center py-10">Loading...</p>;
    if (error) return <p className="text-red-500 text-center py-10">{error}</p>;
    if (!ping) return null;

    const pingAuthorId =
        typeof ping.author === "object" ? ping.author?.id : undefined;
    const isAuthor = currentUser?.id === pingAuthorId;
    const isAdmin =
        currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
    const canResolve = isAuthor || isAdmin;

    const authorName = getAuthorName(ping.author);
    const authorInitials = getAuthorInitials(authorName);
    // Use fetched categories map, fallback to ping.category if available
    const categoryName = ping.categoryId && categories[ping.categoryId]
        ? categories[ping.categoryId].name
        : ping.category?.name || "";
    const categoryIcon = categoryImages[categoryName];
    const surgeCount = ping.surgeCount || ping._count?.surges || 0;
    const commentCount = ping._count?.comments || 0;
    const waveCount = ping._count?.waves || waves.length || 0;

    // Debug logs
    console.log("📌 PingDetail render:", {
        pingId: ping.id,
        categoryId: ping.categoryId,
        categoryName,
        categoryIcon: !!categoryIcon,
        waveCount: waves.length,
    });

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
                    <span className="font-['Poppins',sans-serif] font-medium  text-[10px] text-black">
                        Back
                    </span>
                </button>
            </div>

            {/* ── ProposeWaveBar ────────────────────────── */}
            <ProposeWaveBar
                pingId={pingId ?? String(ping.id)}
                pingTitle={ping.title}
                pingCreatedAt={ping.createdAt}
                onWaveProposed={() => {
                    if (!pingId) return;
                    waveService
                        .getWavesForPing(pingId, { page: 1, limit: 10 })
                        .then((res) => {
                            setWaves(res.data);
                            setWavesPage(1);
                        })
                        .catch((err) => console.error("Failed to refresh waves:", err));
                }}
            />

            {/* ── Ping Card ─────────────────────────────── */}
            <div className="bg-[#fefefe] rounded-[10px] px-5 py-[15px] flex flex-col gap-[15px] w-full">
                {/* Author row */}
                <div className="flex items-center">
                    <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-full bg-[#ffc37b] flex items-center justify-center shrink-0 overflow-hidden">
                            <span className="font-semibold text-[13px] text-white">
                                {authorInitials}
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-['Poppins',sans-serif] font-semibold text-[14px] text-black">
                                {authorName}
                            </span>
                            <span className="font-['Poppins',sans-serif] font-medium text-[8px] text-black">
                                {formatTimestamp(ping.createdAt)}
                            </span>
                        </div>
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
                        <span className="font-['Poppins',sans-serif] font-medium  text-[13px] text-black">
                            {categoryName}
                        </span>
                    </div>
                )}

                {/* Title */}
                <h1 className="font-['Poppins',sans-serif] font-semibold text-[14px] text-black">
                    {ping.title}
                </h1>

                {/* Description */}
                {ping.content && (
                    <p className="font-['Poppins',sans-serif] font-medium  text-[14px] text-[#626665] text-justify leading-relaxed">
                        {ping.content}
                    </p>
                )}

                {/* Stats: surge + comments + waves */}
                <div className="flex items-center justify-between gap-[15px]">
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
                        <span className="font-['Poppins',sans-serif] font-semibold text-[11px]">
                            {surgeCount}
                        </span>
                    </button>

                    <div className="flex items-center gap-3.5">
                        {/* Wave count */}
                        <div className="flex items-center gap-0">
                            <img
                                src={waveIcon}
                                className=" h-[27px] w-[25px]"
                                alt="waveIcon"
                            />
                            <span className="font-['Inter',sans-serif] font-medium text-[12px] md:text-[14px] text-[#63637B] leading-5">
                                {waveCount} Waves Proposed
                            </span>
                        </div>

                        {/* Comment count */}
                        <button
                            className="flex items-center gap-1 hover:text-[#F49B31] transition-colors cursor-pointer"
                        >
                            <img
                                src={commentIcon}
                                className=" h-[18px] w-[18px]"
                                alt="commentIcon"
                            />
                            <span className="font-['Inter',sans-serif] font-medium text-[12px] md:text-[14px] text-[#63637B] leading-5">
                                {commentCount} Comments
                            </span>
                        </button>
                    </div>
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
                            onDelete={handleDeleteWave}
                        />
                    ))}
                </div>
            )}

            {/* ── Load more waves ───────────────────────── */}
            {ping._count && waves.length < ping._count.waves && (
                <div className="flex justify-center">
                    <button
                        type="button"
                        onClick={loadMoreWaves}
                        className="bg-[#fef5ea] border border-black rounded-[20px] px-5 py-2 font-['Poppins',sans-serif] font-medium  text-[12px] text-black cursor-pointer"
                    >
                        Load more waves
                    </button>
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
