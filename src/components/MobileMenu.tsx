import React from "react";
import type { Pages } from "./SideBar";
import { Link } from "react-router-dom";
import history from "../assets/images/History Logo.svg";
import stream from "../assets/images/stream.svg";
import soundBoard from "../assets/images/sound board.svg";

interface Props {
  setActivePage: React.Dispatch<React.SetStateAction<Pages>>;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
  pages: Pages;
  menu: boolean;
}

const MobileMenu = ({ setMenu, menu, pages, setActivePage }: Props) => {
  function handleClick() {
    setMenu(false);
  }

  return (
    <div
      onClick={handleClick}
      className={`${
        menu ? "opacity-100" : "opacity-0 pointer-events-none"
      } fixed transition-opacity duration-300 ease-in inset-0 bg-black/40 md:hidden`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          menu ? "translate-x-0" : "-translate-x-full"
        } transition-transform transform duration-300 ease-in-out w-[190px] top-[100px] flex flex-col gap-[15px] bg-white p-2 rounded-r-xl absolute left-0  py-[15px]`}
      >
        <Link to={"/stream"}>
          <button
            onClick={() =>
              setActivePage({
                streamActive: true,
                historyActive: false,
                soundBoardActive: false,
              })
            }
            className={`flex items-center ${
              pages.streamActive
                ? "bg-[#FFC37B] border-0"
                : "bg-transparent border-2"
            }  gap-3 py-[9px] w-full transition  cursor-pointer  ease-in-out duration-700 text-[15px] border-[#F49B31] rounded-[25px]`}
          >
            <span className="ml-6">
              <img src={stream} alt="" />
            </span>
            Stream
          </button>
        </Link>
        <Link to={"/waveHistory"}>
          <button
            onClick={() =>
              setActivePage({
                streamActive: false,
                historyActive: true,
                soundBoardActive: false,
              })
            }
            className={`flex items-center ${
              pages.historyActive
                ? "bg-[#FFC37B] border-0"
                : "bg-transparent border-2"
            }  gap-3 py-[9px] text-[15px] transition w-full cursor-pointer  ease-in-out duration-700 border-[#F49B31] rounded-[25px]`}
          >
            <span className="ml-6">
              <img src={history} alt="" />
            </span>
            History
          </button>
        </Link>
        <Link to={"/soundBoard"}>
          <button
            onClick={() =>
              setActivePage({
                streamActive: false,
                historyActive: false,
                soundBoardActive: true,
              })
            }
            className={`flex items-center ${
              pages.soundBoardActive
                ? "bg-[#FFC37B] border-0"
                : "bg-transparent border-2"
            }  gap-3 py-[9px] w-full transition cursor-pointer ease-in-out duration-700 text-[15px] border-[#F49B31] rounded-[25px]`}
          >
            <span className="ml-6">
              <img src={soundBoard} alt="" />
            </span>
            Sound Board
          </button>
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;
