/**
 * Layout
 * Figma ref: 3643:8353 (desktop full frame), 3912:9533 (mobile full frame)
 * Phase: 1 (right-aside CommentsPanel slot added in Phase 3)
 *
 * New layout structure:
 * - NavBar (simplified top bar, fixed on desktop)
 * - Sidebar (narrower 280px, desktop only)
 * - MobileHeader (mobile only, replaces PageTitleBar)
 * - Main content area (Outlet)
 * - Right aside slot (desktop only):
 *     - /feed          → AnnouncementWidget + Top3Widget (Phase 2)
 *     - /feed/:pingId  → CommentsPanel (Phase 3)
 */
import { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import MobileHeader from "./MobileHeader";
import AnnouncementWidget from "./UnifiedFeed/AnnouncementWidget";
import Top3Widget from "./UnifiedFeed/Top3Widget";
import CommentsPanel from "./CommentsPanel";
import PingFormModal from "./PingFormModal";
import { PingCreatorProvider } from "../contexts/PingCreatorContext";
import { announcementService, publicService } from "../api/services";
import type { Announcement, Ping } from "../api/types";

const Layout = () => {
  const location = useLocation();
  const isFeedPage = location.pathname === "/feed";
  const pingDetailMatch = location.pathname.match(/^\/feed\/([^/]+)$/);
  const pingDetailId = pingDetailMatch?.[1] ?? null;

  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [top3, setTop3] = useState<Ping[]>([]);
  const [showPingFormModal, setShowPingFormModal] = useState(false);

  useEffect(() => {
    if (!isFeedPage) return;
    announcementService.getAll().then((list) => {
      if (list.length > 0) setAnnouncement(list[0]);
    });
    publicService.getSoundboard({ sort: "trending", top: 3 }).then((res) => {
      setTop3(res.data);
    });
  }, [isFeedPage]);

  return (
    <div className="min-h-screen">
      {/* Top NavBar — fixed on desktop, static on mobile */}
      <header className="z-20 md:fixed md:top-0 w-full">
        <nav>
          <NavBar />
        </nav>
      </header>

      <div className="md:mt-[70px] flex ">
        {/* Desktop Sidebar — fixed, narrower (280px with padding) */}
        <aside className="hidden md:block fixed left-0 top-[70px] bottom-0 w-[280px] overflow-y-auto [scrollbar-width:none] px-[18px] pt-[15px] ">
          <SideBar onCreatePing={() => setShowPingFormModal(true)} />
        </aside>

        {/* Main content area */}
        <div className="flex-1 md:ml-[280px]">
          {/* Mobile header — replaces PageTitleBar, mobile only */}
          <div className="md:hidden">
            <MobileHeader />
          </div>

          <PingCreatorProvider expandPingCreator={() => { }}>
            <main className={`mx-[15px] mt-[15px] md:mx-5 md:mt-5 md:w-[calc(100vw-45vw)] ${isFeedPage || pingDetailId ? 'lg:max-w-[calc(100vw-680px)]' : 'lg:max-w-[calc(100vw-30vw)]'} lg:mx-auto `}>
              <Outlet context={{ showPingFormModal, setShowPingFormModal }} />
            </main>
          </PingCreatorProvider>
        </div>

        {/* Right aside — desktop only */}
        {isFeedPage && (
          <aside className="hidden lg:block w-[310px] shrink-0 pt-[15px] pr-5">
            <div className="flex flex-col gap-[15px]">
              <AnnouncementWidget announcement={announcement} />
              <Top3Widget pings={top3} />
            </div>
          </aside>
        )}

        {/* Ping Detail right aside — CommentsPanel (Phase 3) */}
        {pingDetailId && (
          <aside className="hidden lg:flex w-[310px] shrink-0 pt-[15px] pr-5">
            <CommentsPanel pingId={pingDetailId} className="flex-1" />
          </aside>
        )}
      </div>

      {showPingFormModal && (
        <PingFormModal
          setPingForm={() => setShowPingFormModal(false)}
          setFormSegment={() => { }}
          formSegment="ping"
          onPingCreated={() => setShowPingFormModal(false)}
          onWaveCreated={() => setShowPingFormModal(false)}
        />
      )}
    </div>
  );
};

export default Layout;
