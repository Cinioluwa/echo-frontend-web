import cardProfile from "../../assets/images/wavecardprofile.svg";
import { useAuth } from "../../contexts/AuthContext";

interface StreamCardHeaderProps {
  createdAt: string;
  authorName?: string;
  rank?: number;
}

const StreamCardHeader = ({ createdAt, authorName, rank }: StreamCardHeaderProps) => {
  const { user } = useAuth();

  // Use provided authorName or fallback to current user or guest
  const displayName = authorName || (user ? `${user.firstName} ${user.lastName}` : "Guest User");

  // Determine badge color based on rank
  const getBadgeColor = (rank?: number) => {
    if (!rank || rank > 3) return null;
    if (rank === 1) return "bg-[#FFD700]"; // Gold
    if (rank === 2) return "bg-[#C0C0C0]"; // Silver
    if (rank === 3) return "bg-[#DDE23B]"; // Bronze/Yellow
    return null;
  };

  const badgeColor = getBadgeColor(rank);

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-6 ">
        <img src={cardProfile} alt="Profile" />
        <div className="flex flex-col">
          <span className="text-[15px] whitespace-normal sm:whitespace-nowrap inline-block max-w-3 font-semibold">
            {displayName}
          </span>
          <span className="text-[#8B8E8D] text-[13px]">{createdAt}</span>
        </div>
      </div>
      {badgeColor && (
        <div className="flex gap-2 px-[35px] items-center border rounded-[25px] py-[7px]">
          <span className={`inline-block w-[9px] h-[9px] rounded-full ${badgeColor}`}></span>
          Top {rank}
        </div>
      )}
    </div>
  );
};

export default StreamCardHeader;
