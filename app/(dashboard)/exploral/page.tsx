"use client";

import React, { useState } from "react";
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
  MdSettings,
} from "react-icons/md";
import {
  FaXTwitter,
  FaInstagram,
  FaFacebook,
  FaDiscord,
  FaCrown,
  FaCentos,
  FaChessKnight,
  FaUsers,
  FaArrowLeft,
} from "react-icons/fa6";
import { SiClevercloud, SiCoolermaster, SiPrometheus } from "react-icons/si";
import {
  GiAllSeeingEye,
  GiBlackKnightHelm,
  GiBoxingGlove,
  GiBrainstorm,
  GiExplosionRays,
  GiGiftOfKnowledge,
  GiMiddleArrow,
  GiPsychicWaves,
  GiQuicksand,
  GiSoulVessel,
  GiSparkSpirit,
} from "react-icons/gi";
import { FcMindMap } from "react-icons/fc";
import { HiMiniCheckBadge } from "react-icons/hi2";
import RankUnlockModal from "@/components/ui/modals/leaderboard";
import { useRouter } from "next/navigation";

// {
//                   id: "#001",
//                   title: "Fresh Mind",
//                   level: "Level 1 Path",
//                   req: "Default Unlocked",
//                   status: "unlocked",
//                 },
//                 {
//                   id: "#002",
//                   title: "Rising Star",
//                   level: "Level 2 Path",
//                   req: "Requires 63,000 XP",
//                   status: "locked",
//                 },
//                 {
//                   id: "#003",
//                   title: "Aspiring Expert",
//                   level: "Level 3 Path",
//                   req: "Requires 126,000 XP",
//                   status: "locked",
//                 },
const ExploralPage = () => {
  const router = useRouter();
  const leaderboardRanks = [
    {
      rank: 20,
      title: "Fresh Mind",
      pointsToUnlock: 21_000,
      cashReward: 100_000,
      status: "unlocked",
      Icon: <HiMiniCheckBadge size={23} className="text-green-300" />,
    },
    {
      rank: 19,
      title: "Rising Star",
      pointsToUnlock: 63_000,
      cashReward: 200_000,
      status: "locked",
      Icon: <GiBoxingGlove size={23} className="text-orange-400" />,
    },
    {
      rank: 18,
      title: "Aspiring Expert",
      pointsToUnlock: 126_000,
      cashReward: 400_000,
      status: "locked",
      Icon: <GiExplosionRays size={23} className="text-teal-500" />,
    },
    {
      rank: 17,
      title: "Knowledge Seeker",
      pointsToUnlock: 210_000,
      cashReward: 600_000,
      status: "locked",
      Icon: <GiAllSeeingEye size={23} className="text-brown-700" />,
    },
    {
      rank: 16,
      title: "Eager Learner",
      pointsToUnlock: 315_000,
      cashReward: 900_000,
      status: "locked",
      Icon: <GiMiddleArrow size={23} className="text-green-600" />,
    },
    {
      rank: 15,
      title: "Curious Cat",
      pointsToUnlock: 450_000,
      cashReward: 1_200_000,
      status: "locked",
      Icon: <FaUsers size={23} className="text-pink-600" />,
    },
    {
      rank: 14,
      title: "Inquisitive Soul",
      pointsToUnlock: 630_000,
      cashReward: 1_500_000,
      status: "locked",
      Icon: <GiSoulVessel size={23} className="text-purple-500" />,
    },
    {
      rank: 13,
      title: "Keen Mind",
      pointsToUnlock: 840_000,
      cashReward: 1_800_000,
      status: "locked",
      Icon: <FcMindMap size={23} />,
    },
    {
      rank: 12,
      title: "Quick Wits",
      pointsToUnlock: 1_050_000,
      cashReward: 2_200_000,
      status: "locked",
      Icon: <GiQuicksand size={23} className="text-blue-700" />,
    },
    {
      rank: 11,
      title: "Bright Spark",
      pointsToUnlock: 1_260_000,
      cashReward: 2_500_000,
      status: "locked",
      Icon: <GiSparkSpirit size={23} className="text-indigo-500" />,
    },
    {
      rank: 10,
      title: "Clever Clog",
      pointsToUnlock: 1_500_000,
      cashReward: 2_800_000,
      status: "locked",
      Icon: <SiClevercloud size={23} className="text-green-400" />,
    },
    {
      rank: 9,
      title: "Sharp Thinker",
      pointsToUnlock: 1_800_000,
      cashReward: 3_200_000,
      status: "locked",
      Icon: <GiGiftOfKnowledge size={23} className="text-red-700" />,
    },
    {
      rank: 8,
      title: "Smart Cookie",
      pointsToUnlock: 2_100_000,
      cashReward: 3_600_000,
      status: "locked",
      Icon: (
        <GiBlackKnightHelm
          size={23}
          className="text-gray-900 dark:text-gray-300"
        />
      ),
    },
    {
      rank: 7,
      title: "Knowledge Knight",
      pointsToUnlock: 2_400_000,
      cashReward: 4_000_000,
      status: "locked",
      Icon: <FaChessKnight size={23} className="text-orange-500" />,
    },
    {
      rank: 6,
      title: "Quiz Ace",
      pointsToUnlock: 2_700_000,
      cashReward: 4_400_000,
      status: "locked",
      Icon: <FaCentos size={23} className="text-green-700" />,
    },
    {
      rank: 5,
      title: "Trivia Titan",
      pointsToUnlock: 3_000_000,
      cashReward: 4_800_000,
      status: "locked",
      Icon: <GiPsychicWaves size={23} className="text-green-500" />,
    },
    {
      rank: 4,
      title: "Quiz Pro",
      pointsToUnlock: 3_300_000,
      cashReward: 5_200_000,
      status: "locked",
      Icon: <SiPrometheus size={23} className="text-blue-500" />,
    },
    {
      rank: 3,
      title: "Brainiac",
      pointsToUnlock: 3_600_000,
      cashReward: 5_600_000,
      status: "locked",
      Icon: <GiBrainstorm size={23} className="text-red-600" />,
    },
    {
      rank: 2,
      title: "Mastermind",
      pointsToUnlock: 4_000_000,
      cashReward: 6_500_000,
      status: "locked",
      Icon: <SiCoolermaster size={23} className="text-purple-600" />,
    },
    {
      rank: 1,
      title: "Quiz Overlord",
      pointsToUnlock: 5_000_000,
      cashReward: 10_000_000,
      status: "locked",
      Icon: <FaCrown size={23} className="text-green-500" />,
    },
  ];

  const [count, setCount] = useState(0);
  const [rankData, setrankData] = useState<{
    show: boolean;
    data: (typeof leaderboardRanks)[0];
  }>({
    show: false,
    data: leaderboardRanks[0],
  });

  const handleRankClick = (type: string, size: number) => {
    if (type === "inc" && count < size) {
      setCount(count + 1);
    }
    if (type === "dec" && count > 0) {
      setCount(count - 1);
    }
  };

  const handleRankModal = (payload: (typeof leaderboardRanks)[0]) => {
    if (payload.status === "unlocked") {
      return router.push("/exploral/rank?rank=" + payload.rank);
    }
    setrankData({
      show: !rankData.show,
      data: payload as (typeof leaderboardRanks)[0],
    });
  };
  const ranksLength = leaderboardRanks.length;
  const paginationSize = Math.round(ranksLength / 5);

  const filteredRanks = leaderboardRanks.slice(
    count * paginationSize,
    count * paginationSize + paginationSize + 1,
  );
  return (
    <Layout>
      <Header title="Exploral" backBtn={false} />

      <main className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1600px] mx-auto">
        {/* TOP ROW: Championships & Studio Winner */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 order-2 lg:order-1">
            <GlassCard className="p-6 md:p-8 flex flex-col items-center text-center justify-between min-h-[200px] md:min-h-[250px]">
              <div className="bg-emerald-500/10 p-3 md:p-4 rounded-2xl">
                <MdSettings className="text-emerald-500 text-2xl md:text-3xl" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-bold text-base md:text-lg">
                  Genuslab Quiz Challenge
                </h3>
                <p className="text-slate-400 text-[10px] md:text-xs">
                  The ultimate flagship competition. High stakes, maximum
                  rewards.
                </p>
              </div>
              <div className="flex gap-2 md:gap-3 mt-4">
                <button className="bg-emerald-500/20 text-emerald-500 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] font-bold">
                  LIVE
                </button>
                <button className="bg-white/5 text-slate-400 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] font-bold">
                  1.2k joined
                </button>
              </div>
            </GlassCard>

            {/* Placeholder for the second card seen in mobile mock */}
            <GlassCard className="p-6 md:p-8 flex flex-col items-center text-center justify-between min-h-[200px] md:min-h-[250px] opacity-50 md:opacity-100">
              <div className="bg-purple-500/10 p-4 rounded-2xl">
                <MdStars className="text-purple-500 text-3xl" />
              </div>
              <div className="space-y-2">
                <h3 className="text-white font-bold text-lg">
                  Tech Championship
                </h3>
                <p className="text-slate-400 text-xs">
                  Developing the next generation of tech talent.
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                <button className="bg-purple-500/20 text-purple-500 px-6 py-2 rounded-full text-[10px] font-bold uppercase">
                  Starts in 2h
                </button>
              </div>
            </GlassCard>
          </div>

          <GlassCard className="p-6 md:p-8 flex flex-col items-center relative overflow-hidden order-1 lg:order-2">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full" />
            <p className="text-blue-500 text-[10px] font-bold flex items-center gap-2 mb-4 md:mb-6 uppercase tracking-wider">
              <MdStars /> Current Studio Winner
            </p>
            <div className="relative mb-4">
              <ImageWithFallback className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover ring-4 ring-blue-500/20" />
              <div className="absolute -bottom-2 right-[-10px] bg-blue-600 text-[8px] font-black px-2 py-1 rounded text-white border border-white/20">
                #1 RANK
              </div>
            </div>
            <h3 className="text-white font-bold text-xl mt-2 md:mt-4">
              Evelyn S.
            </h3>
            <p className="text-slate-500 text-[10px] mb-6 md:mb-8">
              Studio Championship 2024
            </p>
            <div className="grid grid-cols-2 w-full gap-4 text-center border-t border-white/5 pt-4">
              <div>
                <p className="text-slate-500 text-[8px] uppercase font-bold mb-1">
                  Points Won
                </p>
                <p className="text-white font-bold text-sm">48,750</p>
              </div>
              <div>
                <p className="text-slate-500 text-[8px] uppercase font-bold mb-1">
                  Prize Pool
                </p>
                <p className="text-emerald-500 font-bold text-sm">₦1.2M</p>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* MIDDLE ROW: Tech News & Socials */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          <GlassCard className="lg:col-span-3 p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 md:mb-8">
              <div>
                <p className="text-blue-500 text-[10px] uppercase tracking-widest font-bold">
                  Latest Trends
                </p>
                <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 mt-1">
                  <MdPublic className="text-blue-500" /> Tech News
                </h2>
              </div>
              <button className="text-slate-400 text-[10px] font-bold bg-white/5 px-4 md:px-6 py-2 rounded-lg border border-white/10 hidden sm:block">
                Discover Full Feed
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="relative group cursor-pointer rounded-3xl overflow-hidden aspect-[16/10] md:aspect-auto">
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10" />
                <ImageWithFallback className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute bottom-0 left-0 p-6 z-20">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">
                    How Web3 is changing the quiz ecosystem
                  </h3>
                  <p className="text-slate-300 text-[10px] font-bold uppercase tracking-wider">
                    5 Min Read • Today
                  </p>
                </div>
              </div>

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
                    time: "4 hours ago",
                  },
                  {
                    icon: <MdSmartToy />,
                    title: "Neural Networks mimic biological structures",
                    time: "8 hours ago",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-4 group cursor-pointer border-b border-white/5 pb-4 last:border-0"
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-white text-xs md:text-sm font-bold leading-snug">
                        {item.title}
                      </h4>
                      <p className="text-slate-500 text-[10px] mt-1 font-bold uppercase">
                        {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 md:p-8">
            <h3 className="text-white font-bold flex items-center gap-2 mb-6 md:mb-8">
              <div className="w-1 h-4 bg-blue-500 rounded-full" /> Connect with
              Us
            </h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                { icon: <FaXTwitter />, label: "X Social" },
                { icon: <FaInstagram />, label: "Instagram" },
                { icon: <FaFacebook />, label: "Facebook" },
                { icon: <FaDiscord />, label: "Discord" },
              ].map((social, i) => (
                <div
                  key={i}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-white/10 transition-all"
                >
                  <div className="text-white text-xl md:text-2xl">
                    {social.icon}
                  </div>
                  <span className="text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-tighter">
                    {social.label}
                  </span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* BOTTOM ROW: Leaderboard Ranks */}
        <GlassCard className="static p-6 md:p-10">
          <div className="flex justify-between items-center mb-8 md:mb-10">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Leaderboard Ranks
              </h2>
              <p className="text-slate-500 text-[10px] md:text-xs mt-1">
                Ascend through the hierarchy of knowledge.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400"
                onClick={() => handleRankClick("dec", paginationSize)}
              >
                <FaArrowLeft size={12} />
              </button>
              <button
                className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-white/10 flex items-center justify-center text-slate-400"
                onClick={() => handleRankClick("inc", paginationSize)}
              >
                <FaArrowLeft size={12} className="rotate-180" />
              </button>
            </div>
          </div>

          <div className="w-full">
            <table className="w-full text-left">
              <thead className="hidden md:table-header-group">
                <tr className="text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-white/5">
                  <th className="pb-6 px-4">Rank ID</th>
                  <th className="pb-6 px-4">Designation</th>
                  <th className="pb-6 px-4">Unlock Requirements</th>
                  <th className="pb-6 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredRanks.map((rank, i) => (
                  <>
                    <tr
                      key={i}
                      onClick={() => handleRankModal(rank)}
                      className="group transition-colors hover:bg-white/5 rounded-xl cursor-pointer"
                    >
                      <td className="py-6 px-4 text-slate-500 font-mono text-xs hidden md:table-cell">
                        {rank.rank.toString().padStart(3, "0")}
                      </td>
                      <td className="py-6 px-0 md:px-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                            {rank.Icon}
                          </div>
                          <div>
                            <p className="text-white font-bold text-sm">
                              {rank.title}
                            </p>
                            {/* <p className="text-emerald-500 text-[10px] font-bold uppercase">
                            {rank.rank}
                            </p> */}
                          </div>
                        </div>
                      </td>
                      <td className="py-6 px-4 text-white text-xs font-bold hidden md:table-cell">
                        {rank.pointsToUnlock.toLocaleString()} XP
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex justify-end md:justify-center">
                          {rank.status === "unlocked" ? (
                            <MdCheckCircle className="text-emerald-500 text-xl" />
                          ) : (
                            <MdLock className="text-slate-500 text-xl" />
                          )}
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </main>
      {rankData.show && (
        <RankUnlockModal
          rank={rankData.data?.rank}
          icon={rankData.data?.Icon}
          title={rankData.data?.title}
          unlockStatus={rankData.data?.status}
          requirementPoints={rankData.data?.pointsToUnlock}
          unlockReward={rankData.data?.cashReward}
          onClose={() => {
            // alert("Modal closed");
            setrankData({ show: false, data: leaderboardRanks[0] });
          }}
        />
      )}
    </Layout>
  );
};

export default ExploralPage;
