/**
 * UnifiedFeed
 * Figma ref: 3643:8353 (desktop), 3912:9533 (mobile feed)
 * Phase: 2
 *
 * Main feed page. Assembles:
 * - ClaimSpaceBanner (dismissible, shows when org has no leader)
 * - InlinePingCreator (expandable inline form)
 * - Scrollable list of UnifiedPingCard (each with InlineWavePreview)
 *
 * TODO: API — fetch pings with fetchPings() and waves with fetchWaves()
 * TODO: API — check if org has a leader; show ClaimSpaceBanner when leaderless
 * TODO: API — feed top-3 to Layout's right column (via context or outlet context)
 */

import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { publicService } from "../api/services";
import { getSocket } from "../api/socket";
import ClaimSpaceBanner from "../components/ClaimSpaceBanner";
import ClaimSpaceModal from "../components/ClaimSpaceModal";
import InlinePingCreator from "../components/InlinePingCreator";
import InviteLeaderModal from "../components/InviteLeaderModal";
import OnboardingOverlay from "../components/onboarding/OnboardingOverlay";
import UnifiedPingCard from "../components/UnifiedFeed/UnifiedPingCard";
import { useAuthStore, usePingsStore, useSearchStore } from "../stores";

const UnifiedFeed = () => {
  // ── Pings store ────────────────────────────────────────────────────────────
  const { pings, isLoading, error, fetchPings, fetchNextPage, hasNextPage } =
    usePingsStore(
      useShallow((state) => ({
        pings: state.pings,
        isLoading: state.isLoading,
        error: state.error,
        fetchPings: state.fetchPings,
        fetchNextPage: state.fetchNextPage,
        hasNextPage: state.hasNextPage,
      })),
    );

  // ── Search / filter store ───────────────────────────────────────────────────
  const { debouncedQuery, selectedCategoryId } = useSearchStore(
    useShallow((state) => ({
      debouncedQuery: state.debouncedQuery,
      selectedCategoryId: state.selectedCategoryId,
    })),
  );

  // ── Auth store — for organizationId passed to claim/invite modals ─────────
  const organizationId = useAuthStore(
    (state) => state.user?.organizationId ?? null,
  );

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [isClaimModalOpen, setClaimModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [weeklyTop3Ids, setWeeklyTop3Ids] = useState<number[]>([]);
  // ── Fetch data on mount / search change ────────────────────────────────────
  useEffect(() => {
    fetchPings({
      q: debouncedQuery || undefined,
      category: selectedCategoryId || undefined,
      sort: "trending",
    });
    // Fetch top 3 pings to pass badge info to UnifiedPingCard components
    publicService
      .getSoundboard({ sort: "trending", top: 3 })
      .then((res) => {
        setWeeklyTop3Ids(res.data.map((ping) => ping.id));
      })
      .catch((err) => {
        console.error("Failed to fetch top 3 pings:", err);
      });
  }, [debouncedQuery, selectedCategoryId, fetchPings]);

  // ── WebSocket event wiring (Phase 11) ───────────────────────────────────────
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    // Listen for new pings in the feed
    socket.on("ping:created", (newPing) => {
      usePingsStore.getState().addPing(newPing);
    });

    // Listen for deleted pings
    socket.on("ping:deleted", ({ pingId }) => {
      usePingsStore.getState().removePing(String(pingId));
    });

    return () => {
      socket.off("ping:created");
      socket.off("ping:deleted");
    };
  }, []);

  // ── Infinite scroll handler ─────────────────────────────────────────────────
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [hasNextPage, isLoading, fetchNextPage]);

  // ── onboarding Overlay controller ─────────────────────────────────────────────────
  const [openOnboarding, setOpenOnboarding] = useState(false);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-[15px] pb-10 max-w-[93vw]">
      {/* Claim space banner — TODO: API — hide when org.leaderId != null */}
      <ClaimSpaceBanner
        onClaimSpace={() => setClaimModalOpen(true)}
        onInviteLeader={() => setInviteModalOpen(true)}
      />

      {/* Inline ping creator */}
      <InlinePingCreator />

      {/* ── Feed list ── */}
      {isLoading && pings.length === 0 ? (
        <div className="flex justify-center items-center py-16">
          <div className="w-8 h-8 border-4 border-[#F49B31] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-[10px] px-4 py-3 text-red-600 text-sm">
          {error}
        </div>
      ) : pings.length === 0 ? (
        <div className="text-center py-16 text-[#4A504E] text-sm">
          No pings yet. Be the first to raise an issue!
        </div>
      ) : (
        <div className="flex flex-col gap-[15px] w-full">
          {pings.map((ping) => (
            <div className="relative group" key={ping.id}>
              <UnifiedPingCard ping={ping} weeklyTop3Ids={weeklyTop3Ids} />
              <div className="absolute inset-0 group-hover:bg-black/6 cursor-pointer pointer-events-none rounded-[10px]" />
            </div>
          ))}

          {/* Load more */}
          {hasNextPage && (
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="mx-auto mt-2 px-6 py-2 bg-[#FEF5EA] border border-[#F49B31] rounded-[15px] text-[#F49B31] font-semibold text-[14px] hover:bg-[#FAE9D4] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Loading…" : "Load more"}
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <ClaimSpaceModal
        isOpen={isClaimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        organizationId={organizationId}
      />
      <InviteLeaderModal
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        organizationId={organizationId}
      />

      {/* Conditionally Rendered  */}
      {openOnboarding && (
        <OnboardingOverlay onFinish={() => setOpenOnboarding(false)} />
      )}
    </div>
  );
};

export default UnifiedFeed;
