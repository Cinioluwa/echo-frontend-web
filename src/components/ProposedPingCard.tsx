import profileImage from "../assets/images/profileImage.jpeg";



interface Props {

    timeStamp: string | undefined;
    pingTitle: String | undefined;
  }

const ProposedPingCard = ({timeStamp, pingTitle}: Props) => {
  return (

    <div className="flex items-center w-full justify-between px-[5px] py-[9px] rounded-2xl bg-[#FFC37B]">
    <div className="  inline-flex mr-2.5 ml-2.5  items-center gap-2.5 ">
      <span className="w-[35px] inline-block overflow-hidden h-[35px] cursor-pointer rounded-full">
        <img src={profileImage} className=" object-cover w-full h-full" />
      </span>
      <div className="text-start">
        <p className="text-[#926B3D] text-[7px] md:text-[12px] ">
          Osagumwenro Ugbo
        </p>
        <p className="text-[10px] md:text-[9px] ">{timeStamp}</p>
      </div>
    </div>
    <p className="flex-1 text-[10px] text-start font-semibold">{pingTitle}...</p>
  </div>
  )
}

export default ProposedPingCard