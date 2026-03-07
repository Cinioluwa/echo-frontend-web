import { useAuthStore } from "../../stores";
import { User } from 'lucide-react';
import WaveStatusIndicator from "../WaveStatusIndicator";

interface StreamCardHeaderProps {
  createdAt: string;
  authorName?: string;
  rank?: number;
  status?: "POSTED" | "UNDER_REVIEW" | "APPROVED" | "REJECTED";
}

const StreamCardHeader = ({ createdAt, authorName, rank, status }: StreamCardHeaderProps) => {
  const user = useAuthStore((state) => state.user);

  // Use provided authorName or fallback to current user or guest
  const displayName = authorName || (user ? `${user.firstName} ${user.lastName}` : "Guest User");

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-6 ">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] whitespace-normal sm:whitespace-nowrap inline-block max-w-3 font-semibold">
            {displayName}
          </span>
          <span className="text-[#8B8E8D] text-[13px]">{createdAt}</span>
        </div>
      </div>
      <WaveStatusIndicator rank={rank} status={status} />
    </div>
  );
};

export default StreamCardHeader;
