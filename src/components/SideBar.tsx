import history from "../assets/images/History Logo.svg";
import stream from "../assets/images/stream.svg";
import soundBoard from "../assets/images/sound board.svg";
import echobtn from "../assets/images/Echobtn.svg";

import Categories from "./Categories";
import { useState } from "react";

const SideBar = () => {
  const [streamActive, setStreamActive] = useState(false);
  const [historyActive, setHistoryActive] = useState(true);
  const [boardActive, setBoardActive] = useState(false);

  return (
    <div>
      <div className="bg-[#FFC37B]  rounded-[10px]">
        <Categories />
      </div>
      <div className="mt-[23px]">
        <div
          onClick={() => {
            setStreamActive(true);
            setBoardActive(false);
            setHistoryActive(false);
          }}
          className={`flex items-center ${
            streamActive ? "bg-[#FFC37B] border-0" : "bg-transparent border-2"
          }  gap-3 py-[13px] transition  cursor-pointer mb-3.5 ease-in-out duration-700 border-[#F49B31] rounded-[15px]`}
        >
          <span className="ml-6">
            <img src={stream} alt="" />
          </span>
          Stream
        </div>
        <div
          onClick={() => {
            setStreamActive(false);
            setBoardActive(false);
            setHistoryActive(true);
          }}
          className={`flex items-center ${
            historyActive ? "bg-[#FFC37B] border-0" : "bg-transparent border-2"
          }  gap-3 py-[13px] transition  cursor-pointer mb-3.5 ease-in-out duration-700 border-[#F49B31] rounded-[15px]`}
        >
          <span className="ml-6">
            <img src={history} alt="" />
          </span>
          Wave History
        </div>
        <div
          onClick={() => {
            setStreamActive(false);
            setBoardActive(true);
            setHistoryActive(false);
          }}
          className={`flex items-center ${
            boardActive ? "bg-[#FFC37B] border-0" : "bg-transparent border-2"
          }  gap-3 py-[13px] transition  cursor-pointer ease-in-out duration-700 border-[#F49B31] rounded-[15px]`}
        >
          <span className="ml-6">
            <img src={soundBoard} alt="" />
          </span>
          Sound Board
        </div>
        <div>
          <div>
            <img
              src={echobtn}
              alt=""
              className="mx-auto max-w-[60%] align-baseline"
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default SideBar;
