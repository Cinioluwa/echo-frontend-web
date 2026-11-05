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
  const representativeProfile = useAuthStore((s) =>
    s.user?.role === "REPRESENTATIVE" && s.user.representativeProfile?.isActive
      ? s.user.representativeProfile
      : null,
  );
  const canManageReps = representativeProfile?.canManageReps === true;
  const canModerate = representativeProfile?.canModerateWaves === true;
  const isRepresentative = useAuthStore((s) => s.user?.role === "REPRESENTATIVE");
  const isHistoryRoute = pathname === "/history";

  const navItem = (to: string, label: string, icon: string, active: boolean) => (
    <Link
      to={to}
      onClick={onNavigate}
      className={`flex items-center gap-3.5 h-12 ${
        active
          ? "bg-[var(--echo-accent)] text-[var(--echo-text-on-accent)]"
          : mobile
            ? "border border-[var(--echo-border-f4e3c9)] bg-[var(--echo-surface)] text-[var(--echo-text-4a3728)] hover:bg-[var(--echo-surface-soft)]"
            : "border border-[var(--echo-border-f49b31)] bg-[var(--echo-surface-soft)] text-[var(--echo-text-primary)] hover:bg-[var(--echo-page)]"
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
        className={`flex items-center gap-3.5 h-12 bg-[var(--echo-accent)] hover:bg-[var(--echo-bg-d88429)] transition-colors cursor-pointer ${
          mobile ? "rounded-xl px-4 shadow-sm" : "rounded-[15px] pl-6"
        } w-full text-[var(--echo-text-on-accent)]`}
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
          {canModerate &&
            navItem(
              "/moderation",
              "Moderation",
              "/assets/icon/moderation.svg",
              pathname === "/moderation",
            )}
          {canManageReps &&
            navItem(
              "/delegation",
              "Delegation & Scope",
              "/assets/icon/organization.svg",
              pathname === "/delegation",
            )}
        </>
      )}

      {/* History Button */}
      <Link
        to="/history"
        className={`flex items-center gap-3.5 h-12 ${
          isHistoryRoute
            ? "bg-[var(--echo-accent)] text-[var(--echo-text-on-accent)]"
            : mobile
              ? "border border-[var(--echo-border-f4e3c9)] bg-[var(--echo-surface)] text-[var(--echo-text-4a3728)] hover:bg-[var(--echo-surface-soft)]"
              : "border border-[var(--echo-border-f49b31)] bg-[var(--echo-surface-soft)] text-[var(--echo-text-primary)] hover:bg-[var(--echo-page)]"
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
