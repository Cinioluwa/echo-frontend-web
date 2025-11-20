import wavecardprofile from "../../assets/images/wavecardprofile.svg";

interface timeProp {
  timeStamp: string;
}

const SoundBoardCardHeader = ({ timeStamp }: timeProp) => {
  return (
    <div>
      <div className="flex items-center gap-6 ">
        <img src={wavecardprofile} alt="" />
        <div className="flex flex-col">
          <span className="text-[15px] inline-block max-w-3 font-semibold">
            Covenant Smith
          </span>
          <span className="text-[#8B8E8D] text-[13px] ">{timeStamp}</span>
        </div>
      </div>
    </div>
  );
};

export default SoundBoardCardHeader;
