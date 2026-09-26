import { getRankData } from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";

const useRank = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["ranks data"],
    queryFn: async () => {
      const res = await getRankData();
      return res.data.payload;
    },
  });
  return { data, isLoading, isError, error };
};

export default useRank;
