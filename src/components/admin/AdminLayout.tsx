import { useState } from "react";
import AdminSideBar from "./AdminSideBar";



const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <div className="fixed">
      <aside className="">
        <AdminSideBar
          userName="Osagumwenro Ugbo"
          userBadge="ADMIN.CU"
          onToggleSidebar={() => setSidebarOpen(false)}
          onSoundboardClick={() => { }} />
      </aside>
    </div>
  );
};

export default AdminLayout;
