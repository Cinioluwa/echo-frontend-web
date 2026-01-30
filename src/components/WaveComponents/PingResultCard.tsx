import type { ReactNode } from "react";
import type { Ping } from "../../api/types/index";

interface Props {
    ping: Ping;
    searchQuery: string;
    onClick: (ping: Ping) => void;
    isSelected?: boolean;
}

/**
 * Utility function to highlight search query in text
 * Splits text and wraps matching parts in a highlighted span
 */
const highlightSearchTerm = (text: string, query: string): ReactNode => {
    if (!query || query.length < 2) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, i) =>
        regex.test(part) ? (
            <mark key={i} className="bg-[#FFC37B] text-[#000000] font-semibold">
                {part}
            </mark>
        ) : (
            <span key={i}>{part}</span>
        )
    );
};

/**
 * PingResultCard Component
 * 
 * Displays an individual ping in the search results dropdown.
 * Shows ping title with highlighted search terms, category badge, and content preview.
 * Includes hover and selected states for better UX.
 */
const PingResultCard = ({ ping, searchQuery, onClick, isSelected = false }: Props) => {
    return (
        <button
            onClick={() => onClick(ping)}
            className={`
        w-full text-left p-3 rounded-[10px] border
        transition-all duration-200
        hover:scale-[1.01] hover:shadow-md
        ${isSelected
                    ? 'border-[#F49B31] bg-[#FEF5EA]'
                    : 'border-[#7D7D7D] bg-white hover:border-[#F49B31]'
                }
      `}
            type="button"
        >
            {/* Title and Category */}
            <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-[14px] font-semibold text-[#454545] flex-1 line-clamp-2">
                    {highlightSearchTerm(ping.title, searchQuery)}
                </h4>

                {ping.category && (
                    <span className="
            text-[10px] font-medium px-2 py-1 rounded-xl 
            bg-[#F49B31] text-white whitespace-nowrap shrink-0
          ">
                        {ping.category.name}
                    </span>
                )}
            </div>

            {/* Content Preview */}
            {ping.content && (
                <div className="
          bg-[#F5F5F5] rounded-[5px] p-2 
          text-[12px] text-[#7D7D7D] 
          line-clamp-2
        ">
                    {ping.content}
                </div>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-3 mt-2 text-[10px] text-[#7D7D7D]">
                {ping.author && (
                    <span>By {ping.author.firstName} {ping.author.lastName}</span>
                )}
                <span>•</span>
                <span>{ping._count?.waves || 0} waves</span>
                {ping.surgeCount > 0 && (
                    <>
                        <span>•</span>
                        <span>{ping.surgeCount} surges</span>
                    </>
                )}
            </div>
        </button>
    );
};

export default PingResultCard;
