const history = "/assets/images/History Logo.svg";
const stream = "/assets/images/stream.svg";
const soundBoard = "/assets/images/sound board.svg";
import Categories from "./Categories";
import { Link } from "react-router-dom";

export interface Pages {
  streamActive: boolean;
  historyActive: boolean;
  soundBoardActive: boolean;
}

interface Props {
  setActivePage: React.Dispatch<React.SetStateAction<Pages>>;
  pages: Pages;
}

const SideBar = ({ pages, setActivePage }: Props) => {
  return (
    <div>
      <div className="bg-[#FFC37B]  rounded-[10px]">
        <Categories />
      </div>
      <div className="mt-[15px]">
        <Link to={"/soundBoard"}>
          <button
            onClick={() =>
              setActivePage({
                streamActive: false,
                historyActive: false,
                soundBoardActive: true,
              })
            }
            className={`flex items-center ${pages.soundBoardActive
              ? "bg-[#FFC37B] border-0"
              : "bg-transparent border-2"
              }  gap-3 py-[13px] w-full transition  cursor-pointer mb-3.5 ease-in-out duration-700 border-[#F49B31] rounded-[15px]`}
          >
            <span className="ml-6">
              <img src={soundBoard} alt="" />
            </span>
            Sound Board
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
            className={`flex items-center ${pages.historyActive
              ? "bg-[#FFC37B] border-0"
              : "bg-transparent border-2"
              }  gap-3 py-[13px] transition w-full cursor-pointer mb-3.5 ease-in-out duration-700 border-[#F49B31] rounded-[15px]`}
          >
            <span className="ml-6">
              <img src={history} alt="" />
            </span>
            History
          </button>
        </Link>
        <Link to={"/stream"}>
          <button
            onClick={() =>
              setActivePage({
                streamActive: true,
                historyActive: false,
                soundBoardActive: false,
              })
            }
            className={`flex items-center ${pages.streamActive
              ? "bg-[#FFC37B] border-0"
              : "bg-transparent border-2"
              }  gap-3 py-[13px] w-full transition  cursor-pointer ease-in-out duration-700 border-[#F49B31] rounded-[15px]`}
          >
            <span className="ml-6">
              <img src={stream} alt="" />
            </span>
            Stream
          </button>
        </Link>
        <div></div>
      </div>
    </div>
  );
};

export default SideBar;
