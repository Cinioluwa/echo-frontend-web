import React from "react";
import { FaPlus } from "react-icons/fa6";
import { motion } from "motion/react";
import NavBar from "../../components/NavBar";
import type { AdminPages } from "./AdminSideBar";
import AdminPageTitleBar from "./AdminPageTitleBar";
import AdminOverviewSideBar from "./AdminOverviewSideBar";

interface LayoutProps {
  setFormSegment: React.Dispatch<React.SetStateAction<string>>;
  setForm: React.Dispatch<React.SetStateAction<boolean>>;
  setActivePage: React.Dispatch<React.SetStateAction<AdminPages>>;
  setAnnouncementModal: React.Dispatch<React.SetStateAction<boolean>>;
  activePage: AdminPages;
  heading: string;
}

const AdminOverviewLayout = ({
  setFormSegment,
  setForm,
  setActivePage,
  activePage,
  heading,
  setAnnouncementModal
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
        >
          <button onClick={() => setAnnouncementModal(true)} className="bg-[#FEF5EA] hidden sm:block text-[13px] rounded-[20px] px-4 border border-[#F49B31] py-2.5">
            Publish Announcement
          </button>
          <motion.button
            onClick={() => {
              setForm(true);
              setFormSegment("ping");
            }}
            className="flex cursor-pointer justify-center text-[13px] items-center gap-[7px] text-white transition-colors overflow-hidden whitespace-nowrap ease-in-out duration-300 rounded-[40px] hover:bg-[#d88429]
         bg-[#F49B31] py-2.5  px-[15px] text-center"
          >
            <FaPlus fontSize={20} />
            Create a ping
          </motion.button>
        </AdminPageTitleBar>
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

export default AdminOverviewLayout;
