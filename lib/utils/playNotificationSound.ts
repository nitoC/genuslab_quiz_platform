// Two-tone chime via Web Audio. Silently does nothing if autoplay is blocked.
export const playNotificationSound = () => {
  if (typeof window === "undefined") return;

  try {
    const AudioCtx =
      window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;

    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const tones = [
      { freq: 880, start: 0, duration: 0.12 },
      { freq: 1174.66, start: 0.1, duration: 0.18 },
    ];

    tones.forEach(({ freq, start, duration }) => {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(freq, now + start);

      gain.gain.setValueAtTime(0, now + start);
      gain.gain.linearRampToValueAtTime(0.15, now + start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + start + duration);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(now + start);
      oscillator.stop(now + start + duration + 0.05);
    });

    setTimeout(() => ctx.close(), 500);
  } catch {
    // Ignore — sound is a nice-to-have, never block on it.
  }
};
