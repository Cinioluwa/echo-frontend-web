/**
 * WaveCard Component
 * Memoized wave solution card for PingDetail page
 * Displays author info, solution text, status badge, and surge button
 * 
 * Performance: Memoized to prevent unnecessary re-renders when wave data hasn't changed
 */
import React from "react";
import { useSurgeStore, useWavesStore } from "../stores";
import { waveService } from "../api/services";
import UserAvatar from "./UserAvatar";
import type { Wave } from "../api/types";

interface WaveCardProps {
    wave: Wave;
    isOwner: boolean;
    onDelete?: (id: number) => void;
}

// ─── Helper Functions (Module-level for performance) ───────────────────────

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
    if (author.firstName || author.lastName) {
        return `${author.firstName ?? ""} ${author.lastName ?? ""}`.trim() || "Anonymous";
    }
    return "Anonymous";
};

// ─── WaveCard Component ─────────────────────────────────────────────────────

const WaveCard = React.memo(({ wave, isOwner, onDelete }: WaveCardProps) => {
    const toggleSurge = useSurgeStore((state) => state.toggleSurge);
    const updateWaveStore = useWavesStore((state) => state.updateWave);
    const waveFromStore = useWavesStore((state) => state.wavesById[String(wave.id)]);
    const currentWave = waveFromStore || wave;
    const hasSurged = useSurgeStore((state) => state.hasSurged("wave", String(currentWave.id)));
    const isToggling = useSurgeStore((state) => state.isToggling[`wave-${currentWave.id}`] || false);

    const authorName = getAuthorName(currentWave.author);
    const surgeCount = currentWave.surgeCount || currentWave._count?.surges || 0;

    console.log(`🌊 WaveCard [ID: ${wave.id}]`, {
        authorRaw: currentWave.author,
        authorName,
        solution: currentWave.solution?.substring(0, 50),
    });

    const handleSurge = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isToggling) return;
        try {
            await toggleSurge("wave", String(wave.id));
            const latest = await waveService.getWaveById(String(wave.id));
            updateWaveStore(String(wave.id), {
                surgeCount: latest.surgeCount,
                hasSurged: latest.hasSurged,
            });
        } catch (err) {
            console.error("Wave surge failed:", err);
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete?.(wave.id);
    };

    const badge =
        wave.rank && wave.rank <= 3
            ? { label: "Top 3", color: "#f49b31" }
            : wave.status === "UNDER_REVIEW"
                ? { label: "Under Review", color: "#f5c518" }
                : wave.status === "POSTED"
                    ? { label: "Posted", color: "#22c55e" }
                    : null;

    return (
        <div className="bg-white rounded-[10px] px-[27.5px] py-[23px] flex flex-col gap-[17px] w-full min-w-full">
            {/* Header: avatar + name/time + badge */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                    <UserAvatar
                        user={typeof currentWave.author === "object" ? currentWave.author : null}
                        size="md"
                        bgColor="bg-[#ffc37b]"
                    />
                    <div className="flex flex-col">
                        <span className="font-['Poppins',sans-serif] font-semibold text-[14px] text-black">
                            {authorName}
                        </span>
                        <span className="font-['Poppins',sans-serif] font-medium text-[10px] text-black">
                            {formatTimestamp(wave.createdAt)}
                        </span>
                    </div>
                </div>

                <div className="flex gap-5">
                    {badge && (
                        <div className="border border-[#626665] rounded-[23px] flex items-center gap-1.5 px-[11px] py-1">
                            <div
                                className="w-[5px] h-[5px] rounded-full shrink-0"
                                style={{ backgroundColor: badge.color }}
                            />
                            <span className="font-['Poppins',sans-serif] font-medium text-[14px] text-black">
                                {badge.label}
                            </span>
                        </div>
                    )}
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

            {/* Body: solution text + surge */}
            <div className="flex items-start justify-between gap-2.5">
                <p className="flex-1 font-['Poppins',sans-serif] font-medium text-[12px] text-black leading-relaxed">
                    {wave.solution}
                </p>

                <div className="flex flex-col items-center gap-2 shrink-0">
                    <button
                        type="button"
                        onClick={handleSurge}
                        disabled={isToggling}
                        aria-label={hasSurged ? "Remove surge" : "Surge"}
                        className={`flex items-center gap-[5px] px-2 py-1 rounded-[15px] border border-black cursor-pointer transition-colors duration-300 disabled:opacity-50 ${hasSurged
                            ? "bg-[#f49b31] text-white border-[#f49b31]"
                            : "bg-[#fef5ea] text-[#4a504e]"
                            }`}
                        style={{ transition: 'background-color 0.3s, color 0.3s, border-color 0.3s' }}
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
                </div>
            </div>
        </div>
    );
});

WaveCard.displayName = 'WaveCard';

export default WaveCard;
