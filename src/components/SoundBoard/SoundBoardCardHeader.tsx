import wavecardprofile from "../../assets/images/wavecardprofile.svg";
import { useAuth } from "../../contexts/AuthContext";

interface timeProp {
  timeStamp: string;
  authorName?: string;
}

const SoundBoardCardHeader = ({ timeStamp, authorName }: timeProp) => {
  const { user } = useAuth();

  // Use provided author name, or fall back to current user's name
  const displayName = authorName || (user ? `${user.firstName} ${user.lastName}` : "Anonymous");

  return (
    <div>
      <div className="flex items-center gap-6 ">
        <img src={wavecardprofile} alt="" />
        <div className="flex flex-col">
          <span className="text-[15px] whitespace-normal sm:whitespace-nowrap inline-block max-w-3 font-semibold">
            {displayName}
          </span>
          <span className="text-[#8B8E8D] text-[13px] ">{timeStamp}</span>
        </div>
      </div>
    </div>
  );
};

export default SoundBoardCardHeader;
