"use client";

import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import { getEpisodeLeaderboard } from "@/lib/api/apis";
import { cn } from "@/lib/utils/cn";
import useSidebar from "@/store/useSidebar";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import {
  MdMenu,
  MdArrowForward,
  MdEmojiEvents,
  MdAccessTime,
  MdAccountBalanceWallet,
  MdMoreHoriz,
  MdPerson,
} from "react-icons/md";

interface LeaderboardItem {
  position: number;
  score: number;
  name: string;
  avatar: string | null;
  totalXp: number;
}

const EpisodePerformancePage = () => {
  const { toggleSidebar } = useSidebar((state: any) => state);
  const QueryParam = useSearchParams();

  const date = QueryParam.get("date");
  const episode = QueryParam.get("episode");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["episode leaderboard", date, episode],
    queryFn: async () => {
      const res = await getEpisodeLeaderboard(
        date as string,
        episode as string,
      );
      return res.data;
    },
    enabled: Boolean(date && episode),
  });

  if (isLoading) {
    return <p className="p-6 text-slate-400">Loading leaderboard...</p>;
  }
  if (isError) {
    return (
      <p className="p-6 text-red-400">Something went wrong fetching data.</p>
    );
  }
  // Extract payload list and map winner
  const leaderboardList: LeaderboardItem[] = data?.payload || [];

  console.log(data, "data");
  console.log(data.payload, "data payload");
  const winner =
    leaderboardList.find((item) => item.position === 1) || leaderboardList[0];

  return (
    <Layout>
      <Header title="Episode Performance" backBtn={true} />
      <div className="min-h-screen pb-28">
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 space-y-6 md:space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSidebar()}
                  className="md:hidden p-2 bg-slate-800 rounded-lg border border-slate-700 text-white"
                >
                  <MdMenu className="text-xl" />
                </button>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  LIVE RESULTS
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Episode Performance
              </h1>
              <p className="text-xs md:text-sm text-slate-400 font-medium">
                Day {date || "--"}{" "}
                <span className="text-slate-700 mx-1.5">|</span> Episode{" "}
                {episode || "--"}
              </p>
            </div>

            <button className="w-fit inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-xs font-semibold transition-colors">
              <span>VIEW QUIZ ANSWERS</span>
              <MdArrowForward className="text-base text-slate-400" />
            </button>
          </div>

          {/* Winner Spotlight Card */}
          {winner && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
                {/* Avatar + Champion Badge */}
                <div className="relative shrink-0 flex flex-col items-center">
                  <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-amber-500/50 p-1">
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-800 flex items-center justify-center">
                      {winner.avatar ? (
                        <Image
                          src={winner.avatar}
                          alt={winner.name}
                          fill
                          className="object-cover"
                          priority
                        />
                      ) : (
                        <MdPerson className="text-4xl text-slate-500" />
                      )}
                    </div>

                    {/* Trophy Badge */}
                    <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 p-1.5 rounded-full border border-slate-900">
                      <MdEmojiEvents size={16} />
                    </div>
                  </div>

                  {/* Champion Tag */}
                  <div className="mt-3 px-3 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] font-bold tracking-wider text-amber-400">
                    CHAMPION
                  </div>
                </div>

                {/* Stats & Description Content */}
                <div className="flex-1 text-center md:text-left space-y-3">
                  <div>
                    <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
                      RANK #{winner.position}
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5 capitalize">
                      Winner: {winner.name}
                    </h2>
                  </div>

                  {/* Metrics */}
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                      <MdAccountBalanceWallet
                        size={15}
                        className="text-emerald-400"
                      />
                      <span>{winner.totalXp} XP</span>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium">
                      <MdAccessTime size={15} className="text-slate-400" />
                      <span>Score: {winner.score}</span>
                    </div>
                  </div>

                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl">
                    Outstanding performance this episode!{" "}
                    <span className="capitalize">{winner.name}</span> achieved a
                    score of {winner.score}% and secured {winner.totalXp} total
                    XP.
                  </p>

                  <div className="pt-1">
                    <button className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-colors">
                      View Full Stats
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Table Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Leaderboard</h3>
                <span className="text-xs text-slate-500">
                  — {leaderboardList.length} Participants
                </span>
              </div>
              <button className="text-slate-500 hover:text-slate-300 p-1">
                <MdMoreHoriz size={20} />
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-[10px] md:text-xs font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/50">
                      <th className="py-3 px-5">RANK</th>
                      <th className="py-3 px-5">USER</th>
                      <th className="py-3 px-5">
                        {" "}
                        WEIGHT SCORE (SCORE * MULTIPLIER)
                      </th>
                      <th className="py-3 px-5 text-right">TOTAL XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-xs md:text-sm font-medium">
                    {leaderboardList.map((row) => (
                      <tr
                        key={row.position}
                        className={cn(
                          "hover:bg-slate-800/50 transition-colors",
                          row.position === 1 && "bg-slate-800/20",
                        )}
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-5">
                          <span
                            className={cn(
                              "font-bold text-sm",
                              row.position === 1
                                ? "text-amber-400"
                                : row.position === 2
                                  ? "text-slate-300"
                                  : row.position === 3
                                    ? "text-amber-600"
                                    : "text-slate-500",
                            )}
                          >
                            #{row.position}
                          </span>
                        </td>

                        {/* User Avatar & Name */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full relative overflow-hidden bg-slate-800 border border-slate-700 shrink-0 flex items-center justify-center">
                              {row.avatar ? (
                                <Image
                                  src={row.avatar}
                                  alt={row.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <MdPerson className="text-slate-400 text-base" />
                              )}
                            </div>
                            <span className="text-white font-semibold capitalize">
                              {row.name}
                            </span>
                          </div>
                        </td>

                        {/* Progress Bar & Score */}
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3 min-w-[140px] max-w-[200px]">
                            {/* <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{
                                  width: `${Math.min(row.score, 100)}%`,
                                }}
                              />
                            </div> */}
                            <span className="text-slate-300 font-semibold text-xs shrink-0">
                              {row.score}
                            </span>
                          </div>
                        </td>

                        {/* Total XP */}
                        <td className="py-3.5 px-5 text-right text-slate-300 font-bold">
                          {row.totalXp} XP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky Footer */}
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-slate-900 border-t border-slate-800">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="grid grid-cols-4 gap-4 sm:gap-8 w-full sm:w-auto text-center sm:text-left divide-x divide-slate-800 sm:divide-x-0">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  MY RANK
                </p>
                <p className="text-base sm:text-lg font-bold text-white mt-0.5">
                  #--
                </p>
              </div>

              <div className="pl-4 sm:pl-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  MY SCORE
                </p>
                <p className="text-base sm:text-lg font-bold text-white mt-0.5">
                  --%
                </p>
              </div>

              <div className="pl-4 sm:pl-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  TOTAL XP
                </p>
                <p className="text-base sm:text-lg font-bold text-white mt-0.5">
                  --
                </p>
              </div>

              <div className="pl-4 sm:pl-0">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400">
                  REWARD
                </p>
                <p className="text-base sm:text-lg font-bold text-emerald-400 mt-0.5">
                  ₦0
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              <span className="hidden lg:inline text-xs text-slate-400">
                Keep playing to reach the top 10!
              </span>
              <button className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs tracking-wider uppercase transition-colors">
                CLAIM REWARD
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const PageWrapper = () => {
  return (
    <Suspense
      fallback={<p className="p-6 text-slate-400">Loading component...</p>}
    >
      <EpisodePerformancePage />
    </Suspense>
  );
};

export default PageWrapper;
