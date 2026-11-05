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
    <aside className="w-full lg:w-56 lg:shrink-0 flex lg:flex-col gap-2 overflow-x-auto no-scrollbar py-2 md:py-0 mb-2 lg:mb-0">
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
          className={`flex min-h-11 items-center gap-3 cursor-pointer px-4 py-2.5 lg:my-1 lg:gap-4 lg:px-5 lg:py-3 rounded-xl whitespace-nowrap transition-colors shrink-0 ${
            item.active
              ? "bg-[var(--echo-accent)] text-[var(--echo-text-on-accent)]"
              : "bg-[var(--echo-surface-soft)] text-[var(--echo-text-4a3728)] hover:bg-[var(--echo-page)]"
          }`}
        >
          {item.icon}
          <span className="text-xs md:text-sm">{item.label}</span>
        </button>
      ))}
    </aside>
  );
};

export default UserProfileSidePanel;
