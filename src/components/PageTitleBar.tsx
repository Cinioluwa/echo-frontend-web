import filters from "../assets/images/filters.svg";
import { FaPlus } from "react-icons/fa6";

interface pageHeaderProps {
  heading: string;
}

const PageTitleBar = ({ heading }: pageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mx-[15px] md:mx-[55px] mt-[15px] ">
      <h3 className="text-[22px] font-semibold ">{heading}</h3>
      <div className="flex items-center gap-[19px]">
        <span className="flex items-center gap-1">
          <img src={filters} alt="" className="inline" />
          <p className=" text-[#B29494] text-[15px] inline ">Filters</p>
        </span>
        <div className="flex justify-center text-[13px] items-center gap-[7px] text-white rounded-[40px] bg-[#F49B31] py-2.5 px-[15px]">
          <FaPlus fontSize={20} />
          Create a ping
        </div>
      </div>
    </div>
  );
};

export default PageTitleBar;
