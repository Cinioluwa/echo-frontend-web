/**
 * SideBar
 * Figma ref: 4183:17907 (Categories & Create sidebar group)
 * Phase: 1
 */
import Categories from "./Categories";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa6";

const historyIcon = "/assets/images/History Logo.svg";

// Kept for backward compatibility — Phase 8 will clean up old consumers
export interface Pages {
  streamActive: boolean;
  historyActive: boolean;
  soundBoardActive: boolean;
}

interface Props {
  setActivePage?: React.Dispatch<React.SetStateAction<Pages>>;
  pages?: Pages;
  onCreatePing?: () => void;
}

const SideBar = ({ onCreatePing }: Props) => {
  return (
    <div className="flex flex-col gap-[20px]">
      {/* Category Card */}
      <div className="bg-[#FFC37B] rounded-[10px] w-[244px]">
        <Categories />
      </div>

      {/* Create a Ping Button */}
      <button
        onClick={() => {
          // TODO: API — Open ping creation (Phase 2: InlinePingCreator replaces this)
          onCreatePing?.();
        }}
        className="flex items-center gap-[26px] h-[48px] bg-[#F49B31] hover:bg-[#d88429] transition-colors cursor-pointer rounded-[15px] pl-[26px] w-[244px] text-white"
      >
        <FaPlus className="w-[18px] h-[18px]" />
        <span className="font-semibold text-[15px] font-['Poppins',sans-serif]">
          Create a Ping
        </span>
      </button>

      {/* History Button */}
      <Link
        to="/history"
        className="flex items-center gap-[12px] h-[48px] bg-[#FEF5EA] border border-[#F49B31] rounded-[15px] pl-[24px] w-[244px] cursor-pointer hover:bg-[#fae9d4] transition-colors"
      >
        <img src={historyIcon} alt="History" className="w-[20px] h-[20px]" />
        <span className="font-semibold text-[15px] text-black font-['Poppins',sans-serif]">
          History
        </span>
      </Link>
    </div>
  );
};

export default SideBar;
