import general from "../../assets/images/General.svg";
import type { Wave } from "../../api/types";

interface Props {
  wave: Wave;
}

const WaveCardBody = ({ wave }: Props) => {
  // Get category name
  const getCategoryName = () => {
    if (wave.category && typeof wave.category === 'object') {
      return wave.category.name;
    }
    return "General";
  };

  return (
    <div className="flex flex-col gap-2.5 my-4">
      <div className="flex items-center gap-[13px]">
        <span>
          <img src={general} alt="" />
        </span>
        {getCategoryName()}
      </div>
      <p className="font-semibold text-[16px] ">
        {wave.ping?.title || wave.title || "Wave Solution"}
      </p>
      <p className=" text-[#626665] text-[15px] border-b border-[#D3CECE] pb-4 ">
        {wave.solution}
      </p>
    </div>
  );
};

export default WaveCardBody;
