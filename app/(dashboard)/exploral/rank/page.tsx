"use client";

import React from "react";
import Layout from "@/components/layouts/Layout";
import GlassCard from "@/components/ui/cards/GlassCard";
import Avatar from "@/components/ui/Avatar";
import { MdEmojiEvents, MdArrowBack, MdDashboard } from "react-icons/md";
import { FaCrown, FaBolt } from "react-icons/fa";

const LeaderboardPage = () => {
  const leaderboardData = [
    {
      rank: "01",
      name: "Alex Rivera",
      xp: "25,400",
      accuracy: 98,
      pos: "#12",
      isTop: true,
    },
    { rank: "02", name: "Mila Chen", xp: "24,100", accuracy: 95, pos: "#28" },
    { rank: "03", name: "Jordan Smit", xp: "21,850", accuracy: 92, pos: "#34" },
    { rank: "04", name: "Elena Rossi", xp: "21,000", accuracy: 89, pos: "#45" },
    { rank: "05", name: "Liam Wang", xp: "19,500", accuracy: 88, pos: "#62" },
    { rank: "06", name: "Sarah J.", xp: "18,200", accuracy: 85, pos: "#98" },
    { rank: "07", name: "David K.", xp: "17,900", accuracy: 84, pos: "#102" },
    { rank: "08", name: "Chris P.", xp: "16,500", accuracy: 82, pos: "#115" },
  ];

  return (
    <Layout>
      <div className="p-4 sm:p-8 max-w-7xl mx-auto flex flex-col gap-6">
        {/* Navigation Buttons - Adjusted for mobile */}
        <div className="flex justify-between md:justify-start gap-4">
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-grey text-[14px] md:text-sm py-2 px-3 md:px-4 rounded-lg border border-white/10 transition-all">
            <MdArrowBack /> Back
          </button>
          <button className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-grey text-[14px] md:text-sm py-2 px-3 md:px-4 rounded-lg border border-white/10 transition-all">
            <MdDashboard /> Dashboard
          </button>
        </div>

        {/* Header Section */}
        <div className="text-center flex flex-col items-center gap-2 mt-4">
          <div className="w-16 h-16 bg-green/10 rounded-lg flex items-center justify-center mb-2 border border-green/20">
            <span className="text-3xl">⚙️</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-(--primary) tracking-tighter">
            FRESH MIND
          </h1>
          <p className="text-grey text-[14px] md:text-sm uppercase tracking-widest font-medium">
            The Rising Elite of Genuslab
          </p>
        </div>

        {/* Podium Section - Mobile Friendly Stack */}
        <div className="flex justify-center items-end gap-2 md:gap-0 mt-8 mb-10 h-auto md:h-80">
          {/* 2nd Place */}
          <div className="flex flex-col items-center gap-3 order-2 md:order-1 scale-90 md:scale-100">
            <div className="relative">
              <Avatar size={70} type="main" color="border-grey/50" />
              <span className="absolute -bottom-1 -right-1 bg-grey text-white w-6 h-6 rounded-full flex items-center justify-center text-[14px] font-bold border-2 border-[#0a121f]">
                2
              </span>
            </div>
            <div className="text-center">
              <p className="text-(--primary) font-bold text-sm">Mila Chen</p>
              <p className="text-grey text-[14px]">24,100 XP</p>
            </div>
            <GlassCard className="w-28 h-20 md:w-40 md:h-32 flex items-center justify-center opacity-40">
              <MdEmojiEvents className="text-grey text-2xl" />
            </GlassCard>
          </div>

          {/* 1st Place */}
          <div className="flex flex-col items-center gap-3 z-10 order-1 md:order-2">
            <div className="relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow">
                <FaCrown size={20} />
              </div>
              <Avatar size={90} type="main" color="border-yellow" />
              <span className="absolute -bottom-1 -right-1 bg-yellow text-black w-7 h-7 rounded-full flex items-center justify-center text-sm font-black border-4 border-[#0a121f]">
                1
              </span>
            </div>
            <div className="text-center">
              <p className="text-(--primary) font-bold text-sm">Alex Rivera</p>
              <p className="text-yellow text-[14px] font-bold uppercase">
                25,400 XP
              </p>
            </div>
            <GlassCard className="w-32 h-28 md:w-48 md:h-44 flex items-center justify-center border-yellow/30 bg-yellow/5">
              <span className="text-3xl md:text-5xl">⭐</span>
            </GlassCard>
          </div>

          {/* 3rd Place */}
          <div className="flex flex-col items-center gap-3 order-3 scale-90 md:scale-100">
            <div className="relative">
              <Avatar size={70} type="main" color="border-orange-400/50" />
              <span className="absolute -bottom-1 -right-1 bg-orange-400 text-white w-6 h-6 rounded-full flex items-center justify-center text-[14px] font-bold border-2 border-[#0a121f]">
                3
              </span>
            </div>
            <div className="text-center">
              <p className="text-(--primary) font-bold text-sm">Jordan Smit</p>
              <p className="text-grey text-[14px]">21,850 XP</p>
            </div>
            <GlassCard className="w-28 h-16 md:w-40 md:h-28 flex items-center justify-center opacity-30">
              <span className="text-lg text-orange-400 font-black">🏅</span>
            </GlassCard>
          </div>
        </div>

        {/* Leaderboard Section */}
        <GlassCard className="overflow-hidden">
          {/* Mobile Labels */}
          <div className="grid grid-cols-6 px-4 py-3 border-b border-white/5 text-[14px] uppercase tracking-tighter text-grey font-bold">
            <div className="col-span-1">Rank</div>
            <div className="col-span-2">User</div>
            <div className="col-span-2 text-center">Stats</div>
            <div className="col-span-1 text-right">Glob.</div>
          </div>

          <div className="flex flex-col">
            {leaderboardData.map((user, index) => (
              <div
                key={index}
                className={`grid grid-cols-6 items-center px-4 py-4 border-b border-white/5 transition-colors ${user.isTop ? "bg-yellow/5" : ""}`}
              >
                {/* Rank */}
                <div
                  className={`col-span-1 font-bold text-sm ${user.isTop ? "text-yellow" : "text-grey"}`}
                >
                  {user.rank}
                </div>

                {/* User Info */}
                <div className="col-span-2 flex items-center gap-2">
                  <Avatar size={28} type="main" />
                  <span className="text-(--primary) text-[14px] md:text-sm font-semibold truncate">
                    {user.name}
                  </span>
                </div>

                {/* Stats (XP + Progress) */}
                <div className="col-span-2 flex flex-col gap-1 px-2">
                  <div className="flex items-center gap-1 text-[14px] font-bold text-(--primary)">
                    <FaBolt className="text-blue text-[14px]" />
                    {user.xp}
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden w-full">
                    <div
                      className={`h-full ${user.isTop ? "bg-blue" : "bg-grey/30"}`}
                      style={{ width: `${user.accuracy}%` }}
                    />
                  </div>
                </div>

                {/* Global Pos */}
                <div className="col-span-1 text-right">
                  <span className="text-[14px] text-grey font-mono opacity-50">
                    {user.pos}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
