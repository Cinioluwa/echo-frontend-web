const cardProfile = "/assets/images/wavecardprofile.svg";
const approve = "/assets/images/approve.svg";
const waveMenu = "/assets/images/waveMenu.svg";
const reject = "/assets/images/reject.svg";
const dropdown = "/assets/images/customDropdown.svg";
const profileImage = "/assets/images/profileImage.jpeg";
import CollapsibleText from "../CollapsibleText";
import type { AdminWave } from "../../api/types/admin.types";
import { categoryImages } from "../CategoryImages";
import PostActionMenu from "./PostActionMenu";
import { useState } from "react";
import { adminService } from "../../api";
import FollowUpLabel from "./FollowUpLabel";

interface AdminWaveCardProps {
  waves: AdminWave;
  onUpdate?: () => void;
}

const AdminWaveCard = ({ waves, onUpdate }: AdminWaveCardProps) => {
  const [openMenu, setOpenMenu] = useState(false);
  const [approved, setApproved] = useState(waves.status === 'APPROVED');
  const [rejected, setRejected] = useState(waves.status === 'REJECTED');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (loading || approved) return;

    try {
      setLoading(true);
      await adminService.updateWaveStatus(waves.id, { status: 'APPROVED' });
      setApproved(true);
      setRejected(false);

      // Show success notification
      alert('Wave approved successfully! Parent ping has been resolved.');

      // Refresh the list
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Failed to approve wave:', error);
      alert(error.response?.data?.error || 'Failed to approve wave');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (loading || rejected) return;

    if (!confirm('Are you sure you want to reject this wave?')) return;

    try {
      setLoading(true);
      await adminService.updateWaveStatus(waves.id, { status: 'REJECTED' });
      setRejected(true);
      setApproved(false);

      // Show success notification
      alert('Wave rejected');

      // Refresh the list
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Failed to reject wave:', error);
      alert(error.response?.data?.error || 'Failed to reject wave');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="m-[15px] md:m-0 px-[25px] py-2.5 bg-[#FEFEFE]  rounded-[10px] ">
        <div className="flex mb-6 mt-2 justify-between gap-8 items-center">
          <div className="flex items-center gap-3">
            <span className="cursor-pointer">
              <img src={dropdown} alt="" />
            </span>
            <p className="text-[14px] font-semibold">{waves.ping.title}</p>
          </div>

          {waves.status && waves.status === "UNDER_REVIEW" && (
            <FollowUpLabel
              label="Under Review"
              color="#067647"
              borderColor={"#ABEFC6"}
              backgroundColor={"#ECFDF3"}
            />
          )}
          {waves.status && waves.status === "APPROVED" && (
            <FollowUpLabel
              label="Approved"
              color="#ffffff"
              borderColor={"#ABEFC6"}
              backgroundColor={"#4CAF50"}
            />
          )}
          {waves.status && waves.status === "REJECTED" && (
            <FollowUpLabel
              label="Rejected"
              color="#B01212"
              borderColor={"#B01212"}
              backgroundColor={"#FFF7E8"}
            />
          )}

          <span onClick={() => setOpenMenu(true)} className="cursor-pointer">
            <img src={waveMenu} alt="" />
          </span>

          {openMenu && (
            <PostActionMenu
              setOpenMenu={setOpenMenu}
              entityType="wave"
              entityId={waves.id}
              onUpdate={onUpdate}
            />
          )}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6 ">
              <img src={cardProfile} alt="" />
              <div className="flex flex-col">
                <span className="text-[15px] whitespace-normal sm:whitespace-nowrap inline-block max-w-3 font-semibold">
                  {waves.author ? `${waves.author.firstName} ${waves.author.lastName}` : 'Anonymous'}
                </span>
                <span className="text-[#8B8E8D] text-[13px]">
                  {new Date(waves.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-[13px]">
              <span>
                <img src={categoryImages['Chapel']} alt="" />
              </span>
              Related Ping
            </div>
          </div>
        </div>
        <div className="my-[15px]">
          <div className="flex items-center w-full justify-between px-[5px] py-[9px] rounded-2xl bg-[#FFC37B]">
            <div className="  inline-flex mr-2.5 ml-2.5  items-center gap-2.5 ">
              <span className="w-[35px] inline-block overflow-hidden h-[35px] cursor-pointer rounded-full">
                <img
                  src={profileImage}
                  className=" object-cover w-full h-full"
                />
              </span>
              <div className="text-start">
                <p className="text-[#926B3D] text-[0.45rem] md:text-[0.74rem] ">
                  Original Ping
                </p>
                <p className="text-[0.62rem] md:text-[0.55rem] ">
                  {new Date(waves.ping.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            <CollapsibleText title={waves.ping.title} />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 my-4">
          <p className="text-[#626665] text-[15px] border-b border-[#D3CECE] pb-4">
            {waves.solution}
          </p>
        </div>

        <div className="flex  justify-between items-center ">
          <div className="flex gap-2.5 mb-2">
            <button
              onClick={handleApprove}
              disabled={loading || approved || rejected}
              className={`flex ${approved
                ? "bg-green-500"
                : "bg-[#F49B31] hover:bg-[#d88429]"
                } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                } transition-all duration-200 ease-in-out text-white items-center justify-center px-4 py-2 rounded-[15px] gap-2.5`}
            >
              <span>
                <img src={approve} alt="" />
              </span>
              {approved ? "Approved" : loading ? "Processing..." : "Approve"}
            </button>

            <button
              onClick={handleReject}
              disabled={loading || approved || rejected}
              className={`flex ${rejected
                ? "bg-gray-500"
                : "bg-[#B01212] hover:bg-[#900f0f]"
                } ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                } text-white items-center justify-center pr-7 pl-4 py-2 rounded-[15px] gap-2.5`}
            >
              <span>
                <img src={reject} alt="" />
              </span>
              {rejected ? "Rejected" : "Reject"}
            </button>
          </div>

          <div className="text-[#454545] text-[14px]">
            {waves.surgeCount || waves._count.surges} Surges
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWaveCard;
