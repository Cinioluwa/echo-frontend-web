import { useState } from "react";
import SoundBoardCardBody from "./SoundBoardCardBody";
import SoundBoardCardFooter from "./SoundBoardCardFooter";
import SoundBoardCardHeader from "./SoundBoardCardHeader";
import { CommentModal } from "../Comments";
import type { Ping } from "../../api/types";

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
  ping?: Ping; // Full ping object for comment modal
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
  onRefresh,
  hasSurged: _hasSurged,
  ping,
}: Props) => {
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);

  const handleCommentClick = () => {
    if (ping) {
      setIsCommentModalOpen(true);
    }
  };

  const handleCommentAdded = () => {
    // Refresh the ping data after comment is added
    onRefresh?.();
  };

  return (
    <>
      <div className="mt-0 m-[15px] md:m-0 px-5 py-[15px] bg-[#FEFEFE] rounded-[10px]">
        <SoundBoardCardHeader timeStamp={timeStamp} authorName={authorName} />
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
          onCommentClick={handleCommentClick}
        />
      </div>

      {/* Comment Modal */}
      {ping && (
        <CommentModal
          isOpen={isCommentModalOpen}
          onClose={() => setIsCommentModalOpen(false)}
          ping={ping}
          onCommentAdded={handleCommentAdded}
        />
      )}
    </>
  );
};

export default SoundBoardCard;
