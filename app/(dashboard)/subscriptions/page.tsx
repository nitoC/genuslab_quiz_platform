"use client";

import { useState } from "react";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import GlassCard from "@/components/ui/cards/GlassCard";
import PrimaryButton from "@/components/ui/buttons/Primary";
import useUser from "@/hooks/useUser";
import {
  getUserSubscriptions,
  getUserSubscriptionById,
} from "@/lib/api/apis";
import { ISubscription } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { FaHistory } from "react-icons/fa";
import GlassBadge from "@/components/ui/GlassBadge";
import RecordDetailView from "@/components/ui/modals/RecordDetailView";

const formatNaira = (price: number) =>
  `₦${Number(price || 0).toLocaleString()}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const SubscriptionRow = ({
  subscription,
  onClick,
}: {
  subscription: ISubscription;
  onClick: () => void;
}) => {
  const isPremium = subscription.name === "PREMIUM";
  const isActive = new Date(subscription.endAt) > new Date();

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full text-left cursor-pointer"
    >
      <GlassCard className="transition-all hover:bg-white/[0.03]">
        <div className="p-4 md:p-5 flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h4 className="text-(--primary) font-bold text-sm md:text-base truncate">
              {isPremium ? "Premium Plan" : "Free Tier"}
            </h4>
            <p className="text-[13px] md:text-sm text-grey truncate mt-0.5">
              {formatDate(subscription.startAt)} — {formatDate(subscription.endAt)}
            </p>
            <p className="text-[12px] text-grey/70 font-mono truncate mt-0.5">
              Ref: {subscription.id}
            </p>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <p className="font-bold text-sm md:text-base text-(--primary)">
              {formatNaira(subscription.price)}
            </p>
            <GlassBadge variant={isActive ? "success" : "neutral"}>
              {isActive ? "Active" : "Expired"}
            </GlassBadge>
          </div>
        </div>
      </GlassCard>
    </button>
  );
};

const SubscriptionsSkeleton = () => (
  <Layout>
    <Header title="My Subscriptions" backBtn />
    <div className="p-4 md:p-8 space-y-4 max-w-[900px] mx-auto">
      <div className="animate-pulse h-6 w-48 bg-white/10 rounded-lg" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse h-20 w-full bg-white/5 rounded-lg" />
      ))}
    </div>
  </Layout>
);

const SubscriptionsPage = () => {
  const { data: userData, isLoading: isUserLoading, userStore } = useUser();
  const user = userData?.user;

  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >(null);

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions", "mine"],
    queryFn: async () => {
      const res = await getUserSubscriptions();
      return (res?.data?.payload ?? []) as ISubscription[];
    },
    enabled: !!userStore,
  });

  const { data: selectedSubscription, isLoading: isDetailLoading } = useQuery(
    {
      queryKey: ["subscriptionDetail", selectedSubscriptionId],
      queryFn: async () => {
        const res = await getUserSubscriptionById(
          selectedSubscriptionId as string,
        );
        return res?.data?.payload as ISubscription | undefined;
      },
      enabled: !!selectedSubscriptionId,
    },
  );

  if (isUserLoading || !userStore || !user) {
    return <SubscriptionsSkeleton />;
  }

  return (
    <Layout>
      <Header title="My Subscriptions" backBtn />

      <main className="p-4 md:p-8 space-y-6 max-w-[900px] mx-auto">
        <div className="space-y-1">
          <h2 className="text-(--primary) text-xl md:text-2xl font-bold">
            My Subscriptions
          </h2>
          <p className="text-grey text-sm">
            All plans you've subscribed to, past and present.
          </p>
        </div>

        <div className="space-y-3 min-h-[200px]">
          {isLoading ? (
            <div className="py-12 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : subscriptions && subscriptions.length > 0 ? (
            subscriptions.map((sub) => (
              <SubscriptionRow
                key={sub.id}
                subscription={sub}
                onClick={() => setSelectedSubscriptionId(sub.id)}
              />
            ))
          ) : (
            <GlassCard className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-white/10">
              <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                <FaHistory className="text-3xl text-grey" />
              </div>

              <div className="space-y-1 max-w-sm">
                <h3 className="text-(--primary) font-bold text-base md:text-lg">
                  No Subscriptions Yet
                </h3>
                <p className="text-grey text-sm">
                  You haven't subscribed to any plan yet. Upgrade to Premium
                  to unlock more benefits.
                </p>
              </div>

              <PrimaryButton
                type="link"
                to="/pricing"
                text="View Plans"
                style="bg-blue text-white hover:bg-blue/90 rounded-lg py-3 px-8 text-xs font-bold tracking-wide inline-flex justify-center items-center gap-2"
              />
            </GlassCard>
          )}
        </div>
      </main>

      {selectedSubscriptionId && (
        <RecordDetailView
          open={!!selectedSubscriptionId}
          onClose={() => setSelectedSubscriptionId(null)}
          loading={isDetailLoading}
          documentTitle="Subscription Receipt"
          subtitle={
            selectedSubscription?.name === "PREMIUM"
              ? "Premium Plan"
              : "Free Tier"
          }
          amount={
            selectedSubscription
              ? formatNaira(selectedSubscription.price)
              : undefined
          }
          amountLabel="Amount Paid"
          statusLabel={
            selectedSubscription
              ? new Date(selectedSubscription.endAt) > new Date()
                ? "Active"
                : "Expired"
              : undefined
          }
          statusVariant={
            selectedSubscription &&
            new Date(selectedSubscription.endAt) > new Date()
              ? "success"
              : "neutral"
          }
          reference={selectedSubscription?.id || selectedSubscriptionId}
          filename={`Genuslab_Subscription_${selectedSubscriptionId}`}
          rows={[
            { label: "Plan", value: selectedSubscription?.name || "—" },
            {
              label: "Start Date",
              value: selectedSubscription
                ? formatDate(selectedSubscription.startAt)
                : "—",
            },
            {
              label: "End Date",
              value: selectedSubscription
                ? formatDate(selectedSubscription.endAt)
                : "—",
            },
          ]}
        />
      )}
    </Layout>
  );
};

export default SubscriptionsPage;
