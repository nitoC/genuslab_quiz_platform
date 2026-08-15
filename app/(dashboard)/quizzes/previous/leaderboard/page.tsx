"use client";

import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import GlassCard from "@/components/ui/cards/GlassCard";
import { cn } from "@/lib/utils/cn";
import useSidebar from "@/store/useSidebar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  MdMenu,
  MdArrowForward,
  MdEmojiEvents,
  MdAccessTime,
  MdAccountBalanceWallet,
  MdMoreHoriz,
} from "react-icons/md";

// Leaderboard dummy data
const leaderboardData = [
  {
    rank: 1,
    name: "Alex J.",
    avatar: "/images/avatars/alex.png", // Replace with your avatar paths
    score: 99,
    time: "8:45",
    isWinner: true,
  },
  {
    rank: 2,
    name: "Sarah K.",
    avatar: "/images/avatars/sarah.png",
    score: 98,
    time: "8:52",
    isWinner: false,
  },
  {
    rank: 3,
    name: "David L.",
    avatar: "/images/avatars/david.png",
    score: 97,
    time: "9:01",
    isWinner: false,
  },
  {
    rank: 4,
    name: "Elena R.",
    avatar: "/images/avatars/elena.png",
    score: 95,
    time: "9:05",
    isWinner: false,
  },
];

const EpisodePerformancePage = () => {
  const { toggleSidebar } = useSidebar((state: any) => state);

  return (
    <Layout>
      <Header title="Episode Performance" backBtn={true} />
      <div className="min-h-screen pb-28">
        {/* Ambient Glass Glows Background */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 -left-24 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-emerald-600/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-8 pt-6 space-y-6 md:space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleSidebar()}
                  className="md:hidden p-2 bg-white/5 rounded-full border border-white/10 text-white"
                >
                  <MdMenu className="text-xl" />
                </button>
                <span className="text-[10px] md:text-xs font-black uppercase tracking-[0.25em] text-blue-400">
                  LIVE RESULTS
                </span>
              </div>
              <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
                Episode Performance
              </h1>
              <p className="text-xs md:text-sm text-slate-400 font-medium">
                Day 125 <span className="text-slate-600 mx-1.5">|</span> Episode
                7 <span className="text-slate-600 mx-1.5">|</span> 7PM - 9PM
              </p>
            </div>

            <button className="w-fit inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-md text-xs font-bold transition-all shadow-lg hover:shadow-purple-500/10 active:scale-95">
              <span>VIEW QUIZ ANSWERS</span>
              <MdArrowForward className="text-base text-purple-400" />
            </button>
          </div>

          {/* Winner Spotlight Glass Card */}
          <GlassCard className="bg-[#0b1222]/60! border-white/10 p-6 md:p-8 backdrop-blur-2xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
              {/* Avatar + Champion Badge */}
              <div className="relative shrink-0 flex flex-col items-center">
                <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full p-1 bg-gradient-to-b from-amber-400 via-amber-500 to-amber-700 shadow-[0_0_40px_rgba(245,158,11,0.25)]">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-slate-900">
                    <Image
                      src="/images/avatars/alex.png" // Fallback or direct avatar path
                      alt="Winner"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>

                  {/* Trophy Badge Floating Right */}
                  <div className="absolute -top-1 -right-1 bg-gradient-to-tr from-amber-600 to-amber-400 text-slate-950 p-2 rounded-full shadow-lg border border-amber-300">
                    <MdEmojiEvents size={18} />
                  </div>
                </div>

                {/* Champion Pill */}
                <div className="mt-3 px-4 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 border border-amber-500/40 text-[10px] font-black uppercase tracking-widest text-amber-300 shadow-inner">
                  CHAMPION
                </div>
              </div>

              {/* Stats & Description Content */}
              <div className="flex-1 text-center md:text-left space-y-4">
                <div>
                  <span className="text-[11px] font-black tracking-wider text-blue-400 uppercase">
                    RANK #1
                  </span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-0.5">
                    Winner: Alex J.
                  </h2>
                </div>

                {/* Metrics Pills */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
                    <MdAccountBalanceWallet size={16} />
                    <span>₦50,000 Reward</span>
                  </div>

                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold">
                    <MdAccessTime size={16} />
                    <span>8:45 Time</span>
                  </div>
                </div>

                <p className="text-slate-400 text-xs md:text-sm leading-relaxed max-w-xl">
                  Unmatched performance this episode! Alex J. achieved a
                  near-perfect score of 99% in record time, outperforming 1,249
                  other participants.
                </p>

                <div className="pt-1">
                  <button className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all active:scale-95">
                    View Full Stats
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Leaderboard Table Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base md:text-lg font-bold text-white">
                  Episode #7 Leaderboard
                </h3>
                <span className="text-xs font-medium text-slate-500">
                  — 1,250 Playing
                </span>
              </div>
              <button className="text-slate-500 hover:text-slate-300 p-1">
                <MdMoreHoriz size={22} />
              </button>
            </div>

            <GlassCard className="bg-[#0b1222]/40! border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-4 px-6">RANK</th>
                      <th className="py-4 px-6">USER</th>
                      <th className="py-4 px-6">SCORE (%)</th>
                      <th className="py-4 px-6 text-right">COMPLETION TIME</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-xs md:text-sm font-semibold">
                    {leaderboardData.map((row) => (
                      <tr
                        key={row.rank}
                        className={cn(
                          "hover:bg-white/[0.02] transition-colors",
                          row.isWinner && "bg-blue-500/[0.03]",
                        )}
                      >
                        {/* Rank */}
                        <td className="py-4 px-6">
                          <span
                            className={cn(
                              "font-black text-sm md:text-base",
                              row.rank === 1
                                ? "text-amber-400"
                                : row.rank === 2
                                  ? "text-slate-300"
                                  : row.rank === 3
                                    ? "text-amber-600"
                                    : "text-slate-500",
                            )}
                          >
                            {row.rank}
                          </span>
                        </td>

                        {/* User Avatar & Name */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full relative overflow-hidden bg-white/5 border border-white/10 shrink-0">
                              <Image
                                src={row.avatar}
                                alt={row.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-white font-bold">
                              {row.name}
                            </span>
                          </div>
                        </td>

                        {/* Progress Bar & Score */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3 min-w-[140px] max-w-[200px]">
                            <div className="flex-1 h-2 rounded-full bg-slate-800 overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full"
                                style={{ width: `${row.score}%` }}
                              />
                            </div>
                            <span className="text-white font-bold text-xs shrink-0">
                              {row.score}%
                            </span>
                          </div>
                        </td>

                        {/* Completion Time */}
                        <td className="py-4 px-6 text-right text-slate-400 font-medium">
                          {row.time}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Floating Glass Sticky Footer for Current User Stats */}
        <div className="fixed bottom-0 left-0 right-0 z-40 p-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/10 shadow-2xl">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* User Stats Grid */}
            <div className="grid grid-cols-4 gap-4 sm:gap-8 w-full sm:w-auto text-center sm:text-left divide-x divide-white/10 sm:divide-x-0">
              <div>
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-blue-400">
                  MY RANK
                </p>
                <p className="text-lg sm:text-xl font-black text-white mt-0.5">
                  #43
                </p>
              </div>

              <div className="pl-4 sm:pl-0">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-blue-400">
                  MY SCORE
                </p>
                <p className="text-lg sm:text-xl font-black text-white mt-0.5">
                  92%
                </p>
              </div>

              <div className="pl-4 sm:pl-0">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-blue-400">
                  MY TIME
                </p>
                <p className="text-lg sm:text-xl font-black text-white mt-0.5">
                  9:15
                </p>
              </div>

              <div className="pl-4 sm:pl-0">
                <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-emerald-400">
                  REWARD
                </p>
                <p className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">
                  ₦500
                </p>
              </div>
            </div>

            {/* Subtext + Action CTA */}
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto">
              <span className="hidden lg:inline text-[11px] text-slate-400 italic">
                Keep playing to reach the top 10!
              </span>
              <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-extrabold text-xs tracking-wider uppercase transition-all shadow-xl shadow-white/10 active:scale-95">
                CLAIM REWARD
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EpisodePerformancePage;
