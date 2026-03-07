const arrowRise = "/assets/images/ArrowRise.svg";
const arrowDrop = "/assets/images/arrowdrop.svg";

const PlatformMetrics = () => {
  return (
    <div className="flex whitespace-nowrap justify-between mt-3 gap-4">
      <div className="bg-white border-[0.5px] border-[#F49B31] p-6 pr-9 max-w-[280px] min-w-[250px] w-full rounded-2xl">
        <p>Waves</p>

        <div className="flex justify-between mt-2 gap-[54px]">
          <p className="text-[25px] font-semibold">7,265</p>
          <span className="flex items-center gap-2">
            <p className="text-[10px]">+11.01%</p>{" "}
            <img src={arrowRise} alt="" className="w-[40%]" />
          </span>
        </div>
      </div>


      <div className="bg-white border-[0.5px] border-[#F49B31] p-6 pr-9 max-w-[280px] min-w-[250px] w-full rounded-2xl">
        <p>Pings Submitted</p>

        <div className="flex justify-between mt-2 gap-[54px]">
          <p className="text-[25px] font-semibold">3,671</p>
          <span className="flex items-center gap-2">
            <p className="text-[10px]">-0.03%</p>{" "}
            <img src={arrowDrop} alt="" className="w-[40%]" />
          </span>
        </div>
      </div>


      <div className="bg-white border-[0.5px] border-[#F49B31] p-6 pr-9 max-w-[280px] min-w-[250px] w-full rounded-2xl">
        <p>Waves Under Review</p>

        <div className="flex justify-between mt-2 gap-[54px]">
          <p className="text-[25px] font-semibold">156</p>
          <span className="flex items-center gap-2">
            <p className="text-[10px]">+15.03%</p>{" "}
            <img src={arrowRise} alt="" className="w-[40%]" />
          </span>
        </div>
      </div>


      <div className="bg-white border-[0.5px] border-[#F49B31] p-6 pr-9 max-w-[280px] min-w-[250px] w-full rounded-2xl">
        <p>Active Users</p>

        <div className="flex justify-between mt-2 gap-[54px]">
          <p className="text-[25px] font-semibold">2,318</p>
          <span className="flex items-center gap-2">
            <p className="text-[10px]">+6.0%</p>{" "}
            <img src={arrowRise} alt="" className="w-[40%]" />
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlatformMetrics;
