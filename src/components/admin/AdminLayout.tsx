import AdminSideBar from "./AdminSideBar";
import NavBar from "../NavBar";

const AdminLayout = () => {
  return (
    <div className="relative md:fixed z-50">
      {/* Top NavBar — fixed on desktop, static on mobile */}
      <header className="z-20 md:hidden w-screen ">
        <nav>
          <NavBar />
        </nav>
      </header>
      <aside className="">
        <AdminSideBar
          userName="Osagumwenro Ugbo"
          userBadge="ADMIN.CU"
          onToggleSidebar={() => { }}
          onSoundboardClick={() => { }} />
      </aside>
    </div>
  );
};

export default AdminLayout;
