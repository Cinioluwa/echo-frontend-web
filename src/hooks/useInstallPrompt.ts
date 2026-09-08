import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

/**
 * Captures the browser's beforeinstallprompt event so we can trigger
 * the install prompt at a time of our choosing (not immediately on page load).
 *
 * Returns:
 *   - `isInstallable`  — true when the browser has a pending install prompt
 *   - `isInstalled`    — true when running in standalone mode (already installed)
 *   - `promptInstall`  — call this to show the native install dialog
 *   - `dismissPrompt`  — call this to dismiss without installing (persists in sessionStorage)
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already running as installed PWA
    const standaloneMedia = window.matchMedia('(display-mode: standalone)');
    const isStandalone =
      standaloneMedia.matches ||
      (navigator as any).standalone === true; // iOS Safari

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Check if user previously dismissed this session
    const dismissed = sessionStorage.getItem('echo:pwa-install-dismissed');
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault(); // prevent default mini-infobar on mobile
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    const installedHandler = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'dismissed') {
      sessionStorage.setItem('echo:pwa-install-dismissed', '1');
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  }, [deferredPrompt]);

  const dismissPrompt = useCallback(() => {
    sessionStorage.setItem('echo:pwa-install-dismissed', '1');
    setIsInstallable(false);
    setDeferredPrompt(null);
  }, []);

  return { isInstallable, isInstalled, promptInstall, dismissPrompt };
}
