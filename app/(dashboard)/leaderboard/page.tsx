"use client";

import { useEffect, useState } from "react";
import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import { cn } from "@/lib/utils/cn";
import Stats from "@/features/leaderboard/components/Stats";
import { useQueries } from "@tanstack/react-query";
import {
  getAverageScore,
  getDailyLeaderboard,
  getLastFiveDaysScore,
  getMonthlyLeaderboard,
  getOverallLeaderboard,
  getOverallUserStats,
  getRankForDay,
  getReferralLeaderboard,
  getTodayRank,
  getUserDashboard,
  getWeeklyLeaderboard,
  getWeeklyLeaderboardHistory,
  getXpLeaderboard,

  //   getDailyXpLeaderboard,
  // getWeeklyXpLeaderboard,
  // getMonthlyXpLeaderboard,
  // getReferralLeaderboard,
  // getPreviousFiveWeeksLeaderboard,
} from "@/lib/api/apis";
import useUser from "@/hooks/useUser";
// import {
//   getOverallLeaderboard,
//   getXpLeaderboard,
//   getDailyXpLeaderboard,
//   getWeeklyXpLeaderboard,
//   getMonthlyXpLeaderboard,
//   getReferralLeaderboard,
//   getPreviousFiveWeeksLeaderboard,
// } from "@/services/api";

const BAR_COLORS = [
  "#132b3d",
  "#174d63",
  "#1a6b85",
  "#1d86a3",
  "#22a1bd",
  "#29b2cf",
  "#448fff",
];

const REFERRAL_DATA = [
  { value: 45 },
  { value: 20 },
  { value: 35 },
  { value: 30 },
  { value: 55 },
  { value: 40 },
];

const MASTER_DATA = [
  { value: 30 },
  { value: 65 },
  { value: 45 },
  { value: 40 },
  { value: 35 },
  { value: 30 },
];

const ACTIVITY_DATA = [
  { name: "Bobby", points: 45 },
  { name: "Emma", points: 58 },
  { name: "Udred", points: 72 },
  { name: "Chibyk", points: 85 },
  { name: "Jane", points: 95 },
];

const TABS = ["Stats", "Performance", "Quiz Ranking", "Referral Ranking"];

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("Stats");

  const maxPoints = Math.max(...ACTIVITY_DATA.map((d) => d.points));

  // replace with the logged in user's detailsId
  const { data, isLoading, isError } = useUser() as {
    data?: { user?: { details?: { id?: string } } };
    isLoading: boolean;
    isError: boolean;
  };

  const detailsId = data?.user?.details?.id;

  const today = new Date();
  const day = `${String(today.getDate()).padStart(2, "0")}-${String(
    today.getMonth() + 1,
  ).padStart(2, "0")}-${today.getFullYear()}`;

  return (
    <Layout>
      <Header title="Global Leaderboard" backBtn={false} />

      <main className="p-8 space-y-8">
        <div>
          <div className="flex scroll-hide overflow-scroll lg:overflow-auto items-center gap-1 bg-[#0f172a]/50 p-1.5 rounded-xl border border-white/5 md:w-fit">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2 shrink-0 rounded-lg text-xs font-bold transition-all duration-200",
                  activeTab === tab
                    ? "bg-[#1e293b] text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5",
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <Stats
          // ACTIVITY_DATA={ACTIVITY_DATA}
          MASTER_DATA={MASTER_DATA}
          maxPoints={maxPoints}
          REFERRAL_DATA={REFERRAL_DATA}
          BAR_COLORS={BAR_COLORS}
          detailsId={detailsId ?? ""}
        />
      </main>
    </Layout>
  );
};

export default LeaderboardPage;
