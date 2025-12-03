import { type ReactNode } from "react";
import filters from "../assets/images/filters.svg";

interface pageHeaderProps {
  heading: string;
  children?: ReactNode;
}

const PageTitleBar = ({ heading, children }: pageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mx-[15px] md:mx-[55px] mt-[15px] ">
      <h3 className="text-[22px] font-semibold ">{heading}</h3>
      <div className="flex items-center gap-[19px]">
        <span className="flex items-center gap-1">
          <img src={filters} alt="" className="inline" />
          <p className=" text-[#B29494] text-[15px] inline ">Filters</p>
        </span>
        {children}
      </div>
    </div>
  );
};

export default PageTitleBar;
