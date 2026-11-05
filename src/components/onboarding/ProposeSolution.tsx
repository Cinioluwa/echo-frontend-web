import OnboardingLottiePlayer from "./OnboardingLottiePlayer";

const ProposeSolution = () => {
  return (
    <div className="w-full flex flex-col items-center text-center">
      {/* Visual Stage */}
      <div className="relative mb-4 flex h-[200px] w-full items-center justify-center overflow-hidden rounded-2xl border border-[var(--echo-border-f49b31)]/15 bg-[var(--echo-bg-fefbf6)] p-2.5 shadow-sm sm:mb-6 sm:h-[300px] sm:p-4 md:h-[320px]">
        <OnboardingLottiePlayer type="propose" className="w-full h-full" />
      </div>

      {/* Text Content */}
      <div className="space-y-3 px-2">
        <h2 className="text-xl font-bold font-['Poppins',sans-serif] text-[var(--echo-text-primary)] tracking-tight sm:text-3xl">
          Propose a <span className="text-[var(--echo-text-f49b31)]">Solution</span>
        </h2>
        <p className="mx-auto max-w-md font-['Inter',sans-serif] text-[13px] leading-relaxed text-[var(--echo-text-5f656f)] sm:text-base">
          Have an idea to make things better? Click on any Ping in the feed and tap{" "}
          <strong className="text-[var(--echo-text-primary)] font-semibold">
            "What's your solution?"
          </strong>{" "}
          to suggest how it can be fixed. Your solution becomes a{" "}
          <strong className="text-[var(--echo-text-f49b31)] font-semibold">Wave</strong>.
        </p>
      </div>
    </div>
  );
};

export default ProposeSolution;
