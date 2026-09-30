/**
 * MobileSideDrawer
 * Mobile-first navigation drawer for categories and key actions.
 *
 * Replaces the old persistent MobileHeader on small screens. The hamburger in
 * the top bar opens this drawer, which slides in from the left over the feed and
 * carries the same navigation as the desktop sidebar in a touch-friendly,
 * mobile-specific layout.
 */
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { X } from "lucide-react";
import SideBar from "./SideBar";
import PingFormModal from "./PingFormModal";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSideDrawer = ({ isOpen, onClose }: Props) => {
  const [showPingForm, setShowPingForm] = useState(false);
  const location = useLocation();

  // Close the drawer on route change so tapping a link navigates and dismisses.
  useEffect(() => {
    if (isOpen) onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Escape to close.
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleCreatePing = () => {
    onClose();
    setShowPingForm(true);
  };

  return (
    <>
      <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="md:hidden fixed inset-0 z-40 bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Panel — pushes in from the left */}
          <motion.aside
            className="md:hidden fixed left-0 top-0 bottom-0 z-50 flex w-[min(88vw,360px)] flex-col overflow-y-auto bg-[#FEF5EA] [scrollbar-width:none] shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", ease: [0.22, 0.61, 0.36, 1], duration: 0.28 }}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-[#F4E3C9] bg-[#FEF5EA] px-5 py-4">
              <div className="flex items-center gap-2">
                <img
                  src="/assets/images/Echo Logo_black.svg"
                  alt=""
                  className="h-6 w-[22px] brightness-0 contrast-200"
                />
                <span className="font-['Poppins',sans-serif] text-xl font-bold leading-none text-black">
                  Echo
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#4A3728] shadow-sm transition-colors hover:bg-[#fae9d4]"
              >
                <X size={20} />
              </button>
            </div>
            <div className="px-4 py-5">
              <SideBar
                onCreatePing={handleCreatePing}
                onNavigate={onClose}
                variant="mobile"
              />
            </div>
          </motion.aside>
        </>
      )}
      </AnimatePresence>

      {/* Ping Form Modal */}
      {showPingForm && (
        <PingFormModal
          setPingForm={() => setShowPingForm(false)}
          onPingCreated={() => setShowPingForm(false)}
        />
      )}
    </>
  );
};

export default MobileSideDrawer;