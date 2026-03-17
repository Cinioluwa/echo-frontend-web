import { MdOutlineManageAccounts } from "react-icons/md";
import { HiOutlineBell, HiOutlineUser } from "react-icons/hi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

type Pages = {
  pages: {
    profile: boolean;
    account: boolean;
    notification: boolean;
  };
};

const AdminProfileSidePanel = ({ pages }: Pages) => {
  const [activeItem, setActiveItem] = useState(pages);

  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Profile",
      icon: <HiOutlineUser size={20} />,
      active: activeItem.profile,
    },

    {
      label: "Notification",
      icon: <HiOutlineBell size={20} />,
      active: activeItem.notification,
    },
    {
      label: "Account",
      icon: <MdOutlineManageAccounts size={20} />,
      active: activeItem.account,
    },
  ];

  return (
    <aside className="w-full lg:w-56 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar py-2 md:py-0 mb-6 md:mb-0">
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            if (item.label === "Profile") {
              setActiveItem({
                profile: true,
                account: false,
                notification: false,
              });
              navigate("/admin/profile");
            } else if (item.label === "Notification") {
              setActiveItem({
                profile: false,
                account: false,
                notification: true,
              });
              navigate("/admin/notification");
            } else if (item.label === "Account") {
              setActiveItem({
                profile: false,
                account: true,
                notification: false,
              });
              navigate("/admin/account");
            }
          }}
          className={`flex items-center md:my-1 gap-5 px-7 py-3 rounded-xl whitespace-nowrap transition-all shrink-0 ${
            item.active
              ? "bg-[#E8A355] text-white shadow-lg shadow-orange-200"
              : "bg-[#FEF5EA] hover:bg-orange-100"
          }`}
        >
          {item.icon}
          <span className="text-sm">{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default AdminProfileSidePanel;
