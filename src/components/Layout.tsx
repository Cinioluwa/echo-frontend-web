/**
 * Layout
 * Figma ref: 3643:8353 (desktop full frame), 3912:9533 (mobile full frame)
 * Phase: 1 (right-aside CommentsPanel slot added in Phase 3)
 *
 * New layout structure:
 * - NavBar (top bar; on mobile it hosts the hamburger that opens MobileSideDrawer)
 * - Sidebar (narrower 280px, desktop only)
 * - Main content area (Outlet)
 * - Right aside slot (desktop only):
 *     - /feed          → AnnouncementWidget + Top3Widget (Phase 2)
 *     - /feed/:pingId  → CommentsPanel (Phase 3)
 */
import { useState, useEffect, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { usePageTitle } from "../hooks/usePageTitle";
import { useNotificationSocket } from "../hooks/useNotificationSocket";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { getSocket, connectSocket } from "../api/socket";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import AnnouncementWidget from "./UnifiedFeed/AnnouncementWidget";
import Top3Widget from "./UnifiedFeed/Top3Widget";
import CommentsPanel from "./CommentsPanel";
import PingFormModal from "./PingFormModal";
import ToastNotification from "./ToastNotification";
import InstallBanner from "./shared/InstallBanner";
import { PingCreatorProvider } from "../contexts/PingCreatorContext";
import {
  announcementService,
  publicService,
  pingService,
} from "../api/services";
import type { Announcement, Ping } from "../api/types";
import MarkAsResolvedBar from "./MarkAsResolvedBar";
import { useAuthStore, usePingsStore, useNotificationStore, useSearchStore } from "../stores";

const Layout = () => {
  const location = useLocation();
  const isFeedPage = location.pathname === "/feed";
  const pingDetailMatch = location.pathname.match(/^\/feed\/([^/]+)$/);
  const pingDetailId = pingDetailMatch?.[1] ?? null;

  // Set page title for static pages (ping detail title will be set in PingDetail component)
  usePageTitle();

  const currentUser = useAuthStore((state) => state.user);
  const updatePingStore = usePingsStore((state) => state.updatePing);

  // ── Notification hooks ────────────────────────────────────────────────────
  // Listens for socket `notification:new` events → updates badge + toast queue
  useNotificationSocket();

  // Request push permission and subscribe once the user is confirmed logged in
  const { subscribe } = usePushNotifications();
  useEffect(() => {
    if (currentUser) {
      const token = useAuthStore.getState().token;
      if (token) {
        connectSocket(token);
      }
      subscribe();
      // Fetch initial notifications to populate unread badge (Fixes "0" bubble issue)
      useNotificationStore.getState().fetchNotifications();
    }
    // Only re-run when the logged-in user changes (e.g. after login/logout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  // Global real-time socket events
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleSurgeUpdate = ({ pingId, surgeCount }: { pingId: number | string; surgeCount: number }) => {
      console.log(`⚡ Real-time ping:surgeUpdate ${pingId}: count=${surgeCount}`);
      updatePingStore(String(pingId), { surgeCount });
    };

    const handlePingCreated = (newPing: any) => {
      console.log('📌 Real-time ping:created:', newPing);
      usePingsStore.getState().addPing(newPing);
    };

    const handlePingDeleted = ({ pingId }: { pingId: number | string }) => {
      console.log('🗑️ Real-time ping:deleted:', pingId);
      usePingsStore.getState().removePing(String(pingId));
    };

    socket.on("ping:surgeUpdate", handleSurgeUpdate);
    socket.on("ping:created", handlePingCreated);
    socket.on("ping:deleted", handlePingDeleted);

    return () => {
      socket.off("ping:surgeUpdate", handleSurgeUpdate);
      socket.off("ping:created", handlePingCreated);
      socket.off("ping:deleted", handlePingDeleted);
    };
  }, [updatePingStore]);
  // ─────────────────────────────────────────────────────────────────────────

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [top3, setTop3] = useState<Ping[]>([]);
  const [showPingFormModal, setShowPingFormModal] = useState(false);
  const [ping, setPing] = useState<Ping | null>(null);
  const [isResolvingPing, setIsResolvingPing] = useState(false);
  const [resolveError, setResolveError] = useState<string | null>(null);

  useEffect(() => {
    if (!isFeedPage) return;
    announcementService.getAll().then((list) => {
      if (list.length > 0) setAnnouncement(list[0]);
    });
    publicService.getSoundboard({ sort: "trending", top: 3 }).then((res) => {
      setTop3(res.data);
    });
  }, [isFeedPage]);

  // Ensure category counts and user surge status are hydrated if loading outside /feed
  useEffect(() => {
    if (isFeedPage) return;
    const searchState = useSearchStore.getState();
    const pingsState = usePingsStore.getState();
    if (
      searchState.totalCount === 0 &&
      Object.keys(searchState.categoryCounts).length === 0 &&
      !pingsState.isLoading &&
      pingsState.pings.length === 0
    ) {
      pingsState.fetchPings({ sort: "trending" });
    }
  }, [isFeedPage]);

  // Fetch ping data when on ping detail page
  useEffect(() => {
    if (!pingDetailId) {
      setPing(null);
      return;
    }
    pingService
      .getPingById(pingDetailId)
      .then((data) => {
        setPing(data);
      })
      .catch((err) => {
        console.error("Failed to load ping:", err);
        setPing(null);
      });
  }, [pingDetailId]);

  // Handle resolve action with optimistic updates
  // Best practice: update local state immediately, revert on error
  const handleResolvePing = useCallback(async () => {
    if (!pingDetailId || isResolvingPing || !ping) return;

    // Optimistic update: store previous state in case we need to revert
    const previousPing = ping;
    const optimisticPing = { ...ping, resolvedAt: new Date().toISOString(), progressStatus: "RESOLVED" as const };

    setIsResolvingPing(true);
    setResolveError(null);

    // Immediately update local state (optimistic)
    setPing(optimisticPing);

    try {
      // Mark ping as resolved via API
      const resolvedPing = await pingService.markAsResolved(pingDetailId);

      // Update both local state and store with confirmed response
      setPing(resolvedPing);
      updatePingStore(pingDetailId, resolvedPing);

      // Clear any previous errors
      setResolveError(null);
    } catch (err) {
      // Revert optimistic update on error
      setPing(previousPing);

      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to resolve ping. Please try again.";
      console.error("Failed to resolve ping:", err);
      setResolveError(errorMessage);
    } finally {
      setIsResolvingPing(false);
    }
  }, [pingDetailId, ping, isResolvingPing, updatePingStore]);

  return (
    <div className="min-h-screen">
      {/* Top NavBar — fixed on desktop, static on mobile */}
      <header className="z-20 md:fixed md:top-0 w-full">
        <nav>
          <NavBar />
        </nav>
      </header>

      <div className="md:mt-[70px] w-full px-3 sm:px-6">
        {/* Shared design container — same 1322px width and same padding as NavBar's
            inner bar, so the logo sits on the sidebar's left edge and the profile
            icon on the right aside's right edge. */}
        <div className="max-w-[1322px] mx-auto relative">
          <div className="flex gap-6">
            {/* Desktop Sidebar — sticky, 244px (persistent across feed and ping detail) */}
            <aside className="hidden md:block w-[244px] shrink-0 sticky top-[85px] h-[calc(100vh-85px)] overflow-y-auto [scrollbar-width:none] pt-[15px]">
              <SideBar onCreatePing={() => setShowPingFormModal(true)} />
            </aside>

            {/* Main content area */}
            <div className="flex-1 min-w-0">
            <PingCreatorProvider expandPingCreator={() => { }}>
              <main className="mt-[15px] lg:mt-5 w-full">
                <Outlet context={{ showPingFormModal, setShowPingFormModal, announcement, top3 }} />
              </main>
            </PingCreatorProvider>
          </div>

          {/* Right aside — desktop only */}
          {isFeedPage && (
            <aside className="hidden lg:block w-[310px] shrink-0 sticky top-[85px] h-[calc(100vh-85px)] overflow-y-auto [scrollbar-width:none] pt-[15px]">
              <div className="flex flex-col gap-[15px]">
                <AnnouncementWidget announcement={announcement} />
                <Top3Widget pings={top3} />
              </div>
            </aside>
          )}

          {/* Ping Detail right aside — desktop only (>=1100px).
              Tablet/mobile use PingDetail's inline comments + bottom-sheet drawer. */}
          {pingDetailId && (
            <aside className="hidden min-[1100px]:flex w-[360px] shrink-0 sticky top-[85px] pt-[15px] pb-4 flex-col gap-[15px] max-h-[calc(100vh-85px)]">
              {(() => {
                const isOwner = ping?.isAnonymous
                  ? (ping.isOwner ?? false)
                  : (currentUser?.id === (typeof ping?.author === "object" ? ping.author?.id : undefined));
                const isResolved = !!ping?.resolvedAt;
                const canResolve = ping && isOwner && !isResolved;

                return (
                  <>
                    <CommentsPanel
                      pingId={pingDetailId}
                      className={canResolve ? "max-h-[calc(100vh-85px-135px)]" : "max-h-[calc(100vh-105px)]"}
                      initialCount={ping?._count?.comments}
                    />

                    {/* ── Resolve error message ─────────────────── */}
                    {resolveError && (
                      <div className="bg-red-50 border border-red-200 rounded-[10px] p-3 text-red-700 text-sm shrink-0">
                        {resolveError}
                      </div>
                    )}

                    {/* ── Mark as Resolved bar ─────────────────── */}
                    {canResolve && (
                      <div className="shrink-0">
                        <MarkAsResolvedBar
                          pingId={pingDetailId}
                          onResolved={handleResolvePing}
                          isLoading={isResolvingPing}
                        />
                      </div>
                    )}
                  </>
                );
              })()}
            </aside>
          )}
          </div>
        </div>
      </div>

      {showPingFormModal && (
        <PingFormModal
          setPingForm={() => setShowPingFormModal(false)}
          onPingCreated={() => setShowPingFormModal(false)}
        />
      )}

      {/* Floating toast notifications (bottom-right) */}
      <ToastNotification />

      {/* PWA Install Banner */}
      <InstallBanner />
    </div>
  );
};

export default Layout;
