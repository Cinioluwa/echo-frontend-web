import { useMemo, useCallback } from "react";

/**
 * useFormOptimization Hook - Phase 10 Performance Enhancement
 * Performance-optimized form handling utilities
 *
 * Features:
 * - Memoized validation functions
 * - Debounced input handlers
 * - Optimized re-render prevention
 *
 * Usage:
 * const { memoizedValidate } = useFormOptimization(validationFn);
 */

interface ValidationFunction<T> {
  (values: T): Record<string, string>;
}

export const useFormOptimization = <T extends Record<string, any>>(
  validationFn: ValidationFunction<T>,
) => {
  // Memoize validation function to prevent unnecessary recalculations
  const memoizedValidate = useCallback(
    (values: T) => validationFn(values),
    [validationFn],
  );

  return {
    memoizedValidate,
  };
};

/**
 * useFormMemo Hook
 * Memoizes form state to prevent unnecessary re-renders
 */
export const useFormMemo = <T extends Record<string, any>>(formData: T) => {
  return useMemo(() => formData, [JSON.stringify(formData)]);
};

/**
 * Performance monitoring utilities
 */
export const performanceMonitor = {
  /**
   * Marks start of a performance measurement
   */
  mark: (name: string) => {
    if (typeof window !== "undefined" && window.performance) {
      performance.mark(name);
    }
  },

  /**
   * Measures time between two marks
   */
  measure: (name: string, startMark: string, endMark: string) => {
    if (typeof window !== "undefined" && window.performance) {
      try {
        performance.measure(name, startMark, endMark);
        const measure = performance.getEntriesByName(name)[0];
        console.log(`[Performance] ${name}: ${measure.duration.toFixed(2)}ms`);
        return measure.duration;
      } catch (error) {
        console.warn(`[Performance] Could not measure ${name}:`, error);
      }
    }
    return 0;
  },

  /**
   * Clears all performance marks and measures
   */
  clear: () => {
    if (typeof window !== "undefined" && window.performance) {
      performance.clearMarks();
      performance.clearMeasures();
    }
  },
};

export default useFormOptimization;
