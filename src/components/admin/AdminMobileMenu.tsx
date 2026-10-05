import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { Building2, X } from "lucide-react";
import { useAuthStore } from "../../stores";

interface Props {
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
  menu: boolean;
}

const AdminMobileMenu = ({ setMenu, menu }: Props) => {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const isRepresentative = user?.role === "REPRESENTATIVE" && user.representativeProfile?.isActive === true;
  const isRepresentativeManager = isRepresentative && user?.representativeProfile?.canManageReps === true;
  const currentPage = location.pathname.toLowerCase();
  function handleClick() {
    setMenu(false);
  }

  useEffect(() => {
    if (menu) setMenu(false);
    // Close the drawer after navigation.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (!menu) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menu, setMenu]);

  const items = isRepresentative
    ? [
        { label: "Representative inbox", to: "/admin/soundboard", icon: "/assets/icon/admin-soundboard.svg" },
        ...(isRepresentativeManager
          ? [{ label: "Institution", to: "/admin/institution", icon: null }]
          : []),
      ]
    : [
        { label: "Soundboard", to: "/admin/soundboard", icon: "/assets/icon/admin-soundboard.svg" },
        { label: "Follow up", to: "/admin/followUp", icon: "/assets/icon/followup.svg" },
        { label: "Moderation", to: "/admin/moderation", icon: "/assets/icon/moderation.svg" },
        { label: "Institution", to: "/admin/institution", icon: null },
      ];

  return (
    <AnimatePresence>
      {menu && (
        <>
          <motion.button
            type="button"
            aria-label="Close admin menu"
            onClick={handleClick}
            className="fixed inset-0 z-40 bg-black/40 min-[1131px]:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label="Admin navigation"
            className="fixed inset-y-0 left-0 z-50 flex h-dvh w-[min(88vw,360px)] flex-col overflow-y-auto bg-[#FEF5EA] shadow-2xl min-[1131px]:hidden"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: [0.22, 0.61, 0.36, 1], duration: 0.28 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#F4E3C9] bg-[#FEF5EA] px-5 py-4">
              <div className="flex items-center gap-2">
                <img src="/assets/images/Echo Logo_black.svg" alt="" className="h-6 w-[22px] brightness-0 contrast-200" />
                <span className="font-['Poppins',sans-serif] text-xl font-bold leading-none text-black">Echo</span>
              </div>
              <button
                type="button"
                onClick={handleClick}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4A3728] shadow-sm transition-colors hover:bg-[#fae9d4]"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 px-4 py-5">
              <div className="flex flex-col gap-3">
                {items.map(({ label, to, icon }) => {
                  const active = currentPage === to.toLowerCase() ||
                    (to === "/admin/soundboard" && currentPage.startsWith("/admin/soundboard/"));
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={handleClick}
                      aria-current={active ? "page" : undefined}
                      className={`flex w-full items-center gap-3 rounded-full border border-[#F49B31] px-5 py-3 text-left text-[15px] font-semibold transition-colors ${
                        active ? "border-0 bg-[#FFC37B] text-[#212121]" : "bg-white text-[#212121] hover:bg-[#FEF5EA]"
                      }`}
                    >
                      {icon ? (
                        <img src={icon} alt="" className={`h-5 w-5 shrink-0 ${active ? "brightness-0" : ""}`} />
                      ) : (
                        <Building2 className={`h-5 w-5 shrink-0 ${active ? "text-[#212121]" : "text-[#F49B31]"}`} aria-hidden="true" />
                      )}
                      {label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default AdminMobileMenu;
