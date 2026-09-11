"use client";

import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import GlassCard from "@/components/ui/cards/GlassCard";
import PrimaryButton from "@/components/ui/buttons/Primary";
import useUser from "@/hooks/useUser";
import { getUserSubscriptions } from "@/lib/api/apis";
import { ISubscription } from "@/interfaces";
import { useQuery } from "@tanstack/react-query";
import { FaCrown, FaHistory } from "react-icons/fa";
import { HiOutlineTv } from "react-icons/hi2";
import clsx from "clsx";

const formatNaira = (price: number) =>
  `₦${Number(price || 0).toLocaleString()}`;

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const SubscriptionRow = ({ subscription }: { subscription: ISubscription }) => {
  const isPremium = subscription.name === "PREMIUM";
  const isActive = new Date(subscription.endAt) > new Date();

  return (
    <GlassCard className="transition-all hover:bg-white/[0.03]">
      <div className="p-4 md:p-5 flex items-center justify-between gap-3">
        <div className="flex gap-3 md:gap-4 items-center flex-1 min-w-0">
          <div
            className={clsx(
              "w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-xl border",
              isPremium
                ? "bg-amber-400/10 border-amber-400/20"
                : "bg-white/5 border-white/5",
            )}
          >
            {isPremium ? (
              <FaCrown className="text-amber-400 text-lg" />
            ) : (
              <HiOutlineTv className="text-blue text-xl" />
            )}
          </div>

          <div className="min-w-0">
            <h4 className="text-(--primary) font-bold text-sm md:text-base truncate">
              {isPremium ? "Premium Plan" : "Free Tier"}
            </h4>
            <p className="text-[13px] md:text-sm text-grey truncate mt-0.5">
              {formatDate(subscription.startAt)} — {formatDate(subscription.endAt)}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <p className="font-bold text-sm md:text-base text-(--primary)">
            {formatNaira(subscription.price)}
          </p>
          <span
            className={clsx(
              "text-[11px] md:text-[12px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md",
              isActive
                ? "text-emerald-400 bg-emerald-400/10"
                : "text-grey bg-white/5",
            )}
          >
            {isActive ? "Active" : "Expired"}
          </span>
        </div>
      </div>
    </GlassCard>
  );
};

const SubscriptionsSkeleton = () => (
  <Layout>
    <Header title="My Subscriptions" backBtn />
    <div className="p-4 md:p-8 space-y-4 max-w-[900px] mx-auto">
      <div className="animate-pulse h-6 w-48 bg-white/10 rounded-lg" />
      {[0, 1, 2].map((i) => (
        <div key={i} className="animate-pulse h-20 w-full bg-white/5 rounded-2xl" />
      ))}
    </div>
  </Layout>
);

const SubscriptionsPage = () => {
  const { data: userData, isLoading: isUserLoading, userStore } = useUser();
  const user = userData?.user;

  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions", "mine"],
    queryFn: async () => {
      const res = await getUserSubscriptions();
      return (res?.data?.payload ?? []) as ISubscription[];
    },
    enabled: !!userStore,
  });

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
              <SubscriptionRow key={sub.id} subscription={sub} />
            ))
          ) : (
            <GlassCard className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-white/10">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5">
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
                style="bg-blue text-white hover:bg-blue/90 rounded-xl py-3 px-8 text-xs font-bold tracking-wide inline-flex justify-center items-center gap-2"
              />
            </GlassCard>
          )}
        </div>
      </main>
    </Layout>
  );
};

export default SubscriptionsPage;
