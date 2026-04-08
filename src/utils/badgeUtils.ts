/**
 * Badge Calculation Utilities
 *
 * Implements the Wave and Ping badge display hierarchy from TAG_AND_STATUS_HIERARCHY.md
 * Only ONE badge displays at a time based on priority hierarchy.
 */

import type { Wave, Ping } from "../api/types";

// ─── Wave Badge Types ────────────────────────────────────────────────────────

export type WaveBadgeType =
  | "COMMUNITY_PICK"
  | "POSTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "IN_PROGRESS"
  | "REJECTED"
  | "COMPLETED"
  | null;

export interface WaveBadgeConfig {
  type: WaveBadgeType;
  label: string;
  color: string; // Hex color code
  bgColor?: string; // Optional background color for badges
}

// ─── Ping Badge Types ───────────────────────────────────────────────────────

export type PingBadgeType = "TOP_3" | "ACKNOWLEDGED" | "RESOLVED" | null;

export interface PingBadgeConfig {
  type: PingBadgeType;
  label: string;
  color: string;
  bgColor?: string;
}

// ─── Color Reference (from spec) ─────────────────────────────────────────────

const BADGE_COLORS = {
  YELLOW: "#FFED4E", // Top 3, Community Pick
  GREEN: "#4CAF50", // Acknowledged, Under Review, Approved
  AMBER: "#F49B31", // Resolved, In Progress
  RED: "#FF6B6B", // Rejected
  GREY: "#A09F9F", // Posted
  ORANGE: "#F49B31", // Completed (same as Amber)
} as const;

// ─── Wave Badge Calculator ──────────────────────────────────────────────────

/**
 * Calculate the appropriate Wave badge based on hierarchy.
 * Only ONE badge displays at a time.
 *
 * Hierarchy (highest to lowest priority):
 * 1. Community Pick (Yellow) - if this wave has the highest surge count for its Ping
 * 2. Posted (Grey)
 * 3. Under Review (Green)
 * 4. Approved (Green)
 * 5. In Progress (Amber)
 * 6. Rejected (Red)
 * 7. Completed (Orange)
 *
 * @param wave - The Wave to calculate badge for
 * @param allWavesForPing - All waves for this wave's parent Ping (needed for Community Pick calculation)
 * @returns Badge configuration or null if no badge applies
 */
export function calculateWaveBadge(
  wave: Wave,
  allWavesForPing: Wave[],
): WaveBadgeConfig | null {
  // Priority 1: Community Pick (Yellow)
  // Check if this wave has the highest surge count among all waves for this ping
  if (allWavesForPing.length > 0) {
    const maxSurgeCount = Math.max(
      ...allWavesForPing.map((w) => w.surgeCount || 0),
    );
    const waveSurgeCount = wave.surgeCount || 0;

    if (waveSurgeCount === maxSurgeCount && maxSurgeCount > 0) {
      return {
        type: "COMMUNITY_PICK",
        label: "Community Pick",
        color: BADGE_COLORS.YELLOW,
      };
    }
  }

  // Priority 2-7: Status-based badges
  // Only one status can be active at a time, so return based on status
  switch (wave.status) {
    case "POSTED":
      return {
        type: "POSTED",
        label: "Posted",
        color: BADGE_COLORS.GREY,
      };

    case "UNDER_REVIEW":
      return {
        type: "UNDER_REVIEW",
        label: "Under Review",
        color: BADGE_COLORS.GREEN,
      };

    case "APPROVED":
      return {
        type: "APPROVED",
        label: "Approved",
        color: BADGE_COLORS.GREEN,
      };

    case "IN_PROGRESS":
      return {
        type: "IN_PROGRESS",
        label: "In Progress",
        color: BADGE_COLORS.AMBER,
      };

    case "REJECTED":
      return {
        type: "REJECTED",
        label: "Rejected",
        color: BADGE_COLORS.RED,
      };

    case "COMPLETED":
      return {
        type: "COMPLETED",
        label: "Completed",
        color: BADGE_COLORS.ORANGE,
      };

    // Unsupported status or "ON_HOLD"
    default:
      return null;
  }
}

// ─── Ping Badge Calculator ──────────────────────────────────────────────────

/**
 * Calculate the appropriate Ping badge based on hierarchy.
 * Only ONE badge displays at a time.
 *
 * Hierarchy (highest to lowest priority):
 * 1. Top 3 (Yellow) - if ping is in the weekly top 3 by surge count
 * 2. Acknowledged (Green) - if progressStatus === "ACKNOWLEDGED"
 * 3. Resolved (Amber) - if progressStatus === "RESOLVED"
 *
 * @param ping - The Ping to calculate badge for
 * @param weeklyTop3Ids - Array of Ping IDs that are in the top 3 this week
 * @returns Badge configuration or null if no badge applies
 */
export function calculatePingBadge(
  ping: Ping,
  weeklyTop3Ids: number[] = [],
): PingBadgeConfig | null {
  // Priority 1: Top 3 (Yellow)
  if (weeklyTop3Ids.includes(ping.id)) {
    return {
      type: "TOP_3",
      label: "Top 3",
      color: BADGE_COLORS.YELLOW,
    };
  }

  // Priority 2: Acknowledged (Green)
  if (ping.progressStatus === "ACKNOWLEDGED") {
    return {
      type: "ACKNOWLEDGED",
      label: "Acknowledged",
      color: BADGE_COLORS.GREEN,
    };
  }

  // Priority 3: Resolved (Amber)
  if (ping.progressStatus === "RESOLVED") {
    return {
      type: "RESOLVED",
      label: "Resolved",
      color: BADGE_COLORS.AMBER,
    };
  }

  // No badge applies
  return null;
}

/**
 * Get color by badge type (helper for styling)
 */
export function getBadgeColor(type: WaveBadgeType | PingBadgeType): string {
  const colorMap: Record<string, string> = {
    COMMUNITY_PICK: BADGE_COLORS.YELLOW,
    POSTED: BADGE_COLORS.GREY,
    UNDER_REVIEW: BADGE_COLORS.GREEN,
    APPROVED: BADGE_COLORS.GREEN,
    IN_PROGRESS: BADGE_COLORS.AMBER,
    REJECTED: BADGE_COLORS.RED,
    COMPLETED: BADGE_COLORS.ORANGE,
    TOP_3: BADGE_COLORS.YELLOW,
    ACKNOWLEDGED: BADGE_COLORS.GREEN,
    RESOLVED: BADGE_COLORS.AMBER,
  };

  return colorMap[type as string] || "#000000";
}
