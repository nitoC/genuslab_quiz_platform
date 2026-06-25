import { create } from "zustand";

type ActiveSlot = [
  {
    label: string;
    value: number;
  },
];

export const useActiveSlotStore = create((set) => ({
  activeSlot: [],
  addSlot: (activeSlots: ActiveSlot) => set(() => set({ activeSlots })),
}));
