import profileImage from "../assets/images/profileImage.jpeg";



const UserInfo = () => {
  return (
    <div className="inline-flex mr-2.5 ml-2.5 md:ml-[55px] items-center gap-2.5 md:mr-[35px]">
      <div className="text-end">
        <p className="text-[#926B3D] text-[7px] md:text-[12px] ">Welcome back!</p>
        <p className=" text-[10px] md:text-[14px] ">Osagumwenro Ugbo</p>
      </div>

      <span className="w-[50px] inline-block overflow-hidden h-[50px] cursor-pointer rounded-full">
        <img src={profileImage} className=" object-cover w-full h-full" />
      </span>
    </div>
  );
};

export default UserInfo;
