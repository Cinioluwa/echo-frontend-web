import surge from "../../../public/surge.svg";
import { useSurgeStore } from "../../stores";

interface Props {
  waveId?: string;
  surgeCount?: number;
  commentCount?: number;
}

function StreamCardFooter({ waveId, surgeCount = 0, commentCount: _commentCount = 0 }: Props) {
  const toggleSurge = useSurgeStore((state) => state.toggleSurge);
  const hasSurged = useSurgeStore((state) =>
    waveId ? state.hasSurged("wave", waveId) : false
  );
  const isToggling = useSurgeStore((state) => 
    waveId ? state.isToggling[`wave-${waveId}`] || false : false
  );

  const handleSurge = async () => {
    if (!waveId || isToggling) return;

    try {
      await toggleSurge("wave", waveId);
      // Optimistic update and error reversion handled by store
    } catch (error) {
      console.error("Surge failed:", error);
      // Error already handled by store (automatic revert)
    }
  };

  // Calculate display surge count (base count + 1 if user has surged)
  const displaySurgeCount = surgeCount + (hasSurged ? 1 : 0);

  return (
    <div className="flex justify-between items-center">
      <button
        onClick={handleSurge}
        disabled={isToggling || !waveId}
        className={`transition-all cursor-pointer duration-300 ease-in-out ${hasSurged
          ? "bg-[#F49B31] hover:bg-[#d88429] text-white font-bold scale-105"
          : "bg-[#FEF5EA] hover:bg-[#f2e8d9] scale-100"
          } py-1.5 lg:py-2 lg:px-5 flex items-center gap-2.5 border rounded-[20px] px-5 ${isToggling || !waveId ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        SURGE
        <img
          src={surge}
          alt=""
          className={`transition-all duration-300 ${hasSurged ? "brightness-0 invert" : ""
            } w-[50%] contrast-200 md:w-full`}
        />
      </button>
      <div className="text-[#454545] text-[14px]">
        {displaySurgeCount} Surge{displaySurgeCount !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

export default StreamCardFooter;
