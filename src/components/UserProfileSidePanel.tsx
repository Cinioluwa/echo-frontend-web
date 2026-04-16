import { MdOutlineManageAccounts } from "react-icons/md";
import { HiOutlineBell, HiOutlineUser } from "react-icons/hi";
import { HiOutlineLockClosed } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

type Pages = {
  pages: {
    profile: boolean;
    account: boolean;
    notification: boolean;
    privacy: boolean;
  };
};

const UserProfileSidePanel = ({ pages }: Pages) => {
  const navigate = useNavigate();

  const menuItems = [
    {
      label: "Profile",
      icon: <HiOutlineUser size={20} />,
      active: pages.profile,
    },
    {
      label: "Privacy",
      icon: <HiOutlineLockClosed size={20} />,
      active: pages.privacy,
    },
    {
      label: "Notification",
      icon: <HiOutlineBell size={20} />,
      active: pages.notification,
    },
    {
      label: "Account",
      icon: <MdOutlineManageAccounts size={20} />,
      active: pages.account,
    },
  ];

  return (
    <aside className="w-full lg:w-56 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar py-2 md:py-0 mb-6 md:mb-0">
      {menuItems.map((item) => (
        <button
          key={item.label}
          onClick={() => {
            if (item.label === "Profile") {
              navigate("/user/profile");
            } else if (item.label === "Privacy") {
              navigate("/user/privacy");
            } else if (item.label === "Notification") {
              navigate("/user/notification");
            } else if (item.label === "Account") {
              navigate("/user/account");
            }
          }}
          className={`flex items-center md:my-1 gap-5 cursor-pointer px-7 py-3 rounded-xl whitespace-nowrap transition-all shrink-0 ${
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

export default UserProfileSidePanel;
