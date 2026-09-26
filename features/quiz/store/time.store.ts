import { create } from "zustand";
import { QUIZ_DURATION } from "@/lib/utils/timer";

// Store the deadline, not a counter — background tabs throttle timers,
// so time left is always deadline - now.
type TimeState = {
  deadline: number;
  resetTime: () => void;
};

export const useTimeStore = create<TimeState>((set) => ({
  deadline: Date.now() + QUIZ_DURATION * 1000,
  resetTime: () => set({ deadline: Date.now() + QUIZ_DURATION * 1000 }),
}));
