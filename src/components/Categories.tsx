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
    <span className="min-w-[26px] h-[26px] px-1.5 font-medium text-[var(--echo-text-on-accent)] text-[13px] leading-none tabular-nums whitespace-nowrap flex justify-center items-center rounded-full bg-[var(--echo-accent)] shrink-0">
      {displayValue}
    </span>
  );
};

const Categories = ({
  mobile = false,
  onNavigate,
}: {
  mobile?: boolean;
  onNavigate?: () => void;
}) => {
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
    onNavigate?.();
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
    onNavigate?.();
  }

  if (isLoading) {
    return <CategoriesSkeleton />;
  }

  if (error) {
    return <CategoriesSkeleton />;
  }

  return (
    <div className={`w-full overflow-hidden ${
      mobile
        ? "rounded-2xl border border-[var(--echo-border-f4e3c9)] bg-[var(--echo-surface)] shadow-sm"
        : "rounded-[15px] bg-[var(--echo-bg-fce0b0)]"
    }`}>
      <div className={mobile ? "px-4 pt-4 pb-2" : "bg-[var(--echo-accent)] px-[14px] py-[16px]"}>
        <h2 className={`font-['Poppins',sans-serif] font-semibold leading-none ${
          mobile ? "text-[16px] text-[var(--echo-text-4a3728)]" : "text-[19px] text-[var(--echo-text-on-accent)]"
        }`}>
          {mobile ? "Categories" : "Category"}
        </h2>
      </div>

      {/* Body */}
      <div className={mobile ? "px-2 pb-2" : "px-[10px] pt-[10px] pb-[12px]"}>
        <button
          onClick={handleClick}
          className={`flex items-center justify-between gap-3 w-full min-h-[48px] px-3.5 rounded-[10px] cursor-pointer transition-colors duration-150 ${
            isAllActive
              ? mobile ? "bg-[var(--echo-surface-soft)] text-[var(--echo-text-4a3728)]" : "bg-[var(--echo-surface)]"
              : mobile ? "text-[var(--echo-text-4a3728)] hover:bg-[var(--echo-surface-soft)]" : "hover:bg-[var(--echo-surface)]/70"
          }`}
        >
          <span className={`font-['Poppins',sans-serif] font-semibold text-[15px] ${mobile ? "text-[var(--echo-text-4a3728)]" : "text-[var(--echo-text-primary)]"}`}>
            All Categories
          </span>
          <CountBadge value={totalCount || 0} />
        </button>

        {/* Category rows */}
        <div>
          {categories.map((category) => {
            const isSelected = selectedCategoryId === category.id;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category)}
                className={`flex items-center justify-between gap-3 w-full min-h-[48px] px-3 rounded-[10px] cursor-pointer transition-colors duration-150 ${
                  isSelected
                    ? mobile ? "bg-[var(--echo-surface-soft)]" : "bg-[var(--echo-surface)]"
                    : mobile ? "hover:bg-[var(--echo-surface-soft)]" : "hover:bg-[var(--echo-surface)]/70"
                }`}
              >
                <span className="flex items-center gap-[13px] min-w-0">
                  <img
                    src={category.labelIcon}
                    alt=""
                    className="w-[22px] h-[22px] object-contain shrink-0"
                  />
                  <span className="font-['Poppins',sans-serif] font-semibold text-[15px] text-[var(--echo-text-4a3728)] truncate">
                    {category.label}
                  </span>
                </span>
                <CountBadge value={categoryCounts[category.id] || 0} />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Categories;
