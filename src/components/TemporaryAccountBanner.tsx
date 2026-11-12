import React, { useState } from "react";
import { AlertCircle, ArrowRight } from "lucide-react";
import { useAuthStore } from "../stores";
import UpgradeSchoolEmailModal from "./UpgradeSchoolEmailModal";

export const TemporaryAccountBanner: React.FC = () => {
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);

  // Only render if the current authenticated user has an active temporary account
  if (!user || !user.isTemporary) {
    return null;
  }

  return (
    <>
      <div className="w-full bg-[#FEF5EA] border-b border-[#ffd7a8] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs font-poppins text-[#75420B] shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-5 rounded-full bg-[#F49B31]/15 text-[#F49B31] flex items-center justify-center shrink-0">
            <AlertCircle size={14} />
          </div>
          <span className="leading-snug">
            <strong className="font-semibold">Temporary Freshman Account</strong>
            {user.regNumber ? ` (${user.regNumber})` : ""}: Once IT issues your official university email, link it to keep your profile permanently verified.
          </span>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#F49B31] px-3.5 py-1 text-white font-medium hover:bg-[#E8911A] transition-colors shadow-xs shrink-0 cursor-pointer text-xs"
        >
          <span>Link School Email</span>
          <ArrowRight size={13} />
        </button>
      </div>

      <UpgradeSchoolEmailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        userRegNumber={user.regNumber}
        currentEmail={user.email}
      />
    </>
  );
};

export default TemporaryAccountBanner;

