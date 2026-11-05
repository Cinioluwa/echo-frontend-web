import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import pingService from "../../api/services/ping.service";
import { loadRelatedPings } from "../../components/admin/PingDetail/loadRelatedPings";
import type { RelatedPing } from "../../components/admin/PingDetail/types";
import SurgeIcon from "../../components/shared/SurgeIcon";
import type { Comment, Ping, Wave } from "../../api/types";
import PrintShell from "./PrintShell";
import { daysBetween, formatAbsolute, pingFilename } from "./format";
import waveCommunityPick from "../../assets/badges/wave-community-pick.svg";

const WAVE_STATUS_LABEL: Record<string, string> = {
    POSTED: "Posted",
    UNDER_REVIEW: "Under review",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    IN_PROGRESS: "In progress",
    COMPLETED: "Completed",
    ON_HOLD: "On hold",
};

const pingStatusLabel = (ping: Ping) => {
    if (ping.resolvedAt || ping.progressStatus === "RESOLVED") return "Resolved";
    if (ping.progressStatus === "IN_PROGRESS") return "In progress";
    if (ping.progressStatus === "ACKNOWLEDGED" || ping.acknowledgedAt) return "Acknowledged";
    return "Open";
};

/** Anonymous content shows only its alias; the real identity is never printed. */
const commentAuthor = (comment: Comment) => {
    if (comment.isAnonymous) return comment.anonymousAlias || "Anonymous";
    const name = `${comment.author?.firstName ?? ""} ${comment.author?.lastName ?? ""}`.trim();
    return name || comment.anonymousAlias || "Anonymous";
};

const pingAuthor = (ping: Ping) => {
    if (ping.isAnonymous) return ping.anonymousAlias || "Anonymous";
    return ping.author ? `${ping.author.firstName} ${ping.author.lastName}`.trim() : ping.anonymousAlias || "Anonymous";
};

/** Same wording the admin wave card uses. */
const waveAuthor = (wave: Wave) => (wave.author ? `${wave.author.firstName} ${wave.author.lastName}` : "Anonymous");

const buildTimeline = (ping: Ping) => {
    const events: Array<{ status: string; at?: string }> = [{ status: "Ping Posted", at: ping.createdAt }];
    if (ping.acknowledgedAt) events.push({ status: "Acknowledged by Admin", at: ping.acknowledgedAt });
    const assignee = ping.assignedToUser
        ? `${ping.assignedToUser.firstName ?? ""} ${ping.assignedToUser.lastName ?? ""}`.trim() || ping.assignedToUser.email
        : ping.assignedToBody?.name;
    if (assignee) events.push({ status: `Assigned to ${assignee}`, at: (ping as Ping & { assignedAt?: string | null }).assignedAt ?? undefined });
    if (ping.resolvedAt) events.push({ status: "Resolved", at: ping.resolvedAt });
    return events;
};

const PingPrintPage = () => {
    const { pingId } = useParams<{ pingId: string }>();
    const [ping, setPing] = useState<Ping | null>(null);
    const [related, setRelated] = useState<RelatedPing[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!pingId) return;
        let cancelled = false;
        (async () => {
            try {
                const data = await pingService.getPingById(pingId);
                const relatedPings = data.category?.name
                    ? await loadRelatedPings(data.category.name, data.id, data.title).catch(() => [])
                    : [];
                if (cancelled) return;
                setRelated(relatedPings);
                setPing(data);
            } catch (err: any) {
                if (!cancelled) setError(err?.response?.data?.error || err?.message || "Failed to load ping");
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [pingId]);

    const waves = useMemo(
        () =>
            [...(ping?.waves ?? [])]
                .filter((wave) => wave.status !== "REJECTED")
                .sort((a, b) => (b._count?.surges ?? b.surgeCount) - (a._count?.surges ?? a.surgeCount))
                .slice(0, 2),
        [ping],
    );

    const topComments = useMemo(
        () =>
            (ping?.comments ?? [])
                .filter((comment) => !comment.parentCommentId)
                .sort(
                    (a, b) =>
                        (b.surgeCount ?? 0) - (a.surgeCount ?? 0) || b.createdAt.localeCompare(a.createdAt),
                )
                .slice(0, 3),
        [ping],
    );

    const status = error ? "error" : ping ? "ready" : "loading";
    const title = ping?.title ?? "Ping";
    const resolved = !!ping?.resolvedAt;
    const response = ping?.officialResponse;
    const responderRole =
        response?.author?.role === "ADMIN" || response?.author?.role === "SUPER_ADMIN"
            ? "Institutional Admin"
            : "Representative";

    return (
        <PrintShell
            footerTitle={title}
            filename={pingFilename(title)}
            status={status}
            errorMessage={error ?? undefined}
        >
            {ping && (
                <>
                    <section className="ep-section">
                        <h1 className="ep-doc-title">{ping.title}</h1>
                        <div className="ep-meta">
                            <span><strong>Category:</strong> {ping.category?.name ?? "General"}</span>
                            <span><strong>Author:</strong> {pingAuthor(ping)}</span>
                            <span><strong>Posted:</strong> {formatAbsolute(ping.createdAt)}</span>
                            <span><strong>Status:</strong> {pingStatusLabel(ping)}</span>
                        </div>
                        <p className="ep-body">{ping.content}</p>
                    </section>

                    <section className="ep-section">
                        <h2 className="ep-h2">Key numbers</h2>
                        <div className="ep-kpis ep-kpis--two">
                            <div className="ep-kpi">
                                <p className="ep-kpi-label">Total surges</p>
                                <p className="ep-kpi-value" style={{ display: "flex", alignItems: "center", gap: "1.5mm" }}>
                                    <SurgeIcon width={12} height={16} fill="var(--echo-text-e8911a)" />
                                    {ping.surgeCount}
                                </p>
                            </div>
                            <div className="ep-kpi">
                                <p className="ep-kpi-label">{resolved ? "Days to resolve" : "Days unresolved"}</p>
                                <p className="ep-kpi-value">
                                    {resolved && ping.resolvedAt
                                        ? daysBetween(ping.createdAt, ping.resolvedAt)
                                        : daysBetween(ping.createdAt)}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="ep-section">
                        <h2 className="ep-h2">Official response</h2>
                        {response ? (
                            <div className="ep-card ep-card--accent" style={{ marginTop: 0 }}>
                                <p className="ep-small">
                                    {responderRole} · {formatAbsolute(response.createdAt)}
                                </p>
                                <p className="ep-body" style={{ marginTop: "1mm" }}>{response.content}</p>
                            </div>
                        ) : (
                            <p className="ep-empty">No official response yet.</p>
                        )}
                    </section>

                    <section className="ep-section">
                        <h2 className="ep-h2">Top waves</h2>
                        {waves.length === 0 ? (
                            <p className="ep-empty">No waves have been proposed for this ping yet.</p>
                        ) : (
                            waves.map((wave, index) => (
                                <div className="ep-card" key={wave.id} style={index === 0 ? { marginTop: 0 } : undefined}>
                                    <div className="ep-card-head">
                                        {index === 0 ? (
                                            <img src={waveCommunityPick} alt="Community Pick" className="ep-community-pick-badge" />
                                        ) : (
                                            <span className="ep-tag">
                                                <img src="/assets/icon/dot-blue.svg" alt="" className="ep-tag-dot" />
                                                Alternative
                                            </span>
                                        )}
                                        <span className="ep-surge">
                                            <SurgeIcon width={9} height={12} fill="var(--echo-text-f49b31)" />
                                            {wave._count?.surges ?? wave.surgeCount}
                                        </span>
                                    </div>
                                    <p className="ep-small">
                                        {waveAuthor(wave)} · {WAVE_STATUS_LABEL[wave.status] ?? wave.status} · {formatAbsolute(wave.createdAt)}
                                    </p>
                                    <p className="ep-body" style={{ marginTop: "1.5mm" }}>{wave.solution}</p>
                                </div>
                            ))
                        )}
                    </section>

                    <section className="ep-section">
                        <h2 className="ep-h2">Top comments</h2>
                        {topComments.length === 0 ? (
                            <p className="ep-empty">No comments yet.</p>
                        ) : (
                            topComments.map((comment, index) => (
                                <div className="ep-card" key={comment.id} style={index === 0 ? { marginTop: 0 } : undefined}>
                                    <p className="ep-small" style={{ marginTop: 0 }}>
                                        <strong style={{ color: "var(--echo-text-primary)" }}>{commentAuthor(comment)}</strong> · {formatAbsolute(comment.createdAt)}
                                    </p>
                                    <p className="ep-body" style={{ marginTop: "1mm" }}>{comment.content}</p>
                                </div>
                            ))
                        )}
                    </section>

                    <section className="ep-section">
                        <h2 className="ep-h2">Status timeline</h2>
                        <ul className="ep-timeline">
                            {buildTimeline(ping).map((event, index) => (
                                <li key={index}>
                                    <div>
                                        <strong>{event.status}</strong>
                                        {event.at && <p className="ep-small">{formatAbsolute(event.at)}</p>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section className="ep-section">
                        <h2 className="ep-h2">Related pings</h2>
                        {related.length === 0 ? (
                            <p className="ep-empty">No related pings.</p>
                        ) : (
                            related.map((item) => (
                                <div className="ep-row" key={item.id}>
                                    <div style={{ minWidth: 0 }}>
                                        <strong style={{ overflowWrap: "anywhere" }}>{item.title}</strong>
                                        <p className="ep-small">{item.category}</p>
                                    </div>
                                    <span className="ep-surge">
                                        <SurgeIcon width={9} height={12} fill="var(--echo-text-f49b31)" />
                                        {item.waveCount}
                                    </span>
                                </div>
                            ))
                        )}
                    </section>
                </>
            )}
        </PrintShell>
    );
};

export default PingPrintPage;
