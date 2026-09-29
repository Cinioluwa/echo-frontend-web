import OnboardingLottiePlayer from "./OnboardingLottiePlayer";

const ProposeSolution = () => {
  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Visual Stage */}
      <div className="w-full h-[260px] sm:h-[280px] rounded-2xl bg-slate-50 dark:bg-[#0D0E12] border border-slate-200/70 dark:border-white/10 flex items-center justify-center p-3 relative overflow-hidden mb-6 shadow-inner">
        <OnboardingLottiePlayer type="propose" className="w-full h-full" />
      </div>

      {/* Text Content */}
      <div className="space-y-3 px-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Propose a <span className="text-[#F49B31]">Solution</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          Have an idea to make things better? Click on any Ping in the feed and tap{" "}
          <strong className="text-gray-900 dark:text-white font-semibold">
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
