/**
 * Utility for detecting dynamic import / chunk loading failures
 * (commonly caused by new deployments or network drops) and
 * automatically triggering safe page reloads or recovery.
 */

export const CHUNK_RELOAD_KEY = "echo:chunk-reload-attempted";
export const CHUNK_RELOAD_TIMESTAMP_KEY = "echo:chunk-reload-timestamp";

export const CHUNK_LOAD_ERROR_PATTERN =
  /ChunkLoadError|error loading dynamically imported module|Failed to fetch dynamically imported module|Loading chunk [\d]+ failed|text\/html is not a valid JavaScript MIME type|Importing a module script failed|Failed to load module script|Unable to preload CSS/i;

export const isChunkLoadError = (error: unknown): boolean => {
  if (!error) return false;
  const message = error instanceof Error ? error.message : String(error);
  return CHUNK_LOAD_ERROR_PATTERN.test(message);
};

/**
 * Attempts an automatic reload if a chunk error occurred and we haven't
 * already attempted a reload within the last 15 seconds (to prevent infinite loops).
 * Returns true if a reload was initiated, false otherwise.
 */
export const tryAutoReloadForChunkError = (error: unknown): boolean => {
  if (typeof window === "undefined") return false;
  if (!isChunkLoadError(error)) return false;

  const lastAttempt = sessionStorage.getItem(CHUNK_RELOAD_TIMESTAMP_KEY);
  const now = Date.now();
  if (lastAttempt && now - parseInt(lastAttempt, 10) < 15000) {
    // Already attempted reload within the last 15 seconds; avoid infinite reload loop
    return false;
  }

  sessionStorage.setItem(CHUNK_RELOAD_TIMESTAMP_KEY, String(now));
  sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
  window.location.reload();
  return true;
};

export const clearChunkReloadState = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(CHUNK_RELOAD_KEY);
    sessionStorage.removeItem(CHUNK_RELOAD_TIMESTAMP_KEY);
  }
};
