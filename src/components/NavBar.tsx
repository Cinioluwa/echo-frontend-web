/**
 * NavBar
 * Figma ref: 3643:8422 (desktop top bar), 3912:9536 (mobile nav)
 * Phase: 1
 */
import ProfileDropdown from "./ProfileDropdown";

const logo = "/assets/images/Echo Logo_black.svg";
const echoBrand = "/assets/images/Echo brand.svg";

const NavBar = () => {
  return (
    <div className="bg-[#FFC37B] flex items-center justify-between px-5 md:px-[45px] py-1.5 md:py-2.5">
      {/* Desktop: Logo icon + "Echo" text */}
      <div className="hidden md:flex items-center gap-[5px]">
        <img
          src={logo}
          className="brightness-0 contrast-200 h-[27px] w-[25px]"
          alt="Echo logo"
        />
        <span className="font-bold text-[30px] text-black font-['Poppins',sans-serif] leading-normal">
          Echo
        </span>
      </div>

      {/* Mobile: Logo icon only */}
      <div className="block md:hidden">
        <img
          src={echoBrand}
          className="brightness-0 contrast-200 h-12 w-12"
          alt="Echo logo"
        />
      </div>

      {/* User profile + dropdown */}
      <ProfileDropdown />
    </div>
  );
};

export default NavBar;
