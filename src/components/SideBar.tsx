/**
 * SideBar
 * Figma ref: 4183:17907 (Categories & Create sidebar group)
 * Phase: 1
 */
import Categories from "./Categories";
import { Link, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores";
import { FaPlus } from "react-icons/fa6";

const historyIcon = "/assets/images/History Logo.svg";

export interface Pages {
  streamActive: boolean;
  historyActive: boolean;
  soundBoardActive: boolean;
}

interface Props {
  setActivePage?: React.Dispatch<React.SetStateAction<Pages>>;
  pages?: Pages;
  onCreatePing?: () => void;
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}

const SideBar = ({ onCreatePing, onNavigate, variant = "desktop" }: Props) => {
  const mobile = variant === "mobile";
  const handleCreateClick = () => {
    onCreatePing?.();
  };
  const { pathname } = useLocation();
  const isRepresentative = useAuthStore((s) => s.user?.role === "REPRESENTATIVE");
  const isHistoryRoute = pathname === "/history";

  const navItem = (to: string, label: string, icon: string, active: boolean) => (
    <Link
      to={to}
      onClick={onNavigate}
      className={`flex items-center gap-3.5 h-12 ${
        active
          ? "bg-[#F49B31] text-white"
          : mobile
            ? "border border-[#F4E3C9] bg-white text-[#4A3728] hover:bg-[#FEF5EA]"
            : "border border-[#F49B31] bg-[#FEF5EA] text-black hover:bg-[#fae9d4]"
      } ${mobile ? "rounded-xl px-4" : "rounded-[15px] pl-6"} w-full cursor-pointer transition-colors`}
    >
      <span className="w-5 h-5 flex items-center justify-center shrink-0">
        <img src={icon} alt="" className={`w-5 h-5 ${active ? "filter brightness-0 invert" : ""}`} />
      </span>
      <span className="font-semibold text-[15px] font-['Poppins',sans-serif]">{label}</span>
    </Link>
  );

  return (
    <div className={`flex flex-col ${mobile ? "gap-3.5" : "gap-5"} w-full`}>
      <Categories mobile={mobile} onNavigate={onNavigate} />

      {/* Create a Ping Button */}
      <button
        onClick={handleCreateClick}
        className={`flex items-center gap-3.5 h-12 bg-[#F49B31] hover:bg-[#d88429] transition-colors cursor-pointer ${
          mobile ? "rounded-xl px-4 shadow-sm" : "rounded-[15px] pl-6"
        } w-full text-white`}
      >
        <span className="w-5 h-5 flex items-center justify-center shrink-0">
          <FaPlus className="w-4 h-4" />
        </span>
        <span className="font-semibold text-[15px] font-['Poppins',sans-serif]">
          Create a Ping
        </span>
      </button>

      {isRepresentative && (
        <>
          {navItem("/inbox", "Inbox", "/assets/icon/admin-soundboard.svg", pathname.startsWith("/inbox"))}
          {navItem("/follow-up", "Follow Up", "/assets/icon/followup.svg", pathname === "/follow-up")}
        </>
      )}

      {/* History Button */}
      <Link
        to="/history"
        className={`flex items-center gap-3.5 h-12 ${
          isHistoryRoute
            ? "bg-[#F49B31] text-white"
            : mobile
              ? "border border-[#F4E3C9] bg-white text-[#4A3728] hover:bg-[#FEF5EA]"
              : "border border-[#F49B31] bg-[#FEF5EA] text-black hover:bg-[#fae9d4]"
        } ${
          mobile ? "rounded-xl px-4" : "rounded-[15px] pl-6"
        } w-full cursor-pointer transition-colors`}
      >
        <span className="w-5 h-5 flex items-center justify-center shrink-0">
          <img
            src={historyIcon}
            alt="History"
            className={`w-5 h-5 ${isHistoryRoute ? "filter brightness-0 invert" : ""}`}
          />
        </span>
        <span className="font-semibold text-[15px] font-['Poppins',sans-serif]">
          History
        </span>
      </Link>
    </div>
  );
};

export default SideBar;
