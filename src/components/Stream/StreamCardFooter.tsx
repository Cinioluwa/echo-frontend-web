import { useState } from "react";
import surge from "../../../public/surge.svg";
import { surgeService } from "../../api/services";

interface Props {
  waveId?: string;
  surgeCount?: number;
  commentCount?: number;
  onRefresh?: () => void;
}

function StreamCardFooter({ waveId, surgeCount = 0, commentCount = 0, onRefresh }: Props) {
  const [surged, setSurged] = useState(false);
  const [currentSurgeCount, setCurrentSurgeCount] = useState(surgeCount);
  const [isLoading, setIsLoading] = useState(false);

  const handleSurge = async () => {
    if (!waveId || isLoading) return;

    setIsLoading(true);
    try {
      const response = await surgeService.toggleSurge("wave", waveId);

      // Update local state based on API response
      setSurged(response.surged);
      setCurrentSurgeCount(prev => response.surged ? prev + 1 : prev - 1);

      // Optionally refresh parent data
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error toggling surge:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <button
        onClick={handleSurge}
        disabled={isLoading || !waveId}
        className={`transition-colors cursor-pointer duration-1200 ease-in-out ${surged
          ? "bg-[#F49B31] hover:bg-[#d88429] transition-colors duration-100 ease-out text-white font-bold"
          : "bg-[#FEF5EA] transition-colors duration-100 ease-in-out hover:bg-[#f2e8d9]"
          } py-1.5 lg:py-2 lg:px-5 flex items-center gap-2.5 border rounded-[20px] px-5 ${isLoading || !waveId ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        SURGE
        <img
          src={surge}
          alt=""
          className={`${surged ? "brightness-0 invert" : ""
            } w-[50%] contrast-200 md:w-full`}
        />
      </button>
      <div className="text-[#454545] text-[14px]">
        {currentSurgeCount} Surge{currentSurgeCount !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

export default StreamCardFooter;
