import OnboardingLottiePlayer from "./OnboardingLottiePlayer";

const Surge = () => {
  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Visual Stage */}
      <div className="w-full h-[260px] sm:h-[280px] rounded-2xl bg-slate-50 dark:bg-[#0D0E12] border border-slate-200/70 dark:border-white/10 flex items-center justify-center p-3 relative overflow-hidden mb-6 shadow-inner">
        <OnboardingLottiePlayer type="support" className="w-full h-full" />
      </div>

      {/* Text Content */}
      <div className="space-y-3 px-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Back <span className="text-[#F49B31]">what matters</span>
        </h2>
        <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          Tap the lightning bolt on any Ping, Wave, or comment you agree with to{" "}
          <strong className="text-[#F49B31] font-semibold">Surge</strong> it. The more
          surges something gets, the higher it rises — and the harder it becomes to ignore.
        </p>
      </div>
    </div>
  );
};

export default Surge;
