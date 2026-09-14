import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  collapsed: boolean;
  toggleSidebar: (open?: boolean) => void;
  toggleCollapsed: (collapsed?: boolean) => void;
}

const useSidebar = create<SidebarState>((set) => ({
  isOpen: false,
  collapsed: false,
  toggleSidebar: (open?: boolean) =>
    set((state) => ({
      isOpen: typeof open === "boolean" ? open : !state.isOpen,
    })),
  toggleCollapsed: (collapsed?: boolean) =>
    set((state) => ({
      collapsed: typeof collapsed === "boolean" ? collapsed : !state.collapsed,
    })),
}));

export default useSidebar;
