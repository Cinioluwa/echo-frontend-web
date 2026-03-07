import profileImage from "../assets/images/profileImage.jpeg";

interface CommentModalProps {
  setCommentModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommentBox = ({setCommentModal}: CommentModalProps) => {



  return (
    <div className="w-full flex flex-col gap-[18px] h-[250px] px-3 py-2.5 bg-[#FFF7E8] rounded-[10px]">
      <div className="flex items-center gap-2">
        <span className="w-[25px] inline-block overflow-hidden h-[25px] cursor-pointer rounded-full">
          <img src={profileImage} className=" object-cover w-full h-full" />
        </span>
        <p className="text-[14px] text-[#63637B]">Obasan Tomilola</p>
      </div>

      <form action="">
        <textarea
          name="announcementDescription"
          id="announcementDescription"
          required
          placeholder="Give an official comment"
          autoComplete="off"
          className="p-[11px] text-[12px] mt-0.5 h-[136px] rounded-xl resize-none w-full text-[#454545] outline-0 bg-white flex-1"
        />

        <div className="text-[14px] flex">
          <button className="bg-[#F49B31] cursor-pointer text-white px-4 py-1 rounded">
            Reply
          </button>
          <button onClick={() => setCommentModal(false)} type="button" className=" text-[#63637B] cursor-pointer px-4 py-1 rounded">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentBox;
