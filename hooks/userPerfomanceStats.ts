import { getPerformanceStats } from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";

const userPerfomanceStats = (detailsId: string, date: string) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["userPerfomanceStats", detailsId, date],
    queryFn: async () => {
      const response = await getPerformanceStats(detailsId, date);
      return response?.data?.payload;
    },
  });
  return {
    data,
    isLoading,
    isError,
    error,
  };
};

export default userPerfomanceStats;
