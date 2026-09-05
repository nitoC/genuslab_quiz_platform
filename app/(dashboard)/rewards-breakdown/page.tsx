"use client";

import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import useSidebar from "@/store/useSidebar";
import React, { useState } from "react";
import {
  MdEmojiEvents,
  MdMenu,
  MdGroupAdd,
  MdToday,
  MdDateRange,
  MdCalendarMonth,
  MdInfoOutline,
  MdArrowForward,
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

const RewardBreakdownPage = () => {
  const { toggleSidebar } = useSidebar((state: any) => state);
  const [activeTab, setActiveTab] = useState<"all" | "episodes" | "referral">(
    "all",
  );

  return (
    <Layout>
      <Header title="Reward Structure" backBtn={true} />
      <div className="min-h-screen pb-20 text-slate-200">
        <div className="max-w-6xl mx-auto px-4 md:px-8 pt-6 space-y-6">
          {/* Header section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSidebar()}
                  className="md:hidden p-1.5 bg-slate-800 rounded border border-slate-700 text-slate-300 hover:text-white"
                  aria-label="Toggle Navigation Sidebar"
                >
                  <MdMenu className="text-lg" />
                </button>
                <span className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Performance & Incentives
                </span>
              </div>
              <h1 className="text-2xl font-semibold text-white tracking-tight">
                Reward Breakdown
              </h1>
              <p className="text-xs text-slate-400">
                Transparent payout structure for competitive episodes and user
                referrals.
              </p>
            </div>

            {/* Segmented Control Filter */}
            <div className="inline-flex bg-slate-900 border border-slate-800 p-1 rounded-md self-start sm:self-auto">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeTab === "all"
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                All Rewards
              </button>
              <button
                onClick={() => setActiveTab("episodes")}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeTab === "episodes"
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Leaderboard Pools
              </button>
              <button
                onClick={() => setActiveTab("referral")}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  activeTab === "referral"
                    ? "bg-slate-800 text-white font-semibold"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Referrals
              </button>
            </div>
          </div>

          {/* Metric Summary Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-slate-900 border border-slate-800 rounded-md p-3.5">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <MdToday size={16} className="text-slate-400" />
                <span>Daily Pool</span>
              </div>
              <p className="text-lg font-bold text-white tracking-tight">
                {formatCurrency(rewardData.daily.total)}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-md p-3.5">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <MdDateRange size={16} className="text-slate-400" />
                <span>Weekly Pool</span>
              </div>
              <p className="text-lg font-bold text-white tracking-tight">
                {formatCurrency(rewardData.weekly.total)}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-md p-3.5">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <MdCalendarMonth size={16} className="text-amber-500/90" />
                <span>Monthly Jackpot</span>
              </div>
              <p className="text-lg font-bold text-white tracking-tight">
                {formatCurrency(rewardData.monthly.total)}
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-md p-3.5">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-medium mb-1">
                <MdGroupAdd size={16} className="text-emerald-500/90" />
                <span>Referral Payout</span>
              </div>
              <p className="text-lg font-bold text-white tracking-tight">
                {formatCurrency(rewardData.referral)}{" "}
                <span className="text-xs font-normal text-slate-400">
                  / user
                </span>
              </p>
            </div>
          </div>

          {/* Leaderboard Tier Breakdown Table/Cards */}
          {(activeTab === "all" || activeTab === "episodes") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                  Leaderboard Distributions
                </h2>
                <span className="text-xs text-slate-400">
                  Calculated by final score and completion time
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Daily Tier Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-md p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-xs font-semibold text-white uppercase tracking-wider">
                        Daily Episodes
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        Top 3 Ranked
                      </span>
                    </div>

                    <div className="my-4">
                      <span className="text-xs text-slate-400 font-medium block">
                        Total Distribution
                      </span>
                      <span className="text-2xl font-bold text-white tracking-tight">
                        {formatCurrency(rewardData.daily.total)}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1.5 px-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                        <span className="font-medium text-slate-300">
                          1st Place
                        </span>
                        <span className="font-semibold text-white">
                          {formatCurrency(rewardData.daily.reward.first)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 px-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                        <span className="font-medium text-slate-300">
                          2nd Place
                        </span>
                        <span className="font-semibold text-white">
                          {formatCurrency(rewardData.daily.reward.second)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 px-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                        <span className="font-medium text-slate-300">
                          3rd Place
                        </span>
                        <span className="font-semibold text-white">
                          {formatCurrency(rewardData.daily.reward.third)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Weekly Tier Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-md p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-xs font-semibold text-white uppercase tracking-wider">
                        Weekly Championship
                      </span>
                      <span className="text-[11px] font-medium text-slate-400">
                        Top 3 Ranked
                      </span>
                    </div>

                    <div className="my-4">
                      <span className="text-xs text-slate-400 font-medium block">
                        Total Distribution
                      </span>
                      <span className="text-2xl font-bold text-white tracking-tight">
                        {formatCurrency(rewardData.weekly.total)}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between py-1.5 px-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                        <span className="font-medium text-slate-300">
                          1st Place
                        </span>
                        <span className="font-semibold text-white">
                          {formatCurrency(rewardData.weekly.reward.first)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 px-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                        <span className="font-medium text-slate-300">
                          2nd Place
                        </span>
                        <span className="font-semibold text-white">
                          {formatCurrency(rewardData.weekly.reward.second)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-1.5 px-2.5 rounded bg-slate-950/60 border border-slate-800/80">
                        <span className="font-medium text-slate-300">
                          3rd Place
                        </span>
                        <span className="font-semibold text-white">
                          {formatCurrency(rewardData.weekly.reward.third)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Monthly Tier Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-md p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                      <span className="text-xs font-semibold text-white uppercase tracking-wider">
                        Monthly Leaderboard
                      </span>
                      <span className="text-[11px] font-medium text-amber-500">
                        Winner Takes All
                      </span>
                    </div>

                    <div className="my-4">
                      <span className="text-xs text-slate-400 font-medium block">
                        Grand Prize Pool
                      </span>
                      <span className="text-2xl font-bold text-white tracking-tight">
                        {formatCurrency(rewardData.monthly.total)}
                      </span>
                    </div>

                    <div className="text-xs">
                      <div className="flex items-center justify-between p-3 rounded bg-amber-500/10 border border-amber-500/20">
                        <span className="font-medium text-amber-200">
                          1st Place Champion
                        </span>
                        <span className="font-bold text-amber-400">
                          {formatCurrency(rewardData.monthly.reward.first)}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-3 leading-normal">
                        Accumulate the highest points across all episodes during
                        the calendar month to claim the monthly jackpot.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Referral Program Section */}
          {(activeTab === "all" || activeTab === "referral") && (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
                Referral Program
              </h2>

              <div className="bg-slate-900 border border-slate-800 rounded-md p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                      Direct Payout
                    </span>
                    <span className="text-xs text-slate-400">
                      No payout limit
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    Earn {formatCurrency(rewardData.referral)} per active
                    referral
                  </h3>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Share your invitation code with new participants. Funds are
                    credited directly to your wallet balance once their first
                    entry is verified.
                  </p>
                </div>

                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0">
                  <span>Invite Users</span>
                  <MdArrowForward size={15} />
                </button>
              </div>
            </div>
          )}

          {/* Institutional Note */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-md p-3.5 flex items-start gap-3 text-xs text-slate-400">
            <MdInfoOutline
              size={16}
              className="text-slate-500 shrink-0 mt-0.5"
            />
            <p className="leading-relaxed">
              Rewards are disbursed automatically following the conclusion and
              audit of each competition timeframe. In the event of equal score
              totals, the fastest cumulative submission duration determines
              ranking.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default RewardBreakdownPage;
