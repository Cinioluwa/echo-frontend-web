import general from "../assets/images/General.svg";
import academics from "../assets/images/Graduation Cap.svg";
import chapel from "../assets/images/Chapel.svg";
import finance from "../assets/images/University.svg";
import hall from "../assets/images/Hall.svg";
import sport from "../assets/images/sport.svg";
import welfare from "../assets/images/welfare.svg";
import { useState } from "react";

type category = {
  label: string;
  labelIcon?: string;
  id: number;
};

const categories: category[] = [
  { labelIcon: general, label: "General", id: 1 },
  {
    labelIcon: academics,
    label: "Academics",
    id: 2,
  },
  {
    labelIcon: chapel,
    label: "Chapel",
    id: 3,
  },
  {
    labelIcon: finance,
    label: "Finance",
    id: 4,
  },
  {
    labelIcon: hall,
    label: "Hall",
    id: 5,
  },
  {
    labelIcon: sport,
    label: "Sport",
    id: 6,
  },
  {
    labelIcon: welfare,
    label: "Academics",
    id: 7,
  },
];

// interface categoryy {
//   isActive: boolean;
//   selectedCategory: boolean;
// }

const Categories = () => {
  const [isActive, setIsActive] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState({} as category);

  function handleClick() {
    if (!isActive) return setIsActive(true);
  }

  function handleCategoryClick(category: category) {
    setSelectedCategory(category);
    setIsActive(false);
  }

  return (
    <div className="p-2">
      <header className="my-[15px] pl-2.5 font-[18px]">Category</header>

      <div
        onClick={handleClick}
        className={`flex justify-between items-center mb-px py-3 px-[15px] ${
          isActive ? "bg-[#FAE9D4] shadow" : "bg-transparent"
        }   rounded-lg font-bold cursor-pointer`}
      >
        All Categories
        <span className="w-[26px] font-normal text-white h-[26px] flex justify-center items-center rounded-full bg-[#F49B31]">
          8
        </span>
      </div>

      <div className="">
        {categories.map((category) => (
          <li
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`flex justify-start gap-[13px] cursor-pointer font-semibold  ${
              isActive
                ? "bg-transparent shadow-none"
                : selectedCategory.id === category.id
                ? "bg-[#FAE9D4] opacity-100 shadow"
                : " opacity-64"
            }  px-[15px] rounded-lg py-[18px] items-center opacity-64 text-[15px] transition ease-in duration-200`}
          >
            <span>
              <img src={category.labelIcon} />
            </span>
            <div>{category.label}</div>
          </li>
        ))}
      </div>
    </div>
  );
};

export default Categories;
