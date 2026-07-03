import { create } from "zustand";

const useSidebar = create((set) => ({
  isOpen: false,
  toggleSidebar: (open?: boolean) =>
    set((state: any) => {
      const shouldOpen = typeof open === "boolean" ? open : !state.isOpen;
      return { isOpen: shouldOpen };
    }),
}));

export default useSidebar;
