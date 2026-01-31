import profileImage from "../assets/images/profileImage.jpeg";

const CommentSection = () => {
  return (
    <div className="w-full flex flex-col  gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 w-full">
          <span className="w-[25px] inline-block overflow-hidden h-[25px] cursor-pointer rounded-full">
            <img src={profileImage} className=" object-cover w-full h-full" />
          </span>
          <p className="text-[14px] flex items-center gap-2 text-[#63637B]">
            Obasan Tomilola{" "}
            <span className="text-[#9191A8] text-[10px]"> º 6 days ago</span>
          </p>
        </div>

        <div>
          <p className="text-[#292936] text-[14px]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis quod
            ullam ex sit ipsam repellendus, ut maiores magni dolorum commodi
            officiis deserunt corporis optio, et quos earum in sint ratione?
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
