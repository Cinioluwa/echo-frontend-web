import WaveCardBody from "./WaveCardBody";
import WaveCardFooter from "./WaveCardFooter";
import WaveCardHeader from "./WaveCardHeader";
import type { ResolutionLog } from "../../api/types/index";

interface Props {
  resolution: ResolutionLog;
}

const WaveCard = ({ resolution }: Props) => {
  return (
    <>
      <div className="  m-[15px] p-[25px] bg-[#FEFEFE]  rounded-[10px] ">
        <WaveCardHeader resolution={resolution} />
        <WaveCardBody resolution={resolution} />
        <WaveCardFooter resolution={resolution} />
      </div>
    </>
  );
};

export default WaveCard;
