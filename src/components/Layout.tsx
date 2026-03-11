/**
 * Layout
 * Figma ref: 3643:8353 (desktop full frame), 3912:9533 (mobile full frame)
 * Phase: 1
 *
 * New layout structure:
 * - NavBar (simplified top bar, fixed on desktop)
 * - Sidebar (narrower 280px, desktop only)
 * - MobileHeader (mobile only, replaces PageTitleBar)
 * - Main content area (Outlet)
 * - Right aside slot (desktop only, feed page only — Phase 2 widgets)
 */
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import MobileHeader from "./MobileHeader";

const Layout = () => {
  const location = useLocation();
  const isFeedPage =
    location.pathname === "/feed" || location.pathname.startsWith("/feed/");

  return (
    <div className="min-h-screen">
      {/* Top NavBar — fixed on desktop, static on mobile */}
      <header className="z-20 md:fixed md:top-0 w-full">
        <nav>
          <NavBar />
        </nav>
      </header>

      <div className="md:mt-[70px] flex">
        {/* Desktop Sidebar — fixed, narrower (280px with padding) */}
        <aside className="hidden md:block fixed left-0 top-[70px] bottom-0 w-[280px] overflow-y-auto [scrollbar-width:none] px-[18px] pt-[15px]">
          <SideBar />
        </aside>

        {/* Main content area */}
        <div className="flex-1 md:ml-[280px]">
          {/* Mobile header — replaces PageTitleBar, mobile only */}
          <div className="md:hidden">
            <MobileHeader />
          </div>

          <main className="mx-[15px] mt-[15px] md:mx-5 md:mt-5">
            <Outlet />
          </main>
        </div>

        {/* Right aside — desktop only, feed page only (Phase 2: AnnouncementWidget, Top3Widget) */}
        {isFeedPage && (
          <aside className="hidden lg:block w-[250px] shrink-0 pt-[15px] pr-5">
            {/* TODO: Phase 2 — AnnouncementWidget */}
            {/* TODO: Phase 2 — Top3Widget */}
          </aside>
        )}
      </div>
    </div>
  );
};

export default Layout;
