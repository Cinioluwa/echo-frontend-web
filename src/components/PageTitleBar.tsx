import { useState, type ReactNode } from "react";
import filters from "../assets/images/filters.svg";
import menuBar from "../assets/images/menu-hotdog.svg";
import MobileMenu from "./MobileMenu";
import type { Pages } from "./SideBar";

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

  return (
    <div className="flex justify-between items-center mx-[15px] md:mx-[55px] mt-[15px] ">
      <div className="flex flex-col gap-3">
        <div className="flex gap-[7px]">
          <button className="md:hidden" onClick={() => setOpenMenu(!openMenu)}>
            <img src={menuBar} alt="" />
          </button>
          <h3 className="text-[22px] font-semibold ">{heading}</h3>
        </div>
        <div className="px-[17px] max-w-[120px] md:hidden border-[#7D7D7D] border rounded-[25px] text-[12px] py-[3px]">
          Category: <span className="text-[#F49B31]">ALL</span>
        </div>
      </div>

      <div className="flex items-center gap-[19px]">
        <span className="hidden md:flex items-center gap-1">
          <img src={filters} alt="" className="inline" />
          <p className=" text-[#B29494] text-[15px] inline ">Filters</p>
        </span>
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
