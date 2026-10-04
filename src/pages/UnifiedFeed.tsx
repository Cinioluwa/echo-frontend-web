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
import { useOutletContext, useSearchParams, useNavigate, Link } from "react-router-dom";
import { useShallow } from "zustand/react/shallow";
import { publicService, organizationService } from "../api/services";
import representativeService from "../api/services/representative.service";
import institutionAdminService from "../api/services/institutionAdmin.service";
import { getSocket } from "../api/socket";
import ClaimSpaceBanner from "../components/ClaimSpaceBanner";
import ClaimSpaceModal from "../components/ClaimSpaceModal";
import AssignPingModal from "../components/AssignPingModal";
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
  const [representativePings, setRepresentativePings] = useState<Ping[]>([]);
  const [representativeLoading, setRepresentativeLoading] = useState(false);
  const [representativeError, setRepresentativeError] = useState<string | null>(null);
  const [representativeHasNextPage, setRepresentativeHasNextPage] = useState(false);
  const [representativePage, setRepresentativePage] = useState(1);
  const [assigningPing, setAssigningPing] = useState<Ping | null>(null);
  const [representativeScope, setRepresentativeScope] = useState<string[]>([]);
  const [feedViewMode, setFeedViewMode] = useState<"all" | "scope">("all");
  const isRepresentative = user?.role === "REPRESENTATIVE";
  const canAssignPings =
    user?.role === "ADMIN" ||
    user?.role === "SUPER_ADMIN" ||
    (user?.representativeProfile?.isActive === true &&
      user.representativeProfile.canAssign === true);

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

  const loadRepresentativePings = useCallback((page = 1) => {
    setRepresentativeLoading(true);
    setRepresentativeError(null);
    return representativeService
      .getSubmittedPings({ page, limit: 20 })
      .then((response) => {
        setRepresentativePings((current) =>
          page === 1 ? response.data : [...current, ...response.data]
        );
        setRepresentativePage(page);
        setRepresentativeHasNextPage(response.pagination.hasNextPage);
      })
      .catch((requestError: unknown) => {
        console.error("Failed to load the representative inbox:", requestError);
        const responseData = (
          requestError as { response?: { data?: { error?: string; message?: string } } }
        )?.response?.data;
        setRepresentativeError(
          responseData?.error || responseData?.message || "We couldn't load your representative inbox."
        );
        if (page === 1) setRepresentativePings([]);
      })
      .finally(() => setRepresentativeLoading(false));
  }, []);

  useEffect(() => {
    if (!isRepresentative) return;
    void loadRepresentativePings(1);
  }, [isRepresentative, loadRepresentativePings]);

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

  useEffect(() => {
    if (!isRepresentative || !organizationId) {
      setRepresentativeScope([]);
      return;
    }

    let cancelled = false;
    institutionAdminService
      .getContextOptions(organizationId)
      .then((context) => {
        if (cancelled) return;
        const profile = user?.representativeProfile;
        const bodyName = context.bodies.find((body) => body.id === profile?.bodyId)?.name;
        const departmentName = context.departments.find(
          (department) => department.id === profile?.departmentId,
        )?.name;
        const scopes = [
          bodyName,
          departmentName,
          profile?.responsibilities === "*"
            ? "All categories"
            : profile?.responsibilities?.split(",").filter(Boolean).join(", "),
          profile?.scopeLevel ? `${profile.scopeLevel}L` : null,
          profile?.scopeHall || null,
        ].filter((value): value is string => Boolean(value));
        setRepresentativeScope(scopes);
      })
      .catch((scopeError: unknown) => {
        console.error("Failed to load representative scope labels:", scopeError);
        if (!cancelled) setRepresentativeScope([]);
      });

    return () => {
      cancelled = true;
    };
  }, [isRepresentative, organizationId, user?.representativeProfile]);

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
  const isViewingScope = isRepresentative && feedViewMode === "scope";
  const visiblePings = isViewingScope ? representativePings : pings;
  const feedLoading = isViewingScope ? representativeLoading : isLoading;
  const feedError = isViewingScope ? representativeError : error;

  const handleLoadMore = useCallback(() => {
    if (isViewingScope) {
      if (!representativeHasNextPage || representativeLoading) return;
      void loadRepresentativePings(representativePage + 1);
      return;
    }

    if (hasNextPage && !isLoading) fetchNextPage();
  }, [
    isViewingScope,
    representativeHasNextPage,
    representativeLoading,
    representativePage,
    loadRepresentativePings,
    hasNextPage,
    isLoading,
    fetchNextPage,
  ]);

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
      {institutionStatus?.claimStatus === "UNCLAIMED" && (
        <ClaimSpaceBanner
          status={institutionStatus}
          onClaimSpace={() => setClaimModalOpen(true)}
          onRecommendLeader={() => setInviteModalOpen(true)}
        />
      )}

      {/* Inline ping creator */}
      <InlinePingCreator />

      {/* Representative Feed Switcher */}
      {isRepresentative && (
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#ffd7a8] bg-[#FEF5EA] p-2 shadow-sm">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFeedViewMode("all")}
              className={`rounded-full px-5 py-2 font-['Inter',sans-serif] text-xs font-semibold transition-all ${
                feedViewMode === "all"
                  ? "bg-[#101010] text-white shadow-sm"
                  : "bg-transparent text-black/65 hover:bg-white hover:text-[#101010]"
              }`}
            >
              Campus Feed
            </button>
            <button
              type="button"
              onClick={() => setFeedViewMode("scope")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 font-['Inter',sans-serif] text-xs font-semibold transition-all ${
                feedViewMode === "scope"
                  ? "bg-[#F49B31] text-white shadow-sm"
                  : "bg-transparent text-black/65 hover:bg-white hover:text-[#A85C08]"
              }`}
            >
              <span>Representative Queue</span>
              {representativePings.length > 0 && (
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                    feedViewMode === "scope"
                      ? "bg-white/25 text-white"
                      : "bg-[#F49B31]/15 text-[#A85C08]"
                  }`}
                >
                  {representativePings.length}
                </span>
              )}
            </button>
          </div>
          <Link
            to="/admin/soundboard"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 font-['Inter',sans-serif] text-xs font-semibold text-[#A85C08] hover:underline"
          >
            Full Workspace →
          </Link>
        </div>
      )}

      {/* Scope banner when in scope view */}
      {isViewingScope && (
        <section className="rounded-2xl border border-black/10 bg-white px-5 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-['Inter',sans-serif] text-xs font-semibold uppercase tracking-[0.15em] text-[#A85C08]">Representative inbox</p>
              <h2 className="mt-1 font-['Poppins',sans-serif] text-lg font-semibold text-[#101010]">Viewing issues for your assigned scope</h2>
              {representativeScope.length > 0 && (
                <p className="mt-1 font-['Inter',sans-serif] text-sm leading-6 text-black/65">{representativeScope.join(" · ")}</p>
              )}
              <p className="mt-1 font-['Inter',sans-serif] text-xs leading-5 text-black/55">This queue includes issues in your scope and issues explicitly assigned to you or your body.</p>
            </div>
            <Link
              to="/admin/soundboard"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#D1C0A9] bg-[#FEF5EA] px-4 py-2 font-['Inter',sans-serif] text-xs font-semibold text-[#A85C08] hover:bg-[#faebd7]"
            >
              Open Full Workspace
            </Link>
          </div>
        </section>
      )}

      {/* Mobile-only Top Widgets (Desktop renders these in Layout's right aside) */}
      {!isViewingScope && (
        <div className="lg:hidden flex flex-col gap-[15px]">
          <AnnouncementWidget announcement={announcement} />
          <Top3Widget pings={top3} />
        </div>
      )}

      {/* ── Feed list ── */}
      {feedError && visiblePings.length === 0 ? (
        <div role="alert" className="rounded-2xl border border-red-200 bg-white p-5 font-['Inter',sans-serif] text-sm text-red-800">
          {feedError}
        </div>
      ) : feedLoading && visiblePings.length === 0 ? (
        <UnifiedFeedSkeleton />
      ) : visiblePings.length === 0 ? (
        <div className="text-center py-16 text-[#4A504E] text-sm">
          {isViewingScope ? "No issues are currently assigned to your scope." : "No pings yet. Be the first to raise an issue!"}
        </div>
      ) : (
        <div className="flex flex-col gap-[15px] w-full">
          {feedError && <p role="alert" className="rounded-xl border border-red-200 bg-white p-3 font-['Inter',sans-serif] text-sm text-red-800">{feedError}</p>}
          {visiblePings.map((ping) => (
            <div className="relative group" key={ping.id}>
              <UnifiedPingCard
                ping={ping}
                weeklyTop3Ids={weeklyTop3Ids}
                wavePreviewMode="embedded-only"
              />
              <div className="absolute inset-0 group-hover:bg-black/6 cursor-pointer pointer-events-none rounded-[10px]" />
              {isViewingScope && canAssignPings && (
                <div className="relative z-10 -mt-1 flex justify-end px-3 pb-3">
                  <button
                    type="button"
                    onClick={() => setAssigningPing(ping)}
                    className="rounded-full border border-black/10 bg-white px-4 py-2 font-['Inter',sans-serif] text-xs font-semibold text-[#A85C08] hover:bg-[#FEF5EA]"
                  >
                    Assign / Route
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Load more */}
          {(isViewingScope ? representativeHasNextPage : hasNextPage) && (
            <button
              onClick={handleLoadMore}
              disabled={feedLoading}
              className="mx-auto mt-2 px-6 py-2 bg-[#FEF5EA] border border-[#F49B31] rounded-[15px] text-[#F49B31] font-semibold text-[14px] hover:bg-[#FAE9D4] transition-colors disabled:opacity-50"
            >
              {feedLoading ? "Loading…" : "Load more"}
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
      <AssignPingModal
        ping={assigningPing}
        organizationId={organizationId}
        onClose={() => setAssigningPing(null)}
        onAssigned={(updatedPing) => {
          setRepresentativePings((current) =>
            current.map((ping) => ping.id === updatedPing.id ? updatedPing : ping),
          );
        }}
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
