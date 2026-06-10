import { FaPlus } from "react-icons/fa6";
import { HiChevronLeft } from "react-icons/hi2";
import NavBar from "./NavBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import PingFormModal from "./PingFormModal";

const ProfileLayout = () => {
  const navigate = useNavigate();
  const [showPingModal, setShowPingModal] = useState(false);

  const handleCloseModal = () => {
    setShowPingModal(false);
  };

  return (
    <div>
      <NavBar />

      <div className="flex justify-between items-center my-4 mx-8">
        <button
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-orange-100 text-sm font-semibold shadow-sm hover:bg-orange-50 transition"
          onClick={() => navigate("/admin/soundboard")}
        >
          <HiChevronLeft size={18} />
          Go back to feed
        </button>
        <button
          onClick={() => setShowPingModal(true)}
          className="flex cursor-pointer justify-center text-[13px] items-center gap-[7px] text-white transition-colors overflow-hidden whitespace-nowrap ease-in-out duration-300 rounded-[40px] hover:bg-[#d88429] bg-[#F49B31] py-2.5  px-[15px] text-center"
        >
          <FaPlus fontSize={20} />
          Create a ping
        </button>
      </div>
      {showPingModal && (
        <PingFormModal
          setPingForm={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProfileLayout;
