import { useAuthStore } from "../../stores";
import { User } from 'lucide-react';

interface timeProp {
  timeStamp: string;
  authorName?: string;
}

const SoundBoardCardHeader = ({ timeStamp, authorName }: timeProp) => {
  const user = useAuthStore((state) => state.user);

  // Use provided author name, or fall back to current user's name
  const displayName = authorName || (user ? `${user.firstName} ${user.lastName}` : "Anonymous");

  return (
    <div>
      <div className="flex items-center gap-6 ">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-500" />
        </div>
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
