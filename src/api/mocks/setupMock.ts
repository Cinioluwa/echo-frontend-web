/* eslint-disable @typescript-eslint/no-explicit-any */
import MockAdapter from "axios-mock-adapter";
import api from "../axios.config";
import {
  ORG,
  categories,
  pings,
  waves,
  comments,
  announcements,
  notifications,
  resolutions,
  organizations,
  currentUser,
  setCurrentUser,
  defaultPreferences,
  studentUser,
  adminUser,
  paginate,
  MOCK_DELAY_MS,
  adminOverviewResponse,
  adminSurgingIssues,
  adminIssuesByCategory,
  adminPings,
  adminBadgesForPing,
} from "./data";
import type { Ping, Wave, Comment } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Dev-only API mock. Intercepts every axios call made through the shared `api`
// instance and answers with the in-memory fixtures in ./data. Enabled only when
// Vite runs in development mode (see src/main.tsx).
// ─────────────────────────────────────────────────────────────────────────────

type Cfg = { url?: string; baseURL?: string; params?: any; data?: any };

// Return the full URL pathname (e.g. "/api/users/login"), preserving the base
// URL's own path prefix. A root-relative axios url like "/users/login" replaces
// the base path when parsed directly, so we re-attach the base path here. Also
// handles the case where `url` is already an absolute/full combined URL.
const noSlash = (s: string) => (s || "/").replace(/\/+$/, "") || "/";
const pathOf = (c: Cfg): string => {
  const base = c.baseURL || "";
  let bp = "";
  try {
    bp = new URL(base || "http://x").pathname;
  } catch {
    // base may be relative or missing; treat as the root path.
  }
  let rp;
  try {
    rp = new URL(c.url || "/", base || "http://x").pathname;
  } catch {
    rp = c.url || "/";
  }
  bp = noSlash(bp);
  rp = noSlash(rp);
  if (rp === bp) return bp || "/";
  const joined = rp.startsWith(bp + "/") ? rp : bp + (rp.startsWith("/") ? rp : "/" + rp);
  return noSlash(joined) || "/";
};

const paramsOf = (c: Cfg): any => c.params || {};

// axios serializes request bodies to JSON strings before the adapter runs,
// so parse them back before reading fields like email/content/solution.
const bodyOf = (d: unknown): any => {
  if (!d) return {};
  if (typeof d === "string") {
    try {
      return JSON.parse(d);
    } catch {
      return {};
    }
  }
  return d;
};

// Avoid leaking live references to callers.
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

const mock = new MockAdapter(api, {
  delayResponse: MOCK_DELAY_MS,
});

const token = () => `mock-token-${Date.now()}`;

const authTokens = (user: typeof currentUser) => {
  try {
    localStorage.setItem("authToken", token());
    localStorage.setItem(
      `echo:institution-confirmed:${user.id}:${user.organizationId}`,
      "1",
    );
    localStorage.setItem(`echo:onboarding-completed:${user.id}`, "1");
  } catch {
    // storage may be unavailable in some sandboxes; ignore.
  }
};

const byId = <T extends { id: number }>(items: T[], id: string) =>
  items.find((i) => i.id === Number(id));

const adminWaves = () =>
  waves.map((wave) => ({
    ...wave,
    ping: {
      ...wave.ping,
      category: wave.category,
      progressStatus: pings.find((ping) => ping.id === wave.ping?.id)?.progressStatus ?? "NONE",
      createdAt: pings.find((ping) => ping.id === wave.ping?.id)?.createdAt ?? wave.createdAt,
    },
    _count: { ...wave._count, surges: wave._count?.surges ?? wave.surgeCount },
  }));

const mockReports = () =>
  pings.slice(0, 3).map((ping, index) => ({
    id: 700 + index,
    status: index === 0 ? "PENDING" : "RESOLVED",
    reason: index === 0 ? "inappropriate-content" : "misinformation",
    reporterId: studentUser.id,
    pingId: ping.id,
    waveId: null,
    commentId: null,
    createdAt: ping.createdAt,
    reporter: {
      id: studentUser.id,
      email: studentUser.email,
      firstName: studentUser.firstName,
      lastName: studentUser.lastName,
      displayName: null,
      profilePicture: studentUser.profilePicture ?? null,
    },
    ping: {
      id: ping.id,
      title: ping.title,
      content: ping.content,
      category: { id: ping.category?.id ?? 1, name: ping.category?.name ?? "General" },
    },
    wave: null,
    comment: null,
    reportCount: index + 1,
  }));

const mockOrgSettings = {
  organization: {
    id: ORG.id,
    name: ORG.name,
    domain: ORG.domain,
    status: "ACTIVE",
    joinPolicy: "OPEN",
    isDomainLocked: false,
    effectiveJoinPolicy: "OPEN",
    joinPolicyLocked: false,
  },
};

const mockOrgRules = {
  allowMediaAttachments: true,
  sameTopicCooldownHours: 10,
  autoFlagReportThreshold: 3,
  hideFlaggedContentPending: true,
  minSurgesForWave: 10,
};

// ── GET handlers ────────────────────────────────────────────────────────────
mock.onGet(/.*/).reply((config) => {
  const p = pathOf(config);
  const params = paramsOf(config);
  const page = Number(params.page) || 1;
  const limit = Number(params.limit) || 20;
  const sort = params.sort || "new";
  const top = Number(params.top) || 0;
  const days = params.days;
  const q = (params.q?.toString() || "").toLowerCase().trim();
  const rawCategory = params.category ?? params.categoryId;
  const catId = rawCategory ? Number(rawCategory) : undefined;

  // Auth / user
  if (p === "/api/users/me") return [200, clone(currentUser)];
  if (p === "/api/users/me/preferences")
    return [200, clone(defaultPreferences)];
  if (p === "/api/users/me/surges")
    return [200, paginate([], page, limit)];
  if (p === "/api/users/me/notification-preferences") return [200, {}];
  if (p === "/api/users/organizations")
    return [200, { organizations: clone(organizations) }];

  // Categories / announcements
  if (p === "/api/categories") return [200, clone(categories)];
  if (p === "/api/announcements") return [200, clone(announcements)];

  // Notifications
  if (p === "/api/notifications")
    return [200, { data: clone(notifications) }];

  // Public feed (soundboard)
  if (p === "/api/public/soundboard") {
    let items = [...pings];
    if (q)
      items = items.filter((i) =>
        `${i.title} ${i.content} ${i.hashtag || ""}`
          .toLowerCase()
          .includes(q),
      );
    if (catId)
      items = items.filter(
        (i) => i.category?.id === catId || i.categoryId === catId,
      );
    items.sort((a, b) =>
      sort === "trending"
        ? b.surgeCount - a.surgeCount
        : b.createdAt.localeCompare(a.createdAt),
    );
    if (top) return [200, paginate(items.slice(0, top), 1, top)];
    return [200, paginate(items, page, limit)];
  }

  // Public stream (waves)
  if (p === "/api/public/stream") {
    const items = [...waves].sort((a, b) =>
      sort === "trending"
        ? b.surgeCount - a.surgeCount
        : b.createdAt.localeCompare(a.createdAt),
    );
    return [200, paginate(items, page, limit)];
  }

  // Admin console (leaders): stats/dashboard endpoints.
  if (p === "/api/admin/overview")
    return [200, adminOverviewResponse()];
  if (p === "/api/admin/overview/surging-issues")
    return [200, adminSurgingIssues()];
  if (p === "/api/admin/issues-by-category")
    return [200, adminIssuesByCategory()];
  if (p === "/api/admin/pings") {
    let list = adminPings();
    if (catId) list = list.filter((item) => item.categoryId === catId);
    return [200, paginate(list, page, limit)];
  }
  if (p === "/api/admin/waves") {
    let list = adminWaves();
    if (params.status) list = list.filter((wave) => wave.status === params.status);
    return [200, paginate(list, page, limit)];
  }
  if (p === "/api/reports") {
    let list = mockReports();
    if (params.status) list = list.filter((report) => report.status === params.status);
    return [200, paginate(list, page, limit)];
  }
  if (p === "/api/admin/reports/analytics") {
    const reports = mockReports();
    return [200, {
      pendingReview: reports.filter((report) => report.status === "PENDING").length,
      resolvedThisWeek: reports.filter((report) => report.status !== "PENDING").length,
      activeSuspensions: 0,
    }];
  }
  if (p === "/api/admin/export/pings") {
    const header = "id,title,category,status,surgeCount\n";
    const rows = pings.map((ping) => [ping.id, ping.title, ping.category?.name ?? "General", ping.progressStatus ?? "NONE", ping.surgeCount]
      .map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
    return [200, new Blob([header + rows], { type: "text/csv" })];
  }
  if (p === "/api/admin/users")
    return [
      200,
      [studentUser, adminUser].map((u) => ({
        id: u.id,
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        role: u.role,
        status: u.status,
        organizationId: u.organizationId,
        createdAt: u.createdAt,
      })),
    ];
  if (p === "/api/admin/organization/settings") return [200, clone(mockOrgSettings)];
  if (p === "/api/admin/organization/rules") return [200, clone(mockOrgRules)];
  if (p === "/api/admin/organization/join-requests") return [200, { requests: [] }];

  // Public resolution log
  if (p === "/api/public/resolution-log") {
    let items = [...resolutions];
    if (days && days !== "all") {
      const cutoff = Date.now() - Number(days) * 24 * 3600 * 1000;
      items = items.filter(
        (r) => new Date(r.resolvedAt).getTime() >= cutoff,
      );
    }
    return [200, paginate(items, page, limit)];
  }

  // Public share metadata
  if (p.startsWith("/api/public/share/"))
    return [
      200,
      {
        type: "ping",
        id: 101,
        title: "Shared ping",
        description: "A ping from the Echo campus soundboard.",
        canonicalUrl: "/feed/101",
        orgName: ORG.name,
      },
    ];

  // Pings
  if (p === "/api/pings/me") {
    const mine = pings.filter((x) => x.authorId === currentUser.id);
    return [200, paginate(mine, page, limit)];
  }
  if (p === "/api/pings/trending") {
    const items = [...pings]
      .sort((a, b) => b.surgeCount - a.surgeCount)
      .slice(0, limit);
    return [200, clone(items)];
  }
  if (p === "/api/pings/search") {
    let items = [...pings];
    if (q)
      items = items.filter((i) =>
        `${i.title} ${i.content} ${i.hashtag || ""}`
          .toLowerCase()
          .includes(q),
      );
    return [200, paginate(items, page, limit)];
  }
  if (/^\/api\/pings\/\d+\/waves$/.test(p)) {
    const id = p.split("/")[3];
    const list = waves.filter((w) => w.ping?.id === Number(id));
    return [200, paginate(list, page, limit)];
  }
  if (/^\/api\/pings\/\d+\/comments$/.test(p)) {
    const id = p.split("/")[3];
    const list = comments
      .filter(
        (c) => c.pingId === Number(id) || (c.targetType === "ping" && c.targetId === id),
      )
      .filter((c) => !c.parentCommentId);
    return [200, paginate(list, page, limit)];
  }
  if (/^\/api\/pings\/\d+$/.test(p)) {
    const id = p.split("/").pop() || "";
    const ping = byId(pings, id);
    if (!ping) return [404, { message: "Ping not found" }];

    const pingComments = comments.filter(
      (comment) => comment.pingId === ping.id && !comment.parentCommentId,
    );
    const pingWaves = waves.filter((wave) => wave.ping?.id === ping.id);
    const sameCategoryPings = pings
      .filter((candidate) => candidate.id !== ping.id && candidate.category?.id === ping.category?.id)
      .sort((a, b) => b.surgeCount - a.surgeCount)
      .slice(0, 3)
    const relatedPings = (sameCategoryPings.length > 0 ? sameCategoryPings : pings
      .filter((candidate) => candidate.id !== ping.id)
      .sort((a, b) => b.surgeCount - a.surgeCount)
      .slice(0, 3))
      .map((candidate) => ({
        id: candidate.id,
        title: candidate.title,
        surgeCount: candidate.surgeCount,
        category: candidate.category ? { name: candidate.category.name } : null,
      }));
    return [
      200,
      clone({
        ...ping,
        comments: pingComments,
        waves: pingWaves,
        relatedPings,
        adminBadges: adminBadgesForPing(ping),
      }),
    ];
  }

  // Waves
  if (p === "/api/waves/top")
    return [
      200,
      clone([...waves].sort((a, b) => b.surgeCount - a.surgeCount).slice(0, limit)),
    ];
  if (/^\/api\/waves\/\d+\/comments$/.test(p)) {
    const id = p.split("/")[3];
    const list = comments.filter(
      (c) => c.waveId === Number(id) || (c.targetType === "wave" && c.targetId === id),
    );
    return [200, paginate(list, page, limit)];
  }
  if (/^\/api\/waves\/\d+$/.test(p)) {
    const id = p.split("/").pop() || "";
    const w = byId(waves, id);
    return w ? [200, clone(w)] : [404, { message: "Wave not found" }];
  }

  // Comments
  if (/^\/api\/comments\/[^/]+\/replies$/.test(p)) {
    const id = p.split("/")[3];
    const parent = comments.find((c) => String(c.id) === id);
    return [200, paginate(parent?.replies || [], page, limit)];
  }
  if (/^\/api\/comments\/[^/]+$/.test(p)) {
    const id = p.split("/").pop() || "";
    const c = comments.find((c) => String(c.id) === id);
    return c ? [200, clone(c)] : [404, { message: "Comment not found" }];
  }

  return [404, { message: "Mock GET route not handled", path: p }];
});

// ── POST handlers ───────────────────────────────────────────────────────────
mock.onPost(/.*/).reply((config) => {
  const p = pathOf(config);
  const body = bodyOf(config.data);

  // Auth
  if (p === "/api/users/login") {
    const email = (body.email || "").toLowerCase();
    const isAdmin = email.startsWith("admin");
    const user = isAdmin ? adminUser : studentUser;
    setCurrentUser(user);
    authTokens(user);
    return [
      200,
      { message: "Login successful", token: token(), user: clone(user) },
    ];
  }
  if (p === "/api/users/register") {
    const u: typeof studentUser = {
      ...studentUser,
      firstName: body.firstName || studentUser.firstName,
      lastName: body.lastName || studentUser.lastName,
      email: body.email || studentUser.email,
    };
    setCurrentUser(u);
    authTokens(u);
    return [
      201,
      { message: "Registration successful", token: token(), user: clone(u) },
    ];
  }
  if (/^\/api\/admin\/pings\/\d+\/(acknowledge|resolve)$/.test(p)) {
    const id = p.split("/")[4];
    const ping = byId(pings, id);
    if (!ping) return [404, { message: "Ping not found" }];
    if (p.endsWith("/acknowledge")) {
      ping.progressStatus = "ACKNOWLEDGED";
    } else {
      ping.progressStatus = "RESOLVED";
      ping.resolvedAt = new Date().toISOString();
    }
    return [200, clone(ping)];
  }
  if (/^\/api\/admin\/reports\/\d+\/action$/.test(p)) {
    const report = mockReports().find((item) => item.id === Number(p.split("/")[4]));
    if (!report) return [404, { message: "Report not found" }];
    report.status = body.action === "DISMISS" ? "DISMISSED" : "RESOLVED";
    return [200, report];
  }
  if (/^\/api\/pings\/\d+\/official-response$/.test(p)) {
    const ping = byId(pings, p.split("/")[3]);
    if (!ping) return [404, { message: "Ping not found" }];
    const response = {
      id: Date.now(),
      content: body.content || "",
      pingId: ping.id,
      authorId: currentUser.id,
      organizationId: currentUser.organizationId || 1,
      isResolved: Boolean(body.isResolved),
      createdAt: new Date().toISOString(),
      author: { firstName: currentUser.firstName, lastName: currentUser.lastName },
    };
    ping.officialResponse = response;
    return [201, clone(response)];
  }
  if (p.includes("/forgot-password"))
    return [200, { message: "If that account exists, a reset link was sent." }];
  if (p.includes("/reset-password"))
    return [200, { message: "Password reset successful" }];
  if (p.includes("/verify-email"))
    return [200, { message: "Email verified successfully" }];
  if (p.includes("/resend-verification"))
    return [200, { message: "Verification email resent" }];
  if (p.includes("/organization-waitlist"))
    return [200, { message: "Request submitted successfully" }];

  // Surges
  if (/^\/api\/pings\/\d+\/surge$/.test(p)) {
    const id = p.split("/")[3];
    const ping = byId(pings, id);
    if (!ping) return [404, { message: "Ping not found" }];
    ping.hasSurged = !ping.hasSurged;
    ping.surgeCount += ping.hasSurged ? 1 : -1;
    if (ping._count) ping._count.surges = ping.surgeCount;
    return [
      200,
      {
        surged: ping.hasSurged,
        message: ping.hasSurged ? "Surge added" : "Surge removed",
      },
    ];
  }
  if (/^\/api\/waves\/\d+\/surge$/.test(p)) {
    const id = p.split("/")[3];
    const w = byId(waves, id);
    if (!w) return [404, { message: "Wave not found" }];
    w.hasSurged = !w.hasSurged;
    w.surgeCount += w.hasSurged ? 1 : -1;
    if (w._count) w._count.surges = w.surgeCount;
    return [
      200,
      {
        surged: w.hasSurged,
        message: w.hasSurged ? "Surge added" : "Surge removed",
      },
    ];
  }

  // View count
  if (/^\/api\/pings\/\d+\/view$/.test(p)) return [200, {}];

  // Create a ping
  if (p === "/api/pings") {
    const catId = body.categoryId ?? 1;
    const np = {
      id: Date.now(),
      title: body.title || "Untitled ping",
      content: body.content || "",
      category: categories.find((c) => c.id === catId),
      categoryId: catId,
      hashtag: body.hashtag,
      author: currentUser,
      authorId: currentUser.id,
      status: "POSTED",
      progressStatus: "NONE",
      surgeCount: 0,
      viewCount: 0,
      hasSurged: false,
      isOwner: true,
      isAnonymous: !!body.isAnonymous,
      anonymousAlias: currentUser.alias || null,
      createdAt: new Date().toISOString(),
      _count: { waves: 0, comments: 0, surges: 0 },
    } as unknown as Ping;
    pings.unshift(np);
    return [201, clone(np)];
  }
  if (p === "/api/admin/announcements") {
    const announcement = {
      id: Date.now(),
      title: body.title || "Announcement",
      content: body.content || "",
      authorId: currentUser.id,
      organizationId: currentUser.organizationId || 1,
      createdAt: new Date().toISOString(),
      author: { firstName: currentUser.firstName, lastName: currentUser.lastName },
    };
    announcements.unshift(announcement);
    return [201, clone(announcement)];
  }
  if (p === "/api/categories") {
    const category = { id: Date.now(), name: body.name || "New Category" };
    categories.push(category);
    return [201, clone(category)];
  }
  if (/^\/api\/admin\/organization\/join-requests\/\d+\/(approve|reject)$/.test(p)) {
    return [200, { message: "Join request updated", requestId: Number(p.split("/")[5]) }];
  }

  // Create a comment (generic)
  if (p === "/api/comments") {
    const c = {
      id: `c-${Date.now()}`,
      content: body.content || "",
      author: currentUser,
      authorId: currentUser.id,
      pingId: body.targetType === "ping" ? Number(body.targetId) : undefined,
      waveId: body.targetType === "wave" ? Number(body.targetId) : null,
      targetType: body.targetType || "ping",
      targetId: body.targetId,
      parentCommentId: body.parentCommentId,
      isAnonymous: !!body.isAnonymous,
      surgeCount: 0,
      isOwner: true,
      createdAt: new Date().toISOString(),
      replyCount: 0,
    } as unknown as Comment;
    if (body.parentCommentId) {
      const parent = comments.find(
        (c) => String(c.id) === String(body.parentCommentId),
      );
      if (parent) {
        if (!parent.replies) parent.replies = [];
        parent.replies.push(c);
        parent.replyCount = (parent.replyCount || 0) + 1;
      }
    } else {
      comments.unshift(c);
      const ping = byId(pings, body.targetId);
      if (ping && ping._count)
        ping._count.comments = (ping._count.comments || 0) + 1;
    }
    return [201, clone(c)];
  }

  // Create comment on a ping
  if (/^\/api\/pings\/\d+\/comments$/.test(p)) {
    const pingId = p.split("/")[3];
    const c = {
      id: `c-${Date.now()}`,
      content: body.content || "",
      author: currentUser,
      authorId: currentUser.id,
      pingId: Number(pingId),
      targetType: "ping",
      targetId: pingId,
      isAnonymous: !!body.isAnonymous,
      surgeCount: 0,
      isOwner: true,
      createdAt: new Date().toISOString(),
      replyCount: 0,
    } as unknown as Comment;
    comments.unshift(c);
    const ping = byId(pings, pingId);
    if (ping && ping._count)
      ping._count.comments = (ping._count.comments || 0) + 1;
    return [201, clone(c)];
  }

  // Reply to a ping comment
  if (/^\/api\/pings\/\d+\/comments\/[^/]+\/replies$/.test(p)) {
    const parts = p.split("/"); // ["","api","pings",pingId,"comments",parentId,"replies"]
    const pingId = parts[3];
    const parentId = parts[5];
    const parent = comments.find((c) => String(c.id) === parentId);
    const c = {
      id: `c-${Date.now()}`,
      content: body.content || "",
      author: currentUser,
      authorId: currentUser.id,
      pingId: Number(pingId),
      targetType: "ping",
      targetId: pingId,
      parentCommentId: parentId,
      isAnonymous: !!body.isAnonymous,
      surgeCount: 0,
      isOwner: true,
      createdAt: new Date().toISOString(),
      replyCount: 0,
    } as unknown as Comment;
    if (parent) {
      if (!parent.replies) parent.replies = [];
      parent.replies.push(c);
      parent.replyCount = (parent.replyCount || 0) + 1;
    }
    return [201, clone(c)];
  }

  // Propose / create a wave on a ping
  if (p === "/api/waves/propose" || /^\/api\/pings\/\d+\/waves$/.test(p)) {
    const pingId =
      p === "/api/waves/propose" ? String(body.pingId || 101) : p.split("/")[3];
    const ping = byId(pings, pingId);
    const w = {
      id: Date.now(),
      solution: body.solution || "",
      author: currentUser,
      authorId: currentUser.id,
      category: ping?.category,
      ping: { id: ping ? ping.id : 101, title: ping ? ping.title : "Ping" },
      surgeCount: 0,
      commentCount: 0,
      viewCount: 0,
      hasSurged: false,
      isOwner: true,
      status: "POSTED",
      createdAt: new Date().toISOString(),
      _count: { surges: 0, comments: 0 },
    } as unknown as Wave;
    waves.unshift(w);
    return [201, clone(w)];
  }

  return [404, { message: "Mock POST route not handled", path: p }];
});

// ── PATCH handlers ──────────────────────────────────────────────────────────
mock.onPatch(/.*/).reply((config) => {
  const p = pathOf(config);
  const body = bodyOf(config.data);

  if (p === "/api/users/me") {
    const upd = {
      ...currentUser,
      ...(body.firstName ? { firstName: body.firstName } : {}),
      ...(body.lastName ? { lastName: body.lastName } : {}),
    };
    setCurrentUser(upd);
    return [200, { message: "Profile updated", user: clone(upd) }];
  }
  if (p === "/api/users/me/preferences")
    return [200, { ...defaultPreferences, ...body }];
  if (p === "/api/users/me/notification-preferences") return [200, body];

  if (p === "/api/admin/organization/settings") {
    mockOrgSettings.organization = { ...mockOrgSettings.organization, ...body };
    return [200, clone(mockOrgSettings.organization)];
  }
  if (p === "/api/admin/organization/join-policy") {
    mockOrgSettings.organization.joinPolicy = body.joinPolicy;
    return [200, clone(mockOrgSettings)];
  }
  if (p === "/api/admin/organization/rules") {
    Object.assign(mockOrgRules, body);
    return [200, clone(mockOrgRules)];
  }

  if (p === "/api/notifications/read-all") {
    notifications.forEach((n) => (n.isRead = true));
    return [200, { message: "All notifications marked as read" }];
  }
  if (/^\/api\/notifications\/[^/]+\/read$/.test(p)) {
    const id = p.split("/")[3];
    const n = notifications.find((n) => String(n.id) === id);
    if (n) n.isRead = true;
    return [200, { message: "Marked as read" }];
  }
  if (/^\/api\/pings\/\d+\/resolve$/.test(p)) {
    const id = p.split("/")[3];
    const ping = byId(pings, id);
    if (ping) {
      ping.status = "COMPLETED";
      ping.progressStatus = "RESOLVED";
      ping.resolvedAt = new Date().toISOString();
      ping.isOwner = true;
    }
    return [200, clone(ping)];
  }
  if (/^\/api\/admin\/waves\/\d+\/status$/.test(p)) {
    const wave = byId(waves, p.split("/")[4]);
    if (!wave) return [404, { message: "Wave not found" }];
    wave.status = body.status;
    return [200, clone(wave)];
  }
  if (/^\/api\/reports\/\d+\/status$/.test(p)) {
    return [200, { ...mockReports().find((report) => report.id === Number(p.split("/")[3])), status: body.status }];
  }
  if (/^\/api\/admin\/pings\/\d+\/progress-status$/.test(p)) {
    const ping = byId(pings, p.split("/")[4]);
    if (!ping) return [404, { message: "Ping not found" }];
    ping.progressStatus = body.progressStatus;
    return [200, clone(ping)];
  }
  if (/^\/api\/admin\/users\/\d+\/role$/.test(p)) return [200, { ...adminUser, role: body.role }];
  if (/^\/api\/admin\/users\/\d+\/suspend$/.test(p)) return [200, { userId: Number(p.split("/")[4]), moderationStatus: "SUSPENDED", suspendedUntil: null }];
  if (/^\/api\/categories\/\d+$/.test(p)) {
    const category = categories.find((item) => item.id === Number(p.split("/")[3]));
    if (!category) return [404, { message: "Category not found" }];
    Object.assign(category, body);
    return [200, { ...category, isActive: body.isActive ?? true }];
  }
  return [404, { message: "Mock PATCH route not handled", path: p }];
});

// Indicate the mock is active (handy for debugging in the console).
console.info(
  "%c[Echo mock] API responses are served from in-memory fixtures (dev only).",
  "color:#7c3aed;font-weight:bold",
);