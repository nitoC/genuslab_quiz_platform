import { create } from "zustand";

type User = {
  accessToken: string;
  sessionId: string;
  userId: string;
};

type UserState = {
  user: User | null;
  isInitialized: boolean;
  updateUser: (user: User) => void;
  logout: () => void;
  setIsInitialized: (isInitialized: boolean) => void;
};

export const useUser = create<UserState>((set) => {
  return {
    user: null,
    isInitialized: false,

    updateUser: (user: User) =>
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
