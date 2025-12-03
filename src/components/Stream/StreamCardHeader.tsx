import cardProfile from "../../assets/images/wavecardprofile.svg";

interface timeProp {
  createdAt: string;
}

const StreamCardHeader = ({ createdAt }: timeProp) => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-6 ">
        <img src={cardProfile} alt="" />
        <div className="flex flex-col">
          <span className="text-[15px] whitespace-normal md:whitespace-nowrap inline-block max-w-3 font-semibold">
            Covenant Smith
          </span>
          <span className="text-[#8B8E8D] text-[13px]">{createdAt}</span>
        </div>
      </div>
      <div className="flex gap-2 px-[35px] items-center border rounded-[25px] py-[7px]">
        <span className="inline-block w-[9px] h-[9px] rounded-full bg-[#DDE23B]"></span>
        Top 3
      </div>
    </div>
  );
};

export default StreamCardHeader;
