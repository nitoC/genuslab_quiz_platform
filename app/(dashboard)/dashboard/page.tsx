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
import ProgressBar from "@/components/ui/ProgressBar";

// import useCountdown from "@/hooks/useCountdown";
// import { useTime } from "@/hooks/useTime";

import { getRankData, getTime, getUserProfile, getMostRecentReward, getMostRecentTransaction } from "@/lib/api/apis";
import getLocalStorage from "@/lib/utils/getLocalStorage";
import nameResolver from "@/lib/utils/nameResolver";

// import { useSocket } from "@/store/useSocket";

import { AiFillDollarCircle } from "react-icons/ai";
import { FaCheckCircle, FaTrophy } from "react-icons/fa";
import { IoIosRocket } from "react-icons/io";
import { MdStars } from "react-icons/md";
import useUser from "@/hooks/useUser";
import TimerPop from "@/features/quiz/components/TimerPop";
import { FloatingDemoButton } from "@/components/ui/buttons/FloatingDemo";

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
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <Skeleton className="w-32 h-8 rounded-full" />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-40" />
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
  const [rewards, setRewards] = useState<number>(0);
  const [currentPayout, setCurrentPayout] = useState<number>(0);

  /* -----------------------------
   * USER QUERY
   * ---------------------------- */
  const { data, isLoading, isError, error, userStore } = useUser();

  /* -----------------------------
   * REWARD & TRANSACTION QUERIES
   * ---------------------------- */
  const {
    data: mostRecentRewardData,
    isLoading: rewardLoading,
  } = useQuery({
    queryKey: ["mostRecentReward"],
    queryFn: async () => {
      const res = await getMostRecentReward();
      console.log(res?.data, "most recent reward data");
      return res?.data;
    },
  });

  const {
    data: mostRecentTransactionData,
    isLoading: transactionLoading,
  } = useQuery({
    queryKey: ["mostRecentTransaction"],
    queryFn: async () => {
      const res = await getMostRecentTransaction();
      console.log(res?.data, "most recent transaction data");
      return res?.data;
    },
  });

  /* Update rewards from most recent reward data */
  useEffect(() => {
    if (mostRecentRewardData?.amount) {
      setRewards(mostRecentRewardData.amount);
    }
  }, [mostRecentRewardData]);

  /* Update payout from most recent transaction data */
  useEffect(() => {
    if (mostRecentTransactionData?.amount) {
      setCurrentPayout(mostRecentTransactionData.amount);
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
    console.log(data?.user, "is error");
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

          {/* TOP ROW */}
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* PROFILE CARD */}
            <GlassCard className="flex-2">
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center">
                <div className="relative">
                  <Avatar
                    url={user?.details?.avatar}
                    size={96}
                    type="main"
                    color="border-orange-400"
                  />

                  <h6 className="text-orange-400 whitespace-nowrap py-2 px-4 rounded-full absolute -bottom-4 left-1/2 -translate-x-1/2 text-sm font-bold bg-[#0f127a] flex gap-2 items-center">
                    <MdStars size={15} />

                    {rank?.rankName || "Fresh Mind"}
                  </h6>
                </div>

                <div className="flex flex-2 p-2 sm:p-4 flex-col gap-3 w-full">
                  <div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <h3 className="text-(--primary) font-bold text-lg">
                        {userName}
                      </h3>

                      <span className="text-blue text-[14px] bg-blue/20 py-2 px-4 rounded-full">
                        Rank {rank?.rank || 0}
                      </span>
                    </div>

                    <p className="text-sm text-grey mt-2">
                      Mastering the Genius Quiz Challenge
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <h4 className="text-sm text-(--primary)">
                      Level {rank?.rank || 0} Progress
                    </h4>

                    <h4 className="text-blue text-sm">
                      {user?.details?.xp || 0}/{rank?.unlockXp || 0} XP
                    </h4>
                  </div>

                  <ProgressBar
                    value={user?.details?.xp || 0}
                    total={rank?.unlockXp || 1}
                    color="bg-linear-90 from-blue-400 to-teal-800/80"
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

                  <span className="text-yellow text-sm font-bold px-2 py-1 rounded-b-sm bg-yellow/10">
                    TOP 5%
                  </span>
                </div>

                {rewards > 0 ? (
                  <>
                    <div className="flex justify-center flex-1 items-center">
                      <ShieldIcon />
                    </div>

                    <div className="flex flex-col gap-2 items-center">
                      <h3 className="text-grey">Current Rewards</h3>

                      <h3 className="font-bold text-lg text-(--primary)">
                        ₦{rewards.toLocaleString()}
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
                    <span className="w-8 h-8 rounded-full text-purple-600 bg-purple-500/20 flex items-center justify-center">
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
                    <span className="text-green-400 text-sm font-bold">
                      DONE
                    </span>
                  ) : (
                    <span className="text-orange-400 text-sm font-bold">
                      PENDING
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center rounded-lg p-3">
                  <div className="flex gap-3 items-center">
                    <span className="w-8 h-8 rounded-full text-green bg-green-500/20 flex items-center justify-center">
                      <AiFillDollarCircle size={20} />
                    </span>

                    <p className="text-sm text-grey">Share Referral Link</p>
                  </div>

                  {hasSharedRef ? (
                    <span className="text-green-400 text-sm font-bold">
                      DONE
                    </span>
                  ) : (
                    <span className="text-orange-400 text-sm font-bold">
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

            {/* ONLINE QUIZ EVENT */}
            <GlassCard>
              <div className="p-6 flex flex-col gap-4 h-full">
                <h3 className="text-(--primary) font-semibold flex gap-2">
                  <FaTrophy className="text-orange-400" />
                  Online Quiz Event
                </h3>

                <div>
                  <h2 className="text-(--primary) font-bold text-xl">
                    ₦10,000
                  </h2>

                  <p className="text-grey text-sm">Reward</p>
                </div>

                <div className="flex gap-4 text-sm text-grey">
                  <span>10 Questions</span>

                  <span>5 mins left</span>
                </div>

                <PrimaryButton
                  type="link"
                  to={`/quiz/`}
                  text="Enter Now"
                  style="bg-green-500 text-white rounded-sm hover:bg-green-400 font-semibold disabled:opacity-50 disabled:pointer-events-none"
                />
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
                        ? "text-green-400"
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
                        xxxx-8329 GTBank PLC
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

                <p className="text-grey text-sm">
                  Get credited instantly for every friend you refer to Genuslab.
                </p>
              </div>

              <div className="flex gap-4 items-center">
                <span className="text-green-400 bg-green-400/10 px-4 py-2 rounded-full text-sm">
                  Bonus ₦1000
                </span>

                <PrimaryButton
                  type="link"
                  to="/profile"
                  text="Invite Friends"
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
