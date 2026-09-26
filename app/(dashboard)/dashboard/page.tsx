"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import ChartUpIcon from "@/assets/ChartUpIcon";
import ShieldIcon from "@/assets/ShieldIcon";

import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";

import Avatar from "@/components/ui/Avatar";
import PrimaryButton from "@/components/ui/buttons/Primary";
import GlassCard from "@/components/ui/cards/GlassCard";
import GlassBadge from "@/components/ui/GlassBadge";
import ProgressBar from "@/components/ui/ProgressBar";

// import useCountdown from "@/hooks/useCountdown";
// import { useTime } from "@/hooks/useTime";

import {
  getRankData,
  getTime,
  getUserProfile,
  getMostRecentTransaction,
  getAllActiveQuiz,
  getTotalRewards,
  getPublicUserStats,
} from "@/lib/api/apis";
import getLocalStorage from "@/lib/utils/getLocalStorage";
import nameResolver from "@/lib/utils/nameResolver";

// import { useSocket } from "@/store/useSocket";

import { AiFillDollarCircle } from "react-icons/ai";
import { FaCheckCircle, FaLock, FaTrophy } from "react-icons/fa";
import { IoIosRocket } from "react-icons/io";
import useUser from "@/hooks/useUser";
import TimerPop from "@/features/quiz/components/TimerPop";
import { FloatingDemoButton } from "@/components/ui/buttons/FloatingDemo";
import SubscribeAlert from "@/features/dashboard/alerts/SubscribeAlert";
import { rewardData } from "@/app/(dashboard)/rewards-breakdown/page";
import { formater } from "@/lib/utils/numFormatter";

const DAILY_PRIZES = [
  { place: "1st", amount: rewardData.daily.reward.first, color: "text-yellow" },
  { place: "2nd", amount: rewardData.daily.reward.second, color: "text-grey" },
  {
    place: "3rd",
    amount: rewardData.daily.reward.third,
    color: "text-yellow",
  },
];

const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`animate-pulse rounded-xl bg-white/10 ${className}`} />
  );
};

const DashboardSkeleton = () => {
  return (
    <Layout>
      <div>
        <Header title="Dashboard" backBtn={false} />

        <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
          {/* Welcome */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>

          {/* Top row */}
          <div className="flex flex-col lg:flex-row gap-8">
            <GlassCard className="flex-2">
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                <Skeleton className="w-24 h-24 rounded-full shrink-0" />

                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-3.5 w-32" />
                    <Skeleton className="h-4 w-56" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>

                    <Skeleton className="h-3 w-full rounded-full" />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Skeleton className="h-11 flex-1" />
                    <Skeleton className="h-11 flex-1" />
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="flex-1">
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-20" />
                </div>

                <Skeleton className="h-32 w-full" />

                <div className="space-y-3">
                  <Skeleton className="h-4 w-32 mx-auto" />
                  <Skeleton className="h-7 w-40 mx-auto" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Grid cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <GlassCard key={item}>
                <div className="p-6 flex flex-col gap-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Invite */}
          <GlassCard>
            <div className="p-6 flex flex-col sm:flex-row gap-6 justify-between">
              <div className="space-y-3">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-80 max-w-full" />
              </div>

              <div className="flex gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-36" />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
};

const Page = () => {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [pop, setPop] = useState(true);

  // const socketId = useSocket((state: any) => state.socketId);

  const [targetEpoch, setTargetEpoch] = useState<number | null>(null);
  const [countdown, setCountdown] = useState("Next quiz in —");
  // const [Sid, setSid] = useState("");

  /* ---------- Rewards and Payout State ---------- */
  const [currentPayout, setCurrentPayout] = useState<number>(0);

  /* -----------------------------
   * USER QUERY
   * ---------------------------- */
  const { data, isLoading, isError, error, userStore } = useUser();

  const detailsId = data?.user?.details?.id;

  /* -----------------------------
   * REWARD & TRANSACTION QUERIES
   * ---------------------------- */
  const { data: totalRewardsData } = useQuery({
    queryKey: ["totalRewards", detailsId],
    queryFn: async () => {
      const res = await getTotalRewards(detailsId as string);
      return res?.data?.payload;
    },
    enabled: !!detailsId,
  });

  const { data: publicStatsData } = useQuery({
    queryKey: ["publicUserStats", detailsId],
    queryFn: async () => {
      const res = await getPublicUserStats(detailsId as string);
      return res?.data?.payload;
    },
    enabled: !!detailsId,
  });

  const totalRewards = totalRewardsData?.total ?? 0;
  const overallRank = publicStatsData?.overallRank ?? null;
  const totalParticipants = publicStatsData?.totalParticipants ?? 0;
  const topPercent =
    overallRank && totalParticipants > 0
      ? Math.max(1, Math.ceil((overallRank / totalParticipants) * 100))
      : null;

  const { data: mostRecentTransactionData, isLoading: transactionLoading } =
    useQuery({
      queryKey: ["mostRecentTransaction"],
      queryFn: async () => {
        const res = await getMostRecentTransaction();
        // The transaction is under data.payload.
        return res?.data?.payload;
      },
    });

  const { data: quizData } = useQuery({
    queryKey: ["active-quiz-episodes"],
    queryFn: async () => {
      const res = await getAllActiveQuiz();
      return res.data.payload;
    },
  });

  const nextActive = useMemo(() => {
    if (!Array.isArray(quizData)) return null;
    return quizData.find((a: any) => a.status === "ACTIVE") ?? null;
  }, [quizData]);

  /* Update payout from most recent transaction data */
  useEffect(() => {
    // Prisma serializes the `Decimal` amount field as a string over JSON,
    // so this needs an explicit Number() cast or `.toLocaleString()` below
    // just echoes the raw string instead of formatting it.
    if (mostRecentTransactionData?.amount != null) {
      setCurrentPayout(Number(mostRecentTransactionData.amount));
    }
  }, [mostRecentTransactionData]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (data?.user && !data.user.verified) {
      router.replace("/verify");
    }
  }, [data?.user?.verified, router]);
  /* -----------------------------
   * LOADING
   * ---------------------------- */
  if (isLoading || !userStore) {
    return <DashboardSkeleton />;
  }

  /* -----------------------------
   * ERROR
   * ---------------------------- */
  if (isError || !data?.user) {
    console.error(data?.user, "is error");
    return (
      <Layout>
        <div>
          <Header title="Dashboard" backBtn={false} />

          <div className="min-h-[70vh] flex items-center justify-center p-6">
            <GlassCard className="max-w-md w-full">
              <div className="p-8 text-center space-y-4">
                <div className="text-red-400 text-lg font-semibold">
                  Failed to load dashboard
                </div>

                <p className="text-sm text-grey">
                  {(error as Error)?.message ||
                    "Something went wrong while fetching your dashboard data."}
                </p>

                <div className="flex gap-3 justify-center">
                  <PrimaryButton
                    text="Retry"
                    handler={() => window.location.reload()}
                  />

                  <PrimaryButton
                    text="Go Home"
                    type="link"
                    to="/"
                    style="text-(--primary) rounded-sm backdrop-blur-lg hover:bg-white/20 duration-500 bg-white/10"
                  />
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </Layout>
    );
  }

  const user = data.user;
  const rank = data.rank;

  const userName = nameResolver(user.name);
  const hasAttempts = user?.details?._count?.quizHistory >= 5;
  const hasSharedRef = user?.referrals.length >= 1;

  let taskCount = 0;
  if (hasAttempts) taskCount += 1;
  if (hasSharedRef) taskCount += 1;

  // if (!data.user.verified && typeof window !== undefined) {
  //   router.push("/verify");
  // }

  return (
    <Layout>
      <div>
        <Header title="Dashboard" backBtn={false} />

        <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
          {/* WELCOME */}
          <div>
            <h2 className="text-(--primary) dash-title text-lg sm:text-xl lg:text-2xl">
              Welcome back, <span className="text-blue">{userName}!</span>
            </h2>

            <p className="text-grey text-sm">
              Here's a quick overview of your account and activity quizzes.
            </p>
          </div>

          {/* SUBSCRIBE NOTIFICATION */}
          {!user?.isSubscribed && <SubscribeAlert />}

          {/* TOP ROW */}
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* PROFILE CARD */}
            <GlassCard className="flex-2">
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                <Avatar
                  url={user?.details?.avatar}
                  size={96}
                  type="main"
                  color="border-white/10"
                />

                <div className="flex flex-2 flex-col gap-3 w-full text-center sm:text-left">
                  <div>
                    <h3 className="text-(--primary) font-semibold text-lg">
                      {userName}
                    </h3>
                    <p className="text-sm text-grey mt-0.5">
                      {rank?.rankName || "Fresh Mind"} · Rank {rank?.rank || 0}
                    </p>

                    <p className="text-sm text-grey mt-2">
                      Mastering the Genius Quiz Challenge
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <h4 className="text-sm text-grey">
                      Level {rank?.rank || 0} progress
                    </h4>

                    <h4 className="text-(--primary) text-sm font-medium">
                      {user?.details?.xp || 0}/{rank?.unlockXp || 0} XP
                    </h4>
                  </div>

                  <ProgressBar
                    value={user?.details?.xp || 0}
                    total={rank?.unlockXp || 1}
                    color="bg-blue"
                  />

                  <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4">
                    <PrimaryButton
                      type="link"
                      to="/quizzes"
                      text="Earn a level"
                    />

                    <PrimaryButton
                      type="link"
                      to="/profile"
                      text="View Profile"
                      style="text-(--primary) rounded-sm backdrop-blur-lg hover:bg-white/20 duration-500 bg-white/10"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* REWARDS CARD */}
            <GlassCard className="flex-1">
              <div className="p-6 sm:p-8 flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                  <ChartUpIcon color="#B3B3B3" size={24} />

                  {topPercent !== null && (
                    <span className="text-yellow text-sm font-bold px-2 py-1 rounded-b-sm bg-yellow/10">
                      TOP {topPercent}%
                    </span>
                  )}
                </div>

                {totalRewards > 0 ? (
                  <>
                    <div className="flex justify-center flex-1 items-center">
                      <ShieldIcon />
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                      <h3 className="text-grey">Total Rewards</h3>

                      <h3 className="font-bold text-lg text-(--primary)">
                        ₦{formater(totalRewards)}
                      </h3>

                      <PrimaryButton
                        text="View Rankings"
                        type="link"
                        to="/leaderboard"
                        style="text-(--primary) rounded-sm backdrop-blur-lg hover:bg-white/20 duration-500 bg-white/10"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col flex-1 items-center justify-center text-center gap-2 py-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-grey opacity-60">
                      <ShieldIcon />
                    </div>
                    <h3 className="text-grey text-sm mt-2">No rewards yet</h3>
                    <p className="text-sm text-grey max-w-[200px]">
                      Climb up the leaderboard rank metrics to start earning.
                    </p>
                    <PrimaryButton
                      text="View Rankings"
                      type="link"
                      to="/leaderboard"
                      style="text-(--primary) rounded-sm backdrop-blur-lg hover:bg-white/20 duration-500 bg-white/10 mt-2"
                    />
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* SECOND ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* DAILY TASKS */}
            <GlassCard>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-(--primary) font-semibold">Tasks</h3>

                  <span className="text-grey text-sm">{taskCount}/2 Done</span>
                </div>

                <div className="flex justify-between items-center rounded-lg p-3">
                  <div className="flex gap-3 items-center">
                    <span className="w-8 h-8 rounded-full text-blue bg-blue/20 flex items-center justify-center">
                      <IoIosRocket />
                    </span>

                    <p className="text-sm text-grey">
                      Complete 5 Quizzes{" "}
                      <span className="text-yellow text-sm font-bold">
                        +150 XP
                      </span>
                    </p>
                  </div>

                  {hasAttempts ? (
                    <span className="text-green text-sm font-bold">
                      DONE
                    </span>
                  ) : (
                    <span className="text-yellow text-sm font-bold">
                      PENDING
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center rounded-lg p-3">
                  <div className="flex gap-3 items-center">
                    <span className="w-8 h-8 rounded-full text-green bg-green/20 flex items-center justify-center">
                      <AiFillDollarCircle size={20} />
                    </span>

                    <p className="text-sm text-grey">Share Referral Link</p>
                  </div>

                  {hasSharedRef ? (
                    <span className="text-green text-sm font-bold">
                      DONE
                    </span>
                  ) : (
                    <span className="text-yellow text-sm font-bold">
                      PENDING
                    </span>
                  )}
                </div>

                <div className="flex justify-center">
                  <Link
                    href="/quizzes/previous"
                    className="text-blue text-sm hover:underline"
                  >
                    View all quizzes
                  </Link>
                </div>
              </div>
            </GlassCard>

            {/* ONLINE QUIZ EVENT — mirrors the "Today's Prize Pool" card on
                the Quizzes page: real daily pool total + 1st/2nd/3rd
                breakdown, instead of a single mismatched reward figure. */}
            <GlassCard>
              <div className="p-6 flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                  <h3 className="text-(--primary) font-semibold flex gap-2 items-center">
                    <FaTrophy className="text-yellow" />
                    Online Quiz Event
                  </h3>

                  {!user.isSubscribed && (
                    <GlassBadge variant="warning" icon={<FaLock size={10} />}>
                      Locked
                    </GlassBadge>
                  )}
                </div>

                <div>
                  <p className="text-grey text-sm">Today's Prize Pool</p>
                  <h2 className="text-(--primary) font-bold text-2xl mt-0.5">
                    ₦{formater(rewardData.daily.total)}
                  </h2>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
                  {DAILY_PRIZES.map((prize) => (
                    <div key={prize.place} className="text-center">
                      <p className={`text-xs font-semibold ${prize.color}`}>
                        {prize.place}
                      </p>
                      <p className="text-(--primary) font-bold text-sm mt-0.5">
                        ₦{formater(prize.amount)}
                      </p>
                    </div>
                  ))}
                </div>

                {nextActive && (
                  <p className="text-sm text-grey">
                    Episode{" "}
                    {nextActive?.episode?.toString().split("_")[1] ?? "N/A"}
                    <span className="mx-1.5">·</span>
                    10 Questions • 5 mins
                  </p>
                )}

                {user.isSubscribed ? (
                  <PrimaryButton
                    type="link"
                    to={`/quiz/`}
                    text="Enter Now"
                    style="bg-green text-white rounded-sm hover:bg-green/90 font-semibold disabled:opacity-50 disabled:pointer-events-none mt-auto"
                  />
                ) : (
                  <>
                    <p className="text-sm text-grey leading-relaxed">
                      Subscribe to unlock live quiz events and compete for real
                      cash prizes.
                    </p>
                    <PrimaryButton
                      type="link"
                      to="/pricing"
                      text="Subscribe to Join"
                      style="bg-blue text-white rounded-sm hover:bg-blue/90 duration-300 font-semibold disabled:opacity-50 disabled:pointer-events-none mt-auto"
                    />
                  </>
                )}
              </div>
            </GlassCard>

            {/* RECENT PAYOUT */}
            <GlassCard>
              <div className="p-6 flex h-full flex-col justify-between gap-4">
                <div className="flex justify-between">
                  <h3 className="text-(--primary) font-semibold">
                    Recent Payout
                  </h3>

                  <FaCheckCircle
                    className={
                      currentPayout > 0
                        ? "text-green"
                        : "text-grey opacity-40"
                    }
                  />
                </div>

                {currentPayout > 0 ? (
                  <>
                    <div>
                      <p className="text-grey text-sm">Amount</p>

                      <h2 className="text-(--primary) font-bold text-xl">
                        ₦{currentPayout.toLocaleString()}
                      </h2>

                      <p className="text-grey text-sm mt-2">
                        {/* Snapshot of the account THIS payout was actually
                            sent to — not a live lookup of the user's
                            current linked account, which may have changed
                            or been removed since this payout was made. */}
                        {mostRecentTransactionData?.payoutAccountNumber
                          ? `•••• ${mostRecentTransactionData.payoutAccountNumber.slice(-4)} ${mostRecentTransactionData.payoutBankName}`
                          : "No bank account on record for this payout"}
                      </p>
                    </div>

                    <Link
                      href="/transactions"
                      className="text-blue text-sm hover:underline text-center"
                    >
                      View Transaction History
                    </Link>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center gap-1 my-auto py-2">
                    <p className="text-sm text-grey font-medium">
                      No recent payouts
                    </p>
                    <p className="text-sm text-grey/60 max-w-[180px]">
                      Your completed quiz earnings settlement summary updates
                      here.
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          </div>

          {/* INVITE FRIENDS */}
          <GlassCard>
            <div className="p-6 flex flex-col sm:flex-row gap-6 justify-between items-center">
              <div className="text-center sm:text-left">
                <h3 className="text-(--primary) font-semibold">
                  Invite Friends & Earn More!
                </h3>

                <p className="text-grey text-sm mt-0.5">
                  Earn{" "}
                  <span className="text-green font-semibold">
                    ₦{formater(rewardData.referral)}
                  </span>{" "}
                  for every friend you refer to Genuslab.
                </p>
                <p className="text-grey/60 text-xs mt-1">
                  Referral rewards are available to Premium subscribers only.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-end">
                <PrimaryButton
                  type="link"
                  to="/profile"
                  text="Invite Friends"
                  style="py-2 px-6 cursor-pointer text-center bg-blue text-white inline-block rounded-sm whitespace-nowrap"
                />
              </div>
            </div>
          </GlassCard>

          {/* FOOTER */}
          <div className="flex flex-col sm:flex-row gap-2 justify-between text-sm text-grey px-2 text-center sm:text-left">
            <span>{countdown}</span>

            <div className="flex gap-4 justify-center">
              <a href="#" className="hover:text-blue">
                Privacy Policy
              </a>

              <a href="#" className="hover:text-blue">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* <h1>hello world</h1> */}
      <TimerPop pop={true} />
      <FloatingDemoButton href="/quiz/demo" />
    </Layout>
  );
};

export default Page;
