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
import UserAvatar from "./UserAvatar";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import WaveActionsDropdown from "./WaveActionsDropdown";
import BadgeTooltip from "./BadgeTooltip";
import { calculateWaveBadge } from "../utils/badgeUtils";
import type { Wave, Media } from "../api/types";
import ImageLightbox from "./shared/ImageLightbox";
import { useEditWindow } from "../hooks";
import { getEditErrorMessage } from "../utils/editErrors";
import { EditedLabel } from "../utils/editedLabel";
import { waveService } from "../api/services";
import { useAuthStore } from "../stores";
import SurgeIcon from "./shared/SurgeIcon";
import formatTimeAgo from "../utils/formatTimeAgo";

interface WaveCardProps {
  wave: Wave;
  isOwner: boolean;
  onSurgeCountChange?: (waveId: number, surgeCount: number) => void;
  onDelete?: (id: number) => void;
  allWavesForPing?: Wave[]; // All waves for the parent Ping (needed for Community Pick calculation)
  onRefresh?: () => void;
}

// ─── Helper Functions (Module-level for performance) ───────────────────────

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
  ({ wave, isOwner, onSurgeCountChange, onDelete, allWavesForPing = [], onRefresh }: WaveCardProps) => {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

    const toggleSurge = useSurgeStore((state) => state.toggleSurge);
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
    const surgeCount =
      currentWave.surgeCount ?? currentWave._count?.surges ?? 0;
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

    const { isEditable, countdownLabel } = useEditWindow(wave.createdAt);
    const canEdit = isOwner && !wave.isAnonymous && isEditable;

    const [isEditing, setIsEditing] = useState(false);
    const [editInput, setEditInput] = useState(currentWave.solution || "");
    const [isSavingEdit, setIsSavingEdit] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    const handleSaveEdit = async () => {
        const trimmed = editInput.trim();
        if (!trimmed || trimmed === currentWave.solution) {
            setIsEditing(false);
            return;
        }

        setIsSavingEdit(true);
        setActionError(null);
        try {
            await waveService.updateWave(String(wave.id), { solution: trimmed });
            setIsEditing(false);
            onRefresh?.();
        } catch (err) {
            setActionError(getEditErrorMessage(err));
        } finally {
            setIsSavingEdit(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditInput(currentWave.solution || "");
        setActionError(null);
    };

    const handleSurge = async (e: React.MouseEvent) => {
      e.stopPropagation();
      if (isToggling) return;
      try {
        const result = await toggleSurge("wave", String(wave.id));
        if (result.surgeCount !== undefined) {
          onSurgeCountChange?.(wave.id, result.surgeCount);
        }
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
        <div className="bg-white rounded-[10px] px-2.5 sm:px-[27.5px] py-2.5 sm:py-[23px] flex flex-col gap-3 sm:gap-[17px] w-full min-w-0 overflow-hidden">
          {/* Header: avatar + name/time + badge + actions */}
          <div className="flex items-center justify-between gap-1.5 sm:gap-2 min-w-0 w-full">
            <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
              <UserAvatar
                user={
                  typeof currentWave.author === "object"
                    ? currentWave.author
                    : null
                }
                size="md"
                bgColor="bg-[#ffc37b]"
                pictureUrl={
                  currentWave.isAnonymous && currentWave.anonymousProfilePicture
                    ? currentWave.anonymousProfilePicture
                    : isOwner && !currentWave.isAnonymous && useAuthStore.getState().user?.profilePicture
                      ? useAuthStore.getState().user?.profilePicture
                      : undefined
                }
              />
              <div className="flex flex-col min-w-0">
                <span
                  className="font-['Poppins',sans-serif] font-semibold text-[13px] sm:text-[14px] text-black truncate max-w-[95px] xs:max-w-[140px] sm:max-w-none leading-snug whitespace-nowrap"
                >
                  {authorName}
                </span>
                <span className="font-['Poppins',sans-serif] font-medium text-[10px] text-[#8B8E8D] leading-tight whitespace-nowrap">
                  {formatTimeAgo(wave.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {badgeConfig && (
                <BadgeTooltip badgeKey={badgeConfig.type as string}><img
                  src={badgeConfig.svg}
                  alt={badgeConfig.label}
                  className="h-[22px] sm:h-[28px] md:h-[33px] w-auto shrink-0 select-none object-contain"
                /></BadgeTooltip>
              )}
              <WaveActionsDropdown
                waveId={wave.id}
                isOwner={isOwner}
                canEdit={canEdit}
                onEdit={() => setIsEditing(true)}
                onDelete={handleDeleteClick}
              />
            </div>
          </div>

          {/* Body: solution text */}
          <div className="w-full">
            {isEditing ? (
              <div className="flex flex-col gap-2 w-full mt-1">
                <textarea
                  value={editInput}
                  onChange={(e) => setEditInput(e.target.value)}
                  disabled={isSavingEdit}
                  className="w-full text-[12px] font-['Poppins',sans-serif] font-medium p-3 border border-gray-300 rounded-md focus:outline-none focus:border-[#f49b31] resize-y min-h-[100px]"
                  autoFocus
                />
                {actionError && <p className="text-red-500 text-sm">{actionError}</p>}
                <div className="flex justify-between items-center">
                  <span className="text-[12px] text-gray-500">
                    {countdownLabel ? `Edit window closes in ${countdownLabel}` : "Edit window closed"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      disabled={isSavingEdit}
                      className="text-[12px] px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveEdit}
                      disabled={isSavingEdit || !editInput.trim()}
                      className="text-[12px] px-3 py-1.5 bg-[#f49b31] text-white rounded-md disabled:opacity-50 cursor-pointer"
                    >
                      {isSavingEdit ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p className="font-['Poppins',sans-serif] font-medium text-[12px] sm:text-[13px] text-black leading-relaxed break-words whitespace-pre-wrap">
                {currentWave.solution}
                {currentWave.isEdited && <EditedLabel />}
              </p>
            )}
          </div>

          {/* Media Attachments */}
          {previewMedia && (
            <div className="relative overflow-hidden rounded-xl border border-black/15 bg-black/90 flex items-center justify-center max-h-80 w-full">
              {/* Ambient blurred backdrop for images */}
              {!previewMedia.mimeType?.startsWith("video/") && (
                <img
                  src={previewMedia.url}
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover blur-2xl scale-120 opacity-60 pointer-events-none select-none"
                />
              )}
              {previewMedia.mimeType?.startsWith("video/") ? (
                <video
                  src={previewMedia.url}
                  controls
                  preload="metadata"
                  className="relative z-10 w-full h-auto max-h-80 object-contain mx-auto block"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setLightboxSrc(previewMedia.url)}
                  aria-label="View full image"
                  className="relative z-10 w-full text-left cursor-zoom-in flex items-center justify-center"
                >
                  <img
                    src={previewMedia.url}
                    alt="Wave attachment"
                    className="w-full h-auto max-h-80 object-contain mx-auto block transition-opacity duration-200 hover:opacity-95"
                    loading="lazy"
                  />
                </button>
              )}
              {remainingMediaCount > 0 && (
                <span className="absolute right-2 top-2 z-20 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded-full">
                  +{remainingMediaCount}
                </span>
              )}
            </div>
          )}

          {!previewMedia && fileMedia.length > 0 && (
            <div className="flex flex-wrap gap-2 w-full">
              {fileMedia.slice(0, 2).map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[12px] font-medium text-[#4A504E] bg-[#FEF5EA] border border-[#FFC37B] rounded-xl px-2.5 py-1 hover:bg-[#FDE8CD] transition-colors"
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

          {/* Footer: surge button aligned with the card content */}
          <div className="flex w-full items-center justify-start pt-0.5">
            <button
              type="button"
              onClick={handleSurge}
              disabled={isToggling}
              aria-label={hasSurged ? "Remove surge" : "Surge"}
              className={`flex items-center gap-[5px] px-2.5 md:px-3 py-1 md:py-[5px] rounded-[15px] border border-black cursor-pointer transition-colors duration-200 disabled:opacity-50 ${hasSurged
                ? "bg-[#F49B31] text-white"
                : "bg-[#FEF5EA] text-[#4A504E]"
                }`}
            >
              <SurgeIcon
                width={12}
                height={16}
                fill={hasSurged ? "#FFFFFF" : "#F49B31"}
              />
              <span className="font-['Poppins',sans-serif] font-semibold text-[13px] md:text-[14px] leading-normal">
                {surgeCount}
              </span>
            </button>
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
        {lightboxSrc && (
          <ImageLightbox
            src={lightboxSrc}
            alt="Wave image"
            onClose={() => setLightboxSrc(null)}
          />
        )}
      </>
    );
  },
);

WaveCard.displayName = "WaveCard";

export default WaveCard;
