import AdminSideBar from "./AdminSideBar";
import AdminMobileNavBar from "./AdminMobileNavBar";

const AdminLayout = () => {
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
