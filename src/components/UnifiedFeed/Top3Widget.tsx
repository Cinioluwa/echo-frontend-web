/**
 * Top3Widget
 * Figma ref: embedded in desktop feed right column (S1 — 4167:11816)
 * Phase: 2
 *
 * Right-column widget showing top 3 most-surged pings.
 * "Top 3" header, 3 rows each with: colored dot, user avatar, ping title (truncated), surge count.
 */

import { useNavigate } from "react-router-dom";
import type { Ping } from "../../api/types";
import UserAvatar from "../UserAvatar";

interface Top3WidgetProps {
  pings?: Ping[];
}

const DOT_COLORS = ["#F49B31", "#FF6B6B", "#FFC37B"];

const Top3Widget = ({ pings = [] }: Top3WidgetProps) => {
  const top3 = pings.slice(0, 3);
  const navigate = useNavigate();

  return (
    <div className="bg-[#FFC37B] border-2 border-[#FFC37B] rounded-[15px] flex flex-col gap-2.5 items-start px-[20px] p-7  w-[276px]">
      {/* Header */}
      <h3 className="font-['Poppins',sans-serif] font-semibold text-[22px] text-black leading-normal">
        Top 3
      </h3>

      {/* Rows */}
      <div className="flex flex-col gap-3.5 w-full">
        {top3.map((ping, index) => {
          return (
            <div
              onClick={() => navigate(`feed/details/${ping.id}`)}
              key={ping.id}
              className="flex items-center cursor-pointer gap-2 w-full bg-[#fef0e0] rounded-[15px] px-2.5 py-3.5"
            >
              {/* Avatar */}
              <div
                style={{ backgroundColor: DOT_COLORS[index] }}
                className="w-[30px] h-[30px] rounded-full flex items-center justify-center shrink-0 overflow-hidden"
              >
                <UserAvatar
                  user={typeof ping.author === "object" ? ping.author : null}
                  size="sm"
                  initialsOnly
                  bgColor="bg-transparent"
                  className="text-[10px]! font-bold text-white"
                />
              </div>
              {/* Title */}
              <span className="flex-1 font-['Poppins',sans-serif] font-medium text-[12px] text-black truncate leading-normal min-w-0">
                {ping.title}
              </span>
              {/* Surge count */}
              <div className="flex items-center gap-[3px] shrink-0">
                <svg
                  width="10"
                  height="13"
                  viewBox="0 0 12 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M6.5 1L1 9h5l-0.5 6 6-8H7l0.5-6z" fill="#F49B31" />
                </svg>
                <span className="font-['Poppins',sans-serif] font-semibold text-[12px] text-[#4A504E] leading-normal">
                  {ping.surgeCount}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Top3Widget;
