import React from "react";
import { Link } from "react-router-dom";
import feed from "../../assets/images/History Logo.svg";
import overview from "../../assets/images/overview.svg";
import followUp from "../../assets/images/followUp.svg";
import type { AdminPages } from "./AdminSideBar";

interface Props {
  setActivePage: React.Dispatch<React.SetStateAction<AdminPages>>;
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
  pages: AdminPages;
  menu: boolean;
}

const AdminMobileMenu = ({ setMenu, menu, pages, setActivePage }: Props) => {
  function handleClick() {
    setMenu(false);
  }

  return (
    <div
      onClick={handleClick}
      className={`${
        menu ? "opacity-100" : "opacity-0 pointer-events-none"
      } fixed transition-opacity duration-300 z-20 ease-in inset-0 bg-black/40 md:hidden`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          menu ? "translate-x-0" : "-translate-x-full"
        } transition-transform transform duration-300 ease-in-out w-[190px] top-[100px] flex flex-col gap-[15px] bg-white p-2 rounded-r-xl absolute left-0  py-[15px]`}
      >
        <Link to={"/admin/feed"}>
          <button
            onClick={() =>
              setActivePage({
                feedActive: true,
                overviewActive: false,
                followUpActive: false,
              })
            }
            className={`flex items-center ${
              pages.feedActive
                ? "bg-[#FFC37B] border-0"
                : "bg-transparent border-2"
            }  gap-3 py-[9px] w-full transition  cursor-pointer  ease-in-out duration-700 text-[15px] border-[#F49B31] rounded-[25px]`}
          >
            <span className="ml-6">
              <img src={feed} alt="" />
            </span>
            Feed
          </button>
        </Link>
        <Link to={"/admin/overview"}>
          <button
            onClick={() =>
              setActivePage({
                feedActive: false,
                overviewActive: true,
                followUpActive: false,
              })
            }
            className={`flex items-center ${
              pages.overviewActive
                ? "bg-[#FFC37B] border-0"
                : "bg-transparent border-2"
            }  gap-3 py-[9px] text-[15px] transition w-full cursor-pointer  ease-in-out duration-700 border-[#F49B31] rounded-[25px]`}
          >
            <span className="ml-6">
              <img src={overview} alt="" />
            </span>
            History
          </button>
        </Link>
        <Link to={"/admin/followUp"}>
          <button
            onClick={() =>
              setActivePage({
                feedActive: false,
                overviewActive: false,
                followUpActive: true,
              })
            }
            className={`flex items-center ${
              pages.followUpActive
                ? "bg-[#FFC37B] border-0"
                : "bg-transparent border-2"
            }  gap-3 py-[9px] w-full transition cursor-pointer ease-in-out duration-700 text-[15px] border-[#F49B31] rounded-[25px]`}
          >
            <span className="ml-6">
              <img src={followUp} alt="" />
            </span>
            Follow Up
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminMobileMenu;
