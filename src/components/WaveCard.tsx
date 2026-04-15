/**
 * WaveCard Component
 * Memoized wave solution card for PingDetail page
 * Displays author info, solution text, status badge, and surge button
 *
 * Implements accurate Wave badge hierarchy from TAG_AND_STATUS_HIERARCHY.md:
 * 1. Community Pick (highest priority) - calculated as highest surge count for the Ping
 * 2-7. Status badges (Posted, Under Review, Approved, In Progress, Rejected, Completed)
 *
 * Performance: Memoized to prevent unnecessary re-renders when wave data hasn't changed
 */
import React, { useState } from "react";
import { useSurgeStore, useWavesStore } from "../stores";
import { waveService } from "../api/services";
import UserAvatar from "./UserAvatar";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import WaveActionsDropdown from "./WaveActionsDropdown";
import { calculateWaveBadge } from "../utils/badgeUtils";
import type { Wave, Media } from "../api/types";
import { Tooltip } from "./Tooltip";

interface WaveCardProps {
  wave: Wave;
  isOwner: boolean;
  onDelete?: (id: number) => void;
  allWavesForPing?: Wave[]; // All waves for the parent Ping (needed for Community Pick calculation)
  pingId: number; // Parent ping ID for generating direct links
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

const getAuthorName = (wave: Wave) => {
  // If anonymous, use the alias
  if (wave.isAnonymous && wave.anonymousAlias) {
    return wave.anonymousAlias;
  }
  // Otherwise use the author's name
  if (wave.author && typeof wave.author === "object") {
    if (wave.author.firstName || wave.author.lastName) {
      return (
        `${wave.author.firstName ?? ""} ${wave.author.lastName ?? ""}`.trim() || "Anonymous"
      );
    }
  }
  return "Anonymous";
};

const getWaveMedia = (wave: Wave): Media[] => {
  const maybeWave = wave as Wave & {
    medias?: Media[];
    attachments?: Media[];
  };
  const media = maybeWave.media ?? maybeWave.medias ?? maybeWave.attachments;

  if (!Array.isArray(media)) return [];
  return media.filter((item): item is Media => Boolean(item?.url));
};

// ─── WaveCard Component ─────────────────────────────────────────────────────

const WaveCard = React.memo(
  ({ wave, isOwner, onDelete, allWavesForPing = [], pingId }: WaveCardProps) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const toggleSurge = useSurgeStore((state) => state.toggleSurge);
    const updateWaveStore = useWavesStore((state) => state.updateWave);
    const waveFromStore = useWavesStore(
      (state) => state.wavesById[String(wave.id)],
    );
    const currentWave = waveFromStore || wave;
    const hasSurged = useSurgeStore((state) =>
      state.hasSurged("wave", String(currentWave.id)),
    );
    const isToggling = useSurgeStore(
      (state) => state.isToggling[`wave-${currentWave.id}`] || false,
    );

    const authorName = getAuthorName(currentWave);
    const initialHasSurged = currentWave.hasSurged ?? false;
    const baseSurgeCount =
      currentWave.surgeCount ?? currentWave._count?.surges ?? 0;
    const surgeCount = Math.max(
      0,
      baseSurgeCount + (hasSurged ? 1 : 0) - (initialHasSurged ? 1 : 0),
    );
    const waveMedia = getWaveMedia(currentWave);
    const imageMedia = waveMedia.filter((item) =>
      item.mimeType?.startsWith("image/"),
    );
    const videoMedia = waveMedia.filter((item) =>
      item.mimeType?.startsWith("video/"),
    );
    const fileMedia = waveMedia.filter(
      (item) =>
        !item.mimeType?.startsWith("image/") &&
        !item.mimeType?.startsWith("video/"),
    );
    const previewMedia = imageMedia[0] ?? videoMedia[0];
    const remainingMediaCount = Math.max(
      0,
      waveMedia.length - (previewMedia ? 1 : 0),
    );

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

    const handleDeleteClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
      setIsDeleting(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 300)); // Brief delay for UX
        onDelete?.(wave.id);
        setShowDeleteModal(false);
      } catch {
        setIsDeleting(false);
      }
    };

    const handleCancelDelete = () => {
      setShowDeleteModal(false);
    };

    // Calculate badge using the hierarchy from TAG_AND_STATUS_HIERARCHY.md
    const badgeConfig = calculateWaveBadge(currentWave, allWavesForPing);

    return (
      <>
        <div className="bg-white rounded-[10px] px-[27.5px] py-[23px] flex flex-col gap-[17px] w-full min-w-full">
          {/* Header: avatar + name/time + badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <UserAvatar
                user={
                  typeof currentWave.author === "object"
                    ? currentWave.author
                    : null
                }
                size="md"
                bgColor="bg-[#ffc37b]" pictureUrl={
                  currentWave.isAnonymous && currentWave.anonymousProfilePicture
                    ? currentWave.anonymousProfilePicture
                    : undefined
                } />
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
              {badgeConfig && (
                <Tooltip
                  content="Current aknowledgement status of this post."
                  position="left"
                >
                  <div className="border border-[#626665] rounded-[23px] flex items-center gap-1.5 px-[11px] py-1">
                    <div
                      className="w-[5px] h-[5px] rounded-full shrink-0"
                      style={{ backgroundColor: badgeConfig.color }}
                    />
                    <span className="font-['Poppins',sans-serif] font-medium text-[11px] text-black">
                      {badgeConfig.label}
                    </span>
                  </div>
                </Tooltip>
              )}
              {isOwner && (
                <WaveActionsDropdown
                  waveId={wave.id}
                  pingId={pingId}
                  isOwner={isOwner}
                  onDelete={handleDeleteClick}
                />
              )}
            </div>
          </div>

          {/* Body: solution text + surge */}
          <div className="flex items-start justify-between gap-2.5">
            <p className="flex-1 font-['Poppins',sans-serif] font-medium text-[12px] text-black leading-relaxed">
              {currentWave.solution}
            </p>

            <div className="flex flex-col items-center gap-2 shrink-0">
              <Tooltip
                content={
                  hasSurged
                    ? "Remove your surge"
                    : "Surge this post to show it's important!"
                }
                position="left"
              >
                <button
                  type="button"
                  onClick={handleSurge}
                  disabled={isToggling}
                  aria-label={hasSurged ? "Remove surge" : "Surge"}
                  className={`flex items-center gap-[5px] px-2 py-1 rounded-[15px] border border-black cursor-pointer transition-colors duration-300 disabled:opacity-50 ${hasSurged
                    ? "bg-[#f49b31] text-white border-[#f49b31]"
                    : "bg-[#fef5ea] text-[#4a504e]"
                    }`}
                  style={{
                    transition:
                      "background-color 0.3s, color 0.3s, border-color 0.3s",
                  }}
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
              </Tooltip>
            </div>
          </div>

          {previewMedia && (
            <div className="relative overflow-hidden rounded-[12px] border border-black/10 bg-[#F8F7F3]">
              {previewMedia.mimeType?.startsWith("video/") ? (
                <video
                  src={previewMedia.url}
                  controls
                  preload="metadata"
                  className="w-full max-h-[320px] object-cover"
                />
              ) : (
                <img
                  src={previewMedia.url}
                  alt="Wave attachment"
                  className="w-full max-h-[320px] object-cover"
                  loading="lazy"
                />
              )}
              {remainingMediaCount > 0 && (
                <span className="absolute right-2 top-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded-full">
                  +{remainingMediaCount}
                </span>
              )}
            </div>
          )}

          {!previewMedia && fileMedia.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {fileMedia.slice(0, 2).map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] font-medium text-[#4A504E] bg-[#FEF5EA] border border-[#FFC37B] rounded-[12px] px-2.5 py-1 hover:bg-[#FDE8CD] transition-colors"
                >
                  {item.filename ?? "Attachment"}
                </a>
              ))}
              {fileMedia.length > 2 && (
                <span className="text-[12px] font-medium text-[#4A504E] px-1 py-1">
                  +{fileMedia.length - 2} more
                </span>
              )}
            </div>
          )}
        </div>

        {showDeleteModal && (
          <DeleteConfirmationModal
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
            isLoading={isDeleting}
            itemType="Wave"
          />
        )}
      </>
    );
  },
);

WaveCard.displayName = "WaveCard";

export default WaveCard;
