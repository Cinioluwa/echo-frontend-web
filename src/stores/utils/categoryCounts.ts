/**
 * Category Counts Utility
 * Calculates category counts from pings and waves data
 */

import type { Ping, Wave } from "../../api/types/index";

export interface CategoryCountsResult {
  counts: Record<number, number>;
  total: number;
}

/**
 * Calculate category counts from an array of pings
 * @param pings Array of ping objects
 * @returns Object containing counts per category and total count
 */
export function calculatePingCategoryCounts(
  pings: Ping[],
): CategoryCountsResult {
  const counts: Record<number, number> = {};
  let total = 0;

  pings.forEach((ping) => {
    if (ping.category?.id) {
      counts[ping.category.id] = (counts[ping.category.id] || 0) + 1;
    }
    total++;
  });

  return { counts, total };
}

/**
 * Calculate category counts from an array of waves
 * Prioritizes wave.category, falls back to wave.ping.category if available
 * @param waves Array of wave objects
 * @returns Object containing counts per category and total count
 */
export function calculateWaveCategoryCounts(
  waves: Wave[],
): CategoryCountsResult {
  const counts: Record<number, number> = {};
  let total = 0;

  waves.forEach((wave) => {
    // Try wave category first, then ping category
    const categoryId = wave.category?.id || wave.ping?.category?.id;

    if (categoryId) {
      counts[categoryId] = (counts[categoryId] || 0) + 1;
    }
    total++;
  });

  return { counts, total };
}

/**
 * Merge multiple category count results
 * Useful when combining counts from different sources (pings + waves)
 * @param results Array of CategoryCountsResult objects
 * @returns Merged counts and total
 */
export function mergeCategoryCounts(
  ...results: CategoryCountsResult[]
): CategoryCountsResult {
  const mergedCounts: Record<number, number> = {};
  let mergedTotal = 0;

  results.forEach(({ counts, total }) => {
    Object.entries(counts).forEach(([categoryId, count]) => {
      const id = Number(categoryId);
      mergedCounts[id] = (mergedCounts[id] || 0) + count;
    });
    mergedTotal += total;
  });

  return { counts: mergedCounts, total: mergedTotal };
}
