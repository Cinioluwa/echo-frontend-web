import wavecardprofile from '../../assets/images/wavecardprofile.svg'
import rating from '../../assets/images/rating.svg'
import type { Wave } from "../../api/types";

interface Props {
  wave: Wave;
}

const WaveCardHeader = ({ wave }: Props) => {
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

  // Get author name
  const getAuthorName = () => {
    if (typeof wave.author === 'object' && wave.author) {
      return `${wave.author.firstName} ${wave.author.lastName}`;
    }
    return 'Anonymous';
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-6 ">
        <img src={wavecardprofile} alt="" />
        <div className="flex flex-col">
          <span className="text-[15px] whitespace-normal sm:whitespace-nowrap inline-block max-w-3 font-semibold">
            {getAuthorName()}
          </span>
          <span className="text-[#8B8E8D] text-[13px] ">{formatDate(wave.createdAt)}</span>
        </div>
      </div>
      {wave.rank && wave.rank <= 3 && (
        <div className="flex gap-1.5 px-[15px] md:px-[30px] py-[7px] border border-[#626665] rounded-[23px]">
          <img src={rating} alt="" />
          Top {wave.rank}
        </div>
      )}
    </div>
  );
};

export default WaveCardHeader;
