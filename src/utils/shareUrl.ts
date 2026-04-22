/**
 * Share URL Builder Utility
 * Generates shareable URLs for pings, waves, and comments with OG preview support
 *
 * These URLs are designed to work with the OG handler at api/share/[entity]/[id].ts
 * which generates dynamic Open Graph metadata for social media previews.
 */

export type ShareEntityType = "ping" | "wave" | "comment";

interface BuildShareUrlOptions {
  includeProtocol?: boolean;
}

/**
 * Build a share URL for an entity (ping, wave, or comment)
 *
 * @param entityType - Type of entity: "ping", "wave", or "comment"
 * @param entityId - Numeric ID of the entity
 * @param options - Optional configuration (includeProtocol, etc.)
 * @returns Share URL suitable for copying to clipboard
 *
 * @example
 * const url = buildShareUrl("ping", 42);
 * // Returns: "https://app.echo-ng.com/share/ping/42" or "yoursite.com/share/ping/42"
 */
export const buildShareUrl = (
  entityType: ShareEntityType,
  entityId: number,
  options: BuildShareUrlOptions = {},
): string => {
  const { includeProtocol = true } = options;

  // Get the app origin
  const origin = getAppOrigin();

  // Build the share path
  const sharePath = `/share/${entityType}/${entityId}`;

  // Return with or without protocol
  if (includeProtocol) {
    return `${origin}${sharePath}`;
  }

  // Extract host from origin (remove protocol)
  const host = new URL(origin).host;
  return `${host}${sharePath}`;
};

/**
 * Build a share URL specifically for a ping
 *
 * @example
 * const url = buildPingShareUrl(58);
 * // Returns: "https://yoursite.com/share/ping/58"
 */
export const buildPingShareUrl = (
  pingId: number,
  options: BuildShareUrlOptions = {},
): string => buildShareUrl("ping", pingId, options);

/**
 * Build a share URL specifically for a wave
 *
 * @example
 * const url = buildWaveShareUrl(12);
 * // Returns: "https://yoursite.com/share/wave/12"
 */
export const buildWaveShareUrl = (
  waveId: number,
  options: BuildShareUrlOptions = {},
): string => buildShareUrl("wave", waveId, options);

/**
 * Build a share URL specifically for a comment
 *
 * @example
 * const url = buildCommentShareUrl(99);
 * // Returns: "https://yoursite.com/share/comment/99"
 */
export const buildCommentShareUrl = (
  commentId: number,
  options: BuildShareUrlOptions = {},
): string => buildShareUrl("comment", commentId, options);

/**
 * Get the application's origin URL
 * Uses window.location.origin or fallback to window.location.protocol + window.location.host
 *
 * @returns Full origin including protocol (e.g., "https://app.echo-ng.com")
 */
export const getAppOrigin = (): string => {
  if (typeof window === "undefined") {
    // Server-side fallback
    return "https://app.echo-ng.com";
  }
  return window.location.origin;
};

/**
 * Copy a share URL to clipboard and return success status
 *
 * @param url - The URL to copy
 * @returns Promise<boolean> - true if copy succeeded, false otherwise
 *
 * @example
 * const success = await copyShareUrlToClipboard(url);
 * if (success) {
 *   showToast("Link copied!");
 * }
 */
export const copyShareUrlToClipboard = async (
  url: string,
): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(url);
    return true;
  } catch (err) {
    console.error("Failed to copy URL to clipboard:", err);
    // Fallback for older browsers
    try {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      const success = document.execCommand("copy");
      document.body.removeChild(textArea);
      return success;
    } catch (fallbackErr) {
      console.error("Fallback copy method also failed:", fallbackErr);
      return false;
    }
  }
};
