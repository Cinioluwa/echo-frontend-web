import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiArrowLeft, FiX } from "react-icons/fi";

import Welcome from "./Welcome";
import RaiseProblem from "./RaiseProblem";
import ProposeSolution from "./ProposeSolution";
import Surge from "./Surge";

const steps = [Welcome, RaiseProblem, ProposeSolution, Surge];

const STEP_LABELS = [
  "Welcome",
  "Raise a Problem",
  "Propose a Solution",
  "Back What Matters",
];

const OnboardingOverlay = ({ onFinish }: { onFinish?: () => void }) => {
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const next = () => {
    if (step < steps.length - 1) {
      setDirection(1);
      setStep((prev) => prev + 1);
    } else {
      onFinish?.();
    }
  };

  const prev = () => {
    if (step > 0) {
      setDirection(-1);
      setStep((prev) => prev - 1);
    }
  };

  const goToStep = (target: number) => {
    if (target === step) return;
    setDirection(target > step ? 1 : -1);
    setStep(target);
  };

  const CurrentStep = steps[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm pointer-events-auto">
      {/* Modal Card Shell */}
      <div className="relative w-full max-w-[580px] bg-white dark:bg-[#16181d] rounded-3xl shadow-2xl border border-gray-100 dark:border-white/10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="px-6 sm:px-8 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-[#F49B31] border border-[#F49B31]/20">
              {step + 1} of {steps.length}
            </span>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
              {STEP_LABELS[step]}
            </span>
          </div>

          <button
            onClick={onFinish}
            aria-label="Close tutorial"
            className="p-2 rounded-full text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Step Body Stage */}
        <div className="relative flex-1 px-6 sm:px-8 py-4 overflow-hidden flex flex-col justify-center min-h-[440px]">
          <AnimatePresence mode="popLayout" custom={direction} initial={false}>
            <motion.div
              key={step}
              custom={direction}
              variants={{
                enter: (dir: number) => ({
                  x: dir > 0 ? 40 : -40,
                  opacity: 0,
                }),
                center: {
                  x: 0,
                  opacity: 1,
                },
                exit: (dir: number) => ({
                  x: dir > 0 ? -40 : 40,
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 350, damping: 32 },
                opacity: { duration: 0.18 },
              }}
              className="w-full flex flex-col items-center"
            >
              <CurrentStep />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Action Footer Bar */}
        <div className="px-6 sm:px-8 py-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/60 dark:bg-white/[0.02]">
          {/* Back or Skip Button */}
          {step > 0 ? (
            <button
              onClick={prev}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white px-3 py-2 rounded-xl hover:bg-gray-200/50 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <button
              onClick={onFinish}
              className="text-sm font-medium text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 px-3 py-2 rounded-xl transition-all cursor-pointer"
            >
              Skip
            </button>
          )}

          {/* Central Pill Progress Dots */}
          <div className="flex items-center gap-1.5">
            {steps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  step === index
                    ? "w-6 bg-[#F49B31]"
                    : "w-2 bg-gray-200 dark:bg-white/20 hover:bg-gray-300 dark:hover:bg-white/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Primary Action Button (Next / Get Started) */}
          <button
            onClick={next}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F49B31] hover:bg-[#e08b26] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
          >
            {step === steps.length - 1 ? (
              <>
                Get Started
                <FiArrowRight className="w-4 h-4" />
              </>
            ) : (
              <>
                Next
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};

export default OnboardingOverlay;
