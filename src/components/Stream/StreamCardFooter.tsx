import { useState } from "react";
import surge from "../../assets/images/surge.svg";

function SoundBoardCardFooter() {
  const [surged, setSurged] = useState(false);

  return (
    <div className="flex  justify-between items-center ">
      <button
        onClick={() => setSurged(!surged)}
        className={`transition-colors cursor-pointer duration-1200 ease-in-out ${
          surged
            ? "bg-[#F49B31] hover:bg-[#d88429] transition-colors duration-100 ease-out text-white font-bold"
            : "bg-[#FEF5EA] transition-colors duration-100 ease-in-out hover:bg-[#f2e8d9]"
        } py-1.5 lg:py-2 lg:px-5 flex items-center gap-2.5 border  rounded-[20px] px-5`}
      >
        SURGE
        <img
          src={surge}
          alt=""
          className={`${
            surged ? "brightness-0 invert" : ""
          } w-[50%] contrast-200 md:w-full`}
        />
      </button>
      <div className="text-[#454545] text-[14px]">114 Surges</div>
    </div>
  );
}

export default SoundBoardCardFooter;
