/**
 * CategorySelector
 * Figma ref: 3687:8314 (Selector in Create Ping - Desktop)
 * Phase: 7
 *
 * Horizontal connected pill bar. All category buttons share a continuous
 * border — first has rounded-l-[25px], last has rounded-r-[25px],
 * middle buttons have flat sides with thin shared borders.
 *
 * Default: bg-[#fef5ea], border-[#454545], black text
 * Selected: bg-[#f49b31], white text
 */

import { useEffect, useState } from "react";
import { categoryService } from "../api/services";
import type { CategoryData } from "../api/types/index";

interface CategorySelectorProps {
  categoryId: number | null;
  setFormData: (categoryId: number, categoryName: string) => void;
}

const CategorySelector = ({ categoryId, setFormData }: CategorySelectorProps) => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center px-5 py-2.5 text-[14px] text-[#454545] border-2 border-[#454545] rounded-[25px]">
        Loading…
      </div>
    );
  }

  return (
    // Horizontally scrollable so it never wraps; container clips overflow
    <div className="flex overflow-x-auto cursor-pointer select-none">
      {categories.map((cat, index) => {
        const isFirst = index === 0;
        const isLast = index === categories.length - 1;
        const isSelected = categoryId === cat.id;

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => setFormData(cat.id, cat.name)}
            className={[
              // Base layout
              "flex items-center justify-center px-5 py-2.5 shrink-0 whitespace-nowrap",
              // Typography
              "text-[14px] font-medium leading-normal",
              // Border — outer borders are 2px; shared inner borders are 1px
              "border-t-2 border-b-2 border-solid",
              isFirst ? "border-l-2 border-r" : isLast ? "border-l border-r-2" : "border-l border-r",
              // Radius
              isFirst ? "rounded-l-[25px]" : "",
              isLast ? "rounded-r-[25px]" : "",
              // Colour states
              isSelected
                ? "bg-[#f49b31] border-[#f49b31] text-white"
                : "bg-[#fef5ea] border-[#454545] text-black hover:bg-[#fde8c6] transition-colors duration-200",
            ].join(" ")}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategorySelector;
