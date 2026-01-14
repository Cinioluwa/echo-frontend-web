import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

interface CategoryFilterContextType {
  selectedCategoryId: number | null;
  selectedCategoryName: string | null;
  setSelectedCategory: (id: number | null, name: string | null) => void;
  clearCategoryFilter: () => void;
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

  const setSelectedCategory = (id: number | null, name: string | null) => {
    setSelectedCategoryId(id);
    setSelectedCategoryName(name);
  };

  const clearCategoryFilter = () => {
    setSelectedCategoryId(null);
    setSelectedCategoryName(null);
  };

  return (
    <CategoryFilterContext.Provider
      value={{
        selectedCategoryId,
        selectedCategoryName,
        setSelectedCategory,
        clearCategoryFilter,
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
