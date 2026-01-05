import eye from "../../assets/images/eye_svgrepo.com.svg";
import type { Wave } from "../../api/types";

interface Props {
  wave: Wave;
}

function WaveCardFooter({ wave }: Props) {
  // Get surge count
  const surgeCount = wave._count?.surges || wave.surgeCount || 0;

  return (
    <div className="flex gap-5 items-center justify-end">
      <div className="flex gap-[7px] items-center justify-end">
        <span>
          <img src={eye} alt="" />
        </span>
        <div className="text-[#454545] text-[14px] flex items-center">
          <span className="mr-1">{wave.viewCount}</span>
          Views
        </div>
      </div>
      <div className="text-[#454545] text-[14px] flex items-center">
        <span className="mr-1">{surgeCount}</span>
        Surges
      </div>
    </div>
  );
}

export default WaveCardFooter;
