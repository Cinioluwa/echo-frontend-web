/**
 * NavBar
 * Figma ref: 3643:8422 (desktop top bar), 3912:9536 (mobile nav)
 * Phase: 1
 *
 * Mobile: a persistent compact hamburger/logo bar stays available at the top
 * of the viewport. Tapping the hamburger opens MobileSideDrawer.
 * Desktop: logo left, bell + profile right.
 */
import { useState } from "react";
import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "./NotificationBell";
import MobileSideDrawer from "./MobileSideDrawer";
import { useNavigate } from "react-router-dom";

const logo = "/assets/images/Echo Logo_black.svg";
const menuBar = "/assets/images/menu-hotdog.svg";

const NavBar = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Desktop app bar */}
      <div className="hidden bg-[#FFC37B] px-3 sm:px-6 py-1.5 md:block md:py-2.5 relative">
        {/* Same max-width as Layout's content row so the logo sits on the sidebar's
            left edge and the profile icon on the right aside's right edge. */}
        <div className="max-w-[1322px] mx-auto flex items-center justify-between gap-2">
          {/* Logo — left-aligned inside the shared desktop container */}
        <div
          onClick={() => navigate("/feed")}
          className="flex items-center gap-[5px] cursor-pointer"
        >
          <img
            src={logo}
            className="brightness-0 contrast-200 h-[27px] w-[25px]"
            alt="Echo logo"
          />
          <span className="font-bold text-[30px] text-black font-['Poppins',sans-serif] leading-normal">
            Echo
          </span>
        </div>

        {/* Notification bell + User profile + dropdown */}
        <div className="flex items-center gap-1.5 shrink-0">
          <NotificationBell />
          <ProfileDropdown />
        </div>
      </div>
      </div>

      {/* Keep the same compact mobile bar available at the top and while scrolling */}
      <div className="h-[64px] md:hidden" aria-hidden="true" />
      <div
        className="md:hidden fixed top-[10px] left-3 right-3 z-30 rounded-[22px] bg-[#FFC37B]/95 shadow-lg backdrop-blur"
      >
        <div className="flex items-center justify-between gap-2 px-3 py-2">
          {/* Mobile: hamburger trigger inside a white circle */}
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            className="shrink-0 w-[34px] h-[34px] rounded-full bg-white flex items-center justify-center cursor-pointer shadow-sm active:scale-95 transition-transform"
          >
            <img
              src={menuBar}
              alt=""
              className="w-[17px] h-[17px] object-contain"
            />
          </button>

          {/* Logo — centred on mobile */}
          <div
            onClick={() => navigate("/feed")}
            className="flex items-center gap-[5px] cursor-pointer absolute left-1/2 -translate-x-1/2"
          >
            <img
              src={logo}
              className="brightness-0 contrast-200 h-[25px] w-[23px]"
              alt="Echo logo"
            />
            <span className="font-bold text-[24px] text-black font-['Poppins',sans-serif] leading-normal">
              Echo
            </span>
          </div>

          {/* Notification bell + User profile + dropdown */}
          <div className="flex items-center gap-1.5 shrink-0">
            <NotificationBell />
            <ProfileDropdown />
          </div>
        </div>
      </div>

      <MobileSideDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
    </>
  );
};

export default NavBar;
