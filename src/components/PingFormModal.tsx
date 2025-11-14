import { useState, type ReactNode } from "react";
import { FaLink } from "react-icons/fa6";
import Toggle from "./Toggle";
import CategorySelector from "./CategorySelector";

interface Props {
  children: ReactNode;
}



const PingFormModal = ({ children }: Props) => {
  const [formSegment, setFormSegment] = useState("ping");

  return (
    <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
      <div className=" mx-5 rounded-4xl p-[25px] md:p-[30px] bg-white gap-7 overflow-hidden text-[32px] font-poppins flex  flex-col items-center">
        <h2 className="font-semibold text-center">What Kind of Post?</h2>
        <div className="flex rounded-[35px] text-[16px] overflow-hidden border-2 border-black">
          <span
            onClick={() => setFormSegment("ping")}
            className={`inline-block rounded-tl-[25px] border-black rounded-bl-[25px] border-r-2 ${
              formSegment === "ping"
                ? "bg-[#F49B31] text-white"
                : "bg-[#FEF5EA]"
            }  py-6 px-8  sm:py-6 sm:px-10`}
          >
            Ping
          </span>
          <span
            onClick={() => setFormSegment("wave")}
            className={`inline-block ${
              formSegment === "wave"
                ? "bg-[#F49B31] text-white"
                : "bg-[#FEF5EA]"
            } rounded-tr-[25px] text-black rounded-br-[25px] py-6 px-8  sm:py-6 md:px-10`}
          >
            Wave
          </span>
        </div>
        <Toggle />
        <form
          onSubmit={(e) => e.preventDefault()}
          action=""
          className="w-full text-[14px] max-w-[480px] justify-center items-center flex flex-col gap-5"
        >
          {/* PingForm input group */}
          <fieldset className=" w-full  text-[14px] flex flex-col gap-7">
            <div className="flex px-[11px] py-3 border border-black rounded-[10px] ">
              <label htmlFor="title">Title :</label>
              <input
                type="text"
                id="title"
                required
                placeholder="name, header..."
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
                autoComplete="off"
              />
            </div>
            <div className="flex px-[11px] py-3 border border-black rounded-[10px] ">
              <label htmlFor="description">Description :</label>
              <input
                type="text"
                id="description"
                placeholder="What's the issue?"
                autoComplete="off"
                required
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>
            <div className="flex px-[11px] py-3 border border-black rounded-[10px] ">
              <label htmlFor="hashtag">Hashtag :</label>
              <input
                type="text"
                id="hashtag"
                required
                placeholder="What's the current movement?"
                autoComplete="off"
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>
          </fieldset>

          <div className="overflow-y-scroll [scrollbar-width:none] w-full">
            <CategorySelector />
          </div>

          <div className="w-full flex justify-between">
            <div className="cursor-pointer">
              <FaLink fontSize={30} color="#F49B31" />
            </div>
            <button
              type="submit"
              className="px-[30px] py-[5px] cursor-pointer text-white hover:transform active:translate-y-1 rounded-xl bg-[#F49B31]"
            >
              Post
            </button>
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default PingFormModal;
