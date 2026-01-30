// import general from "../../assets/images/General.svg";

interface Props {
  pingText: string;
  pingTitle: string;
  image?: string;
  category: string;
}

const SoundBoardCardBody = ({
  pingText,
  pingTitle,
  image,
  category,
}: Props) => {
  return (
    <div className="flex flex-col gap-[11px]">
      <div className="flex items-center gap-[9px]">
        {image && (
          <div className="w-5 h-5 shrink-0">
            <img src={image} alt="" className="w-full h-full object-contain" />
          </div>
        )}
        <p className="text-[#171717] text-[15px] font-medium">{category}</p>
      </div>
      <p className="font-semibold text-[16px] text-black">{pingTitle}</p>
      <p className="text-[#626665] text-[15px] leading-normal">
        {pingText}
      </p>
      <div className="h-px bg-gray-200 w-full my-[11px]"></div>
    </div>
  );
};

export default SoundBoardCardBody;
