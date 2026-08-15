import { constants } from "@/app/constants";
import { IUser } from "@/interfaces";
import { getRankData, getUserProfile } from "@/lib/api/apis";
import getLocalStorage from "@/lib/utils/getLocalStorage";
import { useQuery } from "@tanstack/react-query";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const useUser = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [storedUser, setStoredUser] = useState<{ userId: string } | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // 1. Read stored user safely post-hydration
  useEffect(() => {
    setIsMounted(true);
    const user = getLocalStorage("user");

    if (user) {
      try {
        setStoredUser(JSON.parse(user));
      } catch {
        setStoredUser(null);
      }
    }
  }, []);

  // 2. Auth Guard: Redirect unauthenticated users immediately
  useEffect(() => {
    if (isMounted && !storedUser) {
      router.replace("/login");
    }
  }, [isMounted, storedUser, router]);

  // 3. React Query: Fetches and caches profile data across pages
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [constants.USER, storedUser?.userId],
    enabled: !!storedUser?.userId,
    retry: 1,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    queryFn: async (): Promise<{ user: IUser; rank: any }> => {
      const [userRes, rankRes] = await Promise.all([
        getUserProfile(storedUser!.userId),
        getRankData(),
      ]);

      const user = userRes.data.user;
      const userRank = rankRes.data.payload.find(
        (rank: any) => rank.id === user.details?.rankId,
      );

      return { user, rank: userRank };
    },
  });

  // 4. Strict Route Enforcement: Executes on EVERY route change
  useEffect(() => {
    if (!data?.user) return;

    const isVerified = data.user.verified;
    const isVerifyPage = pathname === "/verify";

    // If unverified and attempting to access ANY page other than /verify
    if (!isVerified && !isVerifyPage) {
      router.replace("/verify");
      return;
    }

    // If verified and trying to access /verify, send to dashboard
    if (isVerified && isVerifyPage) {
      router.replace("/dashboard");
      return;
    }
  }, [pathname, data?.user, router]);

  return { data, isLoading, isError, error, storedUser, refetch };
};

export default useUser;
