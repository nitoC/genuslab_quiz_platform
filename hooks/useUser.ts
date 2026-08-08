import { constants } from "@/app/constants";
import { IUser } from "@/interfaces";
import { getOtp, getRankData, getUserProfile } from "@/lib/api/apis";
import getLocalStorage from "@/lib/utils/getLocalStorage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

const useUser = () => {
  const router = useRouter();
  /* -----------------------------
  rankRes.data.data !userData
   * AUTH GUARD
   * ---------------------------- */
  const storedUser = useMemo(() => {
    const user = getLocalStorage("user");

    console.log(user, "in lstorage");

    if (!user) return null;

    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!storedUser) {
      router.replace("/login");
    }
  }, [storedUser, router]);

  //   useEffect(() => {
  //     setIsMounted(true);
  //   }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [constants.USER, storedUser?.userId],
    enabled: !!storedUser?.userId,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    queryFn: async (): Promise<{ user: IUser; rank: any }> => {
      const [userRes, rankRes] = await Promise.all([
        getUserProfile(storedUser.userId),
        getRankData(),
      ]);
      console.log(userRes.data, "user response");
      const user = userRes.data.user;
      // console.log(rankRes.data, "rank res data");
      const userRank = rankRes.data.payload.find(
        (rank: any) => rank.id === user.details.rankId,
      );
      if (
        user &&
        !user.verified &&
        typeof window !== "undefined" &&
        window.location.pathname !== "/verify"
      ) {
        router.push("/verify");
      }

      if (
        user &&
        user.verified &&
        typeof window !== "undefined" &&
        window.location.pathname === "/verify"
      ) {
        router.push("/dashboard");
      }
      return {
        user,
        rank: userRank,
      };
    },
  });

  return { data, isLoading, isError, error, storedUser };
};

export default useUser;
