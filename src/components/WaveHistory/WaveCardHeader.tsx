import wavecardprofile from '../../assets/images/wavecardprofile.svg'
import rating from '../../assets/images/rating.svg'


const WaveCardHeader = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-6 ">
        <img src={wavecardprofile} alt="" />
        <div className="flex flex-col">
          <span className="text-[15px] inline-block max-w-3 font-semibold">
            Covenant Smith
          </span>
          <span className="text-[#8B8E8D] text-[13px] ">Mar 01, 11:00 am</span>
        </div>
      </div>
      <div className="flex gap-1.5 px-[15px] md:px-[30px] py-[7px] border border-[#626665] rounded-[23px]">
        <img src={rating} alt="" />
        Top 3
      </div>
    </div>
  );
};

export default WaveCardHeader;
