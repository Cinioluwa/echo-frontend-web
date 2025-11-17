interface CategorySelectorProps {
  category: string;
  setCategory: (cat: string) => void;
}

const CategorySelector = ({ category, setCategory }: CategorySelectorProps) => {
  const categories = [
    "General",
    "Academics",
    "Chapel",
    "Finance",
    "Hall",
    "Sport",
    "Welfare",
  ];

  return (
    <div className=" border-2  rounded-[20px] overflow-hidden inline-flex">
      {categories.map((cat, index) => (
        <div
          key={index}
          onClick={() => setCategory(cat)}
          className={`cursor-pointer  ${
            category === cat ? "bg-[#F49B31] text-white" : "bg-[#FEF5EA]"
          } py-2.5 border-r transition-colors duration-500 ease-in-out px-[25px]`}
        >
          {cat}
        </div>
      ))}
    </div>
  );
};

export default CategorySelector;
