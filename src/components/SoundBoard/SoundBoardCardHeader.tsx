import { useAuthStore } from "../../stores";
import { User } from 'lucide-react';

interface timeProp {
  timeStamp: string;
  authorName?: string;
}

const SoundBoardCardHeader = ({ timeStamp, authorName }: timeProp) => {
  const user = useAuthStore((state) => state.user);

  // Use provided author name, or fall back to current user's name, or "Anonymous" if no user
  const displayName = authorName || (user ? `${user.firstName} ${user.lastName}` : "Anonymous");

  return (
    <div className="flex items-center gap-4 mb-3">
      <div className="w-[53px] h-[53px] rounded-full bg-gray-200 flex items-center justify-center shrink-0">
        <User className="w-6 h-6 text-gray-500" />
      </div>
      <div className="flex flex-col">
        <span className="text-[15px] font-semibold text-black">
          {displayName}
        </span>
        <span className="text-[#8B8E8D] text-[13px]">{timeStamp}</span>
      </div>
    </div>
  );
};

export default SoundBoardCardHeader;
