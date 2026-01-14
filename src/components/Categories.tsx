import { useState, useEffect } from "react";
import { categoryImages } from "./CategoryImages";
import { categoryService } from "../api/services";
import type { CategoryData } from "../api/types";
import { useCategoryFilter } from "../contexts/CategoryFilterContext";

type category = {
  label: string;
  labelIcon?: string;
  id: number;
};

const Categories = () => {
  const { selectedCategoryId, setSelectedCategory: setGlobalCategory, clearCategoryFilter } = useCategoryFilter();
  const [isActive, setIsActive] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState({} as category);
  const [categories, setCategories] = useState<category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoryService.getAll();
        // Map API data to local category format with icons
        const mappedCategories = data.map((cat: CategoryData) => ({
          id: cat.id,
          label: cat.name,
          labelIcon: categoryImages[cat.name] || categoryImages.General,
        }));
        setCategories(mappedCategories);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  function handleClick() {
    if (!isActive) {
      setIsActive(true);
      clearCategoryFilter(); // Clear the global filter when "All Categories" is selected
    }
  }

  function handleCategoryClick(category: category) {
    setSelectedCategory(category);
    setIsActive(false);
    setGlobalCategory(category.id, category.label); // Update the global filter
  }

  if (isLoading) {
    return (
      <div className="p-2">
        <header className="my-2.5 pl-2.5 font-[18px]">Category</header>
        <div className="text-center py-4 text-sm text-gray-500">
          Loading categories...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-2">
        <header className="my-2.5 pl-2.5 font-[18px]">Category</header>
        <div className="text-center py-4 text-sm text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="p-2">
      <header className="my-2.5 pl-2.5 font-[18px]">Category</header>

      <button
        onClick={handleClick}
        className={`flex justify-between items-center mb-px py-2.5 px-[15px] ${isActive ? "bg-[#FAE9D4] shadow" : "bg-transparent"
          } w-full rounded-lg font-bold cursor-pointer`}
      >
        All Categories
        <span className="w-[26px] font-normal text-white h-[26px] flex justify-center items-center rounded-full bg-[#F49B31]">
          {categories.length}
        </span>
      </button>

      <div className="">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`flex justify-start gap-[13px] cursor-pointer font-semibold  ${isActive
              ? "bg-transparent shadow-none"
              : selectedCategory.id === category.id
                ? "bg-[#FAE9D4] opacity-100 shadow"
                : " opacity-64"
              }  px-[15px] w-full rounded-lg py-[13px] items-center opacity-64 text-[15px] transition ease-in duration-200`}
          >
            <span>
              <img src={category.labelIcon} />
            </span>
            <div>{category.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Categories;
