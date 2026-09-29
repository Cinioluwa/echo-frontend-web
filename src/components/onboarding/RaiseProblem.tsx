import OnboardingLottiePlayer from "./OnboardingLottiePlayer";

const RaiseProblem = () => {
  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Visual Stage */}
      <div className="w-full h-[260px] sm:h-[280px] rounded-2xl bg-[#FEFBF6] border border-[#F49B31]/15 flex items-center justify-center p-3 relative overflow-hidden mb-6 shadow-sm">
        <OnboardingLottiePlayer type="report" className="w-full h-full" />
      </div>

      {/* Text Content */}
      <div className="space-y-3 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins',sans-serif] text-[#060B13] tracking-tight">
          Raise a <span className="text-[#F49B31]">Problem</span>
        </h2>
        <p className="text-[#5F656F] text-sm sm:text-base leading-relaxed max-w-md mx-auto font-['Inter',sans-serif]">
          See something wrong? Tap{" "}
          <strong className="text-[#060B13] font-semibold">
            "What's the problem?"
          </strong>{" "}
          at the top of your feed and describe it. Post anonymously if you need to.
          Your problem becomes a{" "}
          <strong className="text-[#F49B31] font-semibold">Ping</strong>.
        </p>
      </div>
    </div>
  );
};

export default RaiseProblem;
