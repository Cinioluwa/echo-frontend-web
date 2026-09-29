import OnboardingLottiePlayer from "./OnboardingLottiePlayer";

const ProposeSolution = () => {
  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Visual Stage */}
      <div className="w-full h-[260px] sm:h-[280px] rounded-2xl bg-[#FEFBF6] border border-[#F49B31]/15 flex items-center justify-center p-3 relative overflow-hidden mb-6 shadow-sm">
        <OnboardingLottiePlayer type="propose" className="w-full h-full" />
      </div>

      {/* Text Content */}
      <div className="space-y-3 px-2">
        <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins',sans-serif] text-[#060B13] tracking-tight">
          Propose a <span className="text-[#F49B31]">Solution</span>
        </h2>
        <p className="text-[#5F656F] text-sm sm:text-base leading-relaxed max-w-md mx-auto font-['Inter',sans-serif]">
          Have an idea to make things better? Click on any Ping in the feed and tap{" "}
          <strong className="text-[#060B13] font-semibold">
            "What's your solution?"
          </strong>{" "}
          to suggest how it can be fixed. Your solution becomes a{" "}
          <strong className="text-[#F49B31] font-semibold">Wave</strong>.
        </p>
      </div>
    </div>
  );
};

export default ProposeSolution;
