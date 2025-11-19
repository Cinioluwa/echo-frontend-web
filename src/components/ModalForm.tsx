import { useState, type ReactNode } from "react";
import { FaLink } from "react-icons/fa6";
import Toggle from "./Toggle";
import CategorySelector from "./CategorySelector";
import { v4 as uuidv4 } from "uuid";


interface Props {
  children: ReactNode;
  setPingFormDetails: React.Dispatch<React.SetStateAction<modalFormDetails[]>>;
}



export interface modalFormDetails {
  cat: string;
  formSegment: string;
  anonymous: boolean;
  desc: string;
  hashtag: string;
  solution: string;
  title: string;
  createdAt: string;
  id: string;
}

const ModalFormDetails = ({ children, setPingFormDetails }: Props) => {
  const [formSegment, setFormSegment] = useState("ping");
  const [cat, setCat] = useState("");
  const [anonymous, setAnonymous] = useState(false);
  const [desc, setDesc] = useState("");
  const [hashtag, setHashtag] = useState("");
  const [solution, setSolution] = useState("");
  const [title, setTitle] = useState("");

  function submitForm() {
    if (cat === "") return alert("Select a category!");

    const newModalFormDetails: modalFormDetails = {
      cat: cat.trim(),
      formSegment,
      anonymous,
      title: title.trim(),
      hashtag: hashtag.trim(),
      desc: desc.trim(),
      solution: solution.trim(),
      id: uuidv4(),
      createdAt: new Date()
        .toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .toUpperCase(),
    };

    formSegment === "ping"
      ? setPingFormDetails((prev) => [...prev, newModalFormDetails])
      : "";

    console.log("modalFormDetails: ", newModalFormDetails);

    setTitle("");
    setDesc("");
    setHashtag("");
    setCat("");
    setAnonymous(false);
    setFormSegment("ping");
    setSolution("");
  }

  return (
    <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
      <div className=" mx-5 shadow-2xl rounded-4xl px-[25px] py-2.5 md:p-[30px] bg-white gap-4 overflow-hidden text-[32px] font-poppins flex  flex-col items-center">
        <h2 className="font-semibold text-center text-[20px] md:text-[32px]">
          What Kind of Post?
        </h2>
        <div className="flex rounded-[20px] text-[16px] overflow-hidden border-2 border-black">
          <span
            onClick={() => setFormSegment("ping")}
            className={`inline-block rounded-tl-[15px] border-black rounded-bl-[15px] border-r-2 ${
              formSegment === "ping"
                ? "bg-[#F49B31] text-white"
                : "bg-[#FEF5EA]"
            }  py-6 px-6  sm:py-4 sm:px-8`}
          >
            Ping
          </span>
          <span
            onClick={() => setFormSegment("wave")}
            className={`inline-block ${
              formSegment === "wave"
                ? "bg-[#F49B31] text-white"
                : "bg-[#FEF5EA]"
            } rounded-tr-[15px] text-black rounded-br-[15px] py-6 px-6  sm:py-4 sm:px-8`}
          >
            Wave
          </span>
        </div>
        <div className={`${formSegment === "wave" && "hidden"}`}>
          <Toggle
            checked={anonymous}
            onChange={() => setAnonymous(!anonymous)}
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
            <div className="flex px-[11px] py-3 border border-black rounded-[10px] ">
              <label htmlFor="title">Title :</label>
              <input
                type="text"
                id="title"
                required
                placeholder="name, header..."
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                autoComplete="off"
              />
            </div>
            <div
              className={`flex px-[11px] py-3 border border-black rounded-[10px]  ${
                formSegment === "ping" && "hidden"
              }`}
            >
              <label htmlFor="wingDescription">Description :</label>
              <textarea
                id="wingDescription"
                name="wingDescription"
                placeholder="What's the issue?"
                autoComplete="off"
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
                className="pl-[11px] py-0.5 resize-none h-[100px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>
            <div
              className={`${
                formSegment === "wave" && "hidden"
              } flex px-[11px] py-3 border border-black rounded-[10px]`}
            >
              <label htmlFor="description">Description :</label>
              <input
                type="text"
                name="description"
                id="description"
                placeholder="What's the issue?"
                autoComplete="off"
                onChange={(e) => setDesc(e.target.value)}
                value={desc}
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>

            <div
              className={`flex px-[11px] py-3 border border-black rounded-[10px]  ${
                formSegment === "ping" && "hidden"
              }`}
            >
              <label htmlFor="solution">Solution :</label>
              <textarea
                id="solution"
                name="solution"
                placeholder="What can be done?"
                autoComplete="off"
                onChange={(e) => setSolution(e.target.value)}
                value={solution}
                className="pl-[11px] py-0.5 resize-none h-[100px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>
            <div
              className={`flex px-[11px] py-3 border items-center border-black rounded-[10px]  ${
                formSegment === "wave" && "hidden"
              }`}
            >
              <label htmlFor="hashtag">Hashtag :</label>
              <input
                type="text"
                id="Hashtag"
                name="hashtag"
                placeholder="What can be done?"
                autoComplete="off"
                onChange={(e) => setHashtag(e.target.value)}
                value={hashtag}
                className="pl-[11px] text-[12px] text-[#454545] outline-0 flex-1"
              />
            </div>
          </fieldset>

          <div className="overflow-y-scroll [scrollbar-width:none] w-full">
            <CategorySelector category={cat} setCategory={setCat} />
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

export default ModalFormDetails;
