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
      <div className="border-2 rounded-[20px] p-4 text-center text-gray-500">
        Loading categories...
      </div>
    );
  }

  return (
    <div className=" border-2  rounded-[20px] overflow-hidden inline-flex ">
      {categories.map((cat) => (
        <div
          key={cat.id}
          onClick={() => setFormData(cat.id, cat.name)}
          className={`cursor-pointer  ${categoryId === cat.id ? "bg-[#F49B31] text-white" : "bg-[#FEF5EA] transition-colors duration-300 ease-in-out hover:bg-[#f2e8d9]"
            } py-2.5 border-r transition-colors duration-500 ease-in-out px-[25px] min-w-fit`}
        >
          {cat.name}
        </div>
      ))}
    </div>
  );
};

export default CategorySelector;
