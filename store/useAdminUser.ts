import { create } from "zustand";

type AdminUser = {
  accessToken: string;
  sessionId: string;
  userId: string;
  role?: "USER" | "ADMIN" | "SUPPORT" | "ACCOUNTANT";
  mustChangePassword?: boolean;
};

type AdminUserState = {
  user: AdminUser | null;
  isInitialized: boolean;
  updateUser: (user: AdminUser) => void;
  logout: () => void;
  setIsInitialized: (isInitialized: boolean) => void;
};

// Mirrors store/useUser.ts exactly, but kept as a fully separate store so
// an admin-console session and a client-facing session can coexist in the
// same browser without one overwriting the other's identity in memory.
export const useAdminUser = create<AdminUserState>((set) => {
  return {
    user: null,
    isInitialized: false,

    updateUser: (user: AdminUser) =>
      set(() => ({
        user,
      })),
    logout: () =>
      set(() => ({
        user: null,
      })),
    setIsInitialized: (isInitialized: boolean) =>
      set(() => ({
        isInitialized,
      })),
  };
});
