import pingService from "../../../api/services/ping.service";
import { getRelatedTitleScore } from "./relatedPingMatching";
import type { RelatedPing } from "./types";

/** Top 3 pings in the same category with a similar title; shared by the page and the PDF export. */
export const loadRelatedPings = async (
    categoryName: string,
    currentId: number,
    currentTitle: string,
): Promise<RelatedPing[]> => {
    const res = await pingService.getPingsByCategory(categoryName, { limit: 50 });
    return res.data
        .filter((p) => p.id !== currentId)
        .map((ping) => ({ ping, score: getRelatedTitleScore(currentTitle, ping.title) }))
        .filter(({ score }) => score >= 0.3)
        .sort(
            (a, b) =>
                b.score - a.score ||
                b.ping.surgeCount - a.ping.surgeCount ||
                b.ping.createdAt.localeCompare(a.ping.createdAt),
        )
        .slice(0, 3)
        .map(({ ping }) => ({
            id: ping.id.toString(),
            category: ping.category?.name || categoryName,
            title: ping.title,
            waveCount: ping.surgeCount,
        }));
};
