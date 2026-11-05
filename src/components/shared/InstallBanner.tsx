import { useInstallPrompt } from '../../hooks/useInstallPrompt';

/**
 * InstallBanner
 *
 * Shows a bottom-anchored install prompt when the browser fires
 * beforeinstallprompt. Automatically hidden when:
 *   - App is already installed (standalone mode)
 *   - User dismisses it (persisted in sessionStorage for this session)
 *   - Browser doesn't support install prompts (iOS pre-16.4, desktop browsers)
 *
 * iOS note: iOS Safari doesn't fire beforeinstallprompt. The banner won't
 * appear there. iOS users install via Share → Add to Home Screen manually.
 */
export function InstallBanner() {
  const { isInstallable, promptInstall, dismissPrompt } = useInstallPrompt();

  if (!isInstallable) return null;

  return (
    <aside
      role="banner"
      aria-label="Install Echo app"
      className="fixed bottom-4 left-4 right-4 z-50 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-zinc-900/95 px-4 py-3 shadow-2xl backdrop-blur-md md:left-auto md:right-6 md:max-w-sm"
    >
      {/* Icon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f49b31]">
        <img
          src="/icons/icon-72x72.png"
          alt="Echo"
          className="h-7 w-7 rounded-lg object-contain"
        />
      </div>

      {/* Text */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">Install Echo</p>
        <p className="truncate text-xs text-zinc-400">Add to your home screen</p>
      </div>

      {/* Actions */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={dismissPrompt}
          aria-label="Dismiss install prompt"
          className="rounded-lg px-2 py-1 text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          Not now
        </button>
        <button
          id="pwa-install-btn"
          type="button"
          onClick={promptInstall}
          className="rounded-xl bg-[#f49b31] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#e08a20] transition-colors active:scale-95 cursor-pointer"
        >
          Install
        </button>
      </div>
    </aside>
  );
}

export default InstallBanner;
