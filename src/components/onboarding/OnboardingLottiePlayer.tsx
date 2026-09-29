import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    bodymovin?: any;
    lottie?: any;
    ECHO_REPORT_ISSUE_ANIMATION?: any;
    ECHO_PROPOSE_SOLUTION_ANIMATION?: any;
    ECHO_SUPPORT_WHAT_MATTERS_ANIMATION?: any;
  }
}

export type OnboardingAnimationType = "report" | "propose" | "support";

interface OnboardingLottiePlayerProps {
  type: OnboardingAnimationType;
  className?: string;
}

const SCRIPT_URLS: Record<OnboardingAnimationType, string> = {
  report: "/assets/onboarding/report-issue-animation-data.js",
  propose: "/assets/onboarding/propose-solution-animation-data.js",
  support: "/assets/onboarding/support-what-matters-animation-data.js",
};

export const OnboardingLottiePlayer = ({
  type,
  className = "",
}: OnboardingLottiePlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = () => resolve();
        s.onerror = (e) => reject(e);
        document.body.appendChild(s);
      });
    };

    const mount = async () => {
      try {
        setLoading(true);

        // Ensure bodymovin engine is loaded
        if (!window.bodymovin) {
          await loadScript("/assets/onboarding/lottie.min.js");
        }

        // Ensure animation data is loaded
        await loadScript(SCRIPT_URLS[type]);

        if (cancelled || !containerRef.current) return;

        const rawData =
          type === "report"
            ? window.ECHO_REPORT_ISSUE_ANIMATION
            : type === "propose"
            ? window.ECHO_PROPOSE_SOLUTION_ANIMATION
            : window.ECHO_SUPPORT_WHAT_MATTERS_ANIMATION;

        if (!rawData) {
          console.warn(`Lottie data for ${type} not found`);
          return;
        }

        // Deep-clone and rewrite asset URLs to point to /assets/onboarding/i/
        const animationData = JSON.parse(JSON.stringify(rawData));
        if (Array.isArray(animationData.assets)) {
          animationData.assets.forEach((asset: any) => {
            if (asset && typeof asset.u === "string" && asset.u.trim()) {
              asset.u = "/assets/onboarding/i/";
            }
          });
        }

        // Cleanup prior animation
        if (animRef.current) {
          try {
            animRef.current.destroy();
          } catch {
            // ignore
          }
          animRef.current = null;
        }

        if (containerRef.current) {
          containerRef.current.innerHTML = "";
        }

        const engine = window.bodymovin || window.lottie;
        if (!engine || typeof engine.loadAnimation !== "function") {
          console.warn("Lottie engine not ready");
          return;
        }

        animRef.current = engine.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          animationData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid meet",
          },
        });

        if (!cancelled) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Error initializing Lottie player:", err);
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    mount();

    return () => {
      cancelled = true;
      if (animRef.current) {
        try {
          animRef.current.destroy();
        } catch {
          // ignore
        }
        animRef.current = null;
      }
    };
  }, [type]);

  return (
    <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/60 dark:bg-black/20">
          <div className="w-8 h-8 rounded-full border-2 border-[#F49B31] border-t-transparent animate-spin" />
        </div>
      )}
      <div
        ref={containerRef}
        className="w-full h-full flex items-center justify-center"
      />
    </div>
  );
};

export default OnboardingLottiePlayer;
