import WaveCardBody from "./WaveCardBody";
import WaveCardFooter from "./WaveCardFooter";
import WaveCardHeader from "./WaveCardHeader";

interface Props {
  waveText: string;
  waveTitle: string;
}

const WaveCard = ({ waveText, waveTitle }: Props) => {
  return (
    <>
      <div className="m-[15px] md:m-0 p-[25px] bg-[#FEFEFE]  rounded-[10px] ">
        <WaveCardHeader />
        <WaveCardBody waveTitle={waveTitle} waveText={waveText} />
        <WaveCardFooter />
      </div>
    </>
  );
};

export default WaveCard;
