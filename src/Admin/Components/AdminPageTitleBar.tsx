import { useState, type ReactNode } from "react";
const filters = "/assets/images/filters.svg";
const menuBar = "/assets/images/menu-hotdog.svg";
import type { AdminPages } from "./AdminSideBar";
import MobileCategories from "../../components/MobileCategories";
import AdminMobileMenu from "./AdminMobileMenu";

interface pageHeaderProps {
  heading: string;
  children?: ReactNode;
}

interface MenuProps {
  setActivePage: React.Dispatch<React.SetStateAction<AdminPages>>;
  pages: AdminPages;
}

type combinedProps = MenuProps & pageHeaderProps;

const AdminPageTitleBar = ({
  heading,
  children,
  setActivePage,
  pages,
}: combinedProps) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [openCat, setOpenCat] = useState(false);
  const [selectedMobileCat, setSelectedMobileCat] = useState("");

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
        <span className="hidden md:flex items-center gap-1">
          <img src={filters} alt="" className="inline" />
          <p className=" text-[#B29494] text-[15px] inline ">Filters</p>
        </span>
        {children}
      </div>

      <AdminMobileMenu
        menu={openMenu}
        setMenu={setOpenMenu}
        pages={pages}
        setActivePage={setActivePage}
      />
    </div>
  );
};

export default AdminPageTitleBar;
