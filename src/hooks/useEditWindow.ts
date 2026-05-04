import { useState, useEffect, useRef } from 'react';

const EDIT_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Tracks whether a post is still within the 5-minute edit window.
 *
 * @param createdAt - ISO timestamp from the post's `createdAt` field
 * @returns isEditable (boolean), remainingMs (number), countdownLabel (string | null)
 *
 * NOTE: Mount this hook only inside the edit sub-panel, NOT on every card
 * in the feed, to avoid running many intervals simultaneously.
 */
export function useEditWindow(createdAt: string) {
  const getRemaining = () =>
    Math.max(0, EDIT_WINDOW_MS - (Date.now() - new Date(createdAt).getTime()));

  const [remainingMs, setRemainingMs] = useState<number>(getRemaining);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Recalculate immediately if createdAt changes
    setRemainingMs(getRemaining());

    if (getRemaining() <= 0) return;

    intervalRef.current = setInterval(() => {
      const r = getRemaining();
      setRemainingMs(r);
      if (r <= 0 && intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createdAt]);

  const isEditable = remainingMs > 0;

  /** Formatted countdown label, e.g. "4:32". Null once window closes. */
  const countdownLabel = isEditable
    ? `${Math.floor(remainingMs / 60000)}:${String(
        Math.floor((remainingMs % 60000) / 1000)
      ).padStart(2, '0')}`
    : null;

  return { isEditable, remainingMs, countdownLabel };
}
