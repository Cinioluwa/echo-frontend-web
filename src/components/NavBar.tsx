/**
 * NavBar
 * Figma ref: 3643:8422 (desktop top bar), 3912:9536 (mobile nav)
 * Phase: 1
 */
import ProfileDropdown from "./ProfileDropdown";
import { useNavigate } from "react-router-dom";

const logo = "/assets/images/Echo Logo_black.svg";
const echoBrand = "/assets/images/Echo brand.svg";

const NavBar = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-[#FFC37B] flex items-center justify-between px-5 md:px-[45px] py-1.5 md:py-2.5">
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

      {/* User profile + dropdown */}
      <ProfileDropdown />
    </div>
  );
};

export default NavBar;
