import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuthStore } from "../../stores";

const SuperAdminSideBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const navItems = [
    { name: "Dashboard", path: "/super-admin/dashboard", icon: <img src="/assets/icon/admin-soundboard.svg" alt="Soundboard" className={`w-5 h-5 ${location.pathname.includes("/super-admin/dashboard") ? "grayscale-100 brightness-200" : ""}`} /> },
    { name: "Organizations", path: "/super-admin/organizations", icon: <img src="/assets/icon/organization.svg" alt="Organizations" className={`w-5 h-5 ${location.pathname.includes("/super-admin/organizations") ? "grayscale-100 brightness-200" : ""}`} /> },
    { name: "Users", path: "/super-admin/users", icon: <img src="/assets/icon/profile.svg" alt="Users" className={`w-5 h-5 ${location.pathname.includes("/super-admin/users") ? "grayscale-100 brightness-200" : ""}`} /> },
    { name: "Maintenance", path: "/super-admin/maintenance", icon: <img src="/assets/icon/admin-settings.svg" alt="Maintenance" className={`w-5 h-5 ${location.pathname.includes("/super-admin/maintenance") ? "grayscale-100 brightness-200" : ""}`} /> },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="w-[240px] h-screen bg-[#fef5ea] border-r border-[#f49b31] flex flex-col pt-8 pb-8">
      <div className="px-10 mb-12 flex items-center justify-center gap-3">
        <div className="w-[25px] h-[27px]">
          <img src="/assets/images/Echo Logo_black.svg" alt="Echo Logo" className="w-full h-full" />
        </div>
        <h1 className="text-xl font-bold text-gray-900">Echo</h1>
      </div>

      <nav className="flex-1 px-5 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.path);
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-colors font-semibold ${isActive
                ? "bg-[#f49b31] text-white "
                : "text-gray-700 hover:bg-[#fceacc]"
                }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-5 mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-5 py-4 rounded-xl text-gray-700 hover:bg-[#fceacc] w-full font-semibold transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default SuperAdminSideBar;
