/**
 * CategoryPanel
 * Figma ref: 4183:17908 (desktop), 3901:9126 (mobile)
 * Phase: 2
 *
 * Refactored from Categories.tsx — now a card-style flat panel (244px wide, 447px tall)
 * with "Category" title, "All Categories" row, and per-category rows with count bubbles.
 */

import { useState, useEffect } from "react";
import { categoryImages } from "./CategoryImages";
import { useSearchStore, useCategoriesStore } from "../stores";

type CategoryItem = {
    label: string;
    labelIcon?: string;
    id: number;
};

const CategoryPanel = () => {
    const setCategory = useSearchStore((state) => state.setCategory);
    const clearCategory = useSearchStore((state) => state.clearCategory);
    const categoryCounts = useSearchStore((state) => state.categoryCounts);
    const totalCount = useSearchStore((state) => state.totalCount);

    const categories = useCategoriesStore((state) => state.categories);
    const isLoading = useCategoriesStore((state) => state.isLoading);
    const error = useCategoriesStore((state) => state.error);
    const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

    const [selectedCategory, setLocalSelectedCategory] = useState<CategoryItem | null>(null);

    useEffect(() => {
        fetchCategories((name: string) => categoryImages[name] || categoryImages.General);
    }, [fetchCategories]);

    function handleAllCategories() {
        setLocalSelectedCategory(null);
        clearCategory();
    }

    function handleCategoryClick(category: CategoryItem) {
        setLocalSelectedCategory(category);
        setCategory(category.id, category.label);
    }

    const isAllSelected = selectedCategory === null;

    if (isLoading) {
        return (
            <div className="w-[244px] h-[447px] bg-[#FFC37B] rounded-[10px] p-5 flex flex-col gap-2">
                <h2 className="font-['Poppins',sans-serif] font-medium text-[18px] text-black text-center">
                    Category
                </h2>
                <div className="text-center py-4 text-sm text-white/70">Loading categories...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-[244px] h-[447px] bg-[#FFC37B] rounded-[10px] p-5 flex flex-col gap-2">
                <h2 className="font-['Poppins',sans-serif] font-medium text-[18px] text-black text-center">
                    Category
                </h2>
                <div className="text-center py-4 text-sm text-red-600">{error}</div>
            </div>
        );
    }

    return (
        <div className="w-[244px] min-h-[447px] bg-[#FFC37B] rounded-[10px] py-[23px] flex flex-col">
            {/* Title */}
            <h2 className="font-['Poppins',sans-serif] font-medium text-[18px] text-black text-center mb-2.5">
                Category
            </h2>

            {/* All Categories Row */}
            <button
                onClick={handleAllCategories}
                className="relative flex items-center justify-between mx-2.5 px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors duration-150"
                style={{ background: isAllSelected ? "#FAE9D4" : "transparent" }}
            >
                <span className="font-['Poppins',sans-serif] font-semibold text-[15px] text-black">
                    All Categories
                </span>
                <CountBubble value={totalCount || 0} />
            </button>

            {/* Category Rows */}
            <div className="flex flex-col mt-1">
                {categories.map((category) => {
                    const isSelected = selectedCategory?.id === category.id && !isAllSelected;
                    return (
                        <button
                            key={category.id}
                            onClick={() => handleCategoryClick(category)}
                            className="relative flex items-center justify-between mx-2.5 px-3.5 py-2.5 rounded-lg cursor-pointer transition-colors duration-150"
                            style={{ background: isSelected ? "#FAE9D4" : "transparent" }}
                        >
                            <div className="flex items-center gap-[13px]">
                                {category.labelIcon && (
                                    <img
                                        src={category.labelIcon}
                                        alt={category.label}
                                        className="w-5 h-5 object-contain"
                                        style={{ mixBlendMode: "luminosity" }}
                                    />
                                )}
                                <span
                                    className="font-['Poppins',sans-serif] font-semibold text-[15px]"
                                    style={{ color: "rgba(0,0,0,0.64)" }}
                                >
                                    {category.label}
                                </span>
                            </div>
                            <CountBubble value={categoryCounts[category.id] || 0} />
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

function CountBubble({ value }: { value: number }) {
    return (
        <div className="w-[26px] h-[26px] rounded-full bg-[#F49B31] flex items-center justify-center shrink-0">
            <span className="font-['Poppins',sans-serif] font-medium text-[13px] text-white leading-none">
                {value}
            </span>
        </div>
    );
}

export default CategoryPanel;
