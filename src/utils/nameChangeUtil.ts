/**
 * Name Change Cooldown Utility
 * Handles logic for 30-day cooldown and 15-minute grace period
 */

const GRACE_PERIOD_MS = 15 * 60 * 1000; // 15 minutes
const COOLDOWN_PERIOD_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

export interface NameChangeStatus {
  canChangeName: boolean;
  timeRemaining: number; // milliseconds until next change allowed
  isInGracePeriod: boolean;
  nextChangeTime: Date | null;
  message: string;
}

/**
 * Determines if a user can change their name
 * Grace period: 15 minutes from account creation
 * Cooldown: 30 days from last name change
 */
export function getNameChangeStatus(
  createdAt: string,
  lastNameChangeAt?: string,
): NameChangeStatus {
  const now = new Date();
  const accountCreated = new Date(createdAt);
  const timeSinceCreation = now.getTime() - accountCreated.getTime();

  // Check if in grace period (15 minutes from creation)
  if (timeSinceCreation < GRACE_PERIOD_MS) {
    return {
      canChangeName: true,
      timeRemaining: 0,
      isInGracePeriod: true,
      nextChangeTime: null,
      message:
        "You can change your name during the 15-minute grace period after account creation",
    };
  }

  // Check cooldown from last name change
  if (lastNameChangeAt) {
    const lastChange = new Date(lastNameChangeAt);
    const timeSinceChange = now.getTime() - lastChange.getTime();

    if (timeSinceChange < COOLDOWN_PERIOD_MS) {
      const nextChangeTime = new Date(
        lastChange.getTime() + COOLDOWN_PERIOD_MS,
      );
      const timeRemaining = nextChangeTime.getTime() - now.getTime();

      return {
        canChangeName: false,
        timeRemaining,
        isInGracePeriod: false,
        nextChangeTime,
        message: `You can change your name again in ${formatTimeRemaining(timeRemaining)}`,
      };
    }
  }

  return {
    canChangeName: true,
    timeRemaining: 0,
    isInGracePeriod: false,
    nextChangeTime: null,
    message: "You can change your name",
  };
}

/**
 * Formats remaining time in a human-readable way
 */
export function formatTimeRemaining(ms: number): string {
  const days = Math.floor(ms / (24 * 60 * 60 * 1000));
  const hours = Math.floor((ms % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
  const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

/**
 * Formats the next available change time in a readable format
 */
export function formatNextChangeTime(date: Date | null): string {
  if (!date) return "";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Checks if a name has actually changed
 */
export function hasNameChanged(
  originalFirstName: string,
  originalLastName: string,
  newFirstName: string,
  newLastName: string,
): boolean {
  return (
    originalFirstName.trim() !== newFirstName.trim() ||
    originalLastName.trim() !== newLastName.trim()
  );
}
