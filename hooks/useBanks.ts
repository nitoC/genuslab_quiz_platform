"use client";
import { useQuery } from "@tanstack/react-query";
import { getApprovedBanks } from "@/lib/api/apis";

const useBanks = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["approved banks"],
    queryFn: async () => {
      const res = await getApprovedBanks();
      return res;
    },
  });
  return { data, isLoading, isError, refetch };
};

export default useBanks;
