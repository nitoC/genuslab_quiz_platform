"use client";

import React, { useState } from "react";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import GlassCard from "@/components/ui/cards/GlassCard";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import {
  MdStars,
  MdCheckCircle,
  MdLock,
  MdSettings,
  MdHourglassEmpty,
  MdEmojiEvents,
} from "react-icons/md";
import {
  FaInstagram,
  FaFacebook,
  FaCrown,
  FaCentos,
  FaChessKnight,
  FaUsers,
  FaArrowLeft,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa6";
import { SiClevercloud, SiCoolermaster, SiPrometheus } from "react-icons/si";
import {
  GiAllSeeingEye,
  GiBlackKnightHelm,
  GiBoxingGlove,
  GiExplosionRays,
  GiGiftOfKnowledge,
  GiMiddleArrow,
  GiPsychicWaves,
  GiQuicksand,
  GiSoulVessel,
  GiSparkSpirit,
  GiBrainstorm,
} from "react-icons/gi";
import { FcMindMap } from "react-icons/fc";
import { HiMiniCheckBadge } from "react-icons/hi2";
import RankUnlockModal from "@/components/ui/modals/leaderboard";
import BlogContent from "@/features/exploral/BlogContent";
import { useRouter } from "next/navigation";
import sanityClient from "@/lib/utils/Sanity";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

// Types
interface StudioWinner {
  name: string;
  avatarUrl?: string;
  rankTitle: string;
  pointsWon: number;
  prizePool: string;
}

interface ChampionshipEvent {
  title: string;
  description: string;
  isLive: boolean;
  comingSoon: boolean;
  statusText?: string;
}

const ExploralPage = () => {
  const router = useRouter();

  // Dynamic Data States
  const [techChampionship, setTechChampionship] = useState<ChampionshipEvent>({
    title: "Tech Championship",
    description: "Developing the next generation of tech talent.",
    isLive: false,
    comingSoon: true,
    statusText: "Coming Soon",
  });

  const [studioWinner, setStudioWinner] = useState<StudioWinner | null>(null);

  const query = `*[_type == "post"]
| order(publishedAt desc)[$start...$end]{
  _id,
  title,
  slug,
  publishedAt,
  "authorName": author->name,
  "categories": categories[]->title,
  "mainImageUrl": mainImage.asset->url
}`;

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

  const { data, isLoading } = useQuery({
    queryKey: ["blog_posts"],
    queryFn: async () => {
      const posts = await sanityClient.fetch(query, { start: 0, end: 4 });
      return posts;
    },
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
                <Link
                  href={"/quiz"}
                  className="bg-emerald-500/20 hover:bg-emerald-500 duration-200 hover:text-white text-emerald-500 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] font-bold"
                >
                  LIVE/DEMO
                </Link>
                <Link
                  href="/quizzes"
                  className="bg-white/5 hover:bg-blue-400 duration-200 hover:text-white text-slate-400 px-4 md:px-6 py-1.5 md:py-2 rounded-full text-[10px] font-bold"
                >
                  Join
                </Link>
              </div>
            </GlassCard>

            {/* Dynamic Tech Championship Card (Disabled / Coming Soon Variant) */}
            <GlassCard
              className={`p-6 md:p-8 flex flex-col items-center text-center justify-between min-h-[200px] md:min-h-[250px] transition-all duration-300 ${
                techChampionship.comingSoon
                  ? "bg-slate-900/30 border-white/5 opacity-60 hover:opacity-80 grayscale-[30%]"
                  : ""
              }`}
            >
              <div
                className={`p-4 rounded-2xl ${
                  techChampionship.comingSoon
                    ? "bg-purple-500/5 text-purple-400/60"
                    : "bg-purple-500/10 text-purple-500"
                }`}
              >
                <MdStars className="text-3xl" />
              </div>
              <div className="space-y-2">
                <h3
                  className={`font-bold text-lg ${
                    techChampionship.comingSoon
                      ? "text-slate-300"
                      : "text-white"
                  }`}
                >
                  {techChampionship.title}
                </h3>
                <p
                  className={`text-xs ${
                    techChampionship.comingSoon
                      ? "text-slate-500"
                      : "text-slate-400"
                  }`}
                >
                  {techChampionship.description}
                </p>
              </div>
              <div className="flex gap-3 mt-4">
                {techChampionship.comingSoon ? (
                  <div className="flex items-center gap-2 bg-purple-950/30 text-purple-300/60 px-5 py-2 rounded-full text-[10px] font-extrabold uppercase tracking-widest border border-purple-500/20 backdrop-blur-sm shadow-inner cursor-not-allowed">
                    <MdHourglassEmpty className="animate-pulse text-xs text-purple-400/80" />
                    <span>{techChampionship.statusText || "Coming Soon"}</span>
                  </div>
                ) : (
                  <button className="bg-purple-500 hover:bg-purple-600 transition-colors text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase">
                    {techChampionship.statusText || "Join Now"}
                  </button>
                )}
              </div>
            </GlassCard>
          </div>

          {/* Dynamic Studio Winner Card (Disabled / Empty Variant) */}
          <GlassCard
            className={`p-6 md:p-8 flex flex-col items-center justify-between relative overflow-hidden order-1 lg:order-2 min-h-[250px] transition-all duration-300 ${
              !studioWinner ? "bg-slate-900/20 border-white/5 opacity-70" : ""
            }`}
          >
            <div
              className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl ${
                studioWinner ? "bg-blue-600/20" : "bg-slate-600/10"
              }`}
            />
            <p
              className={`text-[10px] font-bold flex items-center gap-2 uppercase tracking-wider ${
                studioWinner ? "text-blue-500" : "text-slate-500/70"
              }`}
            >
              <MdStars /> Current Studio Winner
            </p>

            {studioWinner ? (
              <>
                <div className="relative my-2">
                  <ImageWithFallback
                    src={studioWinner.avatarUrl}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover ring-4 ring-blue-500/20"
                  />
                  <div className="absolute -bottom-2 right-[-10px] bg-blue-600 text-[8px] font-black px-2 py-1 rounded text-white border border-white/20">
                    #1 RANK
                  </div>
                </div>
                <h3 className="text-white font-bold text-xl mt-2">
                  {studioWinner.name}
                </h3>
                <p className="text-slate-500 text-[10px] mb-4">
                  {studioWinner.rankTitle}
                </p>
                <div className="grid grid-cols-2 w-full gap-4 text-center border-t border-white/5 pt-4">
                  <div>
                    <p className="text-slate-500 text-[8px] uppercase font-bold mb-1">
                      Points Won
                    </p>
                    <p className="text-white font-bold text-sm">
                      {studioWinner.pointsWon.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[8px] uppercase font-bold mb-1">
                      Prize Pool
                    </p>
                    <p className="text-emerald-500 font-bold text-sm">
                      {studioWinner.prizePool}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              /* Sleek Semi-Transparent / Disabled Placeholder State */
              <div className="flex flex-col items-center text-center my-auto py-2 w-full">
                <div className="relative mb-3 flex items-center justify-center">
                  <div className="absolute inset-0 bg-slate-500/10 rounded-full blur-xl" />
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-white/[0.03] border border-dashed border-white/10 flex items-center justify-center text-slate-500/60 shadow-inner">
                    <MdEmojiEvents size={36} className="opacity-30" />
                  </div>
                  <span className="absolute -bottom-2 bg-slate-800/80 text-slate-400 text-[8px] font-extrabold px-2 py-0.5 rounded-full border border-white/10 uppercase tracking-widest backdrop-blur-sm">
                    Pending
                  </span>
                </div>
                <h4 className="text-slate-300 font-semibold text-sm mb-1">
                  No Winner Yet
                </h4>
                <p className="text-slate-500 text-[10px] max-w-[200px] leading-relaxed mb-4">
                  Tournament in progress. Be the first to claim top rank!
                </p>

                <div className="grid grid-cols-2 w-full gap-4 text-center border-t border-white/5 pt-3 opacity-40">
                  <div>
                    <p className="text-slate-500 text-[8px] uppercase font-bold mb-0.5">
                      Points Won
                    </p>
                    <p className="text-slate-400 font-bold text-xs">--</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-[8px] uppercase font-bold mb-0.5">
                      Prize Pool
                    </p>
                    <p className="text-slate-400 font-bold text-xs">--</p>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        </div>

        {/* MIDDLE ROW: Tech News & Socials */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {isLoading ? (
            <GlassCard className="lg:col-span-3 p-6 md:p-8 space-y-4">
              <div className="h-6 bg-white/10 rounded-md w-1/4 animate-pulse mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3"
                  >
                    <div className="h-40 bg-white/10 rounded-lg animate-pulse" />
                    <div className="h-4 bg-white/10 rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-white/10 rounded w-1/2 animate-pulse" />
                  </div>
                ))}
              </div>
            </GlassCard>
          ) : (
            <BlogContent posts={data} />
          )}

          <GlassCard className="p-6 md:p-8">
            <h3 className="text-white font-bold flex items-center gap-2 mb-6 md:mb-8">
              <div className="w-1 h-4 bg-blue-500 rounded-full" /> Connect with
              Us
            </h3>
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {[
                {
                  icon: <FaYoutube />,
                  label: "Youtube",
                  ref: "https://www.youtube.com/@Genuslab_technologies",
                },
                {
                  icon: <FaInstagram />,
                  label: "Instagram",
                  ref: "https://www.instagram.com/genuslabofficial/",
                },
                {
                  icon: <FaFacebook />,
                  label: "Facebook",
                  ref: "https://web.facebook.com/people/Genuslab-Technologies/100089159413660/",
                },
                {
                  icon: <FaTiktok />,
                  label: "TikTok",
                  ref: "https://www.tiktok.com/@genus_lab",
                },
              ].map((social, i) => (
                <Link
                  key={i}
                  href={social.ref}
                  target="__blank"
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-3 hover:bg-white/10 transition-all"
                >
                  <div className="text-white text-xl md:text-2xl">
                    {social.icon}
                  </div>
                  <span className="text-slate-400 text-[8px] md:text-[10px] font-bold uppercase tracking-tighter">
                    {social.label}
                  </span>
                </Link>
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
                {filteredRanks.map((rank) => (
                  <tr
                    key={rank?.title}
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
            setrankData({ show: false, data: leaderboardRanks[0] });
          }}
        />
      )}
    </Layout>
  );
};

export default ExploralPage;
