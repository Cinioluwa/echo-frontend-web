/**
 * Audio Notification Manager
 * Handles preloading, unlocking on first interaction, and playing notification chime.
 */

let chimeAudio: HTMLAudioElement | null = null;
let isUnlocked = false;

export function initNotificationAudio() {
  if (typeof window === "undefined") return;
  if (!chimeAudio) {
    chimeAudio = new Audio("/sounds/sonar-ping.mp3");
    chimeAudio.volume = 0.7;
    chimeAudio.preload = "auto";
  }
}

// Automatically unlock audio on first click/pointerdown/keydown in the document
if (typeof window !== "undefined") {
  const unlock = () => {
    if (isUnlocked) return;
    initNotificationAudio();
    if (chimeAudio) {
      const prevMuted = chimeAudio.muted;
      chimeAudio.muted = true;
      chimeAudio
        .play()
        .then(() => {
          chimeAudio?.pause();
          if (chimeAudio) {
            chimeAudio.currentTime = 0;
            chimeAudio.muted = prevMuted;
          }
          isUnlocked = true;
          window.removeEventListener("pointerdown", unlock);
          window.removeEventListener("keydown", unlock);
        })
        .catch(() => {
          // Retry on next gesture
        });
    }
  };

  window.addEventListener("pointerdown", unlock);
  window.addEventListener("keydown", unlock);
}

export function playNotificationChime() {
  try {
    initNotificationAudio();
    if (chimeAudio) {
      chimeAudio.currentTime = 0;
      chimeAudio.muted = false;
      const promise = chimeAudio.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          console.warn("Notification chime autoplay blocked by browser policy:", err.message);
        });
      }
    }
  } catch (err) {
    console.warn("Failed to play notification chime:", err);
  }
}
