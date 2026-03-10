const cardProfile = "/assets/images/wavecardprofile.svg";
const surge = "/assets/images/surge.svg";
const reaction = "/assets/images/reaction.svg";
const waveMenu = "/assets/images/waveMenu.svg";
const dropdown = "/assets/images/customDropdown.svg";
const dropdown_menu = "/assets/images/dropdown_menu.svg";
import { categoryImages } from "../../components/CategoryImages";
import type { AdminPing } from "../../api/types/admin.types";
import { useState } from "react";
import PostActionMenu from "./PostActionMenu";
import PostEngagementMenu from "./PostEngagementMenu";
import { adminService } from "../../api";

interface AdminPingCardProps {
  pings: AdminPing;
  onUpdate?: () => void;
}

const AdminPingCard = ({ pings, onUpdate }: AdminPingCardProps) => {
  const [acknowledged, setAcknowledged] = useState(!!pings.acknowledgedAt);
  const [openMenu, setOpenMenu] = useState(false);
  const [openEngagementMenu, setOpenEngagementMenu] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAcknowledge = async () => {
    if (loading || acknowledged) return;

    try {
      setLoading(true);
      await adminService.acknowledgePing(pings.id);
      setAcknowledged(true);

      // Show success notification
      alert('Ping acknowledged successfully');

      // Refresh the list
      if (onUpdate) onUpdate();
    } catch (error: any) {
      console.error('Failed to acknowledge ping:', error);
      alert(error.response?.data?.error || 'Failed to acknowledge ping');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="m-[15px] md:m-0 px-[25px] py-2.5 bg-[#FEFEFE]  rounded-[10px] ">
        <div className="flex justify-between items-center">
          <div className="flex mb-6 mt-2 items-center gap-3">
            <span className="cursor-pointer">
              <img src={dropdown} alt="" />
            </span>
            <p className="text-[14px] font-semibold">{pings.title}</p>
          </div>

          <span onClick={() => setOpenMenu(true)} className="cursor-pointer">
            <img src={waveMenu} alt="" />
          </span>

          {openMenu && (
            <PostActionMenu
              setOpenMenu={setOpenMenu}
              entityType="ping"
              entityId={pings.id}
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
                  {pings.isAnonymous ? 'Anonymous' : pings.author ? `${pings.author.firstName} ${pings.author.lastName}` : 'Anonymous'}
                </span>
                <span className="text-[#8B8E8D] text-[13px]">
                  {new Date(pings.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {pings.category && (
              <div className="flex items-center gap-[13px]">
                <span>
                  <img src={categoryImages[pings.category.name]} alt="" />
                </span>
                {pings.category.name}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 my-4">
          <p className="text-[#626665] text-[15px] border-b border-[#D3CECE] pb-4">
            {pings.content}
          </p>
        </div>

        <div className="flex justify-end items-center ">
          <div className="flex gap-4 items-center">
            <div className=" items-center cursor-pointer gap-1 hidden lg:flex">
              <img src={reaction} alt="" />
              <span>{pings._count.comments}</span> comments
            </div>

            <div className="flex bg-[#EF6E0B] rounded-[20px]">
              <button
                onClick={handleAcknowledge}
                disabled={loading || acknowledged}
                className={`transition-colors cursor-pointer duration-1200 ease-in-out ${acknowledged
                  ? "bg-[#F49B31] hover:bg-[#d88429] transition-colors duration-100 ease-out text-white font-bold"
                  : "bg-[#FEF5EA] transition-colors duration-100 ease-in-out hover:bg-[#f2e8d9]"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""
                  } py-1.5 lg:py-2 lg:px-5 flex text-[12px]  font-bold items-center gap-2.5 border rounded-[20px] px-5`}
              >
                <img
                  src={surge}
                  alt=""
                  className={`${acknowledged ? "brightness-0 invert" : ""
                    } w-[50%] contrast-200 md:w-full`}
                />
                {acknowledged ? "ACKNOWLEDGED" : loading ? "PROCESSING..." : "ACKNOWLEDGE"}
              </button>

              <button className="bg-[#EF6E0B]  rounded-[20px] py-1.5 lg:py-2 pl-2 pr-4">
                <span
                  onClick={() => setOpenEngagementMenu(true)}
                  className="cursor-pointer"
                >
                  <img src={dropdown_menu} alt="" />
                </span>
              </button>
              {openEngagementMenu && (
                <PostEngagementMenu
                  setEngagementMenu={setOpenEngagementMenu}
                />
              )}
            </div>

            <div className="text-[#454545] text-[14px]">
              {pings.surgeCount || pings._count.surges} Surges
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPingCard;
