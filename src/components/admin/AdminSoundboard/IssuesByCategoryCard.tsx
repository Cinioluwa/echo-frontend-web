import React from "react";

export interface CategoryIssue {
    id: string;
    title: string;
    postedTime: string; // e.g., "Posted 1d ago"
    count: number;
}

export interface CategoryData {
    categoryId: number;
    name: string;
    icon?: string; // URL to icon image
    resolved: number; // percentage
    openCount: number;
    issues: CategoryIssue[];
}

interface IssuesByCategoryCardProps {
    categories: CategoryData[];
    onCategoryClick?: (category: CategoryData) => void;
    className?: string;
}

const IssuesByCategoryCard: React.FC<IssuesByCategoryCardProps> = ({
    categories,
    onCategoryClick,
    className = "",
}) => {
    return (
        <div
            className={`bg-white border border-[rgba(244,155,49,0.3)] rounded-xl p-5 flex flex-col gap-5 ${className}`}
            data-node-id="issues-by-category-card"
        >
            {/* Title */}
            <h3 className="text-[#212121] font-semibold text-[16px] leading-[18px] uppercase tracking-[0.5px]">
                Issues by Category
            </h3>

            {/* Categories Grid — single column on mobile so cards are not
                squeezed to a width that breaks titles mid-word */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {categories.map((category, index) => (
                    <div
                        key={index}
                        className={`flex flex-col gap-3 bg-[#FEF5EA] p-4 border-[0.5px] border-[#F49B31] rounded-xl ${onCategoryClick ? "cursor-pointer hover:bg-[#FDE8D0] transition-colors" : ""}`}
                        onClick={() => onCategoryClick?.(category)}
                    >
                        {/* Category Header */}
                        <div className="flex items-center gap-3">
                            {category.icon && (
                                <div className="w-6 h-6 flex items-center justify-center">
                                    <img src={category.icon} alt={category.name} className="w-full h-full object-contain" />
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-[#212121] font-medium text-[clamp(10px,1.1vw,14px)] leading-4 whitespace-nowrap truncate">
                                    {category.name}
                                </p>
                                <p className="text-[#5e5c58] text-[clamp(9px,1vw,12px)] leading-3.5 whitespace-nowrap truncate">
                                    {category.openCount} open
                                </p>
                            </div>
                            {/* Resolved Percentage */}
                            <p className="text-[#212121] font-bold text-[24px] leading-[normal]">
                                {category.resolved}%
                                <span className="text-[#5e5c58] font-medium text-[11px] leading-4 block">
                                    resolved
                                </span>
                            </p>
                        </div>

                        {/* Progress Bar — colour identifier per Figma 5458:14828 */}
                        <div className="w-full h-1 bg-[#e0e0e0] rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${category.resolved}%`,
                                    backgroundColor:
                                        category.resolved <= 30 ? "#E05C5C"
                                        : category.resolved <= 50 ? "#E8C97A"
                                        : category.resolved <= 74 ? "#4EB88A"
                                        : "#F49B31",
                                }}
                            />
                        </div>

                        {/* Issues List */}
                        <div className="flex flex-col gap-2">
                            {category.issues.slice(0, 2).map((issue) => (
                                <a href={`/admin/soundboard/${issue.id}`} key={issue.id} className="flex items-start justify-between p-2">
                                    {/* min-w-0: the surge count column below is
                                        ml-2 shrink-0 (nowrap), so without this
                                        the flex algorithm can squeeze the title
                                        to near-zero width and break it per
                                        character */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[#212121] font-medium text-[12px] leading-4">
                                            {issue.title}
                                        </p>
                                        <p className="text-[#f49b31] text-[10px] leading-3.5">
                                            {issue.postedTime}
                                        </p>
                                    </div>
                                    <div className="ml-2 shrink-0 flex items-center gap-0.5 text-[#f49b31] font-semibold text-[12px]">
                                        <img src="/assets/images/surge.svg" alt="" className="w-3.5 h-3.5" />
                                        {issue.count}
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default IssuesByCategoryCard;
