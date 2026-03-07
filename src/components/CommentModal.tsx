import CommentBox from "./CommentBox";
import CommentSection from "./CommentSection";
import profileImage from "../assets/images/profileImage.jpeg";
import { LiaTimesSolid } from "react-icons/lia";

interface CommentModalProps {
  setCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommentModal = ({ setCommentModal }: CommentModalProps) => {
  return (
    <div className="flex font-poppins justify-center items-center z-50 inset-0 fixed bg-black/40">
      <div className=" mx-5 shadow-2xl max-w-[800px] rounded-4xl px-[25px] py-2.5 md:p-[30px] bg-white gap-4 overflow-hidden text-[32px] font-poppins flex  flex-col items-center">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <div className="flex mb-1 items-center gap-2">
              <span className="w-[25px] inline-block overflow-hidden h-[25px] cursor-pointer rounded-full">
                <img
                  src={profileImage}
                  className=" object-cover w-full h-full"
                />
              </span>
              <p className="text-[14px] text-[#63637B]">Obasan Tomilola</p>
              <p className="text-[#9191A8] text-[12px]">published Ping</p>
              <span className="text-[#9191A8] text-[10px]"> º 6 days ago</span>
            </div>
            <LiaTimesSolid
              onClick={() => setCommentModal(false)}
              color="#9191A8"
              size={"20px"}
              className="cursor-pointer"
            />
          </div>
          <h2 className="font-semibold max-w-[500px] text-start text-[20px]">
            Enhance the Microphone System in EIE Large lassroom
          </h2>
          <p className="text-[14px] text-[#63637B]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo natus
            velit ipsum porro quis voluptatibus, iure culpa eaque ducimus,
            cupiditate placeat temporibus ipsa suscipit eligendi eveniet
            obcaecati amet architecto voluptatum. Unde labore cupiditate
            laboriosam voluptas quis? Cumque ipsum doloremque, modi esse
            deleniti enim laborum soluta deserunt ipsam nihil fuga id?
          </p>
        </div>
        <CommentBox setCommentModal={setCommentModal} />
        <div className="w-full mt-2.5 flex items-center gap-3">
          <p className="text-[12px] text-[#9191A8]">4 comments</p>
          <span className="inline-block w-full flex-1 border h-[0.2px] border-[#D8D8E4]"></span>
        </div>
        <div className="max-h-75 flex flex-col gap-5 overflow-y-scroll [scrollbar-width:none]">
          <CommentSection />
          <CommentSection />
          <CommentSection />
          <CommentSection />
        </div>
      </div>
    </div>
  );
};

export default CommentModal;
