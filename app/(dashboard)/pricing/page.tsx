"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { PRICING_PLANS } from "@/data/plans";
import { PricingCard } from "@/components/ui/cards/PricingCard";
import { Footer } from "@/components/ui/PricingFooter";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import PageLoader from "@/components/ui/PageLoader";
import useSubscription from "@/hooks/useSubscription";
import { useFlutterwaveExec as useFlutterExec } from "@/hooks/useFutterwaveExec";
import {
  acquireCheckoutLock,
  releaseCheckoutLock,
  getUserSubscription,
  subscribe,
} from "@/lib/api/apis";
import { closePaymentModal } from "flutterwave-react-v3";
import {
  ReceiptModal,
  TransactionReceiptData,
} from "@/components/ui/modals/receipt";
import toast from "react-hot-toast";

export default function PricingPage() {
  const { data, isLoading, refetch } = useSubscription();
  const { useFlutterwaveExec, userData, txRef, nextCheckout } =
    useFlutterExec();
  // True from the click until Flutterwave closes, so a second click can't
  // start another payment.
  const [checkingOut, setCheckingOut] = useState(false);

  // State for controlling Receipt Modal
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [receiptData, setReceiptData] = useState<TransactionReceiptData | null>(
    null,
  );

  const subscribeMutation = useMutation({
    mutationFn: (payload: { name: string; price: number; txRef: string }) =>
      subscribe(payload),
  });

  const finishCheckout = async () => {
    await releaseCheckoutLock().catch(() => {});
    nextCheckout();
    setCheckingOut(false);
  };

  const handleSubscription = async () => {
    if (checkingOut) return;
    setCheckingOut(true);

    const hasSubscription = await getUserSubscription().catch(() => null);
    if (hasSubscription?.data?.payload?.name === "PREMIUM") {
      setCheckingOut(false);
      return toast.error("You already have an active Premium subscription");
    }

    // The server refuses if a payment is already open or pending, and if an
    // earlier payment went through unreported it activates Premium from it
    // instead of letting the user pay again.
    try {
      const res = await acquireCheckoutLock(txRef);
      if (res.data?.payload?.recovered) {
        await refetch();
        toast.success(
          "Your earlier payment was confirmed. Premium is now active.",
        );
        setCheckingOut(false);
        return;
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "A payment is already in progress for your account.",
      );
      setCheckingOut(false);
      return;
    }

    useFlutterwaveExec({
      callback: async (response: any) => {
        try {
          // 1. Sync with backend API
          await subscribeMutation.mutateAsync({
            name: "PREMIUM",
            price: Number(response.amount),
            txRef: response.tx_ref,
          });
          await refetch();

          // 2. Prepare receipt payload from response
          setReceiptData({
            transactionId: response.transaction_id,
            amount: Number(response.amount),
            currency: response.currency || "NGN",
            txRef: response.tx_ref,
            paymentType: response.payment_type,
            createdAt: new Date().toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            }),
            user: {
              name: userData?.user?.name,
              email: userData?.user?.email,
            },
            planName: "Genuslab Academy Premium",
          });

          // 3. Open Receipt Overlay
          setIsReceiptOpen(true);
        } catch (error: any) {
          toast.error(
            error?.response?.data?.message || "Subscription failed",
          );
          console.error("Subscription process failed:", error);
        } finally {
          closePaymentModal();
          await finishCheckout();
        }
      },
      onClose: async () => {
        await finishCheckout();
      },
    });
  };

  if (isLoading) {
    return <PageLoader theme="dark" />;
  }

  return (
    <Layout>
      <Header title="Pricing" backBtn={false} />
      <div className="min-h-screen text-slate-100 flex flex-col justify-between">
        <main className="max-w-6xl mx-auto px-4 md:px-8 pt-12 md:pt-20 space-y-12 w-full">
          <div className="max-w-2xl">
            <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
              Choose the perfect tier to unlock learning paths, win rewards, and
              exclusive community badges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 justify-center gap-6 lg:gap-8 items-stretch">
            {PRICING_PLANS.map((plan) => (
              <PricingCard
                key={plan.id}
                plan={plan}
                activePlan={data?.data.payload}
                handleSubscription={handleSubscription}
                submitting={checkingOut || subscribeMutation.isPending}
              />
            ))}
          </div>
        </main>

        <Footer />
      </div>

      {/* Payment Receipt Modal Overlay */}
      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        receiptData={receiptData}
      />
    </Layout>
  );
}
