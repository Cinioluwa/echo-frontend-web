import { useState, type ReactNode } from "react";
import FilterDropdown, { type FilterOption } from "./FilterDropdown";
import { useSearchStore } from "../stores";
const menuBar = "/assets/images/menu-hotdog.svg";
import MobileMenu from "./MobileMenu";
import type { Pages } from "./SideBar";
import MobileCategories from "./MobileCategories";

interface pageHeaderProps {
  heading: string;
  children?: ReactNode;
}

interface MenuProps {
  setActivePage: React.Dispatch<React.SetStateAction<Pages>>;
  pages: Pages;
}

type combinedProps = MenuProps & pageHeaderProps;

const PageTitleBar = ({
  heading,
  children,
  setActivePage,
  pages,
}: combinedProps) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openCat, setOpenCat] = useState(false);
  const [selectedMobileCat, setSelectedMobileCat] = useState("");

  // Get filter state and actions from store
  const selectedFilters = useSearchStore((state) => state.selectedFilters);
  const setFilters = useSearchStore((state) => state.setFilters);

  const handleFilterChange = (filters: FilterOption[]) => {
    setFilters(filters);
  };

  return (
    <div className="flex justify-between items-center mx-[15px] md:mx-[55px] mt-[15px] ">
      <div>
        <div className="flex gap-[7px]">
          <button className="md:hidden" onClick={() => setOpenMenu(!openMenu)}>
            <img src={menuBar} alt="" />
          </button>
          <h3 className="text-[22px] font-semibold ">{heading}</h3>
        </div>
        <button
          onClick={() => setOpenCat(!openCat)}
          className="px-[17px] mt-3 cursor-pointer md:hidden border-[#7D7D7D] border rounded-[25px] text-[12px] py-[3px]"
        >
          Category:{" "}
          <span className="pl-0.5 text-[#F49B31]">
            {selectedMobileCat ? selectedMobileCat : "ALL"}
          </span>
        </button>
        {openCat && (
          <div
            onClick={() => setOpenCat(false)}
            className="fixed z-10 transition-opacity duration-300 ease-in inset-0 bg-black/40 md:hidden"
          >
            <MobileCategories
              selectedMobileCat={selectedMobileCat}
              setOpenCat={setOpenCat}
              setSelectedMobileCat={(cat) => setSelectedMobileCat(cat)}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-[19px]">
        <FilterDropdown
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          className="hidden md:flex"
        />
        {children}
      </div>
      <MobileMenu
        menu={openMenu}
        setMenu={setOpenMenu}
        pages={pages}
        setActivePage={setActivePage}
      />
    </div>
  );
};

export default PageTitleBar;
