import { useUser } from "@/store/useUser";
import { axiosSystem } from "../api/axiosConfig";

export const initializeAuth = async () => {
  try {
    const response = await axiosSystem.post("/auth/refresh");

    const payload = response.data.payload;

    useUser.getState().updateUser(payload);

    return true;
  } catch {
    useUser.getState().logout();

    return false;
  } finally {
    useUser.getState().setIsInitialized(true);
  }
};
