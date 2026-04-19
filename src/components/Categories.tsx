import { useState, useEffect } from "react";
import { categoryImages } from "./CategoryImages";
import { useSearchStore, useCategoriesStore } from "../stores";
import CategoriesSkeleton from "./skeletons/CategoriesSkeleton";

type category = {
  label: string;
  labelIcon?: string;
  id: number;
};

const CountBadge = ({ value }: { value: number }) => {
  const displayValue = value > 99 ? "99+" : String(value);

  return (
    <span className="min-w-[26px] h-[26px] px-1.5 font-semibold text-white text-[11px] leading-none tabular-nums whitespace-nowrap flex justify-center items-center rounded-full bg-[#F49B31] shrink-0">
      {displayValue}
    </span>
  );
};

const Categories = () => {
  const setCategory = useSearchStore((state) => state.setCategory);
  const clearCategory = useSearchStore((state) => state.clearCategory);
  const categoryCounts = useSearchStore((state) => state.categoryCounts);
  const totalCount = useSearchStore((state) => state.totalCount);
  // Categories from global store
  const categories = useCategoriesStore((state) => state.categories);
  const isLoading = useCategoriesStore((state) => state.isLoading);
  const error = useCategoriesStore((state) => state.error);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const [isActive, setIsActive] = useState(true);
  const [selectedCategory, setLocalSelectedCategory] = useState({} as category);

  useEffect(() => {
    // Fetch categories with icon mapper
    fetchCategories(
      (name: string) => categoryImages[name] || categoryImages.General,
    );
  }, [fetchCategories]);

  function handleClick() {
    if (!isActive) {
      setIsActive(true);
      clearCategory(); // Clear the global filter when "All Categories" is selected
    }
  }

  function handleCategoryClick(category: category) {
    setLocalSelectedCategory(category);
    setIsActive(false);
    setCategory(category.id, category.label); // Update the global filter
  }

  if (isLoading) {
    return <CategoriesSkeleton />;
  }

  if (error) {
    return <CategoriesSkeleton />;
  }

  return (
    <div className="p-2">
      <header className="my-2.5 pl-2.5 font-[18px]">Category</header>

      <button
        onClick={handleClick}
        className={`flex justify-between items-center mb-px py-2.5 px-[15px] ${
          isActive ? "bg-[#FAE9D4] shadow" : "bg-transparent"
        } w-full rounded-lg font-bold cursor-pointer`}
      >
        All Categories
        <CountBadge value={totalCount || 0} />
      </button>

      <div className="">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`flex justify-between gap-[13px] cursor-pointer font-semibold  ${
              isActive
                ? "bg-transparent shadow-none"
                : selectedCategory.id === category.id
                  ? "bg-[#FAE9D4] opacity-100 shadow"
                  : " opacity-64"
            }  px-[15px] w-full rounded-lg py-[13px] items-center opacity-64 text-[15px] transition ease-in duration-200`}
          >
            <div className="flex gap-[13px] items-center">
              <span>
                <img src={category.labelIcon} />
              </span>
              <div>{category.label}</div>
            </div>
            <CountBadge value={categoryCounts[category.id] || 0} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
