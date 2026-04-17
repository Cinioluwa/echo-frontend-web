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
import Top3Skeleton from "../skeletons/top3Skeleton";

interface Top3WidgetProps {
  pings?: Ping[];
}

const DOT_COLORS = ["#F49B31", "#FF6B6B", "#FFC37B"];

const Top3Widget = ({ pings = [] }: Top3WidgetProps) => {
  const top3 = pings.slice(0, 3);
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-[#FFC37B] rounded-[15px] flex flex-col gap-2.5 items-start px-5 p-7 pb-4 pt-2 w-full lg:w-[300px]">
      {/* Header */}
      <div className="flex justify-between pt-2 pb-4 w-full items-center">
        <h3 className="font-['Poppins',sans-serif] font-semibold text-[22px] text-black leading-normal">
          Top Pings
        </h3>
        <p className="text-[10px]">This week</p>
      </div>

      {/* Rows */}
      <div className="flex flex-row overflow-x-auto lg:flex-col gap-3.5 w-full snap-x snap-mandatory pt-1 pb-2 lg:pb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">

        {
          (top3.length === 0) ? (
            <Top3Skeleton />
          ) : null
        }
        {top3.map((ping, index) => {
          // console.log(index)
          return (
            <div
              onClick={() => navigate(`/feed/${ping.id}`)}
              key={ping.id}
              className={`flex items-center cursor-pointer gap-2 flex-none w-[85%] lg:w-full snap-center ${index === 0 ? 'bg-[#f5a548]' : index === 1 ? 'bg-[#ffd8ab]' : index === 2 ? 'bg-[#faefe3]' : ''} rounded-[15px] px-2.5 py-3.5`}
            >
              <p className={`${index === 0 ? 'text-white' : 'text-[#ee860e]'} font-bold`}>#{index + 1}</p>
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
              {/* Title & Author */}
              <div className="flex-1 flex flex-col min-w-0 justify-center">
                <span className={`font-['Poppins',sans-serif] font-medium text-[12px] truncate leading-normal ${index === 0 ? 'text-white' : 'text-black'}`}>
                  {ping.title}
                </span>
                <span className={`font-['Poppins',sans-serif] font-normal text-[9px] truncate leading-normal ${index === 0 ? 'text-[#fdfdfd]' : 'text-[#626665]'}`}>
                  {typeof ping.author === 'object' && ping.author ? `${ping.author.firstName} ${ping.author.lastName}` : "Anonymous"}
                </span>
              </div>
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
