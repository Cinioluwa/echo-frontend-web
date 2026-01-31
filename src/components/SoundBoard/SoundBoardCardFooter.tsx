import { useState } from "react";
import surge from "../../assets/images/surge.svg";
import reaction from "../../assets/images/reaction.svg";

interface Props {
  hashtag?: string;
  timeStamp: string;
  id: string;
  onPropose: (id: string) => void;
  proposeActive: boolean;
  setCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function SoundBoardCardFooter({
  hashtag,
  timeStamp,
  id,
  onPropose,
  setCommentModal,
  proposeActive,
}: Props) {
  function handleClick(id: string) {
    onPropose(id);
  }

  const [surged, setSurged] = useState(false);

  return (
    <div className="flex gap-2.5 lg:gap-5 justify-between items-center ">
      <div className="flex  text-[#8B8E8D] items-center gap-[25px] justify-center">
        <span className="hidden xl:block">{timeStamp}</span>
        <div className="text-[#EF6E0B] text-[10px] lg:text-[13px] flex items-center">
          <span className="mr-1">{hashtag}</span>
        </div>
      </div>
      <div className="text-[#454545] text-[10px] lg:text-[13px] gap-2.5 lg:gap-5 flex items-center">
        <div
          onClick={() => setCommentModal(true)}
          className=" items-center cursor-pointer gap-1 hidden lg:flex"
        >
          <img src={reaction} alt="" />
          <span>4</span> comments
        </div>
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
        <button
          onClick={() => handleClick(id)}
          disabled={proposeActive}
          className={`${
            proposeActive
              ? "bg-[#F49B31] hover:bg-[#d88429] transition-colors duration-100 ease-out text-white font-bold"
              : "bg-[#FEF5EA] transition-colors duration-100 ease-in-out hover:bg-[#f2e8d9]"
          } cursor-pointer text-[10px] lg:text-[13px] py-1.5 px-5 lg:py-2 flex items-center gap-2.5 border transition-colors duration-1200 ease-in-out  rounded-[20px] lg:px-3.5`}
        >
          {proposeActive ? "PROPOSED" : "PROPOSE A WAVE"}
        </button>
        <div className="text-[#454545] justify-center items-start flex flex-col xl:flex-row text-[14px] xl:justify-center  xl:items-center">
          <span className="md:mr-1">114</span>
          Surges
        </div>
      </div>
    </div>
  );
}

export default SoundBoardCardFooter;
