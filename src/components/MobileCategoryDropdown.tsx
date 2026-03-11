/**
 * MobileCategoryDropdown
 * Figma ref: 3901:9126 (Categories — Unified Feed, mobile)
 * Phase: 6
 *
 * Compact floating dropdown positioned below the "Category: ALL" pill in MobileHeader.
 * Refactored from MobileCategories.tsx with a slimmer, more compact design:
 * - 130px-wide floating panel with bg-[#FFC37B]
 * - "All Categories" row with orange count badge
 * - Category rows: icon (13×13) + name (10px semi-bold)
 * - Closes on selection or outside click
 */

import { useEffect, type SetStateAction } from "react";
import { categoryImages } from "./CategoryImages";
import { useCategoriesStore } from "../stores";

// TODO: API — useCategoriesStore

interface Props {
    setSelectedMobileCat: React.Dispatch<SetStateAction<string>>;
    setOpenCat: React.Dispatch<SetStateAction<boolean>>;
    selectedMobileCat: string;
}

const MobileCategoryDropdown = ({
    setSelectedMobileCat,
    selectedMobileCat,
    setOpenCat,
}: Props) => {
    const categories = useCategoriesStore((state) => state.categories);
    const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

    useEffect(() => {
        fetchCategories(
            (name: string) => categoryImages[name] || categoryImages.General,
        );
    }, [fetchCategories]);

    const isAllActive = !selectedMobileCat;

    function handleAllClick() {
        setSelectedMobileCat("");
        setOpenCat(false);
    }

    function handleCategoryClick(category: { label: string; labelIcon?: string; id: number }) {
        setSelectedMobileCat(category.label);
        setOpenCat(false);
    }

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#FFC37B] rounded-[10px] p-2 flex flex-col gap-2.5 items-center justify-center fixed mt-[155px] ml-[13px] w-[130px] z-20 shadow-md"
        >
            {/* ── All Categories row ────────────────────── */}
            <div className="w-full">
                <button
                    onClick={handleAllClick}
                    className={`flex items-center justify-between px-1 py-[11px] h-[26px] w-full rounded-lg cursor-pointer transition-colors ${isAllActive ? "bg-[#FAE9D4]" : "bg-transparent hover:bg-[#FAE9D4]/60"
                        }`}
                >
                    <span className="font-['Poppins',sans-serif] font-semibold text-[9px] text-black whitespace-nowrap leading-normal">
                        All Categories
                    </span>
                    <div className="bg-[#F49B31] rounded-[13px] px-[5px] py-0.5 flex items-center justify-center shrink-0 ml-1">
                        <span className="font-['Poppins',sans-serif] font-medium text-[8px] text-white text-center leading-normal">
                            {categories.length}
                        </span>
                    </div>
                </button>
            </div>

            {/* ── Category rows ─────────────────────────── */}
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className={`flex items-center gap-[5px] w-full cursor-pointer transition-opacity ${selectedMobileCat === category.label ? "opacity-100" : "opacity-[0.64] hover:opacity-90"
                        }`}
                >
                    {/* Icon — 13×13, luminosity blend */}
                    <div className="relative shrink-0 w-[13px] h-[13px] mix-blend-luminosity">
                        <img
                            src={category.labelIcon}
                            alt={category.label}
                            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                        />
                    </div>
                    <span className="font-['Poppins',sans-serif] font-semibold text-[10px] text-[rgba(0,0,0,0.64)] text-center whitespace-nowrap leading-normal">
                        {category.label}
                    </span>
                </button>
            ))}
        </div>
    );
};

export default MobileCategoryDropdown;
