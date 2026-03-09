const cardProfile = "/assets/images/wavecardprofile.svg";
const surge = "/assets/images/surge.svg";
const reaction = "/assets/images/reaction.svg";
const waveMenu = "/assets/images/waveMenu.svg";
const dropdown = "/assets/images/customDropdown.svg";
const dropdown_menu = "/assets/images/dropdown_menu.svg";
import { categoryImages } from "../../components/CategoryImages";
import type { PingFormDetails } from "../../components/PingFormModal";
import { useState } from "react";
import PostActionMenu from "./PostActionMenu";
import PostEngagementMenu from "./PostEngagementMenu";

interface AdminPingCardProps {
  pings: PingFormDetails;
  onUpdate?: () => void;
}

const AdminPingCard = ({ pings, onUpdate }: AdminPingCardProps) => {
  const [acknowledged, setAcknowledged] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openEngagementMenu, setOpenEngagementMenu] = useState(false);

  return (
    <div className="relative">
      <div className="m-[15px] md:m-0 px-[25px] py-2.5 bg-[#FEFEFE]  rounded-[10px] ">
        <div className="flex justify-between items-center">
          <div className="flex mb-6 mt-2 items-center gap-3">
            <span className="cursor-pointer">
              <img src={dropdown} alt="" />
            </span>
            <p className="text-[14px] font-semibold">{pings.pingTitle}</p>
          </div>

          <span onClick={() => setOpenMenu(true)} className="cursor-pointer">
            <img src={waveMenu} alt="" />
          </span>

          {openMenu && <PostActionMenu setOpenMenu={setOpenMenu} />}
        </div>

        <div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-6 ">
              <img src={cardProfile} alt="" />
              <div className="flex flex-col">
                <span className="text-[15px] whitespace-normal sm:whitespace-nowrap inline-block max-w-3 font-semibold">
                  Covenant Smith
                </span>
                <span className="text-[#8B8E8D] text-[13px]">
                  {pings.createdAt}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-[13px]">
              <span>
                <img src={categoryImages[pings.cat]} alt="" />
              </span>
              {pings.cat}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 my-4">
          <p className="text-[#626665] text-[15px] border-b border-[#D3CECE] pb-4">
            {pings.pingDesc}
          </p>
        </div>

        <div className="flex justify-end items-center ">
          <div className="flex gap-4 items-center">
            <div className=" items-center cursor-pointer gap-1 hidden lg:flex">
              <img src={reaction} alt="" />
              <span>3</span> comments
            </div>

            <div className="flex bg-[#EF6E0B] rounded-[20px]">
              <button
                onClick={() => setAcknowledged(!acknowledged)}
                className={`transition-colors cursor-pointer duration-1200 ease-in-out ${acknowledged
                    ? "bg-[#F49B31] hover:bg-[#d88429] transition-colors duration-100 ease-out text-white font-bold"
                    : "bg-[#FEF5EA] transition-colors duration-100 ease-in-out hover:bg-[#f2e8d9]"
                  } py-1.5 lg:py-2 lg:px-5 flex text-[12px]  font-bold items-center gap-2.5 border rounded-[20px] px-5`}
              >
                <img
                  src={surge}
                  alt=""
                  className={`${acknowledged ? "brightness-0 invert" : ""
                    } w-[50%] contrast-200 md:w-full`}
                />
                ACKNOWLEDGE
              </button>

              <button className="bg-[#EF6E0B]  rounded-[20px] py-1.5 lg:py-2 pl-2 pr-4">
                <span onClick={() => setOpenEngagementMenu(true)} className="cursor-pointer">
                  <img src={dropdown_menu} alt="" />
                </span>
              </button>
              {openEngagementMenu && <PostEngagementMenu setEngagementMenu={setOpenEngagementMenu} />}
            </div>

            <div className="text-[#454545] text-[14px]">128 Surges</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPingCard;
