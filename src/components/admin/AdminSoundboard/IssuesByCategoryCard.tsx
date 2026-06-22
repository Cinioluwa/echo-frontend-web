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

            {/* Categories Grid */}
            <div className="grid grid-cols-2 gap-5">
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
                            <div className="flex-1">
                                <p className="text-[#212121] font-medium text-[14px] leading-4">
                                    {category.name}
                                </p>
                                <p className="text-[#5e5c58] text-[12px] leading-3.5">
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

                        {/* Progress Bar */}
                        <div className="w-full h-1 bg-[#e0e0e0] rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#f49b31] rounded-full"
                                style={{ width: `${category.resolved}%` }}
                            />
                        </div>

                        {/* Issues List */}
                        <div className="flex flex-col gap-2">
                            {category.issues.slice(0, 2).map((issue) => (
                                <a href={`/admin/soundboard/${issue.id}`} key={issue.id} className="flex items-start justify-between p-2">
                                    <div className="flex-1">
                                        <p className="text-[#212121] font-medium text-[12px] leading-4">
                                            {issue.title}
                                        </p>
                                        <p className="text-[#f49b31] text-[10px] leading-3.5">
                                            {issue.postedTime}
                                        </p>
                                    </div>
                                    <div className="ml-2 shrink-0 text-[#f49b31] font-semibold text-[12px]">
                                        ⚡ {issue.count}
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
