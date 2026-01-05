import { useState, type ReactNode } from "react";
import { FaLink } from "react-icons/fa6";
import CategorySelector from "./CategorySelector";
import PostSuccessModal from "./PostSuccessModal";
import { v4 as uuidv4 } from "uuid";
import { waveService } from "../api/services";
import type { Category } from "../api/types/index";

interface Props {
  children: ReactNode;
  setWaveFormDetails: React.Dispatch<React.SetStateAction<WaveFormDetails[]>>;
  setWaveForm: () => void;
  formSegment: string;
  setFormSegment: () => void;
  onSuccess?: () => void;
}

export interface WaveFormDetails {
  cat: string;
  formSegment: string;
  solution: string;
  createdAt: string;
  waveTitle: string;
  id: string;
  waveDesc: string;
}

const WaveFormModal = ({
  children,
  setWaveFormDetails,
  setWaveForm,
  setFormSegment,
  formSegment,
  onSuccess,
}: Props) => {
  const [waveFormData, setWaveFormData] = useState({
    cat: "",
    waveDesc: "",
    waveTitle: "",
    solution: "",
    id: "",
    formSegment: "wave",
  } as WaveFormDetails);

  const [postSuccessModal, setPostSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitForm() {
    if (waveFormData.cat === "") return alert("Select a category!");

    setIsSubmitting(true);
    setError(null);

    try {
      // Note: The backend currently requires waves to be created for specific pings
      // via POST /api/pings/:pingId/waves, not as standalone entities.
      // This is a temporary workaround - waves should be proposed from ping cards.
      setError("Waves must be proposed from existing pings. Please go to the Soundboard and propose a wave for a specific ping.");
      setIsSubmitting(false);
      return;

      // TODO: Once backend supports standalone waves, uncomment this:
      // const createdWave = await waveService.createWave({
      //   title: waveFormData.waveTitle.trim(),
      //   description: waveFormData.waveDesc.trim(),
      //   solution: waveFormData.solution.trim(),
      //   category: waveFormData.cat as Category,
      // });
      // console.log("Wave created successfully:", createdWave);

      // TODO: Once backend supports standalone waves, uncomment below:

      // OBJECT TO BE DISPLAYED LOCALLY:
      // const newWaveFormDetails: WaveFormDetails = {
      //   cat: waveFormData.cat.trim(),
      //   waveTitle: waveFormData.waveTitle.trim(),
      //   waveDesc: waveFormData.waveDesc.trim(),
      //   formSegment: waveFormData.formSegment,
      //   solution: waveFormData.solution.trim(),
      //   id: createdWave.id.toString() || uuidv4(),
      //   createdAt: new Date()
      //     .toLocaleString("en-US", {
      //       month: "short",
      //       day: "2-digit",
      //       hour: "2-digit",
      //       minute: "2-digit",
      //       hour12: true,
      //     })
      //     .toLowerCase(),
      // };

      // // Add to local state if it's a wave
      // if (waveFormData.formSegment === "wave") {
      //   setWaveFormDetails((prev) => [newWaveFormDetails, ...prev]);
      // }

      // // Call onSuccess callback to refresh parent data
      // if (onSuccess) {
      //   onSuccess();
      // }

      // // SET SUCCESS MODAL ACTIVE
      // setPostSuccessModal(!postSuccessModal);

      // // RESET WAVEFORM
      // setWaveFormData({
      //   cat: "",
      //   waveDesc: "",
      //   id: "",
      //   waveTitle: "",
      //   solution: "",
      //   formSegment: "wave",
      //   createdAt: "",
      // });
    } catch (err: any) {
      console.error("Error creating wave:", err);
      setError(err.response?.data?.error || "Failed to create wave. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (postSuccessModal)
    return (
      <PostSuccessModal
        formSegment={waveFormData.formSegment}
        setPostSuccessModal={() => {
          setPostSuccessModal(!postSuccessModal);
          setWaveForm();
        }}
      />
    );

  return (
    <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
      <div className=" mx-5 shadow-2xl rounded-4xl px-[25px] py-2.5 max-w-[480px] md:p-[30px] bg-white gap-4 overflow-hidden text-[32px] font-poppins flex  flex-col items-center">
        <h2 className="font-semibold text-center text-[20px] md:text-[32px]">
          What Kind of Post?
        </h2>
        <div className="flex rounded-[20px] text-[16px] overflow-hidden border-2 border-black">
          <button
            onClick={setFormSegment}
            className={`inline-block rounded-tl-[15px] border-black rounded-bl-[15px] border-r-2 ${formSegment === "ping"
              ? "bg-[#F49B31] text-white"
              : "bg-[#FEF5EA]"
              }  py-6 px-6 cursor-pointer sm:py-4 sm:px-8`}
          >
            Ping
          </button>
          <button
            className={`inline-block ${formSegment === "wave"
              ? "bg-[#F49B31] text-white"
              : "bg-[#FEF5EA]"
              } rounded-tr-[15px] cursor-pointer text-black rounded-br-[15px] py-6 px-6  sm:py-4 sm:px-8`}
          >
            Wave
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
          className="w-full text-[14px] justify-center items-center flex flex-col gap-5"
        >
          {/* Error Message */}
          {error && (
            <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* ModalForm INPUT GROUP: */}
          <fieldset className=" w-full  text-[14px] flex flex-col gap-5">
            <div className="flex p-2.5 w-full py-3 border border-black rounded-[10px]">
              <label htmlFor="waveTitle">Title :</label>
              <input
                type="text"
                id="waveTitle"
                name="waveTitle"
                required
                placeholder="name, header..."
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
                onChange={(e) =>
                  setWaveFormData({
                    ...waveFormData,
                    waveTitle: e.target.value,
                  })
                }
                value={waveFormData.waveTitle}
                autoComplete="off"
              />
            </div>
            <div className="flex p-2.5 py-3 border border-black rounded-[10px] ">
              <label htmlFor="waveDescription">Description :</label>
              <textarea
                id="waveDescription"
                name="waveDescription"
                placeholder="What's the issue?"
                required
                autoComplete="off"
                onChange={(e) =>
                  setWaveFormData({ ...waveFormData, waveDesc: e.target.value })
                }
                value={waveFormData.waveDesc}
                className="pl-[11px] py-0.5 resize-none h-[100px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>

            <div className="flex p-2.5 py-3 border border-black rounded-[10px]">
              <label htmlFor="solution">Solution :</label>
              <textarea
                id="solution"
                name="solution"
                required
                placeholder="What can be done?"
                autoComplete="off"
                onChange={(e) =>
                  setWaveFormData({ ...waveFormData, solution: e.target.value })
                }
                value={waveFormData.solution}
                className="pl-[11px] py-0.5 resize-none h-[100px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>
          </fieldset>

          <div className="overflow-y-scroll [scrollbar-width:none] w-full">
            <CategorySelector
              category={waveFormData.cat}
              setFormData={(cat) =>
                setWaveFormData({ ...waveFormData, cat: cat })
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
              className={`px-[30px] hover:bg-[#d88429] transition-colors duration-300 ease-in-out py-[5px] cursor-pointer text-white rounded-xl bg-[#F49B31] ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {isSubmitting ? "Posting..." : "Post"}
            </button>
          </div>
        </form>
        {children}
      </div>
    </div>
  );
};

export default WaveFormModal;
