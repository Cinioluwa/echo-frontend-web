import { useState, useEffect } from "react";
import surge from "../../../public/surge.svg";
import { surgeService } from "../../api/services";

interface Props {
  waveId?: string;
  surgeCount?: number;
  commentCount?: number;
  onRefresh?: () => void;
  hasSurged?: boolean; // Whether the current user has surged this wave
}

function StreamCardFooter({ waveId, surgeCount = 0, commentCount: _commentCount = 0, onRefresh: _onRefresh, hasSurged = false }: Props) {
  const [surged, setSurged] = useState(hasSurged);
  const [currentSurgeCount, setCurrentSurgeCount] = useState(surgeCount);
  const [isLoading, setIsLoading] = useState(false);

  // Sync surge state with prop changes
  useEffect(() => {
    console.log(`StreamCardFooter [Wave ${waveId}]: hasSurged prop =`, hasSurged);
    setSurged(hasSurged);
  }, [hasSurged, waveId]);

  // Update surge count when prop changes
  useEffect(() => {
    setCurrentSurgeCount(surgeCount);
  }, [surgeCount]);

  const handleSurge = async () => {
    if (!waveId || isLoading) return;

    // Optimistic update - update UI immediately
    const previousSurged = surged;
    const previousCount = currentSurgeCount;

    setSurged(!surged);
    setCurrentSurgeCount(prev => surged ? prev - 1 : prev + 1);
    setIsLoading(true);

    try {
      const response = await surgeService.toggleSurge("wave", waveId);

      // Sync with API response
      setSurged(response.surged);
      setCurrentSurgeCount(_prev => {
        // Calculate the correct count based on the change
        const diff = response.surged ? 1 : -1;
        const expectedCount = previousCount + diff;
        return expectedCount;
      });
    } catch (error) {
      console.error("Error toggling surge:", error);
      // Revert on error
      setSurged(previousSurged);
      setCurrentSurgeCount(previousCount);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <button
        onClick={handleSurge}
        disabled={isLoading || !waveId}
        className={`transition-all cursor-pointer duration-300 ease-in-out ${surged
          ? "bg-[#F49B31] hover:bg-[#d88429] text-white font-bold scale-105"
          : "bg-[#FEF5EA] hover:bg-[#f2e8d9] scale-100"
          } py-1.5 lg:py-2 lg:px-5 flex items-center gap-2.5 border rounded-[20px] px-5 ${isLoading || !waveId ? "opacity-50 cursor-not-allowed" : ""
          }`}
      >
        SURGE
        <img
          src={surge}
          alt=""
          className={`transition-all duration-300 ${surged ? "brightness-0 invert" : ""
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
