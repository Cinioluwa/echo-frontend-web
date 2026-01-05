import { useState } from "react";
import { FaLink } from "react-icons/fa6";
import CategorySelector from "./CategorySelector";
import ProposedPingCard from "./ProposedPingCard";
import { waveService } from "../api/services";

interface Props {
  onClose: () => void;
  pingTimeStamp: string | undefined;
  pingTitle?: string | undefined;
  pingId?: string;
  setProposeActive: React.Dispatch<React.SetStateAction<boolean>>;
  onWaveCreated?: () => void;
}

export interface proposedWaveDetails {
  solution: string;
  cat: string;
  catId: number;
  pingTimeStamp: string | undefined;
  pingTitle: string | undefined;
  createdAt: string;
}

const ProposeWaveModal = ({
  onClose,
  pingTitle,
  pingTimeStamp,
  pingId,
  setProposeActive,
  onWaveCreated,
}: Props) => {
  const [proposedWaveDetails, setProposedWaveDetails] =
    useState<proposedWaveDetails>({
      solution: "",
      cat: "",
      catId: 0,
      pingTimeStamp: "",
      pingTitle: "",
      createdAt: "",
    });

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (proposedWaveDetails.catId === 0 || !proposedWaveDetails.cat) {
      return alert("Select a category!");
    }

    if (!pingId) {
      alert("Ping ID is missing. Cannot create wave.");
      return;
    }

    setIsSubmitting(true);

    try {
      // CREATE WAVE VIA API - Using the ping-specific endpoint
      const createdWave = await waveService.createWaveForPing(
        pingId,
        proposedWaveDetails.solution.trim()
      );

      console.log("Wave created successfully:", createdWave);

      // RESET FORM
      setProposedWaveDetails({
        solution: "",
        cat: "",
        catId: 0,
        pingTimeStamp: "",
        pingTitle: "",
        createdAt: "",
      });

      // UPDATE PROPOSE-btn STATE
      setProposeActive(true);

      // TRIGGER REFRESH IF CALLBACK PROVIDED
      if (onWaveCreated) {
        onWaveCreated();
      }

      // CLOSE MODAL
      onClose();
    } catch (err: any) {
      console.error("Error creating wave:", err);
      alert(err.response?.data?.error || "Failed to create wave. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
      <div className=" mx-5 shadow-2xl rounded-4xl px-[25px] py-2.5 md:p-[30px] bg-white gap-4 overflow-hidden text-[32px] font-poppins flex  flex-col items-center">
        <h2 className="font-semibold text-center text-[20px] md:text-[32px]">
          Proposing a wave
        </h2>

        <ProposedPingCard pingTimeStamp={pingTimeStamp} pingTitle={pingTitle} />

        <div className="flex rounded-[20px] gap-0 text-[16px] ">
          <button
            disabled
            className={`inline-block rounded-tl-[20px] border-r-0 border-2 text-gray-400 rounded-bl-[20px] border-gray-400 py-6 px-6  sm:py-4 sm:px-8`}
          >
            Ping
          </button>
          <button
            disabled
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
            <div className="flex px-[11px] h-[200px]  py-3 border border-black rounded-[10px]">
              <label htmlFor="proposeWaveSolution">Solution :</label>
              <textarea
                id="proposeWaveSolution"
                name="solution"
                required
                placeholder="What can be done?"
                autoComplete="off"
                onChange={(e) =>
                  setProposedWaveDetails({
                    ...proposedWaveDetails,
                    solution: e.target.value,
                  })
                }
                value={proposedWaveDetails.solution}
                className="pl-[11px] py-0.5 resize-none text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>
          </fieldset>
          <div className="overflow-y-scroll [scrollbar-width:none] w-full">
            <CategorySelector
              categoryId={proposedWaveDetails.catId}
              setFormData={(catId, catName) =>
                setProposedWaveDetails({ ...proposedWaveDetails, catId: catId, cat: catName })
              }
            />
          </div>
          <div className="w-full flex justify-between">
            <div className="cursor-pointer">
              <FaLink fontSize={30} color="#F49B31" />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-[30px] hover:bg-[#d88429] text-[12px] transition-colors duration-300 ease-in-out py-[5px] cursor-pointer text-white rounded-xl bg-[#F49B31] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
        <button
          onClick={onClose}
          className="text-[13px] underline cursor-pointer"
        >
          cancel
        </button>
      </div>
    </div>
  );
};

export default ProposeWaveModal;
