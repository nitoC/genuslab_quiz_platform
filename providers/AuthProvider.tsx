"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { axiosSystem } from "@/lib/api/axiosConfig";
import { useUser } from "@/store/useUser";
import PageLoader from "@/components/ui/PageLoader";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const setInitialized = useUser((state) => state.setIsInitialized);
  const isInitialized = useUser((state) => state.isInitialized);
  const currentUser = useUser((state) => state.user);
  const updateUser = useUser((state) => state.updateUser);

  useEffect(() => {
    const initializeAuth = async () => {
      console.log("[AuthProvider] Starting initialization...", { currentUser });

      // If user is already authenticated from login, skip refresh
      if (currentUser?.userId) {
        console.log(
          "[AuthProvider] User already authenticated, skipping refresh",
        );
        setInitialized(true);
        return;
      }

      // User is not in state (e.g., page refresh), try to refresh from cookie
      try {
        console.log("[AuthProvider] Attempting token refresh...");
        const response = await axiosSystem.post("/auth/refresh");

        // console.log("[AuthProvider] Refresh response:", response.data);

        // Only update if we got valid user data with userId
        if (response?.data?.userId) {
          //   console.log(
          //     "[AuthProvider] User restored from refresh:",
          //     response.data.payload,
          //   );
          updateUser(response.data);
        } else {
          console.log("[AuthProvider] Refresh response missing userId");
        }
      } catch (err: any) {
        // console.log(
        //   "[AuthProvider] Refresh failed:",
        //   err.response?.data || err.message,
        // );
        // Don't logout - just keep user as null (unauthenticated)
      } finally {
        // console.log(
        //   "[AuthProvider] Initialization complete, isInitialized = true",
        // );
        setInitialized(true);
      }
    };

    initializeAuth();
  }, [currentUser, updateUser, setInitialized]);

  if (!isInitialized) {
    return <PageLoader theme={pathname?.startsWith("/genuslab") ? "light" : "dark"} />;
  }

  return <>{children}</>;
};

export default AuthProvider;
