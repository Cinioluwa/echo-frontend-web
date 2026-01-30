import type { ResolutionLog } from "../../api/types/index";

interface Props {
  resolution: ResolutionLog;
}

function WaveCardFooter({ resolution }: Props) {
  // Get surge count from resolution (ping surges)
  const surgeCount = resolution._count?.surges || resolution.surgeCount || 0;

  // Get wave and comment counts
  const waveCount = resolution._count?.waves || 0;
  const commentCount = resolution._count?.comments || 0;

  return (
    <div className="flex gap-5 items-center justify-end">
      <div className="text-[#454545] text-[14px] flex items-center">
        <span className="mr-1">{waveCount}</span>
        {waveCount === 1 ? 'Solution' : 'Solutions'}
      </div>
      <div className="text-[#454545] text-[14px] flex items-center">
        <span className="mr-1">{commentCount}</span>
        {commentCount === 1 ? 'Comment' : 'Comments'}
      </div>
      <div className="text-[#454545] text-[14px] flex items-center">
        <span className="mr-1">{surgeCount}</span>
        Surges
      </div>
    </div>
  );
}

export default WaveCardFooter;
