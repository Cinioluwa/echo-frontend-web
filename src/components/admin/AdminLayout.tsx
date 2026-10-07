import { useLocation } from "react-router-dom";
import AdminSideBar from "./AdminSideBar";
import AdminMobileNavBar from "./AdminMobileNavBar";
import { usePageTitle } from "../../hooks/usePageTitle";

const AdminLayout = () => {
  const location = useLocation();
  const isAdminPingDetail = location.pathname.startsWith("/admin/soundboard/");
  usePageTitle(undefined, !isAdminPingDetail);

  return (
    <div className="relative z-50 min-[1131px]:fixed">
      {/* Top NavBar — fixed on desktop, static on mobile */}
      <header className="z-20 w-full min-[1131px]:hidden">
        <nav>
          <AdminMobileNavBar />
        </nav>
      </header>
      <aside className="">
        <AdminSideBar
          onToggleSidebar={() => { }}
          onSoundboardClick={() => { }} />
      </aside>
    </div>
  );
};

export default AdminLayout;
