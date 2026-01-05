import WaveCardBody from "./WaveCardBody";
import WaveCardFooter from "./WaveCardFooter";
import WaveCardHeader from "./WaveCardHeader";
import type { Wave } from "../../api/types";

interface Props {
  wave: Wave;
}

const WaveCard = ({ wave }: Props) => {
  return (
    <>
      <div className="  m-[15px] md:m-0 p-[25px] bg-[#FEFEFE]  rounded-[10px] ">
        <WaveCardHeader wave={wave} />
        <WaveCardBody wave={wave} />
        <WaveCardFooter wave={wave} />
      </div>
    </>
  );
};

export default WaveCard;
