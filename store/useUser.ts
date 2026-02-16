import { create } from "zustand";

export const useUser = create((set) => {
  return {
    user: null,
    updateUser: (user: any) =>
      set(() => ({
        user,
      })),
  };
});


