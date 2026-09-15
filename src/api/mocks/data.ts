import type {
  User,
  Ping,
  Wave,
  Comment,
  CategoryData,
  Announcement,
  AppNotification,
  ResolutionLog,
  PaginatedResponse,
} from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Echo frontend MOCK SEED DATA
// This mirrors the real backend response shapes (src/api/types/*) so the UI
// renders exactly as it would against a live API. All data is in-memory and
// mutates as you interact (surge, comment, propose a wave), purely client-side.
// ─────────────────────────────────────────────────────────────────────────────

export const ORG = {
  id: 1,
  name: "Covenant University",
  domain: "covenantuniversity.edu.ng",
  logoUrl: "",
  joinPolicy: "OPEN" as const,
};

const now = Date.now();
const hoursAgo = (h: number) => new Date(now - h * 3600 * 1000).toISOString();
const daysAgo = (d: number) => hoursAgo(d * 24);

export const categories: CategoryData[] = [
  { id: 1, name: "General" },
  { id: 2, name: "Hall" },
  { id: 3, name: "Sport" },
  { id: 4, name: "Welfare" },
  { id: 5, name: "Academics" },
  { id: 6, name: "Finance" },
  { id: 7, name: "Chapel" },
];

// Users used as authors across fixtures.
export const studentUser: User = {
  id: 1,
  email: "daniel.adewale@stu.cu.edu.ng",
  firstName: "Daniel",
  lastName: "Adewale",
  level: 400,
  role: "USER",
  organizationId: ORG.id,
  status: "ACTIVE",
  createdAt: daysAgo(120),
  alias: "Ebube",
  anonProfilePicture: "",
  organization: { id: ORG.id, name: ORG.name, domain: ORG.domain },
  userPreference: {
    hasCompletedOnboarding: true,
    onboardingCompletedAt: daysAgo(100),
    anonymousAlias: "Ebube",
  },
};

export const adminUser: User = {
  id: 2,
  email: "admin@cu.edu.ng",
  firstName: "Mrs.",
  lastName: "Bello",
  role: "ADMIN",
  organizationId: ORG.id,
  status: "ACTIVE",
  createdAt: daysAgo(200),
  organization: { id: ORG.id, name: ORG.name, domain: ORG.domain },
  userPreference: {
    hasCompletedOnboarding: true,
    onboardingCompletedAt: daysAgo(150),
  },
};

// A couple more distinct authors so the feed looks varied.
const authors: User[] = [
  {
    id: 3,
    email: "tola.osu@stu.cu.edu.ng",
    firstName: "Tola",
    lastName: "Osunlana",
    level: 300,
    role: "USER",
    organizationId: ORG.id,
    status: "ACTIVE",
    createdAt: daysAgo(90),
    organization: { id: ORG.id, name: ORG.name, domain: ORG.domain },
    userPreference: { anonymousAlias: "Sparks" },
  },
  {
    id: 4,
    email: "zainab.yusuf@stu.cu.edu.ng",
    firstName: "Zainab",
    lastName: "Yusuf",
    level: 200,
    role: "USER",
    organizationId: ORG.id,
    status: "ACTIVE",
    createdAt: daysAgo(60),
    organization: { id: ORG.id, name: ORG.name, domain: ORG.domain },
    userPreference: { anonymousAlias: "QuietStorm" },
  },
  {
    id: 5,
    email: "kola.banjo@stu.cu.edu.ng",
    firstName: "Kola",
    lastName: "Banjo",
    level: 100,
    role: "USER",
    organizationId: ORG.id,
    status: "ACTIVE",
    createdAt: daysAgo(45),
    organization: { id: ORG.id, name: ORG.name, domain: ORG.domain },
    userPreference: { anonymousAlias: "Ace" },
  },
];

const cat = (id: number) => categories.find((c) => c.id === id);

export const pings: Ping[] = [
  {
    id: 101,
    title: "Broken water pump in Daniel Hall wings C & D",
    content:
      "We haven't had running water since Tuesday. The pump keeps failing at odd hours and the hostel reps aren't responding to messages. Somebody please look into this, it's affecting everyone on the floor.",
    category: cat(2),
    categoryId: 2,
    hashtag: "#water",
    author: studentUser,
    authorId: 1,
    status: "IN_PROGRESS",
    progressStatus: "ACKNOWLEDGED",
    surgeCount: 48,
    viewCount: 212,
    hasSurged: true,
    isOwner: true,
    createdAt: hoursAgo(3),
    _count: { waves: 3, comments: 9, surges: 48 },
  },
  {
    id: 102,
    title: "Registration portal keeps timing out at midnight",
    content:
      "Every time I try to register courses after 11pm the portal crashes. It works during the day but I only have bandwidth at night. Anyone else facing this?",
    category: cat(1),
    categoryId: 1,
    hashtag: "#portal",
    author: authors[0],
    authorId: 3,
    status: "POSTED",
    progressStatus: "NONE",
    surgeCount: 21,
    viewCount: 98,
    hasSurged: false,
    isOwner: false,
    createdAt: hoursAgo(5),
    _count: { waves: 2, comments: 4, surges: 21 },
  },
  {
    id: 103,
    title: "Refund for cancelled hostel retreat still pending",
    content:
      "We paid for the hostel retreat that got cancelled two weeks ago. Accounts says the money has been processed but it still hasn't hit our wallets. Over ₦30k for some of my roommates.",
    category: cat(3),
    categoryId: 3,
    hashtag: "#refund",
    author: authors[1],
    authorId: 4,
    status: "UNDER_REVIEW",
    progressStatus: "ACKNOWLEDGED",
    surgeCount: 15,
    viewCount: 64,
    hasSurged: false,
    isOwner: false,
    isAnonymous: true,
    anonymousAlias: "QuietStorm",
    createdAt: hoursAgo(9),
    _count: { waves: 1, comments: 2, surges: 15 },
  },
  {
    id: 104,
    title: "Streetlights off on the back path to the library",
    content:
      "The path behind the faculty building is pitch dark after 7pm. Security says it's a wiring issue but nothing has changed in a week. Feels unsafe walking there alone.",
    category: cat(4),
    categoryId: 4,
    hashtag: "#security",
    author: authors[2],
    authorId: 5,
    status: "POSTED",
    progressStatus: "NONE",
    surgeCount: 62,
    viewCount: 301,
    hasSurged: true,
    isOwner: false,
    createdAt: hoursAgo(14),
    _count: { waves: 4, comments: 12, surges: 62 },
  },
  {
    id: 105,
    title: "Queue at the health centre is too long in the mornings",
    content:
      "I waited over an hour at the health centre just to get a malaria test. We need a proper triage system or evening clinic hours. The nurses are doing their best but the system is broken.",
    category: cat(5),
    categoryId: 5,
    hashtag: "#health",
    author: authors[0],
    authorId: 3,
    status: "COMPLETED",
    progressStatus: "RESOLVED",
    surgeCount: 38,
    viewCount: 176,
    hasSurged: false,
    isOwner: false,
    resolvedAt: daysAgo(2),
    createdAt: daysAgo(4),
    _count: { waves: 5, comments: 8, surges: 38 },
  },
  {
    id: 106,
    title: "Cafeteria food prices went up without notice",
    content:
      "The cafeteria raised prices by 20% across the board with zero announcement. There's no transparency on how prices are set and it's hitting everyone hard.",
    category: cat(5),
    categoryId: 5,
    hashtag: "#cafeteria",
    author: studentUser,
    authorId: 1,
    status: "POSTED",
    progressStatus: "NONE",
    surgeCount: 27,
    viewCount: 121,
    hasSurged: false,
    isOwner: true,
    isAnonymous: true,
    anonymousAlias: "Ebube",
    createdAt: daysAgo(1),
    _count: { waves: 1, comments: 5, surges: 27 },
  },
  {
    id: 107,
    title: "No dedicated bench space in the engineering lab",
    content:
      "Most of us end up standing during practicals because there aren't enough benches and sockets. We're a 400-level cohort and this is embarrassing.",
    category: cat(6),
    categoryId: 6,
    hashtag: "#facilities",
    author: authors[1],
    authorId: 4,
    status: "IN_PROGRESS",
    progressStatus: "IN_PROGRESS",
    surgeCount: 11,
    viewCount: 52,
    hasSurged: false,
    isOwner: false,
    createdAt: daysAgo(2),
    _count: { waves: 2, comments: 3, surges: 11 },
  },
  {
    id: 108,
    title: "Shuttle buses skip bus stops when full in the morning",
    content:
      "The 8am shuttle regularly drives past me even though it's my stop. Drivers say they can't pick more people when full, but then they should run more buses at peak time.",
    category: cat(7),
    categoryId: 7,
    hashtag: "#transport",
    author: authors[2],
    authorId: 5,
    status: "POSTED",
    progressStatus: "NONE",
    surgeCount: 19,
    viewCount: 88,
    hasSurged: false,
    isOwner: false,
    createdAt: hoursAgo(6),
    _count: { waves: 1, comments: 4, surges: 19 },
  },
  {
    id: 109,
    title: "Football pitch floodlights are broken again",
    content:
      "The floodlights on the main pitch haven't worked in three weeks. Evening training and inter-hall matches have been postponed twice. When will they be fixed?",
    category: cat(7),
    categoryId: 7,
    hashtag: "#sports",
    author: studentUser,
    authorId: 1,
    status: "POSTED",
    progressStatus: "NONE",
    surgeCount: 24,
    viewCount: 73,
    hasSurged: false,
    isOwner: true,
    createdAt: hoursAgo(11),
    _count: { waves: 2, comments: 4, surges: 24 },
  },
];

export const waves: Wave[] = [
  {
    id: 501,
    solution:
      "The facilities team confirmed the pump was replaced this morning. Wings C and D should have steady water now — please report if it drops again.",
    author: adminUser,
    authorId: 2,
    category: cat(2),
    ping: { id: 101, title: "Broken water pump in Daniel Hall wings C & D" },
    surgeCount: 32,
    commentCount: 3,
    viewCount: 154,
    hasSurged: true,
    isOwner: false,
    status: "APPROVED",
    rank: 1,
    createdAt: hoursAgo(2),
    _count: { surges: 32, comments: 3 },
  },
  {
    id: 502,
    solution:
      "IT resolved the timeout issue overnight. Course registration should now work past midnight. Clear your cache if it still lags.",
    author: adminUser,
    authorId: 2,
    category: cat(1),
    ping: { id: 102, title: "Registration portal keeps timing out at midnight" },
    surgeCount: 14,
    commentCount: 1,
    viewCount: 61,
    hasSurged: false,
    isOwner: false,
    status: "APPROVED",
    createdAt: hoursAgo(4),
    _count: { surges: 14, comments: 1 },
  },
  {
    id: 503,
    solution:
      "Use the campus security app to report dark spots and request a security escort after 7pm. They usually respond within 15 minutes.",
    author: authors[0],
    authorId: 3,
    category: cat(4),
    ping: { id: 104, title: "Streetlights off on the back path to the library" },
    surgeCount: 41,
    commentCount: 5,
    viewCount: 120,
    hasSurged: true,
    isOwner: false,
    rank: 1,
    status: "APPROVED",
    createdAt: hoursAgo(12),
    _count: { surges: 41, comments: 5 },
  },
  {
    id: 506,
    solution:
      "Install a second pressure sensor in the hall and publish weekly maintenance checks so failures are caught before the tank empties.",
    author: authors[0],
    authorId: 3,
    category: cat(2),
    ping: { id: 101, title: "Broken water pump in Daniel Hall wings C & D" },
    surgeCount: 14,
    commentCount: 1,
    viewCount: 42,
    hasSurged: false,
    isOwner: false,
    status: "POSTED",
    createdAt: hoursAgo(5),
    _count: { surges: 14, comments: 1 },
  },
  {
    id: 504,
    solution:
      "The health centre has added evening clinic hours (5pm–8pm) starting Monday to reduce morning queues. Book a slot via the portal.",
    author: adminUser,
    authorId: 2,
    category: cat(5),
    ping: {
      id: 105,
      title: "Queue at the health centre is too long in the mornings",
    },
    surgeCount: 22,
    commentCount: 2,
    viewCount: 89,
    hasSurged: false,
    isOwner: false,
    status: "APPROVED",
    createdAt: daysAgo(3),
    _count: { surges: 22, comments: 2 },
  },
  {
    id: 505,
    solution:
      "Engineering lab coordinator will run a batch installation this weekend to add 12 more benches and power strips.",
    author: adminUser,
    authorId: 2,
    category: cat(6),
    ping: {
      id: 107,
      title: "No dedicated bench space in the engineering lab",
    },
    surgeCount: 8,
    commentCount: 1,
    viewCount: 33,
    hasSurged: false,
    isOwner: false,
    status: "IN_PROGRESS",
    createdAt: daysAgo(1),
    _count: { surges: 8, comments: 1 },
  },
];

// Seeded top-level comments (some on ping 101, some on ping 104).
export const comments: Comment[] = [
  {
    id: "c-901",
    content: "Same issue on our side — the water pressure has been awful too.",
    author: authors[1],
    authorId: 4,
    pingId: 101,
    targetType: "ping",
    targetId: "101",
    surgeCount: 4,
    isOwner: false,
    createdAt: hoursAgo(2),
    replies: [
      {
        id: "c-901-1",
        content: "True! I reported it yesterday to the hall warden.",
        author: authors[2],
        authorId: 5,
        pingId: 101,
        parentCommentId: 901,
        targetType: "ping",
        targetId: "101",
        surgeCount: 1,
        isOwner: false,
        createdAt: hoursAgo(1),
      } as unknown as Comment,
    ],
    replyCount: 1,
  },
  {
    id: "c-902",
    content: "Thanks for escalating this, the facility team is already on it.",
    author: adminUser,
    authorId: 2,
    pingId: 101,
    targetType: "ping",
    targetId: "101",
    surgeCount: 6,
    isOwner: false,
    createdAt: hoursAgo(2),
    replyCount: 0,
  },
  {
    id: "c-904",
    content: "The water pressure dropped again this afternoon. Please keep the maintenance ticket open.",
    author: authors[0],
    authorId: 3,
    pingId: 101,
    targetType: "ping",
    targetId: "101",
    surgeCount: 2,
    isOwner: false,
    createdAt: hoursAgo(1),
    replyCount: 0,
  },
  {
    id: "c-903",
    content: "I don't walk that way anymore after dark. Please get it fixed soon.",
    author: authors[0],
    authorId: 3,
    pingId: 104,
    targetType: "ping",
    targetId: "104",
    isAnonymous: true,
    anonymousAlias: "Sparks",
    surgeCount: 3,
    isOwner: false,
    createdAt: hoursAgo(10),
    replyCount: 0,
  },
];

export const announcements: Announcement[] = [
  {
    id: 1,
    title: "Water supply update",
    content:
      "The hostel pump on Daniel Hall wings C & D has been repaired. Contact the facilities desk if your wing still has no water by evening.",
    authorId: 2,
    organizationId: ORG.id,
    createdAt: hoursAgo(2),
    author: { firstName: "Mrs.", lastName: "Bello" },
  },
  {
    id: 2,
    title: "Mid-semester break schedule",
    content:
      "The mid-semester break runs from next Monday. Libraries remain open from 8am–6pm every day. Expect reduced shuttle frequency.",
    authorId: 2,
    organizationId: ORG.id,
    createdAt: daysAgo(2),
    author: { firstName: "Mrs.", lastName: "Bello" },
  },
];

export const notifications: AppNotification[] = [
  {
    id: "n-1",
    type: "OFFICIAL_RESPONSE",
    title: "Official response on your ping",
    body: "The facilities team responded to 'Broken water pump in Daniel Hall wings C & D'.",
    url: "/feed/101",
    isRead: false,
    createdAt: hoursAgo(1),
  },
  {
    id: "n-2",
    type: "NEW_WAVE_ON_PING",
    title: "New solution proposed",
    body: "A new solution was proposed on a ping you surged.",
    url: "/feed/104",
    isRead: false,
    createdAt: hoursAgo(4),
  },
  {
    id: "n-3",
    type: "PING_SURGED_MILESTONE",
    title: "Your ping is trending 🔥",
    body: "'Broken water pump in Daniel Hall wings C & D' reached 40 surges.",
    url: "/feed/101",
    isRead: true,
    createdAt: hoursAgo(6),
  },
  {
    id: "n-4",
    type: "ANNOUNCEMENT",
    title: "Mid-semester break",
    body: "Libraries remain open 8am–6pm during the mid-semester break.",
    isRead: false,
    createdAt: daysAgo(1),
  },
];

export const resolutions: ResolutionLog[] = [
  {
    id: 105,
    title: "Queue at the health centre is too long in the mornings",
    content:
      "I waited over an hour at the health centre just to get a malaria test. We need a proper triage system or evening clinic hours.",
    category: cat(5),
    hashtag: "#health",
    surgeCount: 38,
    hasSurged: false,
    createdAt: daysAgo(4),
    resolvedAt: daysAgo(2),
    msToResolve: 2 * 24 * 3600 * 1000,
    author: authors[0],
    approvedWave: {
      id: 504,
      solution:
        "The health centre has added evening clinic hours (5pm–8pm) starting Monday to reduce morning queues.",
      surgeCount: 22,
      viewCount: 89,
      createdAt: daysAgo(3),
      author: adminUser,
    },
    officialResponse: {
      id: 1,
      content:
        "Evening clinic hours (5pm–8pm) have been added starting Monday. Slots go live on the portal this weekend.",
      createdAt: daysAgo(2),
      author: adminUser,
    },
    _count: { waves: 5, comments: 8, surges: 38 },
  },
];

// Organizations shown on the "find your institution" flow.
export const organizations = [
  { id: 1, name: "Covenant University", domain: "covenantuniversity.edu.ng", joinPolicy: "OPEN" },
  { id: 2, name: "University of Lagos", domain: "unilag.edu.ng", joinPolicy: "OPEN" },
  { id: 3, name: "Obafemi Awolowo University", domain: "oauife.edu.ng", joinPolicy: "OPEN" },
  { id: 4, name: "Ahmadu Bello University", domain: "abu.edu.ng", joinPolicy: "OPEN" },
  { id: 5, name: "Babcock University", domain: "babcock.edu.ng", joinPolicy: "OPEN" },
];

// The authenticated user (seed defaults to a student; flips to ADMIN when the
// mock login email looks like an admin).
export let currentUser: User = studentUser;

export const setCurrentUser = (user: User) => {
  currentUser = user;
};

export const defaultPreferences = {
  commentAnonymously: false,
  pingAnonymously: false,
  anonymousAlias: "Ebube",
  anonymousAliasProfilePicture: "",
  hasCompletedOnboarding: true,
  onboardingCompletedAt: daysAgo(100),
};

// Build a PaginatedResponse<T> slice for a given page/limit.
export function paginate<T>(
  items: T[],
  page = 1,
  limit = 20,
): PaginatedResponse<T> {
  const start = (page - 1) * limit;
  const data = items.slice(start, start + limit);
  const totalPages = Math.max(1, Math.ceil(items.length / limit));
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: items.length,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };
}

export const MOCK_DELAY_MS = 450;

// ─── Admin console (leaders) fixtures ───────────────────────────────────────
// Shapes mirror src/api/types/admin.types.ts for the endpoints the admin
// soundboard actually calls. Stats are derived from the fixtures above so all
// numbers stay internally consistent (counts, rates, leaders).

// Strip the internal _totals helper before responding.
export const adminOverviewResponse = () => {
  const overview = adminOverview() as Record<string, unknown>;
  const { _totals: _drop, ...rest } = overview;
  void _drop;
  return rest;
};

export const adminSurgingIssues = () => {
  const items = [...pings]
    .sort((a, b) => b.surgeCount - a.surgeCount)
    .slice(0, 3)
    .map((p) => ({
      pingId: p.id,
      title: p.title,
      category: p.category
        ? { id: p.category.id, name: p.category.name }
        : null,
      currentRatePerHour: Math.round((p.surgeCount / 24) * 10) / 10,
      previousRatePerHour: 0.4,
      rateDelta: Math.round((p.surgeCount / 24 - 0.4) * 10) / 10,
      currentSurges: p.surgeCount,
      previousSurges: Math.max(0, p.surgeCount - 7),
    }));
  return {
    window: { hours: 72, start: hoursAgo(72), end: new Date().toISOString() },
    count: items.length,
    items,
  };
};

export const adminIssuesByCategory = () =>
  categories.map((c) => {
    const items = pings.filter(
      (p) => p.category?.id === c.id || p.categoryId === c.id,
    );
    const rc = items.filter((p) => p.resolvedAt).length;
    return {
      categoryId: c.id,
      categoryName: c.name,
      openCount: items.length - rc,
      resolvedCount: rc,
      resolutionRate: items.length ? Math.round((rc / items.length) * 100) : 0,
      topPings: items
        .sort((a, b) => b.surgeCount - a.surgeCount)
        .slice(0, 3)
        .map((p) => ({
          id: p.id,
          title: p.title,
          surgeCount: p.surgeCount,
          createdAt: p.createdAt,
        })),
    };
  });

const openPings = () => pings.filter((p) => !p.resolvedAt);
const resolvedPings = () => pings.filter((p) => p.resolvedAt);

// Admin pings list: map fixtures into the AdminPing response shape.
export const adminPings = () =>
  pings.map((p) => ({
    id: p.id,
    title: p.title,
    content: p.content,
    categoryId: p.categoryId ?? p.category?.id ?? 1,
    status: p.status,
    progressStatus: p.progressStatus ?? "NONE",
    isAnonymous: !!p.isAnonymous,
    surgeCount: p.surgeCount,
    viewCount: p.viewCount ?? 0,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt ?? p.createdAt,
    acknowledgedAt:
      p.progressStatus && p.progressStatus !== "NONE" ? p.createdAt : null,
    resolvedAt: p.resolvedAt ?? null,
    category: {
      id: p.category?.id ?? 1,
      name: p.category?.name ?? "General",
    },
    author:
      typeof p.author === "object" && p.author
        ? {
            id: p.author.id,
            email: p.author.email,
            firstName: p.author.firstName,
            lastName: p.author.lastName,
          }
        : null,
    comments: [] as unknown[],
    surges: [] as unknown[],
    _count: {
      waves: p._count?.waves ?? 0,
      comments: p._count?.comments ?? 0,
      surges: p._count?.surges ?? p.surgeCount,
    },
    adminBadges: adminBadgesForPing(p),
    officialResponse: p.officialResponse ?? null,
  }));

export const adminBadgesForPing = (ping: Ping) => {
  const badgesByPing: Record<number, Array<{ key: string; label: string; group: string }>> = {
    101: [
      { key: "SURGING_NOW", label: "Surging now", group: "velocity" },
      { key: "LONG_OVERDUE", label: "Long overdue", group: "age" },
    ],
    102: [
      { key: "SOLUTION_READY", label: "Solution Ready", group: "solution" },
      { key: "HIGH_DISCUSSION", label: "High discussion", group: "discussion" },
    ],
    103: [{ key: "NEEDS_ATTENTION", label: "Needs Attention", group: "attention" }],
    104: [
      { key: "SURGING_NOW", label: "Surging now", group: "velocity" },
      { key: "WIDESPREAD", label: "Widespread", group: "reach" },
    ],
    105: [{ key: "SOLUTION_READY", label: "Solution Ready", group: "solution" }],
    106: [{ key: "NEEDS_ATTENTION", label: "Needs Attention", group: "attention" }],
    107: [{ key: "RISING_QUICKLY", label: "Rising quickly", group: "velocity" }],
    108: [{ key: "RISING_QUICKLY", label: "Rising quickly", group: "velocity" }],
    109: [{ key: "WIDESPREAD", label: "Widespread", group: "reach" }],
  };

  return badgesByPing[ping.id] ?? [];
};

export const adminOverview = () => {
  const totalPings = pings.length;
  const resolved = resolvedPings().length;
  const open = totalPings - resolved;
  const review = pings.filter((p) => p.status === "UNDER_REVIEW").length;
  const inProgress = pings.filter((p) => p.status === "IN_PROGRESS").length;

  const byCategory = categories.map((c) => {
    const items = pings.filter(
      (p) => p.category?.id === c.id || p.categoryId === c.id,
    );
    const rc = items.filter((p) => p.resolvedAt).length;
    return {
      categoryId: c.id,
      categoryName: c.name,
      totalPings: items.length,
      openCount: items.length - rc,
      resolvedCount: rc,
      openPercentage: items.length
        ? Math.round(((items.length - rc) / items.length) * 100)
        : 0,
      resolutionPercentage: items.length
        ? Math.round((rc / items.length) * 100)
        : 0,
    };
  });

  const top = [...pings]
    .sort((a, b) => b.surgeCount - a.surgeCount)
    .slice(0, 3)
    .map((p, i) => ({
      rank: i + 1,
      pingId: p.id,
      title: p.title,
      author:
        typeof p.author === "object" && p.author
          ? {
              id: p.author.id,
              name: `${p.author.firstName} ${p.author.lastName}`,
            }
          : null,
      engagementCount: p.surgeCount,
      engagementType: "surges" as const,
    }));

  const oldest = [...openPings()]
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    .slice(0, 3)
    .map((p) => ({
      pingId: p.id,
      title: p.title,
      category: p.category
        ? { id: p.category.id, name: p.category.name }
        : null,
      createdAt: p.createdAt,
      ageDays: Math.max(
        0,
        Math.floor((Date.now() - new Date(p.createdAt).getTime()) / 86400000),
      ),
    }));

  return {
    period: {
      month: new Date().toLocaleString("en-US", { month: "long" }),
      year: new Date().getFullYear(),
      start: daysAgo(30),
      end: new Date().toISOString(),
    },
    summaryCards: {
      waves: { value: waves.length, deltaPercent: 12 },
      pingsSubmitted: { value: totalPings, deltaPercent: 8 },
      resolutionRate: {
        value: totalPings ? Math.round((resolved / totalPings) * 100) : 0,
        deltaPercentagePoints: 3,
      },
      avgResolveTimeDays: { value: 2.4, deltaDays: -0.3 },
      activeUsers: { value: 6, deltaPercent: 5 },
      underReview: { value: review, deltaPercent: 0 },
      unresolvedOlderThanDays: {
        thresholdDays: 7,
        value: open,
        deltaAbsolute: 1,
      },
    },
    communityActivity: {
      months: 1,
      series: [
        {
          month: new Date().toLocaleString("en-US", { month: "short" }),
          waves: waves.length,
          pings: totalPings,
          resolved: resolved,
        },
      ],
    },
    categoryHealth: byCategory.map((c) => ({
      categoryId: c.categoryId,
      categoryName: c.categoryName,
      resolutionRate: c.resolutionPercentage,
      unresolvedCount: c.openCount,
      totalPings: c.totalPings,
    })),
    topPings: { windowDays: 7, items: top },
    oldestUnresolved: { total: open, items: oldest },
    surgeVelocity: pings.map((p) => ({
      pingId: p.id,
      velocity: Math.round((p.surgeCount / 24) * 10) / 10,
    })),
    stalledWavesCount: inProgress,
    stalledAcknowledgedPingsCount: pings.filter(
      (p) => p.progressStatus === "ACKNOWLEDGED",
    ).length,
    wavesAwaitingApproval: waves.filter((p) => p.status === "POSTED").length,
    categoriesStats: byCategory,
  };
};