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
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WaveStatusIndicator from "../WaveStatusIndicator";
import UserAvatar from "../UserAvatar";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import type { Wave } from "../../api/types";
import { categoryImages } from "../CategoryImages";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { EmptyState } from "../shared/EmptyState";
import { waveService } from "../../api/services";
import formatTimeAgo from "../../utils/formatTimeAgo";

interface HistoryWavesListProps {
    isLoading?: boolean;
}

const HistoryWavesList = ({ isLoading: parentIsLoading = false }: HistoryWavesListProps) => {
    const [waves, setWaves] = useState<Wave[]>([]);
    // isLoading starts false because the fetch below is waiting on a new backend endpoint
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    // Pagination state (future use)
    // const [hasNextPage, setHasNextPage] = useState(false);
    // const [page, setPage] = useState(1);
    const limit = 20;

    // Fetch waves for the authenticated user
    useEffect(() => {
        setIsLoading(true);
        waveService
            .getMyWaves({ page: 1, limit })
            .then((res) => {
                setWaves(res.data);
                // setHasNextPage(res.pagination?.hasNextPage ?? false); // For future pagination
            })
            .catch(() => setError("Failed to load your waves"))
            .finally(() => setIsLoading(false));
    }, []);

    const handleDeleteWave = async (waveId: number) => {
        try {
            await waveService.deleteWave(String(waveId));
            setWaves((prev) => prev.filter((w) => w.id !== waveId));
        } catch {
            setError("Failed to delete wave");
        }
    };

    if (parentIsLoading || isLoading || error) {
        return (
            <div className="flex justify-center py-10">
                <LoadingSpinner />
            </div>
        );
    }

    if (waves.length === 0) {
        return (
            <EmptyState
                title="No waves yet"
                description="You haven't proposed any solutions yet. Start proposing waves on pings!"
            />
        );
    }

    return (
        <div className="flex flex-col gap-[15px]">
            {waves.map((wave) => (
                <WaveHistoryCard key={wave.id} wave={wave} onDelete={handleDeleteWave} />
            ))}
        </div>
    );
};

// ---------------------------------------------------------------------------
// WaveHistoryCard — expanded wave card for the Waves history tab
// ---------------------------------------------------------------------------
interface WaveHistoryCardProps {
    wave: Wave;
    onDelete: (waveId: number) => void;
}

const WaveHistoryCard = ({ wave, onDelete }: WaveHistoryCardProps) => {
    const navigate = useNavigate();
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const authorName =
        wave.isAnonymous && wave.anonymousAlias
            ? wave.anonymousAlias
            : typeof wave.author === "object" && wave.author
                ? `${wave.author.firstName ?? ""} ${wave.author.lastName ?? ""}`.trim() || "Anonymous"
                : typeof wave.author === "string"
                    ? wave.author
                    : "Anonymous";

    const timestamp = formatTimeAgo(wave.createdAt);

    const categoryName = wave.ping?.category?.name || wave.category?.name || "";
    const categoryIcon = categoryImages[categoryName];

    const surgeCount = wave.surgeCount || wave._count?.surges || 0;

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 300)); // Brief delay for UX
            onDelete(wave.id);
            setShowDeleteModal(false);
        } catch {
            setIsDeleting(false);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
    };

    return (
        <>
            <div className="bg-[#FEFEFE] rounded-[10px] px-5 py-[15px] flex flex-col gap-[15px] w-full max-w-full">
                {/* ─── Header ───────────────────────────── */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <UserAvatar
                            user={typeof wave.author === "object" ? wave.author : null}
                            size="lg"
                            responsive
                            bgColor="bg-[#FFC37B]"
                            className="shrink-0" pictureUrl={
                                wave.isAnonymous && wave.anonymousProfilePicture
                                    ? wave.anonymousProfilePicture
                                    : undefined
                            } />
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
                        {wave.status && (
                            <div className=" rounded-[23px] flex items-center gap-1.5 px-[15px] py-[7px]">
                                <WaveStatusIndicator status={wave.status} />
                            </div>
                        )}
                        {/* Delete button */}
                        <button
                            onClick={handleDeleteClick}
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
                        <span
                            onClick={() => navigate(`/feed/${wave.ping?.id}`)}
                            className="text-[#F49B31] font-medium cursor-pointer hover:underline transition-all"
                        >
                            {wave.ping.title}
                        </span>
                    </p>
                )}

                {/* ─── Body: title + solution/description ── */}
                <div className="flex flex-col gap-2">
                    {wave.title && (
                        <h3 className="font-['Poppins',sans-serif] font-semibold text-[14px] md:text-[16px] text-black leading-normal">
                            {wave.title}
                        </h3>
                    )}
                    <p className="font-['Poppins',sans-serif] font-normal text-[12px] md:text-[14px] text-[#171717] leading-normal whitespace-pre-wrap">
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

                {showDeleteModal && (
                    <DeleteConfirmationModal
                        onConfirm={handleConfirmDelete}
                        onCancel={handleCancelDelete}
                        isLoading={isDeleting}
                        itemType="Wave"
                    />
                )}
            </div>
        </>
    );
};

export default HistoryWavesList;
