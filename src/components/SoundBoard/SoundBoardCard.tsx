import SoundBoardCardBody from "./SoundBoardCardBody";
import SoundBoardCardFooter from "./SoundBoardCardFooter";
import SoundBoardCardHeader from "./SoundBoardCardHeader";

interface Props {
  pingText: string;
  pingTitle: string;
  image: string;
  category: string;
  hashtag?: string;
  timeStamp: string;
  id: string;
  onPropose: (id: string) => void;
  proposeActive: boolean;
  surgeCount?: number;
  commentCount?: number;
  authorName?: string;
  onRefresh?: () => void;
  hasSurged?: boolean;
}

const SoundBoardCard = ({
  pingText,
  category,
  pingTitle,
  image,
  hashtag,
  timeStamp,
  id,
  onPropose,
  proposeActive,
  surgeCount = 0,
  commentCount = 0,
  authorName,
  onRefresh: _onRefresh,
  hasSurged: _hasSurged,
}: Props) => {
  return (
    <>
      <div className="mt-0  m-[15px] md:m-0 px-[25px] py-2.5 bg-[#FEFEFE]  rounded-[10px] ">
        <div className="block xl:hidden">
          <SoundBoardCardHeader timeStamp={timeStamp} authorName={authorName} />
        </div>
        <SoundBoardCardBody
          category={category}
          image={image}
          pingTitle={pingTitle}
          pingText={pingText}
        />
        <SoundBoardCardFooter
          proposeActive={proposeActive}
          onPropose={(id) => onPropose(id)}
          id={id}
          timeStamp={timeStamp}
          hashtag={hashtag}
          surgeCount={surgeCount}
          commentCount={commentCount}
        />
      </div>
    </>
  );
};

export default SoundBoardCard;
