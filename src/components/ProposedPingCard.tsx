import profileImage from "../assets/images/profileImage.jpeg";
import CollapsibleText from "./CollapsibleText";

interface Props {
  pingTimeStamp: string | undefined;
  pingTitle: string | undefined;
}

const ProposedPingCard = ({ pingTimeStamp, pingTitle }: Props) => {
  return (
    <div className="flex items-start w-full justify-between px-[5px] py-[9px] rounded-2xl bg-[#FFC37B]">
      <div className="  inline-flex mr-2.5 ml-2.5  items-center gap-2.5 ">
        <span className="w-[35px] inline-block overflow-hidden h-[35px] cursor-pointer rounded-full">
          <img src={profileImage} className=" object-cover w-full h-full" />
        </span>
        <div className="text-start">
          <p className="text-[#926B3D] text-[0.45rem] md:text-[0.74rem] ">
            Osagumwenro Ugbo
          </p>
          <p className="text-[0.62rem] md:text-[0.55rem] ">{pingTimeStamp}</p>
        </div>
      </div>
      <CollapsibleText text={pingTitle}/>
    </div>
  );
};

export default ProposedPingCard;
