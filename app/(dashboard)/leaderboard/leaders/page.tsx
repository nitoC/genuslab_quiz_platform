"use client";

import React from "react";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import GlassCard from "@/components/ui/cards/GlassCard";
import Avatar from "@/components/ui/Avatar";
import PrimaryButton from "@/components/ui/buttons/Primary";
import { FaTrophy, FaMedal } from "react-icons/fa";
import { MdStars } from "react-icons/md";
import { IoMdArrowUp, IoMdArrowDown } from "react-icons/io";

const LeaderboardPage = () => {
  const topThree = [
    {
      name: "Sarah Jenkins",
      rank: 2,
      xp: "12,450",
      color: "border-gray-300",
      trend: "up",
    },
    {
      name: "Tony Daniels",
      rank: 1,
      xp: "15,200",
      color: "border-yellow-400",
      trend: "stable",
    },
    {
      name: "Mike Ross",
      rank: 3,
      xp: "10,100",
      color: "border-orange-600",
      trend: "down",
    },
  ];

  const rankings = [
    { rank: 4, name: "Harvey Specter", xp: "9,850", status: "Pro" },
    { rank: 5, name: "Donna Paulsen", xp: "9,200", status: "Expert" },
    { rank: 6, name: "Rachel Zane", xp: "8,900", status: "Intermediate" },
    { rank: 7, name: "Louis Litt", xp: "8,500", status: "Intermediate" },
  ];

  return (
    <Layout>
      <Header title="Leaderboard" backBtn={true} />

      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-10">
        {/* PODIUM SECTION */}
        <section className="flex flex-col md:flex-row items-end justify-center gap-6 mt-8">
          {topThree.map((user, index) => (
            <div
              key={user.name}
              className={`flex flex-col items-center gap-4 w-full md:w-64 ${user.rank === 1 ? "order-1 md:order-2 scale-110 mb-6" : user.rank === 2 ? "order-2 md:order-1" : "order-3"}`}
            >
              <div className="relative">
                <Avatar
                  size={user.rank === 1 ? 110 : 80}
                  type="main"
                  color={user.color}
                />
                <div
                  className={`absolute -top-4 -right-2 p-2 rounded-full ${user.rank === 1 ? "bg-yellow text-black" : "bg-white/10 text-(--primary)"}`}
                >
                  {user.rank === 1 ? (
                    <FaTrophy size={18} />
                  ) : (
                    <FaMedal size={16} />
                  )}
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-(--primary) font-bold">{user.name}</h3>
                <p className="text-blue text-sm font-bold">{user.xp} XP</p>
              </div>

              <GlassCard className="w-full">
                <div
                  className={`h-24 md:h-32 flex items-center justify-center font-bold text-4xl text-(--primary)/20`}
                >
                  #{user.rank}
                </div>
              </GlassCard>
            </div>
          ))}
        </section>

        {/* RANKINGS LIST */}
        <section className="flex flex-col gap-4">
          <div className="flex justify-between items-center px-4">
            <h2 className="text-xl font-bold text-(--primary) flex gap-2 items-center">
              <MdStars className="text-blue" /> Global Rankings
            </h2>
            <span className="text-grey text-xs">Updated 2 mins ago</span>
          </div>

          <GlassCard>
            <div className="flex flex-col">
              {rankings.map((player, index) => (
                <div
                  key={player.rank}
                  className={`p-5 flex items-center justify-between hover:bg-white/5 transition-colors ${index !== rankings.length - 1 ? "border-b border-white/5" : ""}`}
                >
                  <div className="flex items-center gap-6">
                    <span className="text-grey font-bold w-4">
                      {player.rank}
                    </span>
                    <div className="flex items-center gap-3">
                      <Avatar size={40} type="main" />
                      <div>
                        <h4 className="text-(--primary) text-sm font-semibold">
                          {player.name}
                        </h4>
                        <span className="text-[10px] text-blue bg-blue/10 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                          {player.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-(--primary) font-bold text-sm">
                        {player.xp}
                      </span>
                      <span className="text-grey text-[10px]">Total XP</span>
                    </div>
                    {index % 2 === 0 ? (
                      <IoMdArrowUp className="text-green-400" />
                    ) : (
                      <IoMdArrowDown className="text-red-400" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </section>

        {/* PERSISTENT USER FOOTER (Like your Countdown) */}
        <div className="sticky bottom-0 z-10 pt-4">
          <GlassCard className="border-t-2 border-blue/50">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-blue font-bold text-xl">#12</span>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm">
                    Your Current Rank
                  </span>
                  <span className="text-grey text-xs">
                    You are in the top 5% this week
                  </span>
                </div>
              </div>
              <PrimaryButton text="Improve Rank" />
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
