import { create } from "zustand";

const useSidebar = create((set) => ({
  isOpen: false,
  toggleSidebar: (open?: boolean) =>
    set((state: boolean) => ({ isOpen: open ?? !state.isOpen })),
}));

export default useSidebar;
