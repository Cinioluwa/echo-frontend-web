/**
 * SideBar
 * Figma ref: 4183:17907 (Categories & Create sidebar group)
 * Phase: 1
 */
import Categories from "./Categories";
import { Link } from "react-router-dom";
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
}

const SideBar = ({ onCreatePing }: Props) => {
  const handleCreateClick = () => {
    onCreatePing?.();
  };
  const isHistoryRoute = window.location.pathname === "/history";

  return (
    <div className="flex flex-col gap-5">
      {/* Category Card */}
      <div className="bg-[#FFC37B] rounded-[10px] w-[244px]">
        <Categories />
      </div>

      {/* Create a Ping Button */}
      <button
        onClick={handleCreateClick}
        className="flex items-center gap-[26px] h-12 bg-[#F49B31] hover:bg-[#d88429] transition-colors cursor-pointer rounded-[15px] pl-[26px] w-[244px] text-white"
      >
        <FaPlus className="w-[18px] h-[18px]" />
        <span className="font-semibold text-[15px] font-['Poppins',sans-serif]">
          Create a Ping
        </span>
      </button>

      {/* History Button */}
      <Link
        to="/history"
        className={`flex items-center gap-3 h-12 ${isHistoryRoute ? 'bg-[#F49B31] text-white' : 'bg-[#FEF5EA] text-black hover:bg-[#fae9d4]'} border border-[#F49B31] rounded-[15px] pl-6 w-[244px] cursor-pointer transition-colors`}
      >
        <img src={historyIcon} alt="History" className={`w-5 h-5 ${isHistoryRoute ? 'filter brightness-0 invert' : ''}`} />
        <span className="font-semibold text-[15px] font-['Poppins',sans-serif]">
          History
        </span>
      </Link>
    </div>
  );
};

export default SideBar;
