/**
 * Top3Widget
 * Figma ref: embedded in desktop feed right column (S1 — 4167:11816)
 * Phase: 2
 *
 * Right-column widget showing top 3 most-surged pings.
 * "Top 3" header, 3 rows each with: colored dot, user avatar, ping title (truncated), surge count.
 */

import React from "react";
import { useNavigate } from "react-router-dom";
import type { Ping } from "../../api/types";
import UserAvatar from "../UserAvatar";
import Top3Skeleton from "../skeletons/top3Skeleton";
import SurgeIcon from "../shared/SurgeIcon";
import { usePingsStore, useSurgeStore } from "../../stores";

interface Top3WidgetProps {
  pings?: Ping[];
}

/**
 * Rank configurations derived from Figma node 5189:14378 (Top 3 Card):
 * - Rank #1 (node 5189:14383): bg #F49B31, rank #FFFFFF, surge icon fill #E74F13
 * - Rank #2 (node 5189:14393): bg #FFC37B, rank #E97318, surge icon fill #E97318
 * - Rank #3 (node 5189:14403): bg #FEF5EA, rank #F49B31, surge icon fill #F49B31
 */
const RANK_CONFIGS = [
  {
    bg: "bg-[#F49B31]",
    rankColor: "text-white",
    avatarBg: "#E74F13",
    titleColor: "text-white",
    authorColor: "text-white/90",
    surgeIconFill: "#E74F13",
    surgeTextColor: "text-[#4A504E]",
  },
  {
    bg: "bg-[#FFC37B]",
    rankColor: "text-[#E97318]",
    avatarBg: "#FF6B6B",
    titleColor: "text-[#454545]",
    authorColor: "text-[#454545]",
    surgeIconFill: "#E97318",
    surgeTextColor: "text-[#4A504E]",
  },
  {
    bg: "bg-[#FEF5EA]",
    rankColor: "text-[#F49B31]",
    avatarBg: "#FFC37B",
    titleColor: "text-black",
    authorColor: "text-black",
    surgeIconFill: "#F49B31",
    surgeTextColor: "text-[#4A504E]",
  },
];

interface Top3ItemProps {
  ping: Ping;
  index: number;
}

const Top3Item: React.FC<Top3ItemProps> = ({ ping, index }) => {
  const navigate = useNavigate();
  const config = RANK_CONFIGS[index] ?? RANK_CONFIGS[2];

  // Subscribe to pings store and surge store for real-time optimistic surge state
  const pingFromStore = usePingsStore(
    (state) => state.pingsById[String(ping.id)],
  );
  const currentPing = pingFromStore || ping;

  const hasSurged = useSurgeStore((state) =>
    state.hasSurged("ping", String(currentPing.id)),
  );
  const isToggling = useSurgeStore(
    (state) => state.isToggling[`ping-${currentPing.id}`] || false,
  );
  const toggleSurge = useSurgeStore((state) => state.toggleSurge);

  const initialHasSurged = currentPing.hasSurged ?? false;
  const baseSurgeCount =
    currentPing.surgeCount ?? currentPing._count?.surges ?? 0;
  const surgeCount = Math.max(
    0,
    baseSurgeCount + (hasSurged ? 1 : 0) - (initialHasSurged ? 1 : 0),
  );

  const handleSurge = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isToggling) return;
    try {
      await toggleSurge("ping", String(currentPing.id));
    } catch (error) {
      console.error("Surge failed:", error);
    }
  };

  return (
    <div
      onClick={() => navigate(`/feed/${currentPing.id}`)}
      className={`flex items-center cursor-pointer gap-2 flex-none w-[85%] lg:w-full snap-center ${config.bg} rounded-[12px] px-2.5 py-2.5 min-h-[55px]`}
    >
      <p
        className={`${config.rankColor} font-['Poppins',sans-serif] font-semibold text-[14px]`}
      >
        #{index + 1}
      </p>
      {/* Avatar */}
      <div
        style={{ backgroundColor: config.avatarBg }}
        className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 overflow-hidden"
      >
        <UserAvatar
          user={typeof currentPing.author === "object" ? currentPing.author : null}
          size="sm"
          initialsOnly
          bgColor="bg-transparent"
          className="text-[10px]! font-bold text-white"
        />
      </div>
      {/* Title & Author */}
      <div className="flex-1 flex flex-col min-w-0 justify-center">
        <span
          className={`font-['Poppins',sans-serif] font-medium text-[11px] truncate leading-tight ${config.titleColor}`}
        >
          {currentPing.title}
        </span>
        <span
          className={`font-['Poppins',sans-serif] font-normal text-[9px] truncate leading-tight ${config.authorColor}`}
        >
          {typeof currentPing.author === "object" && currentPing.author
            ? `${currentPing.author.firstName} ${currentPing.author.lastName}`
            : "Anonymous"}
        </span>
      </div>
      {/* Surge count (interactive with optimistic update) */}
      <button
        type="button"
        onClick={handleSurge}
        disabled={isToggling}
        className="flex items-center gap-[3px] shrink-0 p-1 rounded-md hover:bg-black/5 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
      >
        <SurgeIcon
          width={10}
          height={13}
          fill={hasSurged ? "#E74F13" : config.surgeIconFill}
        />
        <span
          className={`font-['Poppins',sans-serif] font-semibold text-[11px] leading-normal ${config.surgeTextColor}`}
        >
          {surgeCount}
        </span>
      </button>
    </div>
  );
};

const Top3Widget = ({ pings = [] }: Top3WidgetProps) => {
  const top3 = pings.slice(0, 3);

  return (
    <div className="bg-white border border-[#F49B31]/40 rounded-[15px] flex flex-col gap-2.5 items-start p-4 pt-3 pb-4 w-full lg:w-[300px]">
      {/* Header */}
      <div className="flex justify-between pb-2 w-full items-center">
        <h3 className="font-['Poppins',sans-serif] font-semibold text-[18px] text-black leading-normal">
          Top Pings
        </h3>
        <span className="font-['Poppins',sans-serif] font-semibold text-[10px] text-[#626665]">
          This week
        </span>
      </div>

      {/* Rows */}
      <div className="flex flex-row overflow-x-auto lg:flex-col gap-3.5 w-full snap-x snap-mandatory pt-1 pb-2 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {top3.length === 0 ? <Top3Skeleton /> : null}
        {top3.map((ping, index) => (
          <Top3Item key={ping.id} ping={ping} index={index} />
        ))}
      </div>
    </div>
  );
};

export default Top3Widget;
