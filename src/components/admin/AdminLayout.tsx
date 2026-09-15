import React, { useState } from "react";
import AdminSideBar from "./AdminSideBar";

interface AdminLayoutProps {
  children?: React.ReactNode;
  userName?: string;
  userBadge?: string;
}

/**
 * Root cause Bug 1: sidebar rendered in an isolated
 * `div.relative.md:fixed` wrapper, detached from page content, while each
 * page hardcoded `md:ms-[230px]` that never matched the sidebar's real
 * width (390px expanded / 100px collapsed) → overlay + covered cards.
 * Fix: sidebar + main are flex siblings; main is `flex-1 min-w-0` so it
 * always shrinks/pushes instead of being covered. Width animates via
 * `transition-[width]`.
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ children, userName, userBadge }) => {
  // Part B.5: fresh page loads should start collapsed, not expanded.
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fae9d4]">
      {/* No standalone top NavBar here — each admin page renders its own
          mobile header (AdminHeader / SoundboardMobileHeader). Rendering
          NavBar as well duplicated the header at mobile widths (Part D). */}
      <div className="flex items-start min-h-screen" data-node-id="admin-layout-row">
        {/* Sidebar slot: a relatively-positioned container holding an
            invisible layout spacer plus the actual sidebar. At tablet
            (md–lg) the spacer always reserves the collapsed 100px lane so
            content never shifts, and the real sidebar is absolutely
            positioned to overlay on top when expanded (Part B.2/B.4). At
            desktop (lg+) the spacer follows the toggle and the sidebar sits
            in normal (sticky) flow, pushing content as before. */}
        <div className="hidden md:block relative shrink-0" data-node-id="admin-sidebar-slot">
          <div
            aria-hidden="true"
            className={`invisible h-screen transition-[width] duration-300 ease-in-out md:max-lg:w-[100px] ${isSidebarOpen ? "lg:w-[292px]" : "lg:w-[100px]"}`}
          />
          <div className="fixed top-0 left-0 h-screen z-30">
            <AdminSideBar
              userName={userName ?? "Osagumwenro Ugbo"}
              userBadge={userBadge ?? "ADMIN.CU"}
              isOpen={isSidebarOpen}
              onToggleSidebar={() => setIsSidebarOpen((v) => !v)}
              onSoundboardClick={() => { }}
            />
          </div>
        </div>

        {/* Tablet-only dimmed backdrop: a full-viewport layer whose opacity
            fades in/out in sync with the sidebar's own width transition
            (Part B.3), instead of a static box-shadow. Hidden below md
            (mobile uses its own drawer) and at lg+ (desktop pushes content,
            no dimming needed). Clicking it collapses the sidebar. */}
        <div
          aria-hidden={!isSidebarOpen}
          onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
          className={`hidden md:max-lg:block fixed inset-0 z-20 bg-[#212121] transition-opacity duration-300 ease-in-out ${isSidebarOpen ? "opacity-30 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        />

        {/* Main content column — on desktop this shifts with the toggle; on
            tablet it always matches the collapsed width so it stays put. */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
