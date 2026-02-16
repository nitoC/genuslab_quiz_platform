import { create } from "zustand";

export const useSocket = create((set) => ({
  socketId: "",
  updateSocketId: (id: string) =>
    set(() => ({
      socketId: id,
    })),
}));
