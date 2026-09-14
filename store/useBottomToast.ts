import { create } from "zustand";

type BottomToastData = { title: string; description: string };

interface BottomToastState {
  isOpen: boolean;
  data: BottomToastData;
  updateOpen: (isOpen: boolean, data: BottomToastData) => void;
}

export const useBottomToast = create<BottomToastState>((set) => ({
  isOpen: false,
  data: { title: "", description: "" },
  updateOpen: (isOpen, data) => set({ isOpen, data }),
}));
