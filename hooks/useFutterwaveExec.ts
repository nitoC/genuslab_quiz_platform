"use client";

import { useFlutterwave } from "flutterwave-react-v3";
import useUser from "@/hooks/useUser";
import { useCallback, useMemo, useState } from "react";

export const useFlutterwaveExec = () => {
  const {
    data: userData,
    isLoading: isUserLoading,
    isError: isUserError,
  } = useUser();

  // Bumped after each checkout so every attempt gets its own tx_ref.
  // Reusing one made retries fail and blurred which payment was which.
  const [attempt, setAttempt] = useState(0);
  const nextCheckout = useCallback(() => setAttempt((n) => n + 1), []);

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
      customizations: {
        title: "Genuslab academy premium",
        description: "Payment subscription for the genuslab academy quiz",
        logo: "https://genuslabtech.online/_next/image?url=%2Flogo%2Flogo.png&w=256&q=75",
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData, attempt]);

  return {
    useFlutterwaveExec: useFlutterwave(config),
    txRef: config.tx_ref,
    nextCheckout,
    userData,
    isUserLoading,
    isUserError,
  };
};
