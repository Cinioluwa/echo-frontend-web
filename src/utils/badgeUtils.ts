/**
 * Badge Calculation Utilities
 *
 * Implements the Wave and Ping badge display hierarchy from TAG_AND_STATUS_HIERARCHY.md
 * Only ONE badge displays at a time based on priority hierarchy.
 */

import type { Wave, Ping } from "../api/types";

// Badge SVGs from Figma
export {
  waveCommunityPick,
  waveProposed,
  waveUnderReview,
  waveInProgress,
  waveApproved,
  waveRejected,
  waveCompleted,
  waveImplementing,
  pingTop3,
  pingAcknowledged,
  pingResolved,
  pingOpen,
};
import waveCommunityPick from "../assets/badges/wave-community-pick.svg";
import waveProposed from "../assets/badges/wave-proposed.svg";
import waveUnderReview from "../assets/badges/wave-under-review.svg";
import waveInProgress from "../assets/badges/wave-in-progress.svg";
import waveApproved from "../assets/badges/wave-approved.svg";
import waveRejected from "../assets/badges/wave-rejected.svg";
import waveCompleted from "../assets/badges/wave-completed.svg";
import waveImplementing from "../assets/badges/wave-implementing.svg";

import pingTop3 from "../assets/badges/ping-top3.svg";
import pingAcknowledged from "../assets/badges/ping-acknowledged.svg";
import pingResolved from "../assets/badges/ping-resolved.svg";
import pingOpen from "../assets/badges/ping-open.svg";

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
  svg: string; // Pre-rendered SVG asset path from Figma
}

// ─── Ping Badge Types ───────────────────────────────────────────────────────

export type PingBadgeType = "TOP_3" | "ACKNOWLEDGED" | "RESOLVED" | null;

export interface PingBadgeConfig {
  type: PingBadgeType;
  label: string;
  color: string;
  bgColor?: string;
  svg: string;
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
 * 2. Rejected (Red)
 * 3. Completed (Orange)
 * 4. In Progress (Amber)
 * 5. Approved (Green)
 * 6. Under Review (Green)
 * 7. Posted (Grey)
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
        svg: waveCommunityPick,
      };
    }
  }

  // Priority 2-7: Status-based badges
  // Only one status can be active at a time, so return based on status
  switch (wave.status) {
    case "REJECTED":
      return {
        type: "REJECTED",
        label: "Rejected",
        color: BADGE_COLORS.RED,
        svg: waveRejected,
      };

    case "COMPLETED":
      return {
        type: "COMPLETED",
        label: "Completed",
        color: BADGE_COLORS.ORANGE,
        svg: waveCompleted,
      };

    case "IN_PROGRESS":
      return {
        type: "IN_PROGRESS",
        label: "In Progress",
        color: BADGE_COLORS.AMBER,
        svg: waveInProgress,
      };

    case "APPROVED":
      return {
        type: "APPROVED",
        label: "Approved",
        color: BADGE_COLORS.GREEN,
        svg: waveApproved,
      };

    case "UNDER_REVIEW":
      return {
        type: "UNDER_REVIEW",
        label: "Under Review",
        color: BADGE_COLORS.GREEN,
        svg: waveUnderReview,
      };

    case "POSTED":
      return {
        type: "POSTED",
        label: "Posted",
        color: BADGE_COLORS.GREY,
        svg: waveProposed,
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
      svg: pingTop3,
    };
  }

  // Priority 2: Acknowledged (Green)
  if (ping.progressStatus === "ACKNOWLEDGED") {
    return {
      type: "ACKNOWLEDGED",
      label: "Acknowledged",
      color: BADGE_COLORS.GREEN,
      svg: pingAcknowledged,
    };
  }

  // Priority 3: Resolved (Amber)
  if (ping.progressStatus === "RESOLVED" || !!ping.resolvedAt) {
    return {
      type: "RESOLVED",
      label: "Resolved",
      color: BADGE_COLORS.AMBER,
      svg: pingResolved,
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
