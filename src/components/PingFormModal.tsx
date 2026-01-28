import { useState, type ReactNode } from "react";
import { FaLink } from "react-icons/fa6";
import Toggle from "./Toggle";
import CategorySelector from "./CategorySelector";
import { v4 as uuidv4 } from "uuid";
import PostSuccessModal from "./PostSuccessModal";
import usePingStore from "../services/pingStore";

interface Props {
  children: ReactNode;
  setPingForm: () => void;
  formSegment: string;
  setFormSegment: () => void;
}

export interface PingFormDetails {
  cat: string;
  formSegment: string;
  anonymous: boolean;
  pingDesc: string;
  hashtag: string;
  pingTitle: string;
  createdAt: string;
  id: string;
}

const PingFormModal = ({
  children,
  setPingForm,
  setFormSegment,
  formSegment,
}: Props) => {
  const [pingFormData, setPingFormData] = useState<PingFormDetails>({
    cat: "",
    anonymous: false,
    pingDesc: "",
    hashtag: "",
    pingTitle: "",
    formSegment: "ping",
    createdAt: "",
    id: "",
  });

  const [postSuccessModal, setPostSuccessModal] = useState(false);

  const setPing = usePingStore((s) => s.setPings);

  function submitForm() {
    if (pingFormData.cat === "") return alert("Select a category!");

    //PingForm DETAILS OBJECT TO BE SENT TO SERVER:
    const newPingFormDetails: PingFormDetails = {
      cat: pingFormData.cat.trim(),
      formSegment: pingFormData.formSegment,
      anonymous: pingFormData.anonymous,
      pingTitle: pingFormData.pingTitle.trim(),
      hashtag: pingFormData.hashtag.trim(),
      pingDesc: pingFormData.pingDesc.trim(),
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

    setPing(newPingFormDetails);

    // SET SUCCESS MODAL ACTIVE
    setPostSuccessModal(!postSuccessModal);

    // VERIFY THE PINGFORM DETAILS
    console.log("pingFormDetails: ", newPingFormDetails);

    // RESET THE PINGFORM
    setPingFormData({
      cat: "",
      anonymous: false,
      pingDesc: "",
      hashtag: "",
      pingTitle: "",
      formSegment: "ping",
      createdAt: "",
      id: "",
    });
  }

  if (postSuccessModal)
    return (
      <PostSuccessModal
        formSegment={pingFormData.formSegment}
        setPostSuccessModal={() => {
          setPostSuccessModal(!postSuccessModal);
          setPingForm();
        }}
      />
    );

  return (
    <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
      <div className=" mx-5 shadow-2xl max-w-[480px] rounded-4xl px-[25px] py-2.5 md:p-[30px] bg-white gap-4 overflow-hidden text-[32px] font-poppins flex  flex-col items-center">
        <h2 className="font-semibold text-center text-[20px] md:text-[32px]">
          What Kind of Post?
        </h2>
        <div className="flex rounded-[20px] text-[16px] overflow-hidden border-2 border-black">
          <button
            className={`inline-block rounded-tl-[15px] border-black rounded-bl-[15px] border-r-2 ${
              formSegment === "ping"
                ? "bg-[#F49B31] text-white"
                : "bg-[#FEF5EA]"
            }  py-6 px-6 cursor-pointer sm:py-4 sm:px-8`}
          >
            Ping
          </button>
          <button
            onClick={() => setFormSegment()}
            className={`inline-block ${
              formSegment === "wave"
                ? "bg-[#F49B31] text-white"
                : "bg-[#FEF5EA]"
            } rounded-tr-[15px] cursor-pointer text-black rounded-br-[15px] py-6 px-6  sm:py-4 sm:px-8`}
          >
            Wave
          </button>
        </div>
        <div className={`${pingFormData.formSegment === "wave" && "hidden"}`}>
          <Toggle
            checked={pingFormData.anonymous}
            onChange={() =>
              setPingFormData({
                ...pingFormData,
                anonymous: !pingFormData.anonymous,
              })
            }
          />
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitForm();
          }}
          className="w-full text-[14px] justify-center items-center flex flex-col gap-5"
        >
          {/* ModalForm INPUT GROUP: */}
          <fieldset className=" w-full  text-[14px] flex flex-col gap-5">
            <div className="flex px-[11px] py-3 border border-black rounded-[10px]">
              <label htmlFor="pingTitle">Title :</label>
              <input
                type="text"
                id="pingTitle"
                name="pingTitle"
                required
                placeholder="name, header..."
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
                onChange={(e) =>
                  setPingFormData({
                    ...pingFormData,
                    pingTitle: e.target.value,
                  })
                }
                value={pingFormData.pingTitle}
                autoComplete="off"
              />
            </div>

            <div className="flex px-[11px] py-3 border border-black rounded-[10px]">
              <label htmlFor="pingDescription">Description :</label>
              <input
                type="text"
                name="pingDescription"
                id="pingDescription"
                required
                placeholder="What's the issue?"
                autoComplete="off"
                onChange={(e) =>
                  setPingFormData({ ...pingFormData, pingDesc: e.target.value })
                }
                value={pingFormData.pingDesc}
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>

            <div className="flex px-[11px] py-3 border items-center border-black rounded-[10px] ">
              <label htmlFor="hashtag">Hashtag :</label>
              <input
                type="text"
                id="hashtag"
                name="hashtag"
                required
                placeholder="What's the current movement?"
                autoComplete="off"
                onChange={(e) =>
                  setPingFormData({ ...pingFormData, hashtag: e.target.value })
                }
                value={pingFormData.hashtag}
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>
          </fieldset>

          <div className="overflow-y-scroll [scrollbar-width:none] w-full">
            <CategorySelector
              category={pingFormData.cat}
              setFormData={(cat) =>
                setPingFormData({ ...pingFormData, cat: cat })
              }
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

export default PingFormModal;
