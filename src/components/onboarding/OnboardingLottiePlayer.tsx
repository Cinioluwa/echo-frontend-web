import { useEffect, useState } from "react";
import { DotLottieReact, type DotLottie } from "@lottiefiles/dotlottie-react";

export type OnboardingAnimationType = "report" | "propose" | "support";

interface OnboardingLottiePlayerProps {
  type: OnboardingAnimationType;
  className?: string;
}

const ANIMATIONS: Record<OnboardingAnimationType, { src: string; label: string }> = {
  report: {
    src: "/assets/onboarding/Report%20an%20Issue.lottie",
    label: "Animation showing how to report an issue",
  },
  propose: {
    src: "/assets/onboarding/Propose%20a%20Solution.lottie",
    label: "Animation showing how to propose a solution",
  },
  support: {
    src: "/assets/onboarding/Support%20what%20matters.lottie",
    label: "Animation showing how to support a post",
  },
};

export const OnboardingLottiePlayer = ({
  type,
  className = "",
}: OnboardingLottiePlayerProps) => {
  const [player, setPlayer] = useState<DotLottie | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const animation = ANIMATIONS[type];

  useEffect(() => {
    if (!player) return;

    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };
    const handleLoadError = () => {
      setIsLoading(false);
      setHasError(true);
      console.error(`Failed to load onboarding animation: ${animation.src}`);
    };

    player.addEventListener("load", handleLoad);
    player.addEventListener("loadError", handleLoadError);

    return () => {
      player.removeEventListener("load", handleLoad);
      player.removeEventListener("loadError", handleLoadError);
    };
  }, [animation.src, player]);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [type]);

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center ${className}`}
    >
      <DotLottieReact
        src={animation.src}
        autoplay
        loop
        layout={{ fit: "contain", align: [0.5, 0.5] }}
        renderConfig={{ autoResize: true, freezeOnOffscreen: true }}
        dotLottieRefCallback={setPlayer}
        aria-label={animation.label}
        className="h-full w-full"
      />
      {isLoading && !hasError && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-[#FEFBF6]/80"
          aria-label="Loading animation"
        >
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#F49B31] border-t-transparent" />
        </div>
      )}
      {hasError && (
        <p className="absolute inset-x-4 bottom-3 text-center font-['Inter',sans-serif] text-xs text-[#5F656F]">
          This animation isn&apos;t available right now.
        </p>
      )}
    </div>
  );
};

export default OnboardingLottiePlayer;
