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
import SurgeIcon from "../shared/SurgeIcon";

type WavePreviewMode = "embedded-only" | "fetch-if-missing";

interface InlineWavePreviewProps {
    pingId?: number;
    waves?: Wave[];
    mode?: WavePreviewMode;
}

const InlineWavePreview = ({
    pingId,
    waves: embeddedWaves = [],
    mode = "fetch-if-missing",
}: InlineWavePreviewProps) => {
    const [fetchedWaves, setFetchedWaves] = useState<Wave[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasLoadError, setHasLoadError] = useState(false);

    const hasEmbeddedWaves = embeddedWaves.length > 0;

    useEffect(() => {
        if (
            mode !== "fetch-if-missing" ||
            hasEmbeddedWaves ||
            typeof pingId !== "number"
        ) {
            setFetchedWaves([]);
            setIsLoading(false);
            setHasLoadError(false);
            return;
        }

        let isCancelled = false;
        setIsLoading(true);
        setHasLoadError(false);

        waveService
            .getWavesForPing(String(pingId), { limit: 2 })
            .then((res) => {
                if (!isCancelled) {
                    setFetchedWaves(res.data);
                }
            })
            .catch(() => {
                if (!isCancelled) {
                    setHasLoadError(true);
                }
            })
            .finally(() => {
                if (!isCancelled) {
                    setIsLoading(false);
                }
            });

        return () => {
            isCancelled = true;
        };
    }, [hasEmbeddedWaves, mode, pingId]);

    const displayedWaves = (hasEmbeddedWaves ? embeddedWaves : fetchedWaves).slice(
        0,
        2,
    );

    if ((isLoading || hasLoadError) && displayedWaves.length === 0) return null;
    if (displayedWaves.length === 0) return null;

    return (
        <>
            <div className="h-px w-full bg-black/10" />
            <div className="flex flex-col gap-[13px] w-full max-w-full">
            <p className="font-['Poppins',sans-serif] font-medium text-[clamp(12px,2.8vw,13px)] text-[#171717] w-fit">
                Waves
            </p>
            <div className="flex flex-col xl:flex-row gap-2.5 md:gap-5 w-full">
                {displayedWaves.map((wave) => {
                    const authorName =
                        wave.isAnonymous && wave.anonymousAlias
                            ? wave.anonymousAlias
                            : typeof wave.author === "object" && wave.author
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
                            className="bg-[#FFC37B] flex-1 flex items-center justify-between px-[7px] py-2 md:py-2.5 rounded-xl min-h-[52px] md:h-[55px] min-w-0"
                        >
                            {/* Author info */}
                            <div className="flex items-center gap-1.5 shrink-0">
                                <UserAvatar
                                    user={typeof wave.author === "object" ? wave.author : null}
                                    size="sm"
                                    responsive
                                    bgColor="bg-[#F49B31]"
                                    pictureUrl={
                                        wave.isAnonymous && wave.anonymousProfilePicture
                                            ? wave.anonymousProfilePicture
                                            : undefined
                                    }
                                />
                                <div className="flex flex-col gap-[3px] md:gap-[5px]">
                                    <span className="font-['Poppins',sans-serif] font-semibold text-[clamp(8px,2.2vw,11px)] text-black whitespace-nowrap leading-normal">
                                        {authorName}
                                    </span>
                                    <span className="font-['Poppins',sans-serif] font-medium text-[clamp(7px,2vw,9px)] text-[#454545] whitespace-nowrap leading-normal">
                                        {timestamp}
                                    </span>
                                </div>
                            </div>

                            {/* Solution text */}
                            <div className="flex-1 text-center px-2 min-w-0  text-ellipsis line-clamp-2 truncate overflow-y-scroll">
                                <p className="font-['Poppins',sans-serif] font-medium md:font-semibold text-wrap text-[clamp(9px,2.4vw,10px)] text-black truncate leading-normal ">
                                    {wave.solution.length > 30 ? wave.solution.substring(0, 30) + "..." : wave.solution}
                                </p>
                            </div>

                            {/* Surge count */}
                            <div className="flex items-center gap-[5px] shrink-0">
                                <SurgeIcon width={12} height={16} fill="#F49B31" />
                                <span className="font-['Poppins',sans-serif] font-semibold text-[clamp(12px,2.8vw,14px)] text-[#4A504E] leading-normal">
                                    {wave.surgeCount || wave._count?.surges || 0}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </>
);
};

export default InlineWavePreview;
