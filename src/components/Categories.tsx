import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const navigate = useNavigate();
  const location = useLocation();
  const selectedCategoryId = useSearchStore((state) => state.selectedCategoryId);
  const setCategory = useSearchStore((state) => state.setCategory);
  const clearCategory = useSearchStore((state) => state.clearCategory);
  const categoryCounts = useSearchStore((state) => state.categoryCounts);
  const totalCount = useSearchStore((state) => state.totalCount);
  // Categories from global store
  const categories = useCategoriesStore((state) => state.categories);
  const isLoading = useCategoriesStore((state) => state.isLoading);
  const error = useCategoriesStore((state) => state.error);
  const fetchCategories = useCategoriesStore((state) => state.fetchCategories);

  const isAllActive = selectedCategoryId === null;

  useEffect(() => {
    // Fetch categories with icon mapper
    fetchCategories(
      (name: string) => categoryImages[name] || categoryImages.General,
    );
  }, [fetchCategories]);

  function handleClick() {
    clearCategory(); // Reset to "All Categories"
    if (location.pathname !== "/feed") {
      navigate("/feed");
    }
  }

  function handleCategoryClick(category: category) {
    if (selectedCategoryId === category.id) {
      clearCategory(); // Toggle off to "All Categories"
    } else {
      setCategory(category.id, category.label); // Update the global filter
    }
    if (location.pathname !== "/feed") {
      navigate("/feed");
    }
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
          isAllActive ? "bg-[#FAE9D4] shadow" : "bg-transparent"
        } w-full rounded-lg font-bold cursor-pointer`}
      >
        All Categories
        <CountBadge value={totalCount || 0} />
      </button>

      <div className="">
        {categories.map((category) => {
          const isSelected = selectedCategoryId === category.id;
          return (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`flex justify-between gap-[13px] cursor-pointer font-semibold ${
                isSelected
                  ? "bg-[#FAE9D4] opacity-100 shadow"
                  : "bg-transparent opacity-64 hover:opacity-90"
              } px-[15px] w-full rounded-lg py-[13px] items-center text-[15px] transition ease-in duration-200`}
            >
              <div className="flex gap-[13px] items-center">
                <span>
                  <img src={category.labelIcon} />
                </span>
                <div>{category.label}</div>
              </div>
              <CountBadge value={categoryCounts[category.id] || 0} />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Categories;
