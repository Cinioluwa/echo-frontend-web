import feed from "../../assets/images/History Logo.svg";
import overview from "../../assets/images/overview.svg";
import followUp from "../../assets/images/followUp.svg";
import { Link } from "react-router-dom";
import Categories from "../../components/Categories";

export interface AdminPages {
  feedActive: boolean;
  overviewActive: boolean;
  followUpActive: boolean;
}

interface Props {
  setActivePage: React.Dispatch<React.SetStateAction<AdminPages>>;
  pages: AdminPages;
}

const AdminSideBar = ({ pages, setActivePage }: Props) => {
  return (
    <div>
      <div className="bg-[#FFC37B]  rounded-[10px]">
        <Categories />
      </div>
      <div className="mt-[15px]">
        <Link to={"/admin/feed"}>
          <button
            onClick={() =>
              setActivePage({
                feedActive: true,
                overviewActive: false,
                followUpActive: false,
              })
            }
            className={`flex items-center ${
              pages.feedActive
                ? "bg-[#FFC37B] border-0"
                : "bg-transparent border-2"
            }  gap-3 py-[13px] w-full transition  cursor-pointer mb-3.5 ease-in-out duration-700 border-[#F49B31] rounded-[15px]`}
          >
            <span className="ml-6">
              <img src={feed} alt="" />
            </span>
            Feed
          </button>
        </Link>

        <Link to={"/admin/overview"}>
          <button
            onClick={() =>
              setActivePage({
                feedActive: false,
                overviewActive: true,
                followUpActive: false,
              })
            }
            className={`flex items-center ${
              pages.overviewActive
                ? "bg-[#FFC37B] border-0"
                : "bg-transparent border-2"
            }  gap-3 py-[13px] transition w-full cursor-pointer mb-3.5 ease-in-out duration-700 border-[#F49B31] rounded-[15px]`}
          >
            <span className="ml-6">
              <img src={overview} alt="" />
            </span>
            Overview
          </button>
        </Link>
        <Link to={"/admin/followUp"}>
          <button
            onClick={() =>
              setActivePage({
                feedActive: false,
                overviewActive: false,
                followUpActive: true,
              })
            }
            className={`flex items-center ${
              pages.followUpActive
                ? "bg-[#FFC37B] border-0"
                : "bg-transparent border-2"
            }  gap-3 py-[13px] w-full transition  cursor-pointer ease-in-out duration-700 border-[#F49B31] rounded-[15px]`}
          >
            <span className="ml-6">
              <img src={followUp} alt="" />
            </span>
            Follow up
          </button>
        </Link>
        <div></div>
      </div>
    </div>
  );
};

export default AdminSideBar;
