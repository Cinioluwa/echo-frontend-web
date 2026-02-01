/**
 * Animation Variants for Wave Components
 * Using Framer Motion
 */

import type { Variants } from "framer-motion";

/**
 * Tab Switch Animation
 * Duration: 300ms
 * Easing: cubic-bezier(0.4, 0, 0.2, 1)
 */
export const tabVariants: Variants = {
  active: {
    backgroundColor: "#F49B31",
    color: "#FFFFFF",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
  },
  inactive: {
    backgroundColor: "#FEF5EA",
    color: "#000000",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const },
  },
} as const;

/**
 * Form Content Transition
 * Exit Animation: Opacity 1 → 0, Y 0 → -10px, Duration 200ms
 * Enter Animation: Opacity 0 → 1, Y -10px → 0, Duration 300ms
 */
export const formContentVariants: Variants = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeInOut" as const },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2, ease: "easeInOut" as const },
  },
} as const;

/**
 * Dropdown Animation
 * Fade and slide down
 * Stagger children by 50ms
 */
export const dropdownVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    transition: { duration: 0.2 },
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      when: "beforeChildren" as const,
      staggerChildren: 0.05,
    },
  },
} as const;

/**
 * Ping Result Card Animation
 * Individual card in search results
 * Staggered fade-in
 */
export const pingResultCardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut" as const,
    },
  },
} as const;

/**
 * Selected Ping Card Animation
 * Spring animation for smooth appearance
 * Y: -20 → 0, Opacity: 0 → 1
 */
export const selectedPingVariants: Variants = {
  hidden: {
    y: -20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 200,
      damping: 20,
    },
  },
} as const;

/**
 * Ping Result Card Hover Animation
 */
export const pingCardHoverVariants: Variants = {
  rest: {
    scale: 1,
    transition: { duration: 0.2 },
  },
  hover: {
    scale: 1.01,
    boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 },
  },
} as const;

/**
 * No Ping Found Card Animation
 */
export const noPingFoundVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut" as const,
    },
  },
} as const;
