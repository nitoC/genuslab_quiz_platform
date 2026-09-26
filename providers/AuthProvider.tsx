"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { axiosSystem } from "@/lib/api/axiosConfig";
import { useUser } from "@/store/useUser";
import { useAdminUser } from "@/store/useAdminUser";
import PageLoader from "@/components/ui/PageLoader";

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  // Admin and client each restore their own session (separate cookie and store).
  const isAdminRoute = !!pathname?.startsWith("/genuslab");

  const setInitialized = useUser((state) => state.setIsInitialized);
  const isInitialized = useUser((state) => state.isInitialized);
  const currentUser = useUser((state) => state.user);
  const updateUser = useUser((state) => state.updateUser);

  const setAdminInitialized = useAdminUser((state) => state.setIsInitialized);
  const isAdminInitialized = useAdminUser((state) => state.isInitialized);
  const currentAdminUser = useAdminUser((state) => state.user);
  const updateAdminUser = useAdminUser((state) => state.updateUser);

  useEffect(() => {
    if (isAdminRoute) return;

    const initializeAuth = async () => {
      if (currentUser?.userId) {
        setInitialized(true);
        return;
      }

      try {
        const response = await axiosSystem.post("/auth/refresh");
        if (response?.data?.userId) {
          updateUser(response.data);
        }
      } catch (err: any) {
        // Not authenticated — leave user as null.
      } finally {
        setInitialized(true);
      }
    };

    initializeAuth();
  }, [isAdminRoute, currentUser, updateUser, setInitialized]);

  useEffect(() => {
    if (!isAdminRoute) return;

    const initializeAdminAuth = async () => {
      if (currentAdminUser?.userId) {
        setAdminInitialized(true);
        return;
      }

      try {
        const response = await axiosSystem.post("/auth/admin/refresh");
        if (response?.data?.userId) {
          updateAdminUser(response.data);
        }
      } catch (err: any) {
        // Not authenticated — leave admin user as null.
      } finally {
        setAdminInitialized(true);
      }
    };

    initializeAdminAuth();
  }, [isAdminRoute, currentAdminUser, updateAdminUser, setAdminInitialized]);

  const ready = isAdminRoute ? isAdminInitialized : isInitialized;

  if (!ready) {
    return <PageLoader theme={isAdminRoute ? "light" : "dark"} />;
  }

  return <>{children}</>;
};

export default AuthProvider;
