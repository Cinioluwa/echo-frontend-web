import React from "react";
import NavBar from "../NavBar";
import type { AdminPages } from "./AdminSideBar";
import AdminPageTitleBar from "./AdminPageTitleBar";
import AdminOverviewSideBar from "./AdminOverviewSideBar";

interface LayoutProps {
  setActivePage: React.Dispatch<React.SetStateAction<AdminPages>>;
  activePage: AdminPages;
  heading: string;
}

const AdminPostDetailsLayout = ({
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
        <AdminPageTitleBar
          pages={activePage}
          setActivePage={setActivePage}
          heading={heading}
        ></AdminPageTitleBar>
      </header>
      <aside className="hidden md:block [scrollbar-width:none]  overflow-y-auto   px-10 fixed h-[calc(100vh-155px)] w-[350px] left-0 bottom-0 whitespace-nowrap ">
        <AdminOverviewSideBar
          pages={activePage}
          setActivePage={setActivePage}
        />
      </aside>
    </div>
  );
};

export default AdminPostDetailsLayout;
