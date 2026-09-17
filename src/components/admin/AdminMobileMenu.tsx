import React from "react";
import { Link } from "react-router-dom";
import { useAdminPage } from "../../contexts/AdminPageContext";

const soundboard = "/assets/icon/admin-soundboard.svg";
const moderation = "/assets/icon/moderation.svg";
const followUp = "/assets/icon/followup.svg";
const setting = "/assets/icon/admin-settings.svg";
const profile = "/assets/icon/gear.svg";
interface Props {
  setMenu: React.Dispatch<React.SetStateAction<boolean>>;
  menu: boolean;
}

const AdminMobileMenu = ({ setMenu, menu }: Props) => {
  const { pages, setCurrentPage } = useAdminPage();

  const iconClass = (active: boolean) =>
    `w-5 h-5 ${active ? "brightness-0 invert" : ""}`;

  function handleClick() {
    setMenu(false);
  }

  return (
    <div
      onClick={handleClick}
      className={`${menu ? "opacity-100" : "opacity-0 pointer-events-none"
        } fixed transition-opacity duration-300 z-20 ease-in inset-0 bg-black/40 md:hidden`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${menu ? "translate-x-0" : "-translate-x-full"
          } transition-transform transform duration-300 ease-in-out w-[190px] top-[100px] flex flex-col gap-[15px] bg-white p-2 rounded-r-xl absolute left-0  py-[15px]`}
      >
        <Link to={"/admin/soundboard"}>
          <button
            onClick={() => {
              setCurrentPage("soundboard");
              handleClick();
            }}
            className={`flex items-center ${pages.soundboard
              ? "bg-[#FFC37B] border-0"
              : "bg-transparent border-2"
              }  gap-3 py-[9px] w-full transition  cursor-pointer  ease-in-out duration-700 text-[15px] border-[#F49B31] rounded-[25px]`}
          >
            <span className="ml-6">
              <img src={soundboard} alt="" className={iconClass(pages.soundboard)} />
            </span>
            Soundboard
          </button>
        </Link>
        <Link to={"/admin/followUp"}>
          <button
            onClick={() => {
              setCurrentPage("followUp");
              handleClick();
            }}
            className={`flex items-center ${pages.followUp
              ? "bg-[#FFC37B] border-0"
              : "bg-transparent border-2"
              }  gap-3 py-[9px] text-[15px] transition w-full cursor-pointer  ease-in-out duration-700 border-[#F49B31] rounded-[25px]`}
          >
            <span className="ml-6">
              <img src={followUp} alt="" className={iconClass(pages.followUp)} />
            </span>
            Follow Up
          </button>
        </Link>
        <Link to={"/admin/moderation"}>
          <button
            onClick={() => {
              setCurrentPage("moderation");
              handleClick();
            }}
            className={`flex items-center ${pages.moderation
              ? "bg-[#FFC37B] border-0"
              : "bg-transparent border-2"
              }  gap-3 py-[9px] w-full transition cursor-pointer ease-in-out duration-700 text-[15px] border-[#F49B31] rounded-[25px]`}
          >
            <span className="ml-6">
              <img src={moderation} alt="" className={iconClass(pages.moderation)} />
            </span>
            Moderation
          </button>
        </Link>
        <Link to={"/admin/settings"}>
          <button
            onClick={() => {
              setCurrentPage("settings");
              handleClick();
            }}
            className={`flex items-center ${pages.settings
              ? "bg-[#FFC37B] border-0"
              : "bg-transparent border-2"
              }  gap-3 py-[9px] w-full transition cursor-pointer ease-in-out duration-700 text-[15px] border-[#F49B31] rounded-[25px]`}
          >
            <span className="ml-6">
              <img src={setting} alt="" className={iconClass(pages.settings)} />
            </span>
            Settings
          </button>
        </Link>
        <Link to={"/admin/profile"}>
          <button
            onClick={() => {
              setCurrentPage("profile");
              handleClick();
            }}
            className={`flex items-center ${pages.profile
              ? "bg-[#FFC37B] border-0"
              : "bg-transparent border-2"
              }  gap-3 py-[9px] w-full transition cursor-pointer ease-in-out duration-700 text-[15px] border-[#F49B31] rounded-[25px]`}
          >
            <span className="ml-6">
              <img src={profile} alt="" className={iconClass(pages.profile)} />
            </span>
            Profile
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AdminMobileMenu;
