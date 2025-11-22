import tick from "../assets/images/Tick icon.svg";

interface Props {
  setPostSuccessModal: () => void;
  formSegment: string;
}

const PostSuccessModal = ({ setPostSuccessModal, formSegment }: Props) => {
  return (
    <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
      <div className="bg-white p-5 md:p-10 rounded-2xl flex flex-col  gap-5 items-center justify-center">
        <div className=" flex flex-col items-center gap-2.5">
          <div className="flex justify-center gap-2.5 ">
            <img src={tick} alt="" />
            <p className="text-[26px]">Thank You!</p>
          </div>
          <p className="font-light">
            {formSegment === "ping"
              ? "Ping was successfully posted."
              : "Wave was successfully posted."}
          </p>
        </div>
        <div className="text-white flex gap-3 flex-col">
          <button
            className="px-[125px] py-[17px] rounded-lg hover:bg-[#d88429] transition-colors duration-300 ease-in-out
 bg-[#F49B31]"
          >
            Share
          </button>
          <button
            onClick={setPostSuccessModal}
            className="px-[125px] py-[17px] rounded-lg bg-[#654927] transition-colors duration-300 ease-in-out hover:bg-[#553c21]
"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostSuccessModal;
