import { create } from "zustand";
import { QUIZ_DURATION } from "@/lib/utils/timer";

// Stores a real wall-clock deadline (epoch ms) rather than a tick-decremented
// counter. A `setInterval` counter drifts from real elapsed time whenever the
// tab is backgrounded — mobile browsers throttle timers heavily while
// unfocused, so a user switching apps mid-quiz would come back to a timer
// that had barely ticked down, letting the quiz run well past the real
// 5-minute limit. Deriving "time left" from `deadline - Date.now()` on every
// tick makes the countdown self-correcting: however long the tab was
// throttled, the next tick immediately reflects the real remaining time.
type TimeState = {
  deadline: number;
  resetTime: () => void;
};

export const useTimeStore = create<TimeState>((set) => ({
  deadline: Date.now() + QUIZ_DURATION * 1000,
  resetTime: () => set({ deadline: Date.now() + QUIZ_DURATION * 1000 }),
}));
