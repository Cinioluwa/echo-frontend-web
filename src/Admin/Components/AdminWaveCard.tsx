import cardProfile from "../../assets/images/wavecardprofile.svg";
import approve from "../../assets/images/approve.svg";
import waveMenu from "../../assets/images/waveMenu.svg";
import reject from "../../assets/images/reject.svg";
import dropdown from "../../assets/images/customDropdown.svg";
import profileImage from "../../assets/images/profileImage.jpeg";
import CollapsibleText from "../../components/CollapsibleText";
import type { proposedWaveDetails } from "../../components/ProposeWaveModal";
import { categoryImages } from "../../components/CategoryImages";

interface AdminWaveCardProps {
  waves: proposedWaveDetails;
}

const AdminWaveCard = ({ waves }: AdminWaveCardProps) => {
  return (
    <div>
      <div className="m-[15px] md:m-0 px-[25px] py-2.5 bg-[#FEFEFE]  rounded-[10px] ">
        <div className="flex justify-between items-center">
          <div className="flex mb-6 mt-2 items-center gap-3">
            <span>
              <img src={dropdown} alt="" />
            </span>
            <p className="text-[14px] font-semibold">{waves.pingTitle}</p>
          </div>

          <span>
            <img src={waveMenu} alt="" />
          </span>
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
                  {waves.createdAt}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-[13px]">
              <span>
                <img src={categoryImages[waves.cat]} alt="" />
              </span>
              {waves.cat}
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
                  Osagumwenro Ugbo
                </p>
                <p className="text-[0.62rem] md:text-[0.55rem] ">
                  {waves.pingTimeStamp}
                </p>
              </div>
            </div>
            <CollapsibleText text={waves.pingTitle} />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 my-4">
          <p className="text-[#626665] text-[15px] border-b border-[#D3CECE] pb-4">
            {waves.solution}
          </p>
        </div>

        <div className="flex  justify-between items-center ">
          <div className="flex gap-2.5 mb-2">
            <button className="flex bg-[#F49B31] cursor-pointer text-white items-center justify-center px-4 py-2 rounded-[15px] gap-2.5">
              <span>
                <img src={approve} alt="" />
              </span>
              Approve
            </button>

            <button className="flex bg-[#B01212] cursor-pointer text-white items-center justify-center pr-7 pl-4 py-2 rounded-[15px] gap-2.5">
              <span>
                <img src={reject} alt="" />
              </span>
              Reject
            </button>
          </div>

          <div className="text-[#454545] text-[14px]">192 Surges</div>
        </div>
      </div>
    </div>
  );
};

export default AdminWaveCard;
