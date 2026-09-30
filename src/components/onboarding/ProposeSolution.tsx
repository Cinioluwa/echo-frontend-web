import OnboardingLottiePlayer from "./OnboardingLottiePlayer";

const ProposeSolution = () => {
  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Visual Stage */}
      <div className="relative mb-4 flex h-[200px] w-full items-center justify-center overflow-hidden rounded-2xl border border-[#F49B31]/15 bg-[#FEFBF6] p-2.5 shadow-sm sm:mb-6 sm:h-[300px] sm:p-4 md:h-[320px]">
        <OnboardingLottiePlayer type="propose" className="w-full h-full" />
      </div>

      {/* Text Content */}
      <div className="space-y-3 px-2">
        <h2 className="text-xl font-bold font-['Poppins',sans-serif] text-[#060B13] tracking-tight sm:text-3xl">
          Propose a <span className="text-[#F49B31]">Solution</span>
        </h2>
        <p className="mx-auto max-w-md font-['Inter',sans-serif] text-[13px] leading-relaxed text-[#5F656F] sm:text-base">
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
