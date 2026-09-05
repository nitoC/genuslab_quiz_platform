"use client";

import { getSlotDetails } from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";

const useSlots = () => {
  const {
    data: slotData,
    isLoading: slotLoading,
    isError: slotError,
  } = useQuery({
    queryKey: ["slots"],
    queryFn: async () => {
      const res = await getSlotDetails();
      return res?.data?.payload;
    },
  });
  return { slotLoading, slotError, slotData };
};

export default useSlots;
