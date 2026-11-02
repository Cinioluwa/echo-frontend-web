import { adminService } from "../../../api/services/admin.service";
import type { OverviewResponse, SurgingIssue, IssueByCategory } from "../../../api/types/admin.types";
import type { TrendDirection } from "../../shared/TrendArrow";
import type { FollowUpItem } from "./FollowUpQueueCard";

export interface SoundboardSnapshot {
    overview: OverviewResponse;
    surging: SurgingIssue[];
    issuesByCategory: IssueByCategory[] | null;
}

/** The three requests that feed the soundboard; shared by the live page and the PDF export. */
export const loadSoundboardSnapshot = async (): Promise<SoundboardSnapshot> => {
    const [overview, surging, issuesByCategory] = await Promise.all([
        adminService.getOverview({ months: 1 }),
        adminService.getSurgingIssues({ hours: 6, limit: 3 }),
        adminService.getIssuesByCategory().catch(() => null),
    ]);
    return { overview, surging: surging.items, issuesByCategory };
};

export const buildFollowUps = (overview: OverviewResponse): FollowUpItem[] =>
    [
        {
            id: "approved-waves",
            title: "Approved waves not being implemented",
            description: `${overview.stalledWavesCount} approved waves require progression`,
            count: overview.stalledWavesCount,
            iconColor: "green" as const,
            icon: "/assets/icon/not-implemented.svg",
        },
        {
            id: "awaiting-approval",
            title: "Waves awaiting approval",
            description: `${overview.wavesAwaitingApproval} waves need review`,
            count: overview.wavesAwaitingApproval,
            iconColor: "red" as const,
            icon: "/assets/icon/awaiting-approval.svg",
        },
        {
            id: "acknowledged-stalling",
            title: "Acknowledged pings stalling",
            description: `${overview.stalledAcknowledgedPingsCount} acknowledged pings need progression`,
            count: overview.stalledAcknowledgedPingsCount,
            iconColor: "red" as const,
            icon: "/assets/icon/acknowledged-pings.svg",
        },
    ].filter((item) => item.count > 0);

export interface StatBadge {
    label: string;
    direction?: TrendDirection;
    color: "green" | "red" | "orange";
}

export interface StatCardData {
    value: string;
    badge?: StatBadge;
}

const signed = (n: number, digits = 0) => `${n > 0 ? "+" : n < 0 ? "-" : ""}${Math.abs(n).toFixed(digits)}`;

/** Badge arrows always follow the sign of the number they sit next to. */
export const buildStatCards = (overview: OverviewResponse) => {
    const { resolutionRate, avgResolveTimeDays, unresolvedOlderThanDays } = overview.summaryCards;

    const rateDelta = resolutionRate.deltaPercentagePoints;
    const resolution: StatCardData = {
        value: `${resolutionRate.value}%`,
        badge:
            rateDelta === 0
                ? { label: "No change this month", color: "orange" }
                : {
                      label: `${signed(rateDelta, 1)} pts this month`,
                      direction: rateDelta > 0 ? "up" : "down",
                      color: rateDelta > 0 ? "green" : "red",
                  },
    };

    const avgDelta = avgResolveTimeDays.deltaDays;
    const hasAvg = avgResolveTimeDays.value > 0;
    const avgTime: StatCardData = {
        value: hasAvg ? `${avgResolveTimeDays.value.toFixed(1)} days` : "N/A",
        badge:
            !hasAvg || avgDelta == null
                ? undefined
                : avgDelta === 0
                  ? { label: "No change this month", color: "orange" }
                  : {
                        label: `${signed(avgDelta, 1)}d ${avgDelta < 0 ? "faster" : "slower"}`,
                        direction: avgDelta > 0 ? "up" : "down",
                        color: avgDelta < 0 ? "green" : "red",
                    },
    };

    const overdueDelta = unresolvedOlderThanDays.deltaAbsolute;
    const overdue: StatCardData = {
        value: unresolvedOlderThanDays.value.toString(),
        badge:
            overdueDelta === 0
                ? { label: "No change this week", color: "orange" }
                : {
                      label: `${signed(overdueDelta)} this week`,
                      direction: overdueDelta > 0 ? "up" : "down",
                      color: overdueDelta > 0 ? "red" : "green",
                  },
    };

    return { resolution, avgTime, overdue };
};
