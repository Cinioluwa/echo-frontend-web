import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiArrowLeft, FiX } from "react-icons/fi";

import Welcome from "./Welcome";
import RaiseProblem from "./RaiseProblem";
import ProposeSolution from "./ProposeSolution";
import Surge from "./Surge";

const steps = [Welcome, RaiseProblem, ProposeSolution, Surge];

const OnboardingOverlay = ({ onFinish }: { onFinish?: () => void }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const next = () => {
    if (step < steps.length - 1) {
      setStep((prev) => prev + 1);
    } else {
      onFinish?.();
    }
  };

  const prev = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };

  const CurrentStep = steps[step];

  return (
    <div>
      <div className="fixed inset-0 z-40 bg-black/60 pointer-events-auto" />
      <div className="fixed inset-0 z-50 pointer-events-auto">
        {/* Close Button */}
        <div className="h-full w-full overflow-y-scroll">
          <button
            onClick={onFinish}
            className="absolute top-6 cursor-pointer right-6 text-white text-2xl"
          >
            <FiX />
          </button>
          {/* Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full flex justify-center items-center flex-col gap-10 p-20"
            >
              <CurrentStep />
              <div className="mb-5 inset-x-0 bottom-10 flex items-center justify-center gap-6 px-4">
                {/* Back */}
                {step > 0 && (
                  <button
                    onClick={prev}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow"
                  >
                    <FiArrowLeft />
                    Back
                  </button>
                )}
                {/* Dots */}
                <div className="flex gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`h-2 w-2 rounded-full ${
                        step === index ? "bg-sky-400" : "bg-sky-200/80"
                      }`}
                    />
                  ))}
                </div>
                {/* Next */}
                <button
                  onClick={next}
                  className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow font-medium"
                >
                  {step === steps.length - 1 ? "Finish" : "Next"}
                  <FiArrowRight />
                </button>
              </div>
              
              {/* Skip Tutorial explicit button */}
              {step < steps.length - 1 && (
                <button 
                  onClick={onFinish}
                  className="absolute bottom-6 text-white/70 hover:text-white font-medium text-sm transition-colors"
                >
                  Skip Tutorial (Don't show again)
                </button>
              )}
            </motion.div>
          </AnimatePresence>
          {/* Navigation */}
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay;
