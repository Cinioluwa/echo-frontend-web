import SoundBoardCardBody from "./SoundBoardCardBody";
import SoundBoardCardFooter from "./SoundBoardCardFooter";
import SoundBoardCardHeader from "./SoundBoardCardHeader";

interface Props {
  pingText: string;
  pingTitle: string;
}

const SoundBoardCard = ({ pingText, pingTitle }: Props) => {
  return (
    <>
      <div className="  m-[15px] md:m-0 px-[25px] py-2.5 bg-[#FEFEFE]  rounded-[10px] ">
        <div className="block xl:hidden">
          <SoundBoardCardHeader />
        </div>
        <SoundBoardCardBody pingTitle={pingTitle} pingText={pingText} />
        <SoundBoardCardFooter />
      </div>
    </>
  );
};

export default SoundBoardCard;
