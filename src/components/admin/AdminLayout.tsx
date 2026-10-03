import AdminSideBar from "./AdminSideBar";
import AdminMobileNavBar from "./AdminMobileNavBar";

const AdminLayout = () => {
  return (
    <div className="relative md:fixed z-50">
      {/* Top NavBar — fixed on desktop, static on mobile */}
      <header className="z-20 w-full md:hidden">
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
