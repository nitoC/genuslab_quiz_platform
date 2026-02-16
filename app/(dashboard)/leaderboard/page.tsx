"use client";

import React, { useState } from "react";
import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import GlassCard from "@/components/ui/cards/GlassCard";
import SimpleAreaChart from "@/components/ui/charts/CurveArea";
import CircularProgress from "@/components/ui/progress/Circular";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { BarChart, Bar, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { cn } from "@/lib/utils/cn";

const BAR_COLORS = [
  "#132b3d",
  "#174d63",
  "#1a6b85",
  "#1d86a3",
  "#22a1bd",
  "#29b2cf",
  "#448fff",
];

const ACTIVITY_DATA = [
  { name: "Bobby", points: 45 },
  { name: "Emma", points: 58 },
  { name: "Udred", points: 72 },
  { name: "Chibyk", points: 85 },
  { name: "Jane", points: 95 },
];

const TABS = [
  "Stats",
  "Performance",
  "Quiz Ranking",
  "Referral Ranking",
  "Overall Ranking",
];

const LeaderboardPage = () => {
  const [activeTab, setActiveTab] = useState("Stats");
  const maxPoints = Math.max(...ACTIVITY_DATA.map((d) => d.points));

  return (
    <Layout>
      <Header title="Global Leaderboard" backBtn={false} />

      <main className="p-8 space-y-8">
        {/* TABS CHANGER: Matches image_6cfd28 styling */}
        <div className="flex items-center gap-1 bg-[#0f172a]/50 p-1.5 rounded-xl border border-white/5 w-fit">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-6 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                activeTab === tab
                  ? "bg-[#1e293b] text-white shadow-lg"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* TOP ROW */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard className="lg:col-span-2 p-6 flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-start z-10">
              <div>
                <p className="text-slate-400 text-sm font-medium">
                  Weekly Analytics
                </p>
                <h2 className="text-4xl font-bold text-white mt-1">85%</h2>
                <p className="text-emerald-400 text-sm mt-1 flex items-center gap-1">
                  <span className="text-xs">▲</span> +5.2% than last week
                </p>
              </div>
              <div className="opacity-80 scale-75 origin-top-right">
                <CircularProgress
                  percentage={85}
                  size={60}
                  strokeWidth={4}
                  color="text-[#10b981]"
                />
              </div>
            </div>
            <div className="h-[220px] w-full mt-4">
              <SimpleAreaChart />
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-slate-400 font-medium">Top Performers</h3>
              <div className="text-blue-500 bg-blue-500/10 p-2 rounded-full">
                🏆
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-6">Record: 98</h2>
            <div className="space-y-6">
              {[
                {
                  name: "Winner One",
                  xp: "2,500 XP",
                  val: 98,
                  color: "text-[#3b82f6]",
                },
                {
                  name: "Winner Two",
                  xp: "2,100 XP",
                  val: 92,
                  color: "text-[#3b82f6]",
                },
                {
                  name: "Winner Three",
                  xp: "1,950 XP",
                  val: 88,
                  color: "text-[#3b82f6]",
                },
              ].map((user, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="relative">
                    <CircularProgress
                      percentage={user.val}
                      size={45}
                      strokeWidth={3}
                      color={user.color}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold">
                      {user.val}
                    </span>
                  </div>
                  <div className="flex-1 text-sm font-medium">
                    <div className="flex justify-between text-white mb-1">
                      <span>{user.name}</span>
                      <span className="text-blue-400 font-mono">{user.xp}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${user.val}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* BOTTOM ROW */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GlassCard className="p-6 flex flex-col justify-between min-h-55">
            <div className="flex justify-between">
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">
                  Personal Performance
                </p>
                <h2 className="text-3xl font-bold text-white mt-2">Avg: 78%</h2>
                <p className="text-red-400 text-sm mt-1">▼ -2.1% dip</p>
              </div>
              <div className="relative">
                <CircularProgress
                  percentage={78}
                  size={80}
                  strokeWidth={6}
                  color="text-[#3b82f6]"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-white font-bold text-lg">78</span>
                  <span className="text-[8px] text-slate-400 uppercase">
                    Tasks
                  </span>
                </div>
              </div>
            </div>
            <div className="h-30 w-full mt-4">
              <SimpleAreaChart size="sm" />
            </div>
          </GlassCard>

          <GlassCard className="p-6 flex flex-col">
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Activity Leaderboard
            </p>
            <h2 className="text-3xl font-bold text-white mt-2 mb-6">
              Top: {maxPoints}
            </h2>

            <div className="flex-1 min-h-[180px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ACTIVITY_DATA}
                  margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                >
                  <Tooltip
                    cursor={{ fill: "rgba(255,255,255,0.02)" }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-slate-900 border border-white/10 p-2 rounded text-[10px] text-white">
                            {payload[0].value} Points
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="points" radius={[4, 4, 4, 4]} barSize={40}>
                    {ACTIVITY_DATA.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.points === maxPoints
                            ? BAR_COLORS[6]
                            : BAR_COLORS[index % (BAR_COLORS.length - 1)]
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center mt-4 px-4">
              {ACTIVITY_DATA.map((user, i) => (
                <div
                  key={i}
                  className="flex flex-col items-center gap-2 w-[40px]"
                >
                  <ImageWithFallback
                    className={cn(
                      "w-8 h-8 rounded-full bg-slate-700 border overflow-hidden",
                      user.points === maxPoints
                        ? "border-blue-500 ring-2 ring-blue-500/20"
                        : "border-slate-600",
                    )}
                  />
                  <span className="text-[9px] text-slate-400 font-medium truncate w-full text-center">
                    {user.name}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>
    </Layout>
  );
};

export default LeaderboardPage;
