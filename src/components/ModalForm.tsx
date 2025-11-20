import { useState, type ReactNode } from "react";
import { FaLink } from "react-icons/fa6";
import Toggle from "./Toggle";
import CategorySelector from "./CategorySelector";
import { v4 as uuidv4 } from "uuid";
import PostSuccessModal from "./PostSuccessModal";

interface Props {
  children: ReactNode;
  setPingFormDetails: React.Dispatch<React.SetStateAction<modalFormDetails[]>>;
  setPingForm: () => void;
}

export interface modalFormDetails {
  cat: string;
  formSegment: string;
  anonymous: boolean;
  pingDesc: string;
  hashtag: string;
  solution: string;
  pingTitle: string;
  createdAt: string;
  id: string;
  waveTitle: string;
  waveDesc: string;
}

const ModalForm = ({ children, setPingFormDetails, setPingForm }: Props) => {
  const [formData, setFormData] = useState({
    cat: "",
    anonymous: false,
    pingDesc: "",
    waveDesc: "",
    hashtag: "",
    pingTitle: "",
    waveTitle: "",
    solution: "",
    formSegment: "ping",
  } as modalFormDetails);

  const [postSuccessModal, setPostSuccessModal] = useState(false);

  function submitForm() {
    if (formData.cat === "") return alert("Select a category!");

    const newModalFormDetails: modalFormDetails = {
      cat: formData.cat.trim(),
      waveTitle: formData.waveTitle.trim(),
      waveDesc: formData.waveDesc.trim(),
      formSegment: formData.formSegment,
      anonymous: formData.anonymous,
      pingTitle: formData.pingTitle.trim(),
      hashtag: formData.hashtag.trim(),
      pingDesc: formData.pingDesc.trim(),
      solution: formData.solution.trim(),
      id: uuidv4(),
      createdAt: new Date()
        .toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .toLowerCase(),
    };

    formData.formSegment === "ping"
      ? setPingFormDetails((prev) => [...prev, newModalFormDetails])
      : "";
    setPostSuccessModal(!postSuccessModal);

    console.log("modalFormDetails: ", newModalFormDetails);
  }

  if (postSuccessModal)
    return (
      <PostSuccessModal
        formSegment={formData.formSegment}
        setPostSuccessModal={() => {
          setPostSuccessModal(!postSuccessModal);
          setPingForm();
        }}
      />
    );

  return (
    <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
      <div className=" mx-5 shadow-2xl rounded-4xl px-[25px] py-2.5 md:p-[30px] bg-white gap-4 overflow-hidden text-[32px] font-poppins flex  flex-col items-center">
        <h2 className="font-semibold text-center text-[20px] md:text-[32px]">
          What Kind of Post?
        </h2>
        <div className="flex rounded-[20px] text-[16px] overflow-hidden border-2 border-black">
          <span
            onClick={() => setFormData({ ...formData, formSegment: "ping" })}
            className={`inline-block rounded-tl-[15px] border-black rounded-bl-[15px] border-r-2 ${
              formData.formSegment === "ping"
                ? "bg-[#F49B31] text-white"
                : "bg-[#FEF5EA]"
            }  py-6 px-6  sm:py-4 sm:px-8`}
          >
            Ping
          </span>
          <span
            onClick={() => setFormData({ ...formData, formSegment: "wave" })}
            className={`inline-block ${
              formData.formSegment === "wave"
                ? "bg-[#F49B31] text-white"
                : "bg-[#FEF5EA]"
            } rounded-tr-[15px] text-black rounded-br-[15px] py-6 px-6  sm:py-4 sm:px-8`}
          >
            Wave
          </span>
        </div>
        <div className={`${formData.formSegment === "wave" && "hidden"}`}>
          <Toggle
            checked={formData.anonymous}
            onChange={() =>
              setFormData({ ...formData, anonymous: !formData.anonymous })
            }
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
          action=""
          className="w-full text-[14px] max-w-[480px] justify-center items-center flex flex-col gap-5"
        >
          {/* PingForm input group */}

          <fieldset className=" w-full  text-[14px] flex flex-col gap-5">
            <div
              className={`flex px-[11px] py-3 border border-black rounded-[10px]  ${
                formData.formSegment === "wave" && "hidden"
              }`}
            >
              <label htmlFor="pingTitle">Title :</label>
              <input
                type="text"
                id="pingTitle"
                name="pingTitle"
                placeholder="name, header..."
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
                onChange={(e) =>
                  setFormData({ ...formData, pingTitle: e.target.value })
                }
                value={formData.pingTitle}
                autoComplete="off"
              />
            </div>
            <div
              className={`flex px-[11px] py-3 border border-black rounded-[10px]  ${
                formData.formSegment === "ping" && "hidden"
              }`}
            >
              <label htmlFor="waveTitle">Title :</label>
              <input
                type="text"
                id="waveTitle"
                name="waveTitle"
                placeholder="name, header..."
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
                onChange={(e) =>
                  setFormData({ ...formData, waveTitle: e.target.value })
                }
                value={formData.waveTitle}
                autoComplete="off"
              />
            </div>
            <div
              className={`flex px-[11px] py-3 border border-black rounded-[10px]  ${
                formData.formSegment === "ping" && "hidden"
              }`}
            >
              <label htmlFor="waveDescription">Description :</label>
              <textarea
                id="waveDescription"
                name="waveDescription"
                placeholder="What's the issue?"
                autoComplete="off"
                onChange={(e) =>
                  setFormData({ ...formData, waveDesc: e.target.value })
                }
                value={formData.waveDesc}
                className="pl-[11px] py-0.5 resize-none h-[100px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>
            <div
              className={`${
                formData.formSegment === "wave" && "hidden"
              } flex px-[11px] py-3 border border-black rounded-[10px]`}
            >
              <label htmlFor="pingDescription">Description :</label>
              <input
                type="text"
                name="pingDescription"
                id="pingDescription"
                placeholder="What's the issue?"
                autoComplete="off"
                onChange={(e) =>
                  setFormData({ ...formData, pingDesc: e.target.value })
                }
                value={formData.pingDesc}
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>
            <div
              className={`flex px-[11px] py-3 border border-black rounded-[10px]  ${
                formData.formSegment === "ping" && "hidden"
              }`}
            >
              <label htmlFor="solution">Solution :</label>
              <textarea
                id="solution"
                name="solution"
                placeholder="What can be done?"
                autoComplete="off"
                onChange={(e) =>
                  setFormData({ ...formData, solution: e.target.value })
                }
                value={formData.solution}
                className="pl-[11px] py-0.5 resize-none h-[100px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>
            <div
              className={`flex px-[11px] py-3 border items-center border-black rounded-[10px]  ${
                formData.formSegment === "wave" && "hidden"
              }`}
            >
              <label htmlFor="hashtag">Hashtag :</label>
              <input
                type="text"
                id="Hashtag"
                name="hashtag"
                placeholder="What can be done?"
                autoComplete="off"
                onChange={(e) =>
                  setFormData({ ...formData, hashtag: e.target.value })
                }
                value={formData.hashtag}
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>
          </fieldset>

          <div className="overflow-y-scroll [scrollbar-width:none] w-full">
            <CategorySelector
              category={formData.cat}
              setFormData={(cat) => setFormData({ ...formData, cat: cat })}
            />
          </div>
          <div className="w-full flex justify-between">
            <div className="cursor-pointer">
              <FaLink fontSize={30} color="#F49B31" />
            </div>
            <button
              type="submit"
              className="px-[30px] hover:bg-[#d88429] transition-colors duration-300 ease-in-out py-[5px] cursor-pointer text-white rounded-xl bg-[#F49B31]"
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

export default ModalForm;
