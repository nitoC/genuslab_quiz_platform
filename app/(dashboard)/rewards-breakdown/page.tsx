"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import PrimaryButton from "@/components/ui/buttons/Primary";
import React, { useState } from "react";
import {
  MdEmojiEvents,
  MdGroupAdd,
  MdToday,
  MdDateRange,
  MdCalendarMonth,
  MdInfoOutline,
} from "react-icons/md";

export const rewardData = {
  daily: {
    reward: { first: 10_000, second: 3_000, third: 2_000 },
    total: 15_000,
  },
  weekly: {
    reward: {
      first: 100_000,
      second: 50_000,
      third: 10_000,
    },
    total: 160_000,
  },
  monthly: {
    reward: { first: 1_000_000 },
    total: 1_000_000,
  },
  referral: 1_000,
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

// Shared "1st/2nd/3rd place" row — a glass-consistent neutral chip (white/5
// on top of GlassCard's own translucent surface) instead of a solid slate
// block, so it reads as one material with the card around it.
const PlaceRow = ({
  label,
  amount,
}: {
  label: React.ReactNode;
  amount: number;
}) => (
  <div className="flex items-center justify-between py-2.5 px-3 rounded-md bg-white/5 border border-white/10">
    <span className="font-medium text-grey">{label}</span>
    <span className="font-semibold text-(--primary)">
      {formatCurrency(amount)}
    </span>
  </div>
);

const RewardBreakdownPage = () => {
  const [activeTab, setActiveTab] = useState<"all" | "episodes" | "referral">(
    "all",
  );

  const tabs = [
    { key: "all" as const, label: "All Rewards" },
    { key: "episodes" as const, label: "Leaderboard Pools" },
    { key: "referral" as const, label: "Referrals" },
  ];

  return (
    <Layout>
      <Header title="Reward Structure" backBtn={true} />
      <div className="min-h-screen pb-24">
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-8 space-y-10 md:space-y-12">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pb-6 border-b border-white/10">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium uppercase tracking-wide text-grey">
                  Performance & Incentives
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-(--primary) tracking-tight">
                Reward Breakdown
              </h1>
              <p className="text-sm text-grey max-w-md leading-relaxed">
                Transparent payout structure for competitive episodes and user
                referrals.
              </p>
            </div>

            {/* Segmented Control Filter */}
            <div
              role="tablist"
              className="inline-flex flex-wrap gap-1 bg-white/5 border border-white/10 backdrop-blur-xl p-1 rounded-lg self-start sm:self-auto"
            >
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-3.5 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-blue/20 text-blue font-semibold"
                      : "text-grey hover:text-(--primary) hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Metric Summary Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <GlassCard>
              <div className="p-5">
                <div className="flex items-center gap-2 text-grey text-sm font-medium mb-2.5">
                  <span className="bg-white/5 p-1.5 rounded-md text-blue">
                    <MdToday size={16} />
                  </span>
                  <span>Daily Pool</span>
                </div>
                <p className="text-xl font-bold text-(--primary) tracking-tight">
                  {formatCurrency(rewardData.daily.total)}
                </p>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="p-5">
                <div className="flex items-center gap-2 text-grey text-sm font-medium mb-2.5">
                  <span className="bg-white/5 p-1.5 rounded-md text-blue">
                    <MdDateRange size={16} />
                  </span>
                  <span>Weekly Pool</span>
                </div>
                <p className="text-xl font-bold text-(--primary) tracking-tight">
                  {formatCurrency(rewardData.weekly.total)}
                </p>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="p-5">
                <div className="flex items-center gap-2 text-grey text-sm font-medium mb-2.5">
                  <span className="bg-yellow/10 p-1.5 rounded-md text-yellow">
                    <MdCalendarMonth size={16} />
                  </span>
                  <span>Monthly Jackpot</span>
                </div>
                <p className="text-xl font-bold text-(--primary) tracking-tight">
                  {formatCurrency(rewardData.monthly.total)}
                </p>
              </div>
            </GlassCard>

            <GlassCard>
              <div className="p-5">
                <div className="flex items-center gap-2 text-grey text-sm font-medium mb-2.5">
                  <span className="bg-green/10 p-1.5 rounded-md text-green">
                    <MdGroupAdd size={16} />
                  </span>
                  <span>Referral Payout</span>
                </div>
                <p className="text-xl font-bold text-(--primary) tracking-tight">
                  {formatCurrency(rewardData.referral)}{" "}
                  <span className="text-sm font-normal text-grey">/ user</span>
                </p>
              </div>
            </GlassCard>
          </div>

          {/* Leaderboard Tier Breakdown Cards */}
          {(activeTab === "all" || activeTab === "episodes") && (
            <div
              key={`episodes-${activeTab}`}
              className="space-y-5 animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <h2 className="text-sm font-semibold text-(--primary) uppercase tracking-wider">
                  Leaderboard Distributions
                </h2>
                <span className="text-sm text-grey">
                  Calculated by final score and completion time
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Daily Tier Card */}
                <GlassCard className="flex flex-col">
                  <div className="p-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <span className="text-sm font-semibold text-(--primary) uppercase tracking-wider">
                        Daily Episodes
                      </span>
                      <span className="text-[14px] font-medium text-grey">
                        Top 3 Ranked
                      </span>
                    </div>

                    <div className="my-5">
                      <span className="text-sm text-grey font-medium block mb-1">
                        Total Distribution
                      </span>
                      <span className="text-2xl font-bold text-(--primary) tracking-tight">
                        {formatCurrency(rewardData.daily.total)}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-sm">
                      <PlaceRow
                        label="1st Place"
                        amount={rewardData.daily.reward.first}
                      />
                      <PlaceRow
                        label="2nd Place"
                        amount={rewardData.daily.reward.second}
                      />
                      <PlaceRow
                        label="3rd Place"
                        amount={rewardData.daily.reward.third}
                      />
                    </div>
                  </div>
                </GlassCard>

                {/* Weekly Tier Card */}
                <GlassCard className="flex flex-col">
                  <div className="p-6">
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <span className="text-sm font-semibold text-(--primary) uppercase tracking-wider">
                        Weekly Championship
                      </span>
                      <span className="text-[14px] font-medium text-grey">
                        Top 3 Ranked
                      </span>
                    </div>

                    <div className="my-5">
                      <span className="text-sm text-grey font-medium block mb-1">
                        Total Distribution
                      </span>
                      <span className="text-2xl font-bold text-(--primary) tracking-tight">
                        {formatCurrency(rewardData.weekly.total)}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-sm">
                      <PlaceRow
                        label="1st Place"
                        amount={rewardData.weekly.reward.first}
                      />
                      <PlaceRow
                        label="2nd Place"
                        amount={rewardData.weekly.reward.second}
                      />
                      <PlaceRow
                        label="3rd Place"
                        amount={rewardData.weekly.reward.third}
                      />
                    </div>
                  </div>
                </GlassCard>

                {/* Monthly Tier Card */}
                <GlassCard className="flex flex-col">
                  <div className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pb-4 border-b border-white/10">
                      <span className="text-sm font-semibold text-(--primary) uppercase tracking-wider">
                        Monthly Leaderboard
                      </span>
                      <span className="text-[14px] font-medium text-yellow whitespace-nowrap">
                        Winner Takes All
                      </span>
                    </div>

                    <div className="my-5">
                      <span className="text-sm text-grey font-medium block mb-1">
                        Grand Prize Pool
                      </span>
                      <span className="text-2xl font-bold text-(--primary) tracking-tight">
                        {formatCurrency(rewardData.monthly.total)}
                      </span>
                    </div>

                    <div className="text-sm">
                      <PlaceRow
                        label={
                          <span className="flex items-center gap-1.5">
                            <MdEmojiEvents size={16} className="text-yellow" />
                            1st Place Champion
                          </span>
                        }
                        amount={rewardData.monthly.reward.first}
                      />
                      <p className="text-[14px] text-grey mt-4 leading-relaxed">
                        Accumulate the highest points across all episodes during
                        the calendar month to claim the monthly jackpot.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* Referral Program Section */}
          {(activeTab === "all" || activeTab === "referral") && (
            <div
              key={`referral-${activeTab}`}
              className="space-y-5 animate-in fade-in slide-in-from-bottom-1 duration-300"
            >
              <h2 className="text-sm font-semibold text-(--primary) uppercase tracking-wider">
                Referral Program
              </h2>

              <GlassCard>
                <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                  <div className="space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-green bg-green/10 border border-green/20 px-2 py-0.5 rounded">
                        Direct Payout
                      </span>
                      <span className="text-sm font-semibold text-yellow bg-yellow/10 border border-yellow/20 px-2 py-0.5 rounded">
                        Subscribers Only
                      </span>
                      <span className="text-sm text-grey">No payout limit</span>
                    </div>
                    <h3 className="text-lg font-bold text-(--primary)">
                      Earn {formatCurrency(rewardData.referral)} per active
                      referral
                    </h3>
                    <p className="text-sm text-grey max-w-xl leading-relaxed">
                      Share your invitation code with new participants. Funds
                      are credited directly to your wallet balance once their
                      first entry is verified. This reward is only available to
                      subscribed users — non-subscribed users can still refer
                      friends but won't earn the cash bonus until they
                      subscribe.
                    </p>
                  </div>

                  <PrimaryButton
                    type="link"
                    to="/profile"
                    text="Invite Users"
                    style="px-4 py-2.5 bg-blue text-white rounded-md text-sm font-semibold hover:brightness-110 transition-all inline-flex items-center gap-1.5 shrink-0"
                  />
                </div>
              </GlassCard>
            </div>
          )}

          {/* Institutional Note */}
          <GlassCard>
            <div className="p-4 flex items-start gap-3 text-sm text-grey">
              <MdInfoOutline size={16} className="text-grey shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Rewards are disbursed automatically following the conclusion
                and audit of each competition timeframe. In the event of equal
                score totals, the fastest cumulative submission duration
                determines ranking.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
};

export default RewardBreakdownPage;
