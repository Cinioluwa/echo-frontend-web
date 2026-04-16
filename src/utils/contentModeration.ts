/**
 * contentModeration.ts
 * Client-side content guard — first line of defence before the server.
 *
 * Strategy: exact-word and substring matching against a curated blocklist of
 * the most egregious hate categories relevant to a Nigerian campus context.
 * This is intentionally conservative — it blocks only clear violations so that
 * false-positive rates stay low. Context-aware AI moderation (Perspective API)
 * is the planned Phase 3 backend layer.
 *
 * Matching is:
 *  - Case-insensitive
 *  - Unicode-normalised (handles accented lookalikes)
 *  - Whole-word OR substring depending on the term (see SUBSTRING_TERMS)
 */

// ─── Blocklist Categories ─────────────────────────────────────────────────────

/** Racial / ethnic slurs — whole-word match */
const ETHNIC_SLURS = [
  "nigger", "nigga", "kike", "spic", "chink", "gook", "wetback",
  "coon", "beaner", "cracker", "honky",
];

/**
 * Nigerian tribalistic / regional hate terms — whole-word match.
 * These are epithets used to demean specific ethnic groups.
 */
const TRIBAL_SLURS = [
  "nyamiri", "aboki", "omo igbo", "omo yoruba", "omo hausa",
  "gambari", "onye ofe mmanu", "ngwere",
];

/** Homophobic / transphobic slurs — whole-word match */
const HOMOPHOBIC_SLURS = [
  "faggot", "fag", "dyke", "tranny", "shemale", "homo",
];

/** Religious bigotry terms — whole-word match */
const RELIGIOUS_BIGOTRY = [
  "infidel", "kafir", "kuffar", "christain dog", "muslim dog",
  "pagan fool", "heathen",
];

/**
 * Sexual / adult content keywords — substring match (these appear inside
 * longer words too, e.g. "pornographic").
 */
const SEXUAL_CONTENT = [
  "porn", "xxx", "nude", "nudes", "naked", "sex tape", "onlyfans",
  "dick pic", "pussy", "cock", "boobs", "tits", "cum shot",
];

/** Violent / threatening language — whole-word match */
const VIOLENT_LANGUAGE = [
  "kill yourself", "kys", "i will kill", "i\'ll kill", "go die",
  "bomb threat", "shoot you",
];

// ─── Match Configuration ──────────────────────────────────────────────────────

/** Terms that should match even inside longer words (substring match) */
const SUBSTRING_TERMS = new Set([...SEXUAL_CONTENT]);

/** All whole-word terms */
const WHOLE_WORD_TERMS = [
  ...ETHNIC_SLURS,
  ...TRIBAL_SLURS,
  ...HOMOPHOBIC_SLURS,
  ...RELIGIOUS_BIGOTRY,
  ...VIOLENT_LANGUAGE,
];

// ─── Category labels for user-friendly error messages ────────────────────────

type BlocklistEntry = { term: string; category: string; substring: boolean };

const buildBlocklist = (): BlocklistEntry[] => {
  const entries: BlocklistEntry[] = [];

  const addGroup = (terms: string[], category: string, substring = false) => {
    terms.forEach((term) => entries.push({ term, category, substring }));
  };

  addGroup(ETHNIC_SLURS, "racially offensive language");
  addGroup(TRIBAL_SLURS, "tribalistic language");
  addGroup(HOMOPHOBIC_SLURS, "homophobic language");
  addGroup(RELIGIOUS_BIGOTRY, "religious bigotry");
  addGroup(SEXUAL_CONTENT, "sexually explicit content", true);
  addGroup(VIOLENT_LANGUAGE, "threats or violent language");

  return entries;
};

const BLOCKLIST: BlocklistEntry[] = buildBlocklist();

// ─── Core Check Function ──────────────────────────────────────────────────────

export interface ModerationResult {
  /** true if the content is clean */
  passed: boolean;
  /** Human-readable reason shown to the user when content is flagged */
  reason: string | null;
}

/**
 * Checks `text` against the blocklist.
 * Returns { passed: true } if clean, or { passed: false, reason: "..." } if flagged.
 */
export function checkContent(text: string): ModerationResult {
  if (!text || !text.trim()) return { passed: true, reason: null };

  // Normalise: lowercase + remove combining diacritics
  const normalised = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  for (const { term, category, substring } of BLOCKLIST) {
    const normalisedTerm = term
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    let matched = false;
    if (substring) {
      matched = normalised.includes(normalisedTerm);
    } else {
      // Whole-word boundary match
      const pattern = new RegExp(
        `(^|[\\s,!?.;:"'()])${escapeRegex(normalisedTerm)}($|[\\s,!?.;:"')])`,
      );
      matched = pattern.test(normalised);
    }

    if (matched) {
      return {
        passed: false,
        reason: `Your post contains ${category}. Echo is a respectful campus community — please revise your content before posting.`,
      };
    }
  }

  return { passed: true, reason: null };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Convenience wrapper — checks both title and body together.
 * Use in ping/wave form validation.
 */
export function checkPingContent(
  title: string,
  body: string,
): ModerationResult {
  const titleCheck = checkContent(title);
  if (!titleCheck.passed) return titleCheck;
  return checkContent(body);
}
