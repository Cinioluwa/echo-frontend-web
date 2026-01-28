import ProposedPingCard from "../ProposedPingCard";
import StreamCardBody from "./StreamCardBody";
import StreamCardFooter from "./StreamCardFooter";
import StreamCardHeader from "./StreamCardHeader";

interface Props {
  waveText: string;
  waveTitle?: string;
  image: string;
  category: string;
  pingTimeStamp: string;
  createdAt: string;
  pingTitle: string;
}

const StreamCard = ({
  waveText,
  category,
  waveTitle,
  image,
  createdAt,
  pingTimeStamp,
  pingTitle,
}: Props) => {
  return (
    <>
      <div className="m-[15px] md:m-0 px-[25px] py-2.5 bg-[#FEFEFE]  rounded-[10px] ">
        <div>
          <StreamCardHeader createdAt={createdAt} />
        </div>
        <div className="my-[15px]">
          <ProposedPingCard
            pingTimeStamp={pingTimeStamp}
            pingTitle={pingTitle}
          />
        </div>
        <StreamCardBody
          category={category}
          image={image}
          waveTitle={waveTitle}
          waveText={waveText}
        />
        <StreamCardFooter />
      </div>
    </>
  );
};

export default StreamCard;
