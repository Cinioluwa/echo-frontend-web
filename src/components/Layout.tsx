import React from "react";
import { FaPlus } from "react-icons/fa6";
import NavBar from "./NavBar";
import PageTitleBar from "./PageTitleBar";
import SideBar, { type Pages } from "./SideBar";

interface LayoutProps {
  setFormSegment: React.Dispatch<React.SetStateAction<string>>;
  setForm: React.Dispatch<React.SetStateAction<boolean>>;
  setActivePage: React.Dispatch<React.SetStateAction<Pages>>;
  activePage: Pages;
  heading: string;
}

const Layout = ({
  setFormSegment,
  setForm,
  setActivePage,
  activePage,
  heading,
}: LayoutProps) => {
  return (
    <div>
      <header className="z-20 md:fixed md:top-0 w-full">
        <nav>
          <NavBar />
        </nav>
        <PageTitleBar
          pages={activePage}
          setActivePage={setActivePage}
          heading={heading}
        >
          <button
            onClick={() => {
              setForm(true);
              setFormSegment("ping");
            }}
            className="flex cursor-pointer justify-center text-[13px] items-center gap-[7px] text-white transition-colors ease-in-out duration-300 rounded-[40px] hover:bg-[#d88429]
         bg-[#F49B31] py-2.5 px-[15px] text-center"
          >
            <FaPlus fontSize={20} />
            Create a ping
          </button>
        </PageTitleBar>
      </header>
      <aside className="hidden md:block [scrollbar-width:none]  overflow-y-auto   px-10 fixed h-[calc(100vh-155px)] w-[350px] left-0 bottom-0 whitespace-nowrap ">
        <SideBar pages={activePage} setActivePage={setActivePage} />
      </aside>
    </div>
  );
};

export default Layout;
