import { create } from "zustand";

const useSidebar = create((set) => ({
  isOpen: false,
  toggleSidebar: () => set((state: any) => ({ isOpen: !state.isOpen })),
}));

export default useSidebar;
