import general from "../../assets/images/General.svg";

interface Props {
  pingText: string;
  pingTitle: string;
}

const SoundBoardCardBody = ({ pingText, pingTitle}: Props) => {
  return (
    <div className="flex flex-col gap-2.5 my-4">
      <div className="flex items-center gap-[13px]">
        <span>
          <img src={general} alt="" />
        </span>
        General
      </div>
      <p className="font-semibold text-[16px] ">
        {pingTitle}
      </p>
      <p className=" text-[#626665] text-[15px] border-b border-[#D3CECE] pb-4 ">
        {pingText}
      </p>
    </div>
  );
};

export default SoundBoardCardBody;
