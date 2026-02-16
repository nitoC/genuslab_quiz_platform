"use client";

import React from "react";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import GlassCard from "@/components/ui/cards/GlassCard";
import { cn } from "@/lib/utils/cn";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import {
  MdEmojiEvents,
  MdStars,
  MdPublic,
  MdCalendarToday,
  MdFlashOn,
  MdSmartToy,
  MdCheckCircle,
  MdLock,
} from "react-icons/md";
import {
  FaXTwitter,
  FaInstagram,
  FaFacebook,
  FaDiscord,
} from "react-icons/fa6";

const ExploralPage = () => {
  return (
    <Layout>
      <Header title="Exploral" backBtn={false} />

      <main className="p-8 space-y-8 max-w-[1600px] mx-auto">
        {/* TOP ROW: Championships & Studio Winner */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-8 flex flex-col items-center text-center justify-between min-h-[250px]">
              <div className="bg-emerald-500/10 p-4 rounded-2xl">
                <MdEmojiEvents className="text-emerald-500 text-3xl" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-bold text-lg">
                  All Episode Results
                </h3>
                <p className="text-slate-400 text-xs">
                  View all quiz episode results.
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="bg-emerald-500/20 text-emerald-500 px-6 py-2 rounded-full text-[10px] font-bold">
                  Join
                </button>
                <button className="bg-white/5 text-slate-400 px-6 py-2 rounded-full text-[10px] font-bold">
                  1.2k joined
                </button>
              </div>
            </GlassCard>

            <GlassCard className="p-8 flex flex-col items-center text-center justify-between min-h-[250px]">
              <div className="bg-purple-500/10 p-4 rounded-2xl">
                <MdStars className="text-purple-500 text-3xl" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-bold text-lg">
                  Cycle Championship
                </h3>
                <p className="text-slate-400 text-xs px-8">
                  Battle for the top spot as we can only have one winner.
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="bg-purple-500/20 text-purple-500 px-6 py-2 rounded-full text-[10px] font-bold">
                  Starts in 2h
                </button>
                <button className="bg-white/5 text-slate-400 px-6 py-2 rounded-full text-[10px] font-bold">
                  Premium Only
                </button>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-8 flex flex-col items-center relative overflow-hidden">
            {/* Studio Winner Decor */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full" />

            <p className="text-blue-500 text-[10px] font-bold flex items-center gap-2 mb-6">
              <MdStars /> Studio Winner
            </p>

            <div className="relative mb-4">
              <ImageWithFallback className="w-26 h-24 rounded-2xl object-cover ring-4 ring-blue-500/20" />
              <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-amber-500 text-[8px] font-black px-2 py-0.5 rounded text-black">
                #1 RANK
              </div>
            </div>

            <h3 className="text-white font-bold text-xl mt-4">Evelyn S.</h3>
            <p className="text-slate-500 text-[10px] mb-8">
              Studio Championship 2024
            </p>

            <div className="grid grid-cols-2 w-full gap-4 text-center">
              <div>
                <p className="text-slate-500 text-[8px] uppercase font-bold mb-1">
                  Points Won
                </p>
                <p className="text-white font-mono font-bold text-sm">48,750</p>
              </div>
              <div>
                <p className="text-slate-500 text-[8px] uppercase font-bold mb-1">
                  Prize Money
                </p>
                <p className="text-emerald-500 font-mono font-bold text-sm">
                  ₦1,200,000
                </p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* MIDDLE ROW: Tech News & Socials */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <GlassCard className="lg:col-span-3 p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <p className="text-blue-500 text-[10px] uppercase tracking-widest font-bold">
                  Latest Trends
                </p>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mt-1">
                  <MdPublic className="text-blue-500" /> Tech News
                </h2>
              </div>
              <button className="text-slate-400 text-[10px] font-bold bg-white/5 px-6 py-2 rounded-lg border border-white/10">
                Discover Full Feed
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Featured Article */}
              <div className="relative group cursor-pointer rounded-3xl overflow-hidden aspect-video md:aspect-auto">
                <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent z-10" />
                <ImageWithFallback className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute bottom-0 left-0 p-8 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2 leading-tight">
                    How Web3 is changing the quiz ecosystem
                  </h3>
                  <p className="text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                    5 Min Read • Today
                  </p>
                </div>
              </div>

              {/* News List */}
              <div className="space-y-6">
                {[
                  {
                    icon: <MdCalendarToday />,
                    title: "Global Tech Championship 2024 registration open",
                    time: "2 hours ago",
                  },
                  {
                    icon: <MdFlashOn />,
                    title: "New AI-driven hint system for Premium users",
                    time: "5 hours ago",
                  },
                  {
                    icon: <MdSmartToy />,
                    title: "Neural Networks mimic biological structures",
                    time: "8 hours ago",
                  },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 group-hover:text-white transition-colors">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-bold group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 text-[10px] mt-1 font-bold">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h3 className="text-white font-bold flex items-center gap-2 mb-8">
              <div className="w-1 h-4 bg-blue-500 rounded-full" /> Connect with
              Us
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: <FaXTwitter />, label: "X Social" },
                { icon: <FaInstagram />, label: "Instagram" },
                { icon: <FaFacebook />, label: "Facebook" },
                { icon: <FaDiscord />, label: "Discord" },
              ].map((social, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-3 hover:bg-white/10 cursor-pointer transition-all"
                >
                  <div className="text-slate-400 text-xl">{social.icon}</div>
                  <span className="text-slate-400 text-[8px] font-bold uppercase tracking-tighter">
                    {social.label}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* BOTTOM ROW: Leaderboard Ranks Table */}
        <GlassCard className="p-10">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-2xl font-bold text-white">
                Leaderboard Ranks
              </h2>
              <p className="text-slate-500 text-xs mt-1 font-medium">
                Ascend through the hierarchy of knowledge.
              </p>
            </div>
            <div className="flex gap-2">
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400">
                {"<"}
              </button>
              <button className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20">
                {">"}
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-white/5">
                  <th className="pb-6 px-4">Rank ID</th>
                  <th className="pb-6 px-4">Designation</th>
                  <th className="pb-6 px-4">Unlock Requirements</th>
                  <th className="pb-6 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  {
                    id: "#001",
                    title: "Fresh Mind",
                    level: "Level 1 Path",
                    req: "Default Unlocked",
                    status: "unlocked",
                  },
                  {
                    id: "#002",
                    title: "Rising Star",
                    level: "Level 2 Path",
                    req: "Requires 63,000 XP",
                    status: "locked",
                  },
                  {
                    id: "#003",
                    title: "Aspiring Expert",
                    level: "Level 3 Path",
                    req: "Requires 126,000 XP",
                    status: "locked",
                  },
                ].map((rank, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-8 px-4 text-slate-500 font-mono text-xs">
                      {rank.id}
                    </td>
                    <td className="py-8 px-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            rank.status === "unlocked"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : "bg-slate-800 text-slate-500",
                          )}
                        >
                          <MdStars size={24} />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">
                            {rank.title}
                          </p>
                          <p className="text-emerald-500 text-[10px] font-bold">
                            {rank.level}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-4 text-white text-xs font-bold">
                      {rank.req}
                    </td>
                    <td className="py-8 px-4">
                      <div className="flex justify-center">
                        {rank.status === "unlocked" ? (
                          <div className="bg-emerald-500/10 p-2 rounded-full">
                            <MdCheckCircle className="text-emerald-500" />
                          </div>
                        ) : (
                          <div className="bg-white/5 p-2 rounded-full border border-white/5">
                            <MdLock className="text-slate-600" />
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </main>
    </Layout>
  );
};

export default ExploralPage;
