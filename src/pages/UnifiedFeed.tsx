/**
 * UnifiedFeed
 * Figma ref: 3643:8353 (desktop), 3912:9533 (mobile feed)
 * Phase: 2
 *
 * Main feed page. Assembles:
 * - ClaimSpaceBanner (shown until the founding agreement is accepted)
 * - InlinePingCreator (expandable inline form)
 * - Scrollable list of UnifiedPingCard (each with InlineWavePreview)
 */

import { useCallback, useEffect, useState } from "react";
import { useOutletContext, useSearchParams, useNavigate } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { publicService, organizationService } from "../api/services";
import { getSocket } from "../api/socket";
import ClaimSpaceBanner from "../components/ClaimSpaceBanner";
import ClaimSpaceModal from "../components/ClaimSpaceModal";
import InlinePingCreator from "../components/InlinePingCreator";
import InviteLeaderModal from "../components/InviteLeaderModal";
import OnboardingOverlay from "../components/onboarding/OnboardingOverlay";
import AnnouncementWidget from "../components/UnifiedFeed/AnnouncementWidget";
import Top3Widget from "../components/UnifiedFeed/Top3Widget";
import UnifiedPingCard from "../components/UnifiedFeed/UnifiedPingCard";
import type { Announcement, Ping } from "../api/types";
import type { InstitutionStatus } from "../api/services/organization.service";
import { useAuthStore, usePingsStore, useSearchStore } from "../stores";
import UnifiedFeedSkeleton from "../components/skeletons/UnifiedFeedSkeleton";

const UnifiedFeed = () => {
  const { announcement = null, top3 = [] } = useOutletContext<{ announcement: Announcement | null, top3: Ping[] }>() || {};
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Redirect legacy ?ping= query to the new path, preserving other params (like ?wave= or ?comment=)
  useEffect(() => {
    const pingId = searchParams.get("ping");
    if (pingId) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("ping");
      const searchString = newParams.toString();
      navigate(`/feed/${pingId}${searchString ? `?${searchString}` : ""}`, { replace: true });
    }
  }, [searchParams, navigate]);

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
  const user = useAuthStore((state) => state.user);
  const shouldAutoShowOnboarding = useAuthStore(
    (state) => state.shouldAutoShowOnboarding,
  );
  const markOnboardingComplete = useAuthStore(
    (state) => state.markOnboardingComplete,
  );

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [isClaimModalOpen, setClaimModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [weeklyTop3Ids, setWeeklyTop3Ids] = useState<number[]>([]);
  const [institutionStatus, setInstitutionStatus] =
    useState<InstitutionStatus | null>(null);
  const refreshInstitutionStatus = useCallback(async () => {
    if (!organizationId) {
      setInstitutionStatus(null);
      return;
    }

    try {
      const status = await organizationService.getInstitutionStatus(organizationId);
      setInstitutionStatus(status);
    } catch (err) {
      console.error("Failed to fetch institution status:", err);
      setInstitutionStatus(null);
    }
  }, [organizationId]);

  useEffect(() => {
    void refreshInstitutionStatus();
  }, [refreshInstitutionStatus]);

  // ── Fetch campus data on mount / search change (Hydrates category counts) ──
  useEffect(() => {
    fetchPings({
      q: debouncedQuery || undefined,
      category: selectedCategoryId !== null ? selectedCategoryId : undefined,
      categoryId: selectedCategoryId !== null ? selectedCategoryId : undefined,
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
  }, [debouncedQuery, selectedCategoryId, fetchPings, organizationId]);

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

    // Listen for real-time surge updates
    const handleSurgeUpdate = ({ pingId, surgeCount }: { pingId: number | string; surgeCount: number }) => {
      usePingsStore.getState().updatePing(String(pingId), { surgeCount });
    };
    socket.on("ping:surgeUpdate", handleSurgeUpdate);

    return () => {
      socket.off("ping:created");
      socket.off("ping:deleted");
      socket.off("ping:surgeUpdate", handleSurgeUpdate);
    };
  }, []);

  // ── Infinite scroll handler ─────────────────────────────────────────────────
  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isLoading) fetchNextPage();
  }, [hasNextPage, isLoading, fetchNextPage]);

  // ── onboarding Overlay controller ─────────────────────────────────────────────────
  const [openOnboarding, setOpenOnboarding] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    // Prevent showing multiple times in the same session, even if state fluctuates
    if (sessionStorage.getItem("echo:onboarding-shown") === "1") {
      return;
    }

    if (shouldAutoShowOnboarding(user)) {
      setOpenOnboarding(true);
      sessionStorage.setItem("echo:onboarding-shown", "1");
    }
  }, [user, shouldAutoShowOnboarding]);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-[15px] pb-10 w-full max-w-[720px] mx-auto">
      {/* ClaimSpaceBanner */}
      {institutionStatus?.claimStatus === "UNCLAIMED" && !institutionStatus?.hasLeader && (
        <ClaimSpaceBanner
          status={institutionStatus}
          onClaimSpace={() => setClaimModalOpen(true)}
          onRecommendLeader={() => setInviteModalOpen(true)}
        />
      )}

      {/* Inline ping creator */}
      <InlinePingCreator />

      {/* Mobile-only Top Widgets (Desktop renders these in Layout's right aside) */}
      {(
        <div className="lg:hidden flex flex-col gap-[15px]">
          <AnnouncementWidget announcement={announcement} />
          <Top3Widget pings={top3} />
        </div>
      )}

      {/* ── Feed list ── */}
      {error && pings.length === 0 ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-white p-5 font-['Inter',sans-serif] text-sm text-red-800">
          {error}
        </div>
      ) : isLoading && pings.length === 0 ? (
        <UnifiedFeedSkeleton />
      ) : pings.length === 0 ? (
        <div className="text-center py-16 text-[#4A504E] text-sm">
          No pings yet. Be the first to raise an issue!
        </div>
      ) : (
        <div className="flex flex-col gap-[15px] w-full">
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-white p-3 font-['Inter',sans-serif] text-sm text-red-800">{error}</p>}
          {pings.map((ping) => (
            <div className="relative group" key={ping.id}>
              <UnifiedPingCard
                ping={ping}
                weeklyTop3Ids={weeklyTop3Ids}
                wavePreviewMode="embedded-only"
              />
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
        onSubmitted={() => void refreshInstitutionStatus()}
        institutionName={institutionStatus?.organizationName}
        organizationId={organizationId}
      />
      <InviteLeaderModal
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        organizationId={organizationId}
        institutionName={institutionStatus?.organizationName}
      />
      {/* Conditionally Rendered  */}
      {openOnboarding && (
        <OnboardingOverlay
          onFinish={() => {
            void markOnboardingComplete();
            setOpenOnboarding(false);
          }}
        />
      )}
    </div>
  );
};

export default UnifiedFeed;
