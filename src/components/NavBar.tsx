/**
 * NavBar
 * Figma ref: 3643:8422 (desktop top bar), 3912:9536 (mobile nav)
 * Phase: 1
 */
import ProfileDropdown from "./ProfileDropdown";
import NotificationBell from "./NotificationBell";
import { useNavigate } from "react-router-dom";

const logo = "/assets/images/Echo Logo_black.svg";

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#FFC37B] px-5 md:px-6 py-1.5 md:py-2.5">
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        <div
          onClick={() => navigate("/feed")}
          className="flex items-center gap-[5px] cursor-pointer"
        >
          <img
            src={logo}
            className="brightness-0 contrast-200 h-[25px] w-[23px] md:h-[27px] md:w-[25px]"
            alt="Echo logo"
          />
          <span className="font-bold text-[24px] md:text-[30px] text-black font-['Poppins',sans-serif] leading-normal">
            Echo
          </span>
        </div>

        {/* Notification bell + User profile + dropdown */}
        <div className="flex items-center gap-1.5">
          <NotificationBell />
          <ProfileDropdown />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
