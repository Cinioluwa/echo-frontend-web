import WaveCardBody from "./WaveCardBody";
import WaveCardFooter from "./WaveCardFooter";
import WaveCardHeader from "./WaveCardHeader";

interface Props {
  waveText: string;
  waveTitle: string;
  
}

const WaveCard = ({ waveText, waveTitle}: Props) => {
  return (
    <>
      <div className="p-[23px] bg-[#FEFEFE] mb-[22px] rounded-[10px] ">
        <WaveCardHeader />
        <WaveCardBody waveTitle={waveTitle} waveText={waveText} />
        <WaveCardFooter />
      </div>
    </>
  );
};

export default WaveCard;
