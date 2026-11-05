import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiArrowLeft, FiX } from "react-icons/fi";
import { createPortal } from "react-dom";

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
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onFinishRef.current?.();
    };
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
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

  const CurrentStep = steps[step];

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-2 backdrop-blur-sm animate-in fade-in duration-200 sm:p-6"
      onClick={onFinish}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Echo help tutorial"
        className="relative flex max-h-[calc(100dvh-1rem)] w-full max-w-[680px] flex-col overflow-hidden rounded-[24px] border border-[#F4E3C9] bg-white shadow-[0_20px_60px_-15px_rgba(244,155,49,0.18),0_10px_30px_-10px_rgba(0,0,0,0.12)] animate-in fade-in zoom-in-95 duration-200 sm:max-h-[calc(100dvh-3rem)] sm:rounded-[28px]"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex shrink-0 items-center justify-between gap-3 px-4 pb-2 pt-4 sm:px-8 sm:pt-6">
          <div className="flex min-w-0 items-center gap-2">
            <span className="shrink-0 rounded-full border border-[#F49B31]/30 bg-[#FEF5EA] px-2.5 py-1 text-xs font-semibold text-[#8A4B08]">
              {step + 1} of {steps.length}
            </span>
            <span className="truncate font-['Inter',sans-serif] text-xs font-medium text-[#5F656F]">
              {STEP_LABELS[step]}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onFinish?.()}
            aria-label="Close tutorial"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#5F656F] transition-colors hover:bg-[#FEF5EA] hover:text-[#060B13] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F49B31]"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Step Body Stage */}
        <div className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-2 sm:px-8 sm:py-4">
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
              className="flex w-full flex-col items-center"
            >
              <CurrentStep />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Action Footer Bar */}
        <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-1 border-t border-[#F4E3C9] bg-[#FEF5EA]/60 px-3 py-2.5 sm:gap-3 sm:px-8 sm:py-4">
          <div className="flex justify-start">
            {step > 0 ? (
              <button
                type="button"
                onClick={prev}
                className="flex min-h-11 items-center gap-1 rounded-full px-3 text-[13px] font-semibold text-[#5F656F] transition-colors hover:bg-white hover:text-[#060B13] sm:gap-1.5 sm:px-3.5 sm:text-sm"
              >
                <FiArrowLeft className="w-4 h-4" />
                Back
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onFinish?.()}
                className="min-h-11 rounded-full px-3 text-[13px] font-medium text-[#5F656F] transition-colors hover:bg-white hover:text-[#060B13] sm:px-3.5 sm:text-sm"
              >
                Skip
              </button>
            )}
          </div>

          {/* Central progress indicator */}
          <div
            className="flex items-center justify-center gap-1.5 px-2"
            role="progressbar"
            aria-label="Tutorial progress"
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={step + 1}
          >
            {steps.map((_, index) => (
              <span
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  step === index ? "w-6 bg-[#F49B31]" : "w-2 bg-[#D1C0A9]"
                }`}
              />
            ))}
          </div>

          {/* Primary Action Button (Next / Get Started) */}
          <button
            type="button"
            onClick={next}
            className="flex min-h-11 justify-self-end items-center justify-center gap-1 rounded-full bg-[#F49B31] px-3.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-[#E08A24] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F49B31] active:scale-95 sm:gap-1.5 sm:px-5 sm:text-sm"
          >
            {step === steps.length - 1 ? "Get Started" : "Next"}
            <FiArrowRight className="h-4 w-4 shrink-0" />
          </button>
        </div>

      </section>
    </div>,
    document.body,
  );
};

export default OnboardingOverlay;
