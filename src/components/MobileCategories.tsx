const general = "/assets/images/General.svg";
const academics = "/assets/images/Graduation Cap.svg";
const chapel = "/assets/images/Chapel.svg";
const finance = "/assets/images/University.svg";
const hall = "/assets/images/Hall.svg";
const sport = "/assets/images/sport.svg";
const welfare = "/assets/images/welfare.svg";
import { useState, type SetStateAction } from "react";

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
    label: "Welfare",
    id: 7,
  },
];

// interface categoryy {
//   isActive: boolean;
//   selectedCategory: boolean;
// }

interface Props {
  setSelectedMobileCat: React.Dispatch<SetStateAction<string>>;
  setOpenCat: React.Dispatch<SetStateAction<boolean>>;
  selectedMobileCat: string;
}

const MobileCategories = ({
  setSelectedMobileCat,
  selectedMobileCat,
  setOpenCat,
}: Props) => {
  const [isActive, setIsActive] = useState(true);

  function handleClick() {
    setSelectedMobileCat("");
    if (!isActive) return setIsActive(true);
    setOpenCat(false);
  }

  function handleCategoryClick(category: category) {
    setIsActive(false);
    setSelectedMobileCat(category.label);
    setOpenCat(false);
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="p-2 ml-[13px] bg-[#FFC37B] fixed mt-[145px] rounded-[17px]"
    >
      <button
        onClick={handleClick}
        className={`flex justify-between items-center py-2 px-2.5 ${selectedMobileCat
            ? ""
            : isActive
              ? "bg-[#FAE9D4] shadow"
              : "bg-transparent"
          } w-full rounded-xl font-bold mb-[5px] text-[12px] gap-[45px] cursor-pointer`}
      >
        All Categories
        <span className="w-5 font-normal text-white h-5 flex justify-center items-center rounded-full bg-[#F49B31]">
          8
        </span>
      </button>
      <div>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategoryClick(category)}
            className={`flex justify-start gap-2 cursor-pointer font-semibold ${selectedMobileCat === category.label
                ? "bg-[#FAE9D4] opacity-100 shadow"
                : " opacity-64"
              }   px-2.5 w-full rounded-lg py-2 items-center opacity-64 text-[11px] transition ease-in duration-200`}
          >
            <span>
              <img src={category.labelIcon} className="w-[80%]" />
            </span>
            <div>{category.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileCategories;
