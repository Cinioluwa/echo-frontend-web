import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import SuperAdminSideBar from "./SuperAdminSideBar";
import SuperAdminTopBar from "./SuperAdminTopBar";

const getPageTitle = (pathname: string) => {
  if (pathname.includes("dashboard")) return "Super Admin Overview";
  if (pathname.includes("organizations")) return "Super Admin Organizations";
  if (pathname.includes("users")) return "Super Admin Users";
  if (pathname.includes("maintenance")) return "Super Admin Maintenance";
  return "Super Admin";
};

const SuperAdminLayout: React.FC = () => {
  const location = useLocation();
  const title = getPageTitle(location.pathname);

  return (
    <div className="flex h-screen w-full bg-[#fcf9f2] overflow-hidden">
      <SuperAdminSideBar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <SuperAdminTopBar title={title} />
        <main className="flex-1 overflow-y-auto p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
