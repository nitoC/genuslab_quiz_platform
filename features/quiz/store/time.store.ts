import { create } from "zustand";

type TimeState = {
  time: number;
  decrementTime: () => void;
  resetTime: () => void;
};

export const useTimeStore = create<TimeState>((set) => ({
  time: 300,
  decrementTime: () => set((state) => ({ time: state.time - 1 })),
  resetTime: () => set(() => ({ time: 300 })),
}));
