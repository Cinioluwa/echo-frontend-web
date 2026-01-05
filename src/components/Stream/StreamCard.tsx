import ProposedPingCard from "../ProposedPingCard";
import StreamCardBody from "./StreamCardBody";
import StreamCardFooter from "./StreamCardFooter";
import StreamCardHeader from "./StreamCardHeader";

interface Props {
  waveText: string;
  waveTitle: string;
  image: string;
  category: string;
  pingTimeStamp: string;
  createdAt: string;
  pingTitle: string;
  waveId?: string;
  surgeCount?: number;
  commentCount?: number;
  onRefresh?: () => void;
  authorName?: string;
  authorId?: number;
  rank?: number;
}

const StreamCard = ({
  waveText,
  category,
  waveTitle,
  image,
  createdAt,
  pingTimeStamp,
  pingTitle,
  waveId,
  surgeCount = 0,
  commentCount = 0,
  onRefresh,
  authorName,
  authorId,
  rank
}: Props) => {
  return (
    <>
      <div className="m-[15px] md:m-0 px-[25px] py-2.5 bg-[#FEFEFE]  rounded-[10px] ">
        <div>
          <StreamCardHeader
            createdAt={createdAt}
            authorName={authorName}
            rank={rank}
          />
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
        <StreamCardFooter
          waveId={waveId}
          surgeCount={surgeCount}
          commentCount={commentCount}
          onRefresh={onRefresh}
        />
      </div>
    </>
  );
};

export default StreamCard;
