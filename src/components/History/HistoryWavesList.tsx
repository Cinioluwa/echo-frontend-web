/**
 * HistoryWavesList
 * Figma ref: 2nd frame in S5 (desktop: 4183:17017), 2nd frame in S6 (mobile: 4183:17018)
 * Phase: 4
 *
 * Content for the "Waves" tab on the History page.
 * Shows the user's proposed waves in expanded card format:
 * - Author info + status badge ("Resolved", "Top 3", etc.)
 * - Category label
 * - Wave title + full description (solution)
 * - Surge count + delete option
 *
 * TODO: API — GET /api/users/me/waves with pagination
 */

import WaveStatusIndicator from "../WaveStatusIndicator";
import type { Wave } from "../../api/types";
import { categoryImages } from "../CategoryImages";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { EmptyState } from "../shared/EmptyState";

// ---------------------------------------------------------------------------
// Mock data — replace with /api/users/me/waves once available
// ---------------------------------------------------------------------------
const MOCK_WAVES: Wave[] = [
    {
        id: 201,
        solution: "Upgrade the pumping machines in the water facility",
        title: "Install High-Capacity Water Pumps",
        description:
            "The current pumps are outdated and cannot sustain the demand from all halls simultaneously. Installing modern, high-capacity pumps would resolve the instability issue permanently.",
        surgeCount: 87,
        viewCount: 240,
        status: "APPROVED",
        rank: 1,
        createdAt: "2024-05-30T11:00:00.000Z",
        author: {
            id: 1,
            firstName: "Felix",
            lastName: "Oluwapelumi",
            email: "felix@echo.com",
            role: "USER",
            organizationId: 1,
            status: "ACTIVE",
            createdAt: "2024-01-01T00:00:00.000Z",
        },
        ping: {
            id: 1,
            title: "The water is not stable in the halls",
            category: { id: 4, name: "Hall" },
        },
        _count: { surges: 87, comments: 12 },
    },
    {
        id: 202,
        solution: "Engage a sound technician to overhaul the PA system",
        title: "Chapel PA System Overhaul",
        description:
            "A professional assessment and full overhaul of the amplifiers, mixers, and speaker units would fix the crackling. Budget estimate: ₦150,000.",
        surgeCount: 34,
        viewCount: 120,
        status: "POSTED",
        createdAt: "2024-03-15T14:00:00.000Z",
        author: {
            id: 1,
            firstName: "Felix",
            lastName: "Oluwapelumi",
            email: "felix@echo.com",
            role: "USER",
            organizationId: 1,
            status: "ACTIVE",
            createdAt: "2024-01-01T00:00:00.000Z",
        },
        ping: {
            id: 2,
            title: "The chapel PA system needs urgent repair",
            category: { id: 3, name: "Chapel" },
        },
        _count: { surges: 34, comments: 5 },
    },
];
// ---------------------------------------------------------------------------

interface HistoryWavesListProps {
    isLoading?: boolean;
}

const HistoryWavesList = ({ isLoading = false }: HistoryWavesListProps) => {
    if (isLoading) {
        return (
            <div className="flex justify-center py-10">
                <LoadingSpinner />
            </div>
        );
    }

    if (MOCK_WAVES.length === 0) {
        return (
            <EmptyState
                title="No waves yet"
                description="You haven't proposed any solutions yet. Start proposing waves on pings!"
            />
        );
    }

    return (
        <div className="flex flex-col gap-[15px]">
            {MOCK_WAVES.map((wave) => (
                <WaveHistoryCard key={wave.id} wave={wave} />
            ))}
            {/* TODO: API — pagination when /api/users/me/waves is integrated */}
        </div>
    );
};

// ---------------------------------------------------------------------------
// WaveHistoryCard — expanded wave card for the Waves history tab
// ---------------------------------------------------------------------------
interface WaveHistoryCardProps {
    wave: Wave;
}

const WaveHistoryCard = ({ wave }: WaveHistoryCardProps) => {
    const authorName =
        typeof wave.author === "object" && wave.author
            ? `${wave.author.firstName} ${wave.author.lastName}`
            : "Anonymous";

    const authorInitials = authorName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    const timestamp = wave.createdAt
        ? new Date(wave.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })
        : "";

    const categoryName = wave.ping?.category?.name || wave.category?.name || "";
    const categoryIcon = categoryImages[categoryName];

    const surgeCount = wave.surgeCount || wave._count?.surges || 0;

    const handleDelete = () => {
        // TODO: API — DELETE /api/waves/:waveId
        console.log("Delete wave:", wave.id);
    };

    return (
        <div className="bg-[#FEFEFE] rounded-[10px] px-5 py-[15px] flex flex-col gap-[15px] w-full">
            {/* ─── Header ───────────────────────────── */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="w-9 h-9 md:w-[53px] md:h-[53px] rounded-full bg-[#FFC37B] flex items-center justify-center shrink-0 overflow-hidden">
                        <span className="font-['Poppins',sans-serif] font-bold text-[12px] md:text-[18px] text-white">
                            {authorInitials}
                        </span>
                    </div>
                    {/* Name + timestamp */}
                    <div className="flex flex-col">
                        <span className="font-['Poppins',sans-serif] font-semibold text-[13px] md:text-[15px] text-black leading-normal">
                            {authorName}
                        </span>
                        <span className="font-['Poppins',sans-serif] font-medium text-[11px] md:text-[13px] text-[#8B8E8D] leading-normal">
                            {timestamp}
                        </span>
                    </div>
                </div>

                {/* Badges: status + delete */}
                <div className="flex items-center gap-3">
                    {/* Status badge */}
                    {(wave.status || wave.rank) && (
                        <div className="border border-[#626665] rounded-[23px] flex items-center gap-1.5 px-[15px] py-[7px]">
                            <WaveStatusIndicator status={wave.status} rank={wave.rank} />
                        </div>
                    )}
                    {/* Delete button */}
                    <button
                        onClick={handleDelete}
                        aria-label="Delete wave"
                        className="w-[31px] h-8 rounded-full bg-[#FEF5EA] flex items-center justify-center hover:bg-red-100 transition-colors cursor-pointer"
                    >
                        <svg
                            width="16"
                            height="16"
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
                </div>
            </div>

            {/* ─── Category label ────────────────────── */}
            {categoryName && (
                <div className="flex items-center gap-[9px]">
                    {categoryIcon && (
                        <img
                            src={categoryIcon}
                            alt={categoryName}
                            className="w-5 h-5 object-contain"
                        />
                    )}
                    <span className="font-['Poppins',sans-serif] font-medium text-[15px] text-[#171717]">
                        {categoryName}
                    </span>
                </div>
            )}

            {/* ─── Parent ping context ───────────────── */}
            {wave.ping?.title && (
                <p className="font-['Poppins',sans-serif] text-[12px] text-[#8B8E8D] leading-normal">
                    Wave on:{" "}
                    <span className="text-[#F49B31] font-medium">{wave.ping.title}</span>
                </p>
            )}

            {/* ─── Body: title + solution/description ── */}
            <div className="flex flex-col gap-2">
                {wave.title && (
                    <h3 className="font-['Poppins',sans-serif] font-semibold text-[14px] md:text-[16px] text-black leading-normal">
                        {wave.title}
                    </h3>
                )}
                <p className="font-['Poppins',sans-serif] font-normal text-[12px] md:text-[14px] text-[#171717] leading-normal">
                    {wave.description || wave.solution}
                </p>
            </div>

            {/* ─── Footer: surge count ──────────────── */}
            <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 border border-[#626665] rounded-[18px] px-[13px] py-[5px]">
                    {/* Lightning bolt icon */}
                    <svg
                        width="10"
                        height="14"
                        viewBox="0 0 10 14"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <path
                            d="M5.5 1L1 7.5H5L4.5 13L9 6.5H5L5.5 1Z"
                            fill="#F49B31"
                            stroke="#F49B31"
                            strokeWidth="0.8"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="font-['Poppins',sans-serif] font-medium text-[13px] text-black">
                        {surgeCount}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default HistoryWavesList;
