"use client";

import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import useSlots from "@/hooks/useSlots";
import useSystemTime from "@/hooks/useSystemTime";
import { getEpisodeLeaderboard } from "@/lib/api/apis";
import { cn } from "@/lib/utils/cn";
import useSidebar from "@/store/useSidebar";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
// import { useRouter } from "next/router";
import React, { Suspense, useMemo } from "react";
import {
  MdMenu,
  MdArrowForward,
  MdEmojiEvents,
  MdAccessTime,
  MdAccountBalanceWallet,
  MdMoreHoriz,
  MdPerson,
  MdHourglassTop,
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
  const router = useRouter();
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

  const { slotData, slotLoading, slotError } = useSlots();
  const {
    data: sysTime,
    isLoading: sysTimeLoading,
    isError: sysTimeError,
  } = useSystemTime();

  const ongoing = useMemo(() => {
    if (!slotData || !episode || !sysTime?.payload || !date) return false;

    const slot = slotData.find((s: any) => s.episode === episode);
    if (!slot) return false;

    // 1. Parse base quiz date safely (assuming YYYY-MM-DD string format)
    const [year, month, day] = date.split("-").map(Number);
    if (!year || !month || !day) return false;

    // 2. Derive system time object from server payload
    const currentSysTime = new Date(sysTime.payload);

    // 3. Construct exact start and end dates for the quiz episode slot
    // Note: month index is 0-based in JavaScript (month - 1)
    const slotStart = new Date(year, month - 1, day, slot.startHour || 0, 0, 0);
    const slotEnd = new Date(year, month - 1, day, slot.endHour, 0, 0);

    // 4. Compare timestamp bounds
    const currentMs = currentSysTime.getTime();
    return currentMs >= slotStart.getTime() && currentMs < slotEnd.getTime();
  }, [episode, slotData, sysTime, date]);

  if (isLoading || slotLoading || sysTimeLoading || ongoing === undefined) {
    return <p className="p-6 text-slate-400">Loading leaderboard...</p>;
  }
  if (isError || slotError || sysTimeError) {
    return (
      <p className="p-6 text-red-400">Something went wrong fetching data.</p>
    );
  }

  const leaderboardList: LeaderboardItem[] = data?.payload || [];

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
                <span className="text-sm font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  {ongoing && (
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  )}
                  {ongoing ? "LIVE LEADERBOARD" : "LIVE RESULTS"}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Episode Performance
              </h1>
              <p className="text-sm md:text-sm text-slate-400 font-medium">
                Day {date || "--"}{" "}
                <span className="text-slate-700 mx-1.5">|</span> Episode{" "}
                {episode || "--"}
              </p>
            </div>

            <button
              onClick={() => {
                router.back();
              }}
              className="w-fit inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 text-sm font-semibold transition-colors"
            >
              <span>VIEW QUIZ ANSWERS</span>
              <MdArrowForward className="text-base text-slate-400" />
            </button>
          </div>

          {/* Conditional Banner: Ongoing vs Completed Winner Card */}
          {ongoing ? (
            <div className="bg-slate-900 border border-blue-500/30 rounded-xl p-6 md:p-8 relative overflow-hidden">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
                  <MdHourglassTop size={32} className="animate-spin" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-1">
                  <div className="inline-block px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/30 text-[14px] font-bold tracking-wider text-blue-400 uppercase">
                    Ongoing Episode
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white">
                    Episode is currently in progress
                  </h2>
                  <p className="text-slate-400 text-sm md:text-sm">
                    Scores and positions are updated live. Final winners will be
                    announced once this episode concludes.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            winner && (
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

                      <div className="absolute top-0 right-0 bg-amber-500 text-slate-950 p-1.5 rounded-full border border-slate-900">
                        <MdEmojiEvents size={16} />
                      </div>
                    </div>

                    <div className="mt-3 px-3 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-[14px] font-bold tracking-wider text-amber-400">
                      CHAMPION
                    </div>
                  </div>

                  {/* Winner Content */}
                  <div className="flex-1 text-center md:text-left space-y-3">
                    <div>
                      <span className="text-sm font-semibold tracking-wider text-slate-400 uppercase">
                        RANK #{winner.position}
                      </span>
                      <h2 className="text-xl md:text-2xl font-bold text-white mt-0.5 capitalize">
                        Winner: {winner.name}
                      </h2>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium">
                        <MdAccountBalanceWallet
                          size={15}
                          className="text-emerald-400"
                        />
                        <span>{winner.totalXp} XP</span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium">
                        <MdAccessTime size={15} className="text-slate-400" />
                        <span>Score: {winner.score}</span>
                      </div>

                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300 text-sm font-medium">
                        <MdPerson size={15} className="text-slate-400" />
                        <span>{leaderboardList.length} Participants</span>
                      </div>
                    </div>

                    <p className="text-slate-400 text-sm md:text-sm leading-relaxed max-w-xl">
                      Outstanding performance this episode!{" "}
                      <span className="capitalize">{winner.name}</span> achieved
                      a score of {winner.score}% and secured {winner.totalXp}{" "}
                      total XP.
                    </p>

                    <div className="pt-1">
                      <Link
                        href={"/rewards-breakdown"}
                        target="_blank"
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors"
                      >
                        View Reward Breakdown
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Leaderboard Table Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Leaderboard</h3>
                <span className="text-sm text-slate-500">
                  — {leaderboardList.length}{" "}
                  {ongoing ? "Participating" : "Participants"}
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
                    <tr className="border-b border-slate-800 text-[14px] md:text-sm font-semibold uppercase tracking-wider text-slate-400 bg-slate-950/50">
                      <th className="py-3 px-5">RANK</th>
                      <th className="py-3 px-5">USER</th>
                      <th className="py-3 px-5">
                        WEIGHT SCORE (SCORE * MULTIPLIER)
                      </th>
                      <th className="py-3 px-5 text-right">TOTAL XP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-sm md:text-sm font-medium">
                    {leaderboardList.map((row) => (
                      <tr
                        key={row.position}
                        className={cn(
                          "hover:bg-slate-800/50 transition-colors",
                          !ongoing && row.position === 1 && "bg-slate-800/20",
                        )}
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-5">
                          <span
                            className={cn(
                              "font-bold text-sm",
                              !ongoing && row.position === 1
                                ? "text-amber-400"
                                : !ongoing && row.position === 2
                                  ? "text-slate-300"
                                  : !ongoing && row.position === 3
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
                          <div className="flex items-center gap-3 min-w-35 max-w-50">
                            <span className="text-slate-300 font-semibold text-sm shrink-0">
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
