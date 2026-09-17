"use client";

import { useState, useRef, useEffect } from "react";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import GlassCard from "@/components/ui/cards/GlassCard";
import Avatar from "@/components/ui/Avatar";
import ClickableUserLink from "@/components/ui/ClickableUserLink";
import PrimaryButton from "@/components/ui/buttons/Primary";
import { FaTrophy, FaMedal, FaChevronDown, FaCheck, FaInbox } from "react-icons/fa";
import { MdHourglassTop } from "react-icons/md";
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
  timeInSeconds: number | null;
  userDetailsId: string;
}

type TimeframeType = "daily" | "weekly" | "monthly" | "overall";

// Formats a raw seconds value as "1m 23s" (or "45s" under a minute) — null
// means no recorded completion time for that user (e.g. referral entries,
// which aren't timed at all).
const formatSpeed = (seconds: number | null | undefined) => {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) {
    return "—";
  }
  const totalSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
};

/* ================= SKELETON LOADERS ================= */

const PodiumSkeleton = () => (
  <section className="flex flex-col md:flex-row items-end justify-center gap-6 mt-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className={`flex flex-col items-center gap-4 w-full md:w-64 animate-pulse ${
          i === 2 ? "md:order-2 scale-105 md:scale-110 mb-4 md:mb-6" : ""
        }`}
      >
        <div className="w-20 h-20 rounded-full bg-white/10" />
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="h-4 w-28 bg-white/10 rounded-md" />
          <div className="h-3 w-16 bg-white/5 rounded-md" />
        </div>
        <GlassCard className="w-full">
          <div className="h-20 md:h-24 flex items-center justify-center">
            <div className="h-8 w-12 bg-white/10 rounded-md" />
          </div>
        </GlassCard>
      </div>
    ))}
  </section>
);

const ListSkeleton = () => (
  <section className="flex flex-col gap-4 mt-6">
    <div className="flex justify-between items-center px-1 animate-pulse">
      <div className="h-5 w-36 bg-white/10 rounded-md" />
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
                <div className="w-10 h-10 rounded-full bg-white/10" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-4 w-28 bg-white/10 rounded-md" />
                  <div className="h-3 w-16 bg-white/5 rounded-md" />
                </div>
              </div>
            </div>
            <div className="h-4 w-16 bg-white/10 rounded-md" />
          </div>
        ))}
      </div>
    </GlassCard>
  </section>
);

/* ================= EMPTY STATE PLACEHOLDER ================= */

const EmptyLeaderboard = ({ type }: { type: "quiz" | "referral" }) => (
  <div className="my-8 py-16 px-4 flex flex-col items-center justify-center text-center">
    <GlassCard className="max-w-md w-full">
      <div className="p-8 flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-white/5 text-grey">
          <FaInbox size={32} />
        </div>

        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-(--primary)">
            No rankings yet
          </h3>
          <p className="text-sm text-grey">
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

  const { data: userData } = useUser();
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

      let ranking = null;
      if (detailsId) {
        const rankingRes = await getUserRankings(
          `${type === "quiz" ? "xp" : type}/${timeframe}/${detailsId}`,
        );
        ranking = rankingRes?.data?.payload ?? null;
      }

      return {
        leaderboard: leaderboard?.data?.payload || [],
        ranking,
      };
    },
  });

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
    ...(rank2 ? [{ ...rank2, ring: "border-white/20" }] : []),
    ...(rank1 ? [{ ...rank1, ring: "border-yellow" }] : []),
    ...(rank3 ? [{ ...rank3, ring: "border-orange-400/60" }] : []),
  ];

  const restRankings = hasLeaderboardData
    ? data.leaderboard.filter((u) => u.position > 3)
    : [];

  // Safely extract numeric position from user ranking
  const userPositionDisplay = (() => {
    if (!data.ranking) return "--";
    if (typeof data.ranking === "number" || typeof data.ranking === "string") {
      return data.ranking;
    }
    return data.ranking?.position || data.ranking?.rank || "--";
  })();

  return (
    <Layout>
      <Header title="Leaderboard" backBtn={true} />

      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8 max-w-6xl mx-auto">
        {/* CONTROL BAR: TYPE TABS & TIMEFRAME DROPDOWN */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 rounded-lg bg-white/5 border border-white/10">
          {/* TYPE SWITCHER TABS */}
          <div className="relative flex items-center p-1 bg-black/20 rounded-md w-full sm:w-auto">
            <button
              onClick={() => setType("quiz")}
              className={`flex-1 sm:flex-none flex items-center justify-center px-6 py-2 rounded text-sm font-medium transition-colors ${
                type === "quiz"
                  ? "bg-blue/20 text-blue"
                  : "text-grey hover:text-(--primary)"
              }`}
            >
              Quiz
            </button>
            <button
              onClick={() => setType("referral")}
              className={`flex-1 sm:flex-none flex items-center justify-center px-6 py-2 rounded text-sm font-medium transition-colors ${
                type === "referral"
                  ? "bg-blue/20 text-blue"
                  : "text-grey hover:text-(--primary)"
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
              className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 text-(--primary) text-sm font-medium px-4 py-2.5 rounded-md border border-white/10 transition-colors"
            >
              <span className="flex items-center gap-2">
                <span className="text-grey">Period:</span>
                <span className="font-semibold">{selectedTimeframeLabel}</span>
              </span>
              <FaChevronDown
                size={12}
                className={`text-grey transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* DROPDOWN MENU PANEL */}
            {isDropdownOpen && (
              <div className="absolute right-0 left-0 sm:left-auto sm:w-full mt-2 py-1.5 rounded-md bg-blue-950/95 backdrop-blur-xl border border-white/10 shadow-lg z-50 overflow-hidden">
                {TIMEFRAMES.map((tf) => {
                  const isSelected = timeframe === tf.value;
                  return (
                    <button
                      key={tf.value}
                      onClick={() => {
                        setTimeframe(tf.value);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm font-medium transition-colors ${
                        isSelected
                          ? "text-blue bg-blue/10"
                          : "text-grey hover:bg-white/5 hover:text-(--primary)"
                      }`}
                    >
                      <span>{tf.label}</span>
                      {isSelected && <FaCheck size={12} />}
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
          <GlassCard>
            <div className="text-center py-12 text-red text-sm font-medium">
              Failed to load leaderboard data. Please try again later.
            </div>
          </GlassCard>
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
                    className={`flex flex-col items-center gap-3 w-full md:w-64 ${
                      user.position === 1
                        ? "order-1 md:order-2 scale-105 md:scale-110 mb-4 md:mb-6"
                        : user.position === 2
                          ? "order-2 md:order-1"
                          : "order-3"
                    }`}
                  >
                    <div className="relative">
                      <ClickableUserLink
                        userDetailsId={user.userDetailsId}
                        currentUserDetailsId={detailsId}
                      >
                        <Avatar
                          size={user.position === 1 ? 96 : 76}
                          type="main"
                          url={user.avatar || undefined}
                          color={user.ring}
                        />
                      </ClickableUserLink>
                      <div
                        className={`absolute -top-2 -right-2 p-1.5 rounded-full ${
                          user.position === 1
                            ? "bg-yellow text-black"
                            : "bg-white/10 text-(--primary)"
                        }`}
                      >
                        {user.position === 1 ? (
                          <FaTrophy size={14} />
                        ) : (
                          <FaMedal size={13} />
                        )}
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-(--primary) font-semibold capitalize">
                        {user.name}
                      </h3>
                      <p className="text-grey text-[13px]">{user.rank}</p>
                      <p className="text-blue text-sm font-semibold mt-1">
                        {(user.score ?? 0).toLocaleString()}{" "}
                        {type === "quiz" ? "pts" : "referrals"}
                      </p>
                      {type === "quiz" && (
                        <p className="text-grey text-[13px] flex items-center justify-center gap-1 mt-0.5">
                          <MdHourglassTop size={12} />
                          {formatSpeed(user.timeInSeconds)}
                        </p>
                      )}
                    </div>

                    <GlassCard className="w-full">
                      <div className="h-16 md:h-20 flex items-center justify-center font-semibold text-3xl text-white/15">
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
                <h2 className="text-lg font-semibold text-(--primary) px-1">
                  Full rankings
                </h2>

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
                          <span className="text-grey font-semibold w-6 text-center">
                            {player.position}
                          </span>
                          <div className="flex items-center gap-3">
                            <ClickableUserLink
                              userDetailsId={player.userDetailsId}
                              currentUserDetailsId={detailsId}
                            >
                              <Avatar
                                size={40}
                                type="main"
                                url={player.avatar || undefined}
                              />
                            </ClickableUserLink>
                            <div>
                              <h4 className="text-(--primary) text-sm font-semibold capitalize">
                                {player.name}
                              </h4>
                              <p className="text-grey text-[13px]">
                                {player.rank}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 sm:gap-8">
                          {type === "quiz" && (
                            <div className="hidden sm:flex flex-col items-end">
                              <span className="text-(--primary) font-medium text-sm flex items-center gap-1">
                                <MdHourglassTop size={13} className="text-grey" />
                                {formatSpeed(player.timeInSeconds)}
                              </span>
                              <span className="text-grey text-[13px]">Speed</span>
                            </div>
                          )}
                          <div className="flex flex-col items-end">
                            <span className="text-(--primary) font-semibold text-sm">
                              {(player.score ?? 0).toLocaleString()}
                            </span>
                            <span className="text-grey text-[13px]">
                              {type === "quiz" ? "Total score" : "Referrals"}
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
            <GlassCard>
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <span className="text-blue font-semibold text-xl">
                    #{userPositionDisplay}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-(--primary) font-semibold text-sm">
                      Your current rank
                    </span>
                    <span className="text-grey text-sm">
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
