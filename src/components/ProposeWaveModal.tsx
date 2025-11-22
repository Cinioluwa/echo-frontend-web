import { useState } from "react";
import { FaLink } from "react-icons/fa6";
import CategorySelector from "./CategorySelector";
import ProposedPingCard from "./ProposedPingCard";

interface Props {
  onClose: () => void;
  timeStamp: string | undefined;
  pingTitle: String | undefined;
  setProposeActive: React.Dispatch<React.SetStateAction<boolean>>;
}

const ProposeWaveModal = ({ onClose, pingTitle, timeStamp, setProposeActive }: Props) => {

function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setProposeActive(true)
}

  const [propoposeWaveSoultion, setProposeWaveSolution] = useState("");

  return (
    <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
      <div className=" mx-5 shadow-2xl rounded-4xl px-[25px] py-2.5 md:p-[30px] bg-white gap-4 overflow-hidden text-[32px] font-poppins flex  flex-col items-center">
        <h2 className="font-semibold text-center text-[20px] md:text-[32px]">
          Proposing a wave
        </h2>

        <ProposedPingCard timeStamp={timeStamp} pingTitle={pingTitle} />

        <div className="flex rounded-[20px] gap-0 text-[16px] ">
          <button
            disabled
            className={`inline-block rounded-tl-[20px] border-r-0 border-2 text-gray-400 rounded-bl-[20px] border-gray-400 py-6 px-6  sm:py-4 sm:px-8`}
          >
            Ping
          </button>
          <button
            className={`inline-block rounded-tr-[20px] text-white bg-[#F49B31] border-[#454545] border-2 border-l rounded-br-[20px] py-6 px-6  sm:py-4 sm:px-8`}
          >
            Wave
          </button>
        </div>
        <form
          onSubmit={(e) => handleSubmit(e)}
          className="w-full text-[14px] max-w-[480px] justify-center items-center flex flex-col gap-5"
        >
          <fieldset className=" w-full  text-[14px] flex flex-col gap-5">
            <div className="flex px-[11px] h-[200px]  py-3 border border-black rounded-[10px]  ">
              <label htmlFor="proposeWaveSolution">Solution :</label>
              <textarea
                id="proposeWaveSolution"
                name="solution"
                required
                placeholder="What can be done?"
                autoComplete="off"
                onChange={(e) => setProposeWaveSolution(e.target.value)}
                value={propoposeWaveSoultion}
                className="pl-[11px] py-0.5 resize-none text-[12px] text-[#454545] outline-0 flex-1"
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
              className="px-[30px] hover:bg-[#d88429] text-[12px] transition-colors duration-300 ease-in-out py-[5px] cursor-pointer text-white rounded-xl bg-[#F49B31]"
            >
              Post
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-[13px] underline cursor-pointer"
          >
            cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProposeWaveModal;
