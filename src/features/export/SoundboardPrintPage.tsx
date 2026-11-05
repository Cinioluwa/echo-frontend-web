import { useEffect, useState } from "react";
import SurgeIcon from "../../components/shared/SurgeIcon";
import TrendArrow from "../../components/shared/TrendArrow";
import {
    buildFollowUps,
    buildStatCards,
    loadSoundboardSnapshot,
    type SoundboardSnapshot,
    type StatCardData,
} from "../../components/admin/AdminSoundboard/soundboardData";
import PrintShell from "./PrintShell";
import { daysBetween, formatAbsoluteDate, soundboardFilename } from "./format";

const Kpi = ({ label, data, note }: { label: string; data: StatCardData; note: string }) => (
    <div className="ep-kpi">
        <p className="ep-kpi-label">{label}</p>
        <p className="ep-kpi-value">{data.value}</p>
        <p className="ep-kpi-note">{note}</p>
        {data.badge && (
            <p className="ep-kpi-trend">
                {data.badge.direction && <TrendArrow direction={data.badge.direction} size={10} />}
                {data.badge.label}
            </p>
        )}
    </div>
);

const SoundboardPrintPage = () => {
    const [snapshot, setSnapshot] = useState<SoundboardSnapshot | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        loadSoundboardSnapshot()
            .then((data) => {
                if (!cancelled) setSnapshot(data);
            })
            .catch((err: any) => {
                if (!cancelled) setError(err?.response?.data?.error || err?.message || "Failed to load soundboard");
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const status = error ? "error" : snapshot ? "ready" : "loading";
    const stats = snapshot ? buildStatCards(snapshot.overview) : null;
    const followUps = snapshot ? buildFollowUps(snapshot.overview) : [];
    const categories = snapshot
        ? snapshot.issuesByCategory?.map((c) => ({
              id: c.categoryId,
              name: c.categoryName,
              openCount: c.openCount,
              resolved: c.resolutionRate,
              pings: c.topPings,
          })) ??
          snapshot.overview.categoriesStats.map((c) => ({
              id: c.categoryId,
              name: c.categoryName,
              openCount: c.openCount,
              resolved: c.resolutionPercentage,
              pings: [],
          }))
        : [];

    return (
        <PrintShell
            footerTitle="Soundboard"
            filename={soundboardFilename()}
            status={status}
            errorMessage={error ?? undefined}
        >
            {snapshot && stats && (
                <>
                    <h1 className="ep-doc-title">Soundboard snapshot</h1>

                    <section className="ep-section">
                        <h2 className="ep-h2">Surging issues</h2>
                        {snapshot.surging.length === 0 ? (
                            <p className="ep-empty">No surging issues right now.</p>
                        ) : (
                            snapshot.surging.map((item) => (
                                <div className="ep-card ep-card--accent ep-row" key={item.pingId}>
                                    <div style={{ minWidth: 0 }}>
                                        <strong style={{ overflowWrap: "anywhere" }}>{item.title}</strong>
                                        <p className="ep-small">{item.category?.name ?? "Uncategorized"}</p>
                                    </div>
                                    <span className="ep-surge" style={{ gap: 0 }}>
                                        +<SurgeIcon width={9} height={12} fill="var(--echo-text-f49b31)" />
                                        {item.currentRatePerHour.toFixed(1)}/hr
                                    </span>
                                </div>
                            ))
                        )}
                    </section>

                    <section className="ep-section">
                        <h2 className="ep-h2">Follow up</h2>
                        {followUps.length === 0 ? (
                            <p className="ep-empty">No follow-ups pending.</p>
                        ) : (
                            followUps.map((item) => (
                                <div className="ep-card ep-row" key={item.id}>
                                    <div style={{ minWidth: 0 }}>
                                        <strong>{item.title}</strong>
                                        <p className="ep-small">{item.description}</p>
                                    </div>
                                    <span className="ep-surge">{item.count}</span>
                                </div>
                            ))
                        )}
                    </section>

                    <section className="ep-section">
                        <h2 className="ep-h2">Key metrics</h2>
                        <div className="ep-kpis">
                            <Kpi label="Resolution Rate" data={stats.resolution} note="*Of pings resolved" />
                            <Kpi label="Average Resolution Time" data={stats.avgTime} note="*Days to resolve" />
                            <Kpi label="Overdue (>7D)" data={stats.overdue} note="*Need attention" />
                        </div>
                    </section>

                    <section className="ep-section">
                        <h2 className="ep-h2">Issues by category</h2>
                        {categories.length === 0 ? (
                            <p className="ep-empty">No categories yet.</p>
                        ) : (
                            categories.map((category, index) => (
                                <div className="ep-card" key={category.id} style={index === 0 ? { marginTop: 0 } : undefined}>
                                    <div className="ep-card-head">
                                        <h3 className="ep-card-title">{category.name}</h3>
                                        <span className="ep-small" style={{ whiteSpace: "nowrap" }}>
                                            {category.openCount} open · {Math.round(category.resolved)}% resolved
                                        </span>
                                    </div>
                                    {category.pings.slice(0, 2).length === 0 ? (
                                        <p className="ep-small">No open pings listed.</p>
                                    ) : (
                                        category.pings.slice(0, 2).map((ping) => (
                                            <div className="ep-row" key={ping.id}>
                                                <div style={{ minWidth: 0 }}>
                                                    <span style={{ overflowWrap: "anywhere" }}>{ping.title}</span>
                                                    <p className="ep-small">
                                                        Posted {formatAbsoluteDate(ping.createdAt)} · {daysBetween(ping.createdAt)}d old
                                                    </p>
                                                </div>
                                                <span className="ep-surge">
                                                    <SurgeIcon width={9} height={12} fill="var(--echo-text-f49b31)" />
                                                    {ping.surgeCount}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ))
                        )}
                    </section>
                </>
            )}
        </PrintShell>
    );
};

export default SoundboardPrintPage;
