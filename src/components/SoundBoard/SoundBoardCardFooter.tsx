const reaction = "/assets/images/reaction.svg";
import surge from "/assets/images/surge.svg";
import { useSurgeStore } from "../../stores";

interface Props {
  hashtag?: string;
  timeStamp: string;
  id: string;
  onPropose: (id: string) => void;
  proposeActive: boolean;
  surgeCount?: number;
  commentCount?: number;
}

function SoundBoardCardFooter({
  id,
  onPropose,
  proposeActive,
  surgeCount = 0,
  commentCount = 0,
}: Props) {
  function handleClick(id: string) {
    onPropose(id);
  }

  const toggleSurge = useSurgeStore((state) => state.toggleSurge);
  const hasSurged = useSurgeStore((state) => state.hasSurged("ping", id));
  const isToggling = useSurgeStore((state) => state.isToggling[`ping-${id}`] || false);

  const handleSurge = async () => {
    if (isToggling || !id) return;

    try {
      await toggleSurge("ping", id);
      // Optimistic update and error reversion handled by store
    } catch (error) {
      console.error("Surge failed:", error);
      // Error already handled by store (automatic revert)
    }
  };

  return (
    <div className="flex gap-5 justify-end items-center">
      <button className="flex items-center gap-2 text-[#63637B] text-[14px] cursor-pointer">
        <img src={reaction} alt="" className="w-4 h-4" />
        <span>{commentCount} Comments</span>
      </button>
      <button
        onClick={handleSurge}
        disabled={isToggling}
        className={`transition-colors cursor-pointer duration-200 ${hasSurged
          ? "bg-[#F49B31] hover:bg-[#d88429] text-white"
          : "bg-[#FEF5EA] hover:bg-[#f2e8d9] text-black"
          } h-[39px] px-[27px] py-[15px] flex items-center justify-center gap-2.5 border border-black rounded-[20px] disabled:opacity-50 disabled:cursor-not-allowed uppercase font-bold text-[14px]`}
      >
        {isToggling ? "..." : "SURGE"}
        <img
          src={surge}
          alt=""
          className={`${hasSurged ? "brightness-0 invert" : ""} w-3 h-[18px]`}
        />
      </button>
      <button
        onClick={() => handleClick(id)}
        disabled={proposeActive}
        className={`${proposeActive
          ? "bg-[#F49B31] hover:bg-[#d88429] text-white"
          : "bg-[#FEF5EA] hover:bg-[#f2e8d9] text-black"
          } cursor-pointer h-[39px] px-[27px] py-[15px] flex items-center justify-center gap-2.5 border border-black transition-colors duration-200 rounded-[20px] uppercase font-bold text-[14px] w-fit`}
      >
        {proposeActive ? "PROPOSED" : "PROPOSE A WAVE"}
      </button>
      <div className="text-[#4A504E] text-[14px] font-semibold">
        {surgeCount} Surge
      </div>
    </div>
  );
}

export default SoundBoardCardFooter;
