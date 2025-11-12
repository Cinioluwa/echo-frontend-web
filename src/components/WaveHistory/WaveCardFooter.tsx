import eye from "../../assets/images/eye_svgrepo.com.svg";

function WaveCardFooter() {
  return (
    <div className="flex gap-5 items-center justify-end">
      <div className="flex gap-[7px] items-center justify-end">
        <span>
          <img src={eye} alt="" />
        </span>
        <div className="text-[#454545] text-[14px] flex items-center">
          <span className="mr-1">161</span>
          Views
        </div>
      </div>
      <div className="text-[#454545] text-[14px] flex items-center">
        <span className="mr-1">114</span>
        Surges
      </div>
    </div>
  );
}

export default WaveCardFooter;
