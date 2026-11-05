import OnboardingLottiePlayer from "./OnboardingLottiePlayer";

const Surge = () => {
  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Visual Stage */}
      <div className="relative mb-4 flex h-[200px] w-full items-center justify-center overflow-hidden rounded-2xl border border-[var(--echo-border-f49b31)]/15 bg-[var(--echo-bg-fefbf6)] p-2.5 shadow-sm sm:mb-6 sm:h-[300px] sm:p-4 md:h-[320px]">
        <OnboardingLottiePlayer type="support" className="w-full h-full" />
      </div>

      {/* Text Content */}
      <div className="space-y-3 px-2">
        <h2 className="text-xl font-bold font-['Poppins',sans-serif] text-[var(--echo-text-primary)] tracking-tight sm:text-3xl">
          Back <span className="text-[var(--echo-text-f49b31)]">what matters</span>
        </h2>
        <p className="mx-auto max-w-md font-['Inter',sans-serif] text-[13px] leading-relaxed text-[var(--echo-text-5f656f)] sm:text-base">
          Tap the lightning bolt on any Ping, Wave, or comment you agree with to{" "}
          <strong className="text-[var(--echo-text-f49b31)] font-semibold">Surge</strong> it. The more
          surges something gets, the higher it rises — and the harder it becomes to ignore.
        </p>
      </div>
    </div>
  );
};

export default Surge;
