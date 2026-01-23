import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface CategoryFilterContextType {
  selectedCategoryId: number | null;
  selectedCategoryName: string | null;
  setSelectedCategory: (id: number | null, name: string | null) => void;
  clearCategoryFilter: () => void;
  categoryCounts: Record<number, number>;
  totalCount: number;
  setCategoryCounts: (counts: Record<number, number>, total: number) => void;
}

const CategoryFilterContext = createContext<
  CategoryFilterContextType | undefined
>(undefined);

interface CategoryFilterProviderProps {
  children: ReactNode;
}

export const CategoryFilterProvider: React.FC<CategoryFilterProviderProps> = ({
  children,
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [selectedCategoryName, setSelectedCategoryName] = useState<
    string | null
  >(null);
  const [categoryCounts, setCategoryCountsState] = useState<Record<number, number>>({});
  const [totalCount, setTotalCount] = useState<number>(0);

  const setSelectedCategory = (id: number | null, name: string | null) => {
    setSelectedCategoryId(id);
    setSelectedCategoryName(name);
  };

  const clearCategoryFilter = () => {
    setSelectedCategoryId(null);
    setSelectedCategoryName(null);
  };

  const setCategoryCounts = (counts: Record<number, number>, total: number) => {
    setCategoryCountsState(counts);
    setTotalCount(total);
  };

  return (
    <CategoryFilterContext.Provider
      value={{
        selectedCategoryId,
        selectedCategoryName,
        setSelectedCategory,
        clearCategoryFilter,
        categoryCounts,
        totalCount,
        setCategoryCounts,
      }}
    >
      {children}
    </CategoryFilterContext.Provider>
  );
};

export const useCategoryFilter = (): CategoryFilterContextType => {
  const context = useContext(CategoryFilterContext);
  if (!context) {
    throw new Error(
      "useCategoryFilter must be used within a CategoryFilterProvider"
    );
  }
  return context;
};
