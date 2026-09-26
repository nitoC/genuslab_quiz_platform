"use client";

import { getTime } from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";

const useSystemTime = () => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["system time"],
    queryFn: async () => {
      const res = await getTime();
      return res.data;
    },
  });

  return { data, isLoading, isError, refetch };
};

export default useSystemTime;
