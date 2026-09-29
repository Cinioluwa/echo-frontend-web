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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-200">
      {/* Modal Card Shell — Warm, Light Aesthetic matching Echo */}
      <div className="relative w-full max-w-[580px] bg-white rounded-3xl shadow-[0_20px_60px_-15px_rgba(244,155,49,0.18),0_10px_30px_-10px_rgba(0,0,0,0.08)] border border-[#F49B31]/20 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header Bar */}
        <div className="px-6 sm:px-8 pt-6 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[#FEF5EA] text-[#F49B31] border border-[#F49B31]/30">
              {step + 1} of {steps.length}
            </span>
            <span className="text-xs font-medium text-[#7A808C]">
              {STEP_LABELS[step]}
            </span>
          </div>

          <button
            onClick={onFinish}
            aria-label="Close tutorial"
            className="p-2 rounded-full text-[#7A808C] hover:text-[#060B13] hover:bg-[#FEF5EA] transition-colors cursor-pointer"
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
        <div className="px-6 sm:px-8 py-4 border-t border-[#F0E6D8] flex items-center justify-between bg-[#FAF6F1]">
          {/* Back or Skip Button */}
          {step > 0 ? (
            <button
              onClick={prev}
              className="flex items-center gap-1.5 text-sm font-semibold text-[#7A808C] hover:text-[#060B13] px-3.5 py-2 rounded-xl hover:bg-[#EFE8DD]/70 transition-all cursor-pointer"
            >
              <FiArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <button
              onClick={onFinish}
              className="text-sm font-medium text-[#7A808C] hover:text-[#060B13] px-3.5 py-2 rounded-xl hover:bg-[#EFE8DD]/70 transition-all cursor-pointer"
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
                    : "w-2 bg-[#E2D6C5] hover:bg-[#D4C5B0]"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Primary Action Button (Next / Get Started) */}
          <button
            onClick={next}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#F49B31] hover:bg-[#E08A24] text-white font-semibold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
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
