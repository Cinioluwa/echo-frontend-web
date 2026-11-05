/**
 * UnifiedPingCard
 * Figma ref: 3657:8934 (desktop), 3919:9099 (mobile)
 * Phase: 2
 *
 * Replaces SoundBoardCard. Shows ping header, category label, body (title + description + image),
 * footer (surge / comment / wave counts), and InlineWavePreview section.
 * Clicking the card navigates to /feed/:pingId.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useSurgeStore, usePingsStore } from "../../stores";
import { pingService } from "../../api/services";
import BadgeTooltip from "../BadgeTooltip";
import { calculatePingBadge } from "../../utils/badgeUtils";
import InlineWavePreview from "./InlineWavePreview";
import DeleteConfirmationModal from "../DeleteConfirmationModal";
import UserAvatar from "../UserAvatar";
import PingActionsDropdown from "./PingActionsDropdown";
import ImageCarousel from "../shared/ImageCarousel";
import type { Ping } from "../../api/types";
import { categoryImages } from "../CategoryImages";
import SurgeIcon from "../shared/SurgeIcon";
import formatTimeAgo from "../../utils/formatTimeAgo";
import { getErrorMessage } from "../../utils/networkUtils";

const waveIcon = "/assets/icon/wave.svg";
const commentIcon = "/assets/icon/comment.svg";
interface UnifiedPingCardProps {
  ping: Ping;
  isHistoryContext?: boolean;
  weeklyTop3Ids?: number[];
  wavePreviewMode?: "embedded-only" | "fetch-if-missing";
  onDelete?: (pingId: number) => void;
  detailBasePath?: string;
}

const UnifiedPingCard = ({
  ping,
  isHistoryContext = false,
  weeklyTop3Ids = [],
  wavePreviewMode = "fetch-if-missing",
  onDelete,
  detailBasePath = "/feed",
}: UnifiedPingCardProps) => {
  const navigate = useNavigate();
  const currentUser = useAuthStore((state) => state.user);
  const toggleSurge = useSurgeStore((state) => state.toggleSurge);
  const hasSurged = useSurgeStore((state) =>
    state.hasSurged("ping", String(ping.id)),
  );
  const isToggling = useSurgeStore(
    (state) => state.isToggling[`ping-${ping.id}`] || false,
  );

  // Get the latest ping data from store to reflect surge count updates
  const pingFromStore = usePingsStore(
    (state) => state.pingsById[String(ping.id)],
  );
  const currentPing = pingFromStore || ping;

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const isOwner = currentPing.isAnonymous
    ? (currentPing.isOwner ?? false)
    : (currentUser?.id === (typeof currentPing.author === "object" ? currentPing.author?.id : undefined));

  const authorName =
    currentPing.isAnonymous && currentPing.anonymousAlias
      ? currentPing.anonymousAlias
      : typeof currentPing.author === "object" && currentPing.author
        ? `${currentPing.author.firstName} ${currentPing.author.lastName}`
        : "Anonymous";

  const timestamp = formatTimeAgo(currentPing.createdAt);

  const categoryName = currentPing.category?.name || "";
  const categoryIcon = categoryImages[categoryName] || categoryImages.General;
  const pingImages = currentPing.media?.filter((media) =>
    media.mimeType.startsWith("image/"),
  ) || [];

  const initialHasSurged = currentPing.hasSurged ?? false;
  const baseSurgeCount = currentPing.surgeCount ?? currentPing._count?.surges ?? 0;
  const surgeCount = Math.max(
    0,
    baseSurgeCount + (hasSurged ? 1 : 0) - (initialHasSurged ? 1 : 0),
  );
  const waveCount =
    currentPing._count?.waves ?? currentPing.waves?.length ?? 0;
  const commentCount = currentPing._count?.comments || 0;

  const handleCardClick = () => {
    navigate(`${detailBasePath}/${currentPing.id}`);
  };

  const handleSurge = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isToggling) return;
    try {
      await toggleSurge("ping", String(currentPing.id));
    } catch (error) {
      console.error("Surge failed:", error);
    }
  };

  const handleCommentandWaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`${detailBasePath}/${currentPing.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    const pingId = currentPing.id;
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await pingService.deletePing(String(pingId));
      usePingsStore.getState().removePing(String(pingId));
      onDelete?.(pingId);
      setShowDeleteModal(false);
    } catch (err) {
      console.error("Failed to delete ping:", err);
      setDeleteError(getErrorMessage(err));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className={[
          "bg-[#FEFEFE] rounded-[10px] px-2.5 sm:px-4 md:px-5 py-2.5 sm:py-3 md:py-[15px] flex flex-col gap-[15px] cursor-pointer hover:shadow-sm transition-shadow w-full overflow-hidden",
          isHistoryContext ? "max-w-full min-w-0" : "",
          "text-wrap",
        ].join(" ")}
        onClick={handleCardClick}
        role="article"
      >
        {/* ─── Header ─────────────────────────────── */}
        <div
          className={[
            "flex flex-col gap-2.5",
            isHistoryContext ? "min-w-0" : "",
          ].join(" ")}
        >
          {/* Author row */}
          <div
            className={[
              "flex items-center justify-between gap-1.5 sm:gap-2",
              isHistoryContext ? "min-w-0" : "",
            ].join(" ")}
          >
            <div
              className={[
                "flex items-center gap-2 sm:gap-2.5 md:gap-4 min-w-0 flex-1",
                isHistoryContext ? "min-w-0" : "",
              ].join(" ")}
            >
              {/* Avatar */}
              <UserAvatar
                user={
                  typeof currentPing.author === "object"
                    ? currentPing.author
                    : null
                }
                size="lg"
                responsive
                bgColor="bg-[#FFC37B]"
                className="shrink-0"
                pictureUrl={
                  currentPing.isAnonymous && currentPing.anonymousProfilePicture
                    ? currentPing.anonymousProfilePicture
                    : isOwner && !currentPing.isAnonymous && currentUser?.profilePicture
                      ? currentUser.profilePicture
                      : undefined
                }
              />
              {/* Name + timestamp */}
              <div
                className={[
                  "flex flex-col min-w-0",
                  isHistoryContext ? "min-w-0" : "",
                ].join(" ")}
              >
                <span
                  className="font-['Poppins',sans-serif] font-semibold text-[clamp(12px,3vw,15px)] text-black leading-normal truncate whitespace-nowrap max-w-[95px] xs:max-w-[140px] sm:max-w-none"
                >
                  {authorName}
                </span>
                <span className="font-['Poppins',sans-serif] font-medium text-[clamp(10px,2.4vw,13px)] text-[#8B8E8D] leading-normal whitespace-nowrap">
                  {timestamp}
                </span>
              </div>
            </div>

            {/* Badges: Ping status + actions dropdown */}
            <div
              className={[
                "flex items-center gap-1 md:gap-2.5 shrink-0",
                isHistoryContext ? "min-w-0" : "",
              ].join(" ")}
            >
              {/* Ping status badge (Top 3, Acknowledged, or Resolved) */}
              {(() => {
                // Calculate badge using hierarchy from TAG_AND_STATUS_HIERARCHY.md
                // Pass weeklyTop3Ids from parent to calculate Top 3 badge when applicable
                const badgeConfig = calculatePingBadge(
                  currentPing,
                  weeklyTop3Ids,
                );
                if (!badgeConfig) return null;

                return (<BadgeTooltip badgeKey={badgeConfig.type as string}><img
                    src={badgeConfig.svg}
                    alt={badgeConfig.label}
                    className="h-[22px] sm:h-[28px] md:h-[33px] w-auto shrink-0 select-none object-contain"
                  /></BadgeTooltip>);
              })()}
              {/* Actions dropdown */}
              <PingActionsDropdown
                pingId={currentPing.id}
                isOwner={isOwner}
                onDelete={handleDelete}
              />
            </div>
          </div>

          {/* Category label */}
          {categoryName && (
            <div
              className={[
                "flex items-center gap-[9px] min-w-0 flex-wrap",
                isHistoryContext ? "min-w-0" : "",
              ].join(" ")}
            >
              {categoryIcon && (
                <img
                  src={categoryIcon}
                  alt={categoryName}
                  className="w-[13px] h-[13px] md:w-5 md:h-5 object-contain shrink-0"
                />
              )}
              <span className="font-['Poppins',sans-serif] font-medium text-[clamp(11px,2.8vw,15px)] text-[#171717] truncate">
                {categoryName}
              </span>
            </div>
          )}
        </div>

        {/* ─── Body ────────────────────────────────── */}
        <div
          className={[
            "flex flex-col gap-[13px]",
            isHistoryContext ? "min-w-0" : "",
          ].join(" ")}
        >
          <h3 className="font-['Poppins',sans-serif] font-semibold text-[clamp(13px,3.1vw,16px)] text-black leading-normal wrap-break-words overflow-hidden">
            {currentPing.title}
          </h3>
          {currentPing.content && (
            <p
              className="font-['Poppins',sans-serif] font-medium text-[clamp(11px,2.7vw,14px)] text-black/70 leading-relaxed wrap-break-words overflow-hidden line-clamp-3 whitespace-pre-wrap"
            >
              {currentPing.content}
            </p>
          )}
          {pingImages.length > 0 && (
            <div onClick={(e) => e.stopPropagation()}>
              <ImageCarousel images={pingImages} altText={currentPing.title || "User uploaded image"} />
            </div>
          )}
        </div>

        {/* ─── Footer: Surge + wave & comment counts ─ */}
        <div
          className={[
            "flex items-center justify-between",
            isHistoryContext ? "min-w-0" : "",
          ].join(" ")}
        >
          {/* Surge button */}
          <button
            onClick={handleSurge}
            disabled={isToggling}
            aria-label={hasSurged ? "Remove surge" : "Surge"}
            className={`flex items-center gap-[5px] px-2.5 md:px-3 py-1 md:py-[5px] rounded-[15px] border border-black cursor-pointer transition-colors disabled:opacity-50 ${hasSurged ? "bg-[#F49B31] text-white" : "bg-[#FEF5EA] text-[#4A504E]"}`}
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

          {/* Wave + comment counts */}
          <div className="flex items-center gap-2 md:gap-3.5 flex-wrap justify-end">
            {/* Wave count */}
            <div
              className="flex items-center gap-0"
              onClick={handleCommentandWaveClick}
            >
              <img
                src={waveIcon}
                className="h-[22px] w-5 md:h-[27px] md:w-[25px]"
                alt="waveIcon"
              />
              <span className="font-['Inter',sans-serif] font-medium text-[clamp(10px,2.5vw,14px)] text-[#63637B] leading-5 whitespace-nowrap">
                {waveCount} <span className="md:hidden">Waves</span>
                <span className="hidden md:inline">Waves Proposed</span>
              </span>
            </div>

            {/* Comment count */}
            <button
              onClick={handleCommentandWaveClick}
              className="flex items-center gap-1 hover:text-[#F49B31] transition-colors cursor-pointer"
            >
              <img
                src={commentIcon}
                className="h-[22px] w-5 md:h-[27px] md:w-[25px]"
                alt="commentIcon"
              />
              <span className="font-['Inter',sans-serif] font-medium text-[clamp(10px,2.5vw,14px)] text-[#63637B] leading-5 whitespace-nowrap">
                {commentCount} Comments
              </span>
            </button>
          </div>
        </div>

        {/* ─── Inline Wave Preview ─────────────────── */}
        <InlineWavePreview
          pingId={currentPing.id}
          waves={currentPing.waves}
          mode={wavePreviewMode}
        />
      </div>

      {showDeleteModal && (
        <DeleteConfirmationModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
          isLoading={isDeleting}
          errorMessage={deleteError}
        />
      )}
    </>
  );
};

export default UnifiedPingCard;
