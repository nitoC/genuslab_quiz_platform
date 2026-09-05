"use client";

import { useFlutterwave, closePaymentModal } from "flutterwave-react-v3";
import useUser from "@/hooks/useUser";
import { useMemo } from "react";

export const useFlutterwaveExec = () => {
  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUser();

  // Memoize config so tx_ref stays stable across re-renders
  const config = useMemo(() => {
    const user = userData?.user;

    return {
      public_key: process.env.NEXT_PUBLIC_FLUTTER_PUBLIC_KEY || "",
      tx_ref: `GLT-${Date.now()}-${user?.id || "guest"}-premium`,
      amount: 4000,
      currency: "NGN",
      payment_options: "card,mobilemoney,ussd",
      customer: {
        email: user?.email || "",
        phone_number: user?.phone || "",
        name: user?.name || "",
      },
      // Fixed: Moved customizations out of customer object to root level
      customizations: {
        title: "Genuslab academy premium",
        description: "Payment subscription for the genuslab academy quiz",
        logo: "https://genuslabtech.online/_next/image?url=%2Flogo%2Flogo.png&w=256&q=75",
      },
    };
  }, [userData]);

  return {
    useFlutterwaveExec: useFlutterwave(config),
    userData,
    isUserLoading,
    isUserError,
  };
};
