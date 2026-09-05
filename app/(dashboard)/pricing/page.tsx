"use client";

import { useState } from "react";
import { PRICING_PLANS } from "@/data/plans";
import { PricingCard } from "@/components/ui/cards/PricingCard";
import { Footer } from "@/components/ui/PricingFooter";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import useSubscription from "@/hooks/useSubscription";
import { useFlutterwaveExec as useFlutterExec } from "@/hooks/useFutterwaveExec";
import { subscribe } from "@/lib/api/apis";
import { closePaymentModal } from "flutterwave-react-v3";
import {
  ReceiptModal,
  TransactionReceiptData,
} from "@/components/ui/modals/receipt";
import toast from "react-hot-toast";

export default function PricingPage() {
  const { data, isLoading, refetch } = useSubscription();
  const { useFlutterwaveExec, userData } = useFlutterExec();

  // State for controlling Receipt Modal
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [receiptData, setReceiptData] = useState<TransactionReceiptData | null>(
    null,
  );

  const handleSubscription = () => {
    setSubmitting(true);
    useFlutterwaveExec({
      callback: async (response: any) => {
        try {
          // 1. Sync with backend API
          await subscribe({ name: "PREMIUM", price: Number(response.amount) });
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
        } catch (error) {
          toast.error("Subscription failed");
          console.error("Subscription process failed:", error);
        } finally {
          setSubmitting(false);
          closePaymentModal();
        }
      },
      onClose: () => {
        setSubmitting(false);
      },
    });
  };

  if (isLoading) {
    return <p className="p-8 text-slate-200">loading...</p>;
  }

  return (
    <Layout>
      <Header title="Pricing" backBtn={false} />
      <div className="min-h-screen text-slate-100 relative overflow-hidden flex flex-col justify-between">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-3xl pointer-events-none" />

        <main className="max-w-6xl mx-auto px-4 md:px-8 pt-12 md:pt-20 space-y-12 relative z-10 w-full">
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
                submitting={submitting}
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
