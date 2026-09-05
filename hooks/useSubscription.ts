"use client";

import { getUserSubscription } from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";

const useSubscription = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const res = await getUserSubscription();
      return res;
    },
  });
  return { data, isLoading, isError, refetch };
};

export default useSubscription;
