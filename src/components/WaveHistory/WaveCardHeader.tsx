const rating = '/assets/images/rating.svg'
import type { ResolutionLog } from "../../api/types";
import { User } from 'lucide-react';

interface Props {
  resolution: ResolutionLog;
}

const WaveCardHeader = ({ resolution }: Props) => {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get author name (from the ping author)
  const getAuthorName = () => {
    if (resolution.author && typeof resolution.author === 'object') {
      return `${resolution.author.firstName} ${resolution.author.lastName}`;
    }
    return 'Anonymous';
  };

  // Calculate resolution time in days
  const getResolutionTime = () => {
    const days = Math.floor(resolution.msToResolve / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Same day';
    if (days === 1) return '1 day';
    return `${days} days`;
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-6 ">
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-500" />
        </div>
        <div className="flex flex-col">
          <span className="text-[15px] whitespace-normal sm:whitespace-nowrap inline-block max-w-3 font-semibold">
            {getAuthorName()}
          </span>
          <span className="text-[#8B8E8D] text-[13px] ">{formatDate(resolution.resolvedAt)}</span>
        </div>
      </div>
      <div className="flex gap-1.5 px-[15px] md:px-[30px] py-[7px] border border-[#626665] rounded-[23px]">
        <span className="text-green-600 font-semibold">✓</span>
        Resolved in {getResolutionTime()}
      </div>
    </div>
  );
};

export default WaveCardHeader;
