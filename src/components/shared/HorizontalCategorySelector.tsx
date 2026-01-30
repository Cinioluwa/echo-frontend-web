import { useEffect, useState } from "react";
import { categoryService } from "../../api/services";
import type { CategoryData } from "../../api/types/index";

interface HorizontalCategorySelectorProps {
    selectedCategoryId: number | null;
    onSelectCategory: (categoryId: number, categoryName: string) => void;
    className?: string;
}

const HorizontalCategorySelector = ({
    selectedCategoryId,
    onSelectCategory,
    className = "",
}: HorizontalCategorySelectorProps) => {
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
            <div className="flex items-center justify-center py-4 text-sm text-[#7D7D7D]">
                Loading categories...
            </div>
        );
    }

    return (
        <div className={`overflow-x-auto scrollbar-hide ${className}`}>
            <div className="flex min-w-max">
                {categories.map((cat, index) => {
                    const isSelected = selectedCategoryId === cat.id;
                    const isFirst = index === 0;
                    const isLast = index === categories.length - 1;

                    return (
                        <button
                            key={cat.id}
                            onClick={() => onSelectCategory(cat.id, cat.name)}
                            className={`
                px-[25px] py-2.5 font-medium text-sm
                transition-all duration-300 ease-in-out
                ${isFirst ? "rounded-l-[25px]" : ""}
                ${isLast ? "rounded-r-[25px]" : ""}
                ${isSelected
                                    ? "bg-[#F49B31] text-white shadow-md"
                                    : "bg-[#FEF5EA] text-[#454545] hover:bg-[#f2e8d9]"
                                }
              `}
                            type="button"
                        >
                            {cat.name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default HorizontalCategorySelector;
