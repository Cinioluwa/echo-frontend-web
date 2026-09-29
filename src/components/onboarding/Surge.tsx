import OnboardingLottiePlayer from "./OnboardingLottiePlayer";

const Surge = () => {
  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Visual Stage */}
      <div className="w-full h-[260px] sm:h-[280px] rounded-2xl bg-[#FEFBF6] border border-[#F49B31]/15 flex items-center justify-center p-3 relative overflow-hidden mb-6 shadow-sm">
        <OnboardingLottiePlayer type="support" className="w-full h-full" />
      </div>

      {/* Text Content */}
      <div className="space-y-3 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins',sans-serif] text-[#060B13] tracking-tight">
          Back <span className="text-[#F49B31]">what matters</span>
        </h2>
        <p className="text-[#5F656F] text-sm sm:text-base leading-relaxed max-w-md mx-auto font-['Inter',sans-serif]">
          Tap the lightning bolt on any Ping, Wave, or comment you agree with to{" "}
          <strong className="text-[#F49B31] font-semibold">Surge</strong> it. The more
          surges something gets, the higher it rises — and the harder it becomes to ignore.
        </p>
      </div>
    </div>
  );
};

export default Surge;
