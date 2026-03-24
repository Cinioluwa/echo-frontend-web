/**
 * InlineWavePreview
 * Figma ref: 3919:9125 (mobile wave section), 3657:8934 (desktop wave section)
 * Phase: 2
 *
 * Shown at the bottom of each UnifiedPingCard.
 * Displays a "Waves" header and up to 2 wave previews,
 * each with: avatar, name, timestamp, solution text, surge count.
 */

import { useState, useEffect } from "react";
import { waveService } from "../../api/services";
import UserAvatar from "../UserAvatar";
import type { Wave } from "../../api/types";

interface InlineWavePreviewProps {
    pingId: number;
}

const InlineWavePreview = ({ pingId }: InlineWavePreviewProps) => {
    const [waves, setWaves] = useState<Wave[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        waveService
            .getWavesForPing(String(pingId), { limit: 2 })
            .then((res) => setWaves(res.data))
            .catch(() => setError("Failed to load waves"))
            .finally(() => setIsLoading(false));
    }, [pingId]);

    if (isLoading) return null;
    if (error) return <p className="text-red-500 text-xs">{error}</p>;
    if (!waves || waves.length === 0) return null;

    const displayedWaves = waves.slice(0, 2);

    return (
        <div className="flex flex-col gap-[13px] w-full max-w-full">
            <p className="font-['Poppins',sans-serif] font-medium text-[15px] md:text-[13px] text-[#171717] w-[63px]">
                Waves
            </p>
            <div className="flex flex-col md:flex-row gap-2.5 md:gap-5 w-full">
                {displayedWaves.map((wave) => {
                    const authorName =
                        typeof wave.author === "object" && wave.author
                            ? `${wave.author.firstName ?? ""} ${wave.author.lastName ?? ""}`.trim() || "Anonymous"
                            : typeof wave.author === "string"
                                ? wave.author
                                : "Anonymous";

                    const timestamp = wave.createdAt
                        ? new Date(wave.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        })
                        : "";

                    return (
                        <div
                            key={wave.id}
                            className="bg-[#FFC37B] flex-1 flex items-center justify-between px-[7px] py-2.5 rounded-xl h-[55px] min-w-0"
                        >
                            {/* Author info */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                <UserAvatar
                                    user={typeof wave.author === "object" ? wave.author : null}
                                    size="sm"
                                    responsive
                                    bgColor="bg-[#F49B31]"
                                />
                                <div className="flex flex-col gap-[3px] md:gap-[5px]">
                                    <span className="font-['Poppins',sans-serif] font-semibold text-[8px] md:text-[11px] text-black whitespace-nowrap leading-normal">
                                        {authorName}
                                    </span>
                                    <span className="font-['Poppins',sans-serif] font-medium text-[7px] md:text-[9px] text-[#454545] whitespace-nowrap leading-normal">
                                        {timestamp}
                                    </span>
                                </div>
                            </div>

                            {/* Solution text */}
                            <div className="flex-1 text-center px-2 min-w-0  text-ellipsis line-clamp-2 truncate overflow-y-scroll">
                                <p className="font-['Poppins',sans-serif] font-medium md:font-semibold text-wrap text-[10px] md:text-[10px] text-black truncate leading-normal ">
                                    {wave.solution}
                                </p>
                            </div>

                            {/* Surge count */}
                            <div className="flex items-center gap-[5px] shrink-0">
                                <svg width="12" height="16" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path d="M6.5 1L1 9h5l-0.5 6 6-8H7l0.5-6z" fill="#4A504E" />
                                </svg>
                                <span className="font-['Poppins',sans-serif] font-semibold text-[14px] text-[#4A504E] leading-normal">
                                    {wave.surgeCount || wave._count?.surges || 0}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default InlineWavePreview;
