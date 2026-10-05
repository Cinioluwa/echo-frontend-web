import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../NotificationBell";
import ProfileDropdown from "../ProfileDropdown";
import AdminMobileMenu from "./AdminMobileMenu";

const logo = "/assets/images/Echo Logo_black.svg";
const menuBar = "/assets/images/menu-hotdog.svg";

const AdminMobileNavBar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <div className="h-[64px] min-[1131px]:hidden" aria-hidden="true" />
      <div className="fixed left-3 right-3 top-[10px] z-30 rounded-[22px] bg-[#FFC37B]/95 shadow-lg backdrop-blur min-[1131px]:hidden">
        <div className="relative flex items-center justify-between gap-2 px-3 py-2">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open admin menu"
            aria-expanded={menuOpen}
            className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-white shadow-sm transition-transform active:scale-95"
          >
            <img src={menuBar} alt="" className="h-[17px] w-[17px] object-contain" />
          </button>

          <button
            type="button"
            onClick={() => navigate("/feed")}
            className="absolute left-1/2 flex -translate-x-1/2 items-center gap-[5px]"
            aria-label="Echo home"
          >
            <img
              src={logo}
              className="h-[25px] w-[23px] brightness-0 contrast-200"
              alt=""
            />
            <span className="font-['Poppins',sans-serif] text-[24px] font-bold leading-normal text-black">
              Echo
            </span>
          </button>

          <div className="flex shrink-0 items-center gap-1.5">
            <NotificationBell />
            <ProfileDropdown />
          </div>
        </div>
      </div>
      <AdminMobileMenu setMenu={setMenuOpen} menu={menuOpen} />
    </>
  );
};

export default AdminMobileNavBar;
