import filters from "../assets/images/filters.svg";
import create from "../assets/images/Create.svg";

interface pageHeaderProps {
  heading: string;
}

const PageTitleBar = ({ heading }: pageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mx-[55px] mt-[15px] ">
      <h3 className="text-[22px] font-semibold ">{heading}</h3>
      <div className="flex items-center gap-[19px]">
        <span className="flex items-center gap-1">
          <img src={filters} alt="" className="inline" />
          <p className=" text-[#B29494] text-[15px] inline ">Filters</p>
        </span>
        <img
          src={create}
          alt=""
          className="w-[50px] cursor-pointer h-[50px] rounded-full"
        />
      </div>
    </div>
  );
};

export default PageTitleBar;
