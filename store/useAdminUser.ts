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

// Same as useUser, kept separate so admin and user sessions can coexist.
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
