"use client";

import { useState, useRef, useEffect } from "react";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import GlassCard from "@/components/ui/cards/GlassCard";
import Avatar from "@/components/ui/Avatar";
import PrimaryButton from "@/components/ui/buttons/Primary";
import {
  FaTrophy,
  FaMedal,
  FaChevronDown,
  FaBrain,
  FaUsers,
  FaCheck,
  FaInbox,
} from "react-icons/fa";
import { MdStars } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { getLeaderboardStats, getUserRankings } from "@/lib/api/apis";
import useUser from "@/hooks/useUser";

interface LeaderboardUser {
  position: number;
  score: number;
  name: string;
  avatar: string | null;
  totalXp: number;
  rewardBalance: number;
  rank: string;
}

type TimeframeType = "daily" | "weekly" | "monthly" | "overall";

/* ================= SKELETON LOADERS ================= */

const PodiumSkeleton = () => (
  <section className="flex flex-col md:flex-row items-end justify-center gap-6 mt-4">
    {/* 2nd Place Skeleton */}
    <div className="order-2 md:order-1 flex flex-col items-center gap-4 w-full md:w-64 animate-pulse">
      <div className="w-[80px] h-[80px] rounded-full bg-white/10" />
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="h-4 w-28 bg-white/10 rounded-md" />
        <div className="h-3 w-16 bg-white/10 rounded-md" />
        <div className="h-3 w-12 bg-white/5 rounded-full" />
      </div>
      <GlassCard className="w-full">
        <div className="h-20 md:h-28 flex items-center justify-center">
          <div className="h-8 w-12 bg-white/10 rounded-md" />
        </div>
      </GlassCard>
    </div>

    {/* 1st Place Skeleton */}
    <div className="order-1 md:order-2 flex flex-col items-center gap-4 w-full md:w-64 scale-105 md:scale-110 mb-4 md:mb-6 animate-pulse">
      <div className="w-[100px] h-[100px] rounded-full bg-white/10" />
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="h-5 w-32 bg-white/10 rounded-md" />
        <div className="h-3.5 w-20 bg-white/10 rounded-md" />
        <div className="h-3 w-14 bg-white/5 rounded-full" />
      </div>
      <GlassCard className="w-full">
        <div className="h-20 md:h-28 flex items-center justify-center">
          <div className="h-8 w-12 bg-white/10 rounded-md" />
        </div>
      </GlassCard>
    </div>

    {/* 3rd Place Skeleton */}
    <div className="order-3 flex flex-col items-center gap-4 w-full md:w-64 animate-pulse">
      <div className="w-[80px] h-[80px] rounded-full bg-white/10" />
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="h-4 w-24 bg-white/10 rounded-md" />
        <div className="h-3 w-16 bg-white/10 rounded-md" />
        <div className="h-3 w-12 bg-white/5 rounded-full" />
      </div>
      <GlassCard className="w-full">
        <div className="h-20 md:h-28 flex items-center justify-center">
          <div className="h-8 w-12 bg-white/10 rounded-md" />
        </div>
      </GlassCard>
    </div>
  </section>
);

const ListSkeleton = () => (
  <section className="flex flex-col gap-4 mt-6">
    <div className="flex justify-between items-center px-4 animate-pulse">
      <div className="h-5 w-36 bg-white/10 rounded-md" />
      <div className="h-3 w-20 bg-white/5 rounded-md" />
    </div>

    <GlassCard>
      <div className="flex flex-col">
        {[1, 2, 3, 4, 5].map((_, idx) => (
          <div
            key={idx}
            className={`p-4 sm:p-5 flex items-center justify-between animate-pulse ${
              idx !== 4 ? "border-b border-white/5" : ""
            }`}
          >
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="w-6 h-4 bg-white/10 rounded-md" />
              <div className="flex items-center gap-3">
                <div className="w-[40px] h-[40px] rounded-full bg-white/10" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-28 bg-white/10 rounded-md" />
                  <div className="h-3 w-16 bg-white/5 rounded-full" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <div className="h-4 w-16 bg-white/10 rounded-md" />
              <div className="h-2.5 w-12 bg-white/5 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  </section>
);

/* ================= EMPTY STATE PLACEHOLDER ================= */

const EmptyLeaderboard = ({ type }: { type: "quiz" | "referral" }) => (
  <div className="my-8 py-16 px-4 flex flex-col items-center justify-center text-center">
    <GlassCard className="max-w-md w-full p-8 flex flex-col items-center gap-4 border border-white/10 shadow-2xl">
      <div className="p-4 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
        <FaInbox size={40} />
      </div>

      <div className="space-y-1">
        <h3 className="text-xl font-bold text-white">No Rankings Yet</h3>
        <p className="text-sm text-gray-400">
          {type === "quiz"
            ? "Be the first to complete a quiz and claim the top spot on the leaderboard!"
            : "No referral rankings found for this timeframe. Invite friends to jump ahead!"}
        </p>
      </div>

      <div className="pt-2 w-full">
        <PrimaryButton
          type="link"
          to={type === "quiz" ? "/quizzes" : "/profile?tab=Referral"}
          text={type === "quiz" ? "Take a Quiz Now" : "Invite Friends"}
        />
      </div>
    </GlassCard>
  </div>
);

/* ================= MAIN COMPONENT ================= */

const LeaderboardPage = () => {
  const [type, setType] = useState<"quiz" | "referral">("quiz");
  const [timeframe, setTimeframe] = useState<TimeframeType>("overall");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const TIMEFRAMES: { label: string; value: TimeframeType }[] = [
    { label: "Daily", value: "daily" },
    { label: "Weekly", value: "weekly" },
    { label: "Monthly", value: "monthly" },
    { label: "Overall", value: "overall" },
  ];

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const {
    data: userData,
    isLoading: userLoading,
    isError: userError,
  } = useUser();
  const detailsId = userData?.user?.details?.id || "";

  const {
    data = { leaderboard: [], ranking: null },
    isLoading,
    isError,
  } = useQuery<{ leaderboard: LeaderboardUser[]; ranking: any }>({
    queryKey: ["leaderboard", type, timeframe, detailsId],
    queryFn: async () => {
      const leaderboard = await getLeaderboardStats(
        `${type === "quiz" ? "xp" : type}/${timeframe}`,
      );
      const ranking = await getUserRankings(
        `${type === "quiz" ? "xp" : type}/${timeframe}/${detailsId}`,
      );
      return {
        leaderboard: leaderboard?.data?.payload || [],
        ranking: ranking?.data?.payload || 0,
      };
    },
  });

  console.log(data, "leaderboard");
  const selectedTimeframeLabel =
    TIMEFRAMES.find((tf) => tf.value === timeframe)?.label || "Overall";

  const hasLeaderboardData =
    Array.isArray(data?.leaderboard) && data.leaderboard.length > 0;

  // Extract Top 3 for Podium
  const rank1 = hasLeaderboardData
    ? data.leaderboard.find((u) => u.position === 1)
    : null;
  const rank2 = hasLeaderboardData
    ? data.leaderboard.find((u) => u.position === 2)
    : null;
  const rank3 = hasLeaderboardData
    ? data.leaderboard.find((u) => u.position === 3)
    : null;

  const podiumList = [
    ...(rank2 ? [{ ...rank2, color: "border-gray-300" }] : []),
    ...(rank1 ? [{ ...rank1, color: "border-yellow-400" }] : []),
    ...(rank3 ? [{ ...rank3, color: "border-orange-600" }] : []),
  ];

  const restRankings = hasLeaderboardData
    ? data.leaderboard.filter((u) => u.position > 3)
    : [];

  return (
    <Layout>
      <Header title="Leaderboard" backBtn={true} />

      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8 max-w-6xl mx-auto">
        {/* CONTROL BAR: TYPE TABS & TIMEFRAME DROPDOWN */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl relative z-30">
          {/* TYPE SWITCHER TABS */}
          <div className="relative flex items-center p-1 bg-black/20 rounded-xl w-full sm:w-auto border border-white/5">
            <button
              onClick={() => setType("quiz")}
              className={`relative z-10 flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                type === "quiz"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Quiz
            </button>
            <button
              onClick={() => setType("referral")}
              className={`relative z-10 flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ${
                type === "referral"
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Referrals
            </button>
          </div>

          {/* DROPDOWN */}
          <div className="relative w-full sm:w-52" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="w-full flex items-center justify-between bg-white/10 hover:bg-white/15 active:bg-white/20 text-white text-xs sm:text-sm font-medium px-4 py-2.5 rounded-xl border border-white/15 shadow-lg backdrop-blur-md transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <span className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">Period:</span>
                <span className="font-semibold text-white">
                  {selectedTimeframeLabel}
                </span>
              </span>
              <FaChevronDown
                size={12}
                className={`text-gray-400 group-hover:text-white transition-transform duration-300 ${
                  isDropdownOpen ? "rotate-180 text-blue-400" : ""
                }`}
              />
            </button>

            {/* DROPDOWN MENU PANEL */}
            {isDropdownOpen && (
              <div className="absolute right-0 left-0 sm:left-auto sm:w-full mt-2 py-1.5 rounded-xl bg-slate-900/80 backdrop-blur-2xl border border-white/15 shadow-2xl shadow-black/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                {TIMEFRAMES.map((tf) => {
                  const isSelected = timeframe === tf.value;
                  return (
                    <button
                      key={tf.value}
                      onClick={() => {
                        setTimeframe(tf.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-xs sm:text-sm font-medium transition-colors ${
                        isSelected
                          ? "bg-blue-600/30 text-blue-300 font-semibold border-l-2 border-blue-500"
                          : "text-gray-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <span>{tf.label}</span>
                      {isSelected && (
                        <FaCheck size={12} className="text-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* LOADING STATE */}
        {isLoading && (
          <div>
            <PodiumSkeleton />
            <ListSkeleton />
          </div>
        )}

        {/* ERROR STATE */}
        {isError && (
          <div className="text-center py-16 text-red-400 font-medium bg-red-500/5 rounded-2xl border border-red-500/10">
            Failed to load leaderboard data. Please try again later.
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !isError && !hasLeaderboardData && (
          <EmptyLeaderboard type={type} />
        )}

        {/* DATA PRESENT STATE */}
        {!isLoading && !isError && hasLeaderboardData && (
          <>
            {/* PODIUM SECTION */}
            {podiumList.length > 0 && (
              <section className="flex flex-col md:flex-row items-end justify-center gap-6 mt-4">
                {podiumList.map((user) => (
                  <div
                    key={user.position}
                    className={`flex flex-col items-center gap-4 w-full md:w-64 ${
                      user.position === 1
                        ? "order-1 md:order-2 scale-105 md:scale-110 mb-4 md:mb-6"
                        : user.position === 2
                          ? "order-2 md:order-1"
                          : "order-3"
                    }`}
                  >
                    <div className="relative">
                      <Avatar
                        size={user.position === 1 ? 100 : 80}
                        type="main"
                        url={user.avatar || undefined}
                        color={user.color}
                      />
                      <div
                        className={`absolute -top-3 -right-2 p-2 rounded-full ${
                          user.position === 1
                            ? "bg-yellow-400 text-black shadow-lg"
                            : "bg-white/10 text-white"
                        }`}
                      >
                        {user.position === 1 ? (
                          <FaTrophy size={18} />
                        ) : (
                          <FaMedal size={16} />
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-white font-bold capitalize">
                        {user.name}
                      </h3>
                      <p className="text-blue-400 text-sm font-bold">
                        {type === "quiz" ? "SCORE:" : "REFERRALS:"}{" "}
                        {(user.score ?? 0).toLocaleString()}{" "}
                      </p>
                      <span className="text-[10px] text-gray-400 bg-white/5 px-2.5 py-0.5 rounded-full uppercase">
                        {user.rank}
                      </span>
                    </div>

                    <GlassCard className="w-full">
                      <div className="h-20 md:h-28 flex items-center justify-center font-bold text-4xl text-white/20">
                        #{user.position}
                      </div>
                    </GlassCard>
                  </div>
                ))}
              </section>
            )}

            {/* RANKINGS LIST (4th place and below) */}
            {restRankings.length > 0 && (
              <section className="flex flex-col gap-4">
                <div className="flex justify-between items-center px-4">
                  <h2 className="text-xl font-bold text-white flex gap-2 items-center">
                    <MdStars className="text-blue-400" /> Global Rankings
                  </h2>
                  <span className="text-gray-400 text-xs">Live Updates</span>
                </div>

                <GlassCard>
                  <div className="flex flex-col">
                    {restRankings.map((player, index) => (
                      <div
                        key={player.position}
                        className={`p-4 sm:p-5 flex items-center justify-between hover:bg-white/5 transition-colors ${
                          index !== restRankings.length - 1
                            ? "border-b border-white/5"
                            : ""
                        }`}
                      >
                        <div className="flex items-center gap-4 sm:gap-6">
                          <span className="text-gray-400 font-bold w-6 text-center">
                            {player.position}
                          </span>
                          <div className="flex items-center gap-3">
                            <Avatar
                              size={40}
                              type="main"
                              url={player.avatar || undefined}
                            />
                            <div>
                              <h4 className="text-white text-sm font-semibold capitalize">
                                {player.name}
                              </h4>
                              <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full uppercase">
                                {player.rank}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-8">
                          <div className="flex flex-col items-end">
                            <span className="text-white font-bold text-sm">
                              {type === "quiz"
                                ? (player.totalXp ?? 0).toLocaleString()
                                : (player.score ?? 0).toLocaleString()}
                            </span>
                            <span className="text-gray-400 text-[10px]">
                              {type === "quiz" ? "Total XP" : "Referrals"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </section>
            )}
          </>
        )}

        {/* PERSISTENT USER FOOTER */}
        {type === "quiz" && (
          <div className="sticky bottom-0 z-10 pt-4">
            <GlassCard className="border-t-2 border-blue-500/50">
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-blue-400 font-bold text-xl">
                    #{data.ranking ? data.ranking : "--"}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm">
                      Your Current Rank
                    </span>
                    <span className="text-gray-400 text-xs">
                      Keep attempting quizzes to boost your position
                    </span>
                  </div>
                </div>
                <PrimaryButton type="link" to="/quizzes" text="Improve Rank" />
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LeaderboardPage;
