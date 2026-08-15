import { create } from "zustand";

export const useSocket = create((set) => ({
  socket: null,
  updateSocket: (socket: any) =>
    set(() => ({
      socket,
    })),
}));
