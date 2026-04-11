import { motion, AnimatePresence } from "framer-motion";
import { useState, type ReactNode } from "react";

interface TooltipProps {
  children: ReactNode;
  content: ReactNode;
  position?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
  tooltipClass?: string;
}

export const Tooltip = ({
  children,
  content,
  position = "top",
  delay = 0.1,
  className = "",
  tooltipClass = "",
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  const positionStyles = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const animationVariants = {
    hidden: { opacity: 0, y: 5, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <div
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      <AnimatePresence>
        {visible && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={animationVariants}
            transition={{ duration: delay }}
            className={`absolute z-50 px-3 py-2 text-[10px] rounded-lg shadow-lg bg-black text-white whitespace-nowrap ${positionStyles[position]} ${tooltipClass}`}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
