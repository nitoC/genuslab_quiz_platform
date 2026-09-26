"use client";
import Avatar from "@/components/ui/Avatar";
import GlassCard from "@/components/ui/cards/GlassCard";
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  MdAccountBalanceWallet,
  MdEdit,
  MdErrorOutline,
  MdGroups,
  MdHistory,
  MdPerson,
  MdRefresh,
  MdStars,
} from "react-icons/md";
import ShareCard from "../cards/Share";
import { FaChartBar } from "react-icons/fa6";
import CustomCardChart from "@/components/ui/charts/Modbar";
import PrimaryButton from "@/components/ui/buttons/Primary";
import ReferralShare from "../cards/SocialShare";
import clsx from "clsx";
import { BiShield, BiStar, BiTrophy } from "react-icons/bi";
import { GiFlame } from "react-icons/gi";
import { useQuery } from "@tanstack/react-query";
import { getLastFiveRewards, getTotalRewards } from "@/lib/api/apis";

// Reward Item Interface matching your API response
interface RewardItem {
  id: string;
  value: string;
  createdAt: string;
  claimed: boolean;
  claimedAt: string | null;
  source: "QUIZ" | "REFERRAL" | string;
  attemptId: string | null;
  referralId: string | null;
  userDetailsId: string;
}

const Profile = ({ user, rank, totalRewards, userRewardsArray }: any) => {
  const [share, setShare] = useState(false);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["total-rewards", user?.details?.id],
    queryFn: async () => {
      const res = await getTotalRewards(user?.details?.id);
      return res.data;
    },
    enabled: !!user?.details?.id,
  });

  const handleShare = (val: boolean) => {
    setShare(val);
  };

  const rewardsList: RewardItem[] = data?.payload?.lastFive ?? [];

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (isError) {
    return (
      <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center min-h-[60vh]">
        <GlassCard className="p-8 max-w-md w-full border-red/20 bg-red/5 backdrop-blur-xl text-center flex flex-col items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-red/10 border border-red/20 flex items-center justify-center text-red">
            <MdErrorOutline size={30} />
          </div>
          <div>
            <h3 className="text-(--primary) font-bold text-lg mb-1">
              Unable to Load Rewards
            </h3>
            <p className="text-grey text-sm leading-relaxed">
              We encountered an issue fetching your profile rewards data. Please
              check your connection and try again.
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="mt-2 flex items-center gap-2 bg-white/10 hover:bg-white/15 text-(--primary) border border-white/10 text-sm px-5 py-2.5 rounded-lg transition-all duration-200"
          >
            <MdRefresh size={16} /> Retry
          </button>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-10">
      {/* RANK STAGES */}
      <div>
        <h3 className="text-(--primary) font-bold flex items-center gap-2 mb-4 text-sm md:text-base">
          <MdStars className="text-blue" /> Rank Stages
        </h3>
        <div className="flex scroll-hide md:grid md:grid-cols-4 gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar pb-2">
          <StageCard
            title="Fresh Mind"
            subtitle={rank?.rankName === "Fresh Mind" ? "Achieved" : "ongoing"}
            icon={<GiFlame color="#fff" />}
            active={rank?.rankName === "Fresh Mind"}
            completed={true}
          />
          <StageCard
            title="Rising Star"
            subtitle={
              rank?.rankName === "Rising Star" ? "Achieved" : "Rising Star"
            }
            icon={<BiStar color="#fff" />}
            active={rank?.rankName === "Rising Star"}
            completed={true}
          />
          <StageCard
            title="Aspiring Expert"
            subtitle={
              rank?.rankName === "Aspiring Expert"
                ? "Achieved"
                : "Aspiring Expert"
            }
            icon={<BiShield color="#fff" size={20} />}
            active={rank?.rankName === "Aspiring Expert"}
            completed={false}
          />
          <StageCard
            title="Knowledge Seeker"
            subtitle={
              rank?.rankName === "Knowledge Seeker"
                ? "Achieved"
                : "Knowledge Seeker"
            }
            icon={<BiTrophy color="#fff" size={20} />}
            active={rank?.rankName === "Knowledge Seeker"}
            completed={false}
          />
        </div>
      </div>

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: REWARDS & CHART (Col 8) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          <GlassCard className="p-8">
            {rewardsList.length > 0 || data?.payload?.total > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <p className="text-grey md:text-sm mb-1">Total Rewards</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-(--primary)">
                      ₦
                      {data?.payload?.total?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </h2>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-grey flex gap-2 items-center uppercase">
                      <MdStars className="text-blue" /> Quiz Winnings
                    </p>
                    <p className="text-xl font-bold text-(--primary) mt-1">
                      ₦
                      {data?.payload?.quiz?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-grey flex gap-2 items-center uppercase">
                      <MdGroups className="text-blue" /> Referral Earnings
                    </p>
                    <p className="text-xl font-bold text-(--primary) mt-1">
                      ₦
                      {data?.payload?.referral?.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                    <p className="text-blue mt-1">₦1000 per invite</p>
                  </div>
                </div>

                {/* RECENT REWARDS ACTIVITY (LAST 5 REWARDS) */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-grey text-sm font-bold uppercase tracking-widest flex items-center gap-2">
                      <MdHistory className="text-blue" size={16} /> Recent
                      Rewards (Last 5)
                    </p>
                  </div>

                  <div className="rounded-xl overflow-hidden">
                    {rewardsList.slice(0, 5).map((reward) => {
                      const isReferral = reward.source === "REFERRAL";
                      const amount = parseFloat(reward.value || "0");
                      const formattedDate = new Date(
                        reward.createdAt,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <div
                          key={reward.id}
                          className="p-3.5 flex items-center justify-between hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            {/* <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue">
                              {isReferral ? (
                                <MdGroups size={18} />
                              ) : (
                                <MdStars size={18} />
                              )}
                            </div> */}
                            <div>
                              <p className="text-sm font-bold text-(--primary)">
                                {isReferral
                                  ? "Referral Bonus"
                                  : "Quiz Event Prize"}
                              </p>
                              <p className="text-grey">{formattedDate}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-green">
                              +₦
                              {amount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                            <span className="text-[14px] uppercase tracking-wider text-grey">
                              {reward.claimed ? "Claimed" : "Unclaimed"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            ) : (
              /* EMPTY REWARDS ACCUMULATION PLACEHOLDER CARD */
              <div className="flex flex-col items-center justify-center text-center py-12 px-4 gap-4 min-h-[340px]">
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-grey opacity-60">
                  <FaChartBar size={24} className="text-blue" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-(--primary) font-bold text-lg">
                    No rewards accumulated yet
                  </h3>
                  <p className="text-sm text-grey max-w-sm mx-auto leading-relaxed">
                    Your completed tracks and performance settlement timelines
                    metrics update here. Participate in live events to earn
                    rewards.
                  </p>
                </div>
                <PrimaryButton
                  text="View Active Quizzes"
                  type="link"
                  to="/quizzes"
                  style="bg-blue text-white rounded-lg px-6 py-2 text-sm font-semibold mt-2"
                />
              </div>
            )}
          </GlassCard>
        </div>

        {/* RIGHT: INVITE & STATS (Col 4) */}
        <div className="lg:col-span-4 flex flex-col gap-8">
          {/* Invite Friends */}
          <ShareCard user={user} share={share} setShare={handleShare} />

          {/* Quick Stats */}
          <GlassCard className="p-6">
            <h4 className="text-grey text-sm font-bold uppercase tracking-widest mb-6">
              Quick Stats
            </h4>
            <div className="flex flex-col gap-6">
              <StatRow
                icon={<FaCheckCircle className="text-green" />}
                label="Quizzes Completed"
                value={user?.details?._count?.quizHistory}
              />
              <StatRow
                icon={<MdGroups className="text-blue" />}
                label="Referrals"
                value={user?.referrals?.length ?? 0}
              />
            </div>
          </GlassCard>
        </div>
      </div>

      <section
        aria-hidden={!share}
        className={clsx(
          "fixed inset-0 z-200 transition-opacity duration-300 ease-out",
          share
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        <div
          onClick={() => setShare(false)}
          className="absolute inset-0 bg-black/50"
        />
        <div
          className={clsx(
            "absolute inset-x-4 bottom-4 mx-auto max-w-2xl md:inset-x-auto md:right-20 xl:right-1/2 xl:translate-x-1/2 transition-transform duration-300 ease-out",
            share ? "translate-y-0" : "translate-y-8",
          )}
        >
          <GlassCard>
            <ReferralShare
              referralCode={user?.referralCode}
              baseUrl={user?.baseUrl}
              user={user}
              share={share}
              setShare={handleShare}
            />
          </GlassCard>
        </div>
      </section>
    </div>
  );
};

// Skeleton Loader Component matching layout structure
const ProfileSkeleton = () => (
  <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-10 animate-pulse">
    {/* Rank Stages Skeleton */}
    <div>
      <div className="h-5 w-28 bg-white/10 rounded mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-white/5 border border-white/5 h-20 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-lg bg-white/10 shrink-0" />
            <div className="flex flex-col gap-2 w-full">
              <div className="h-3 w-3/4 bg-white/10 rounded" />
              <div className="h-2 w-1/2 bg-white/5 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Main Content Grid Skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 flex flex-col gap-8">
        <GlassCard className="p-8 flex flex-col gap-6">
          <div className="h-3 w-20 bg-white/10 rounded" />
          <div className="h-10 w-48 bg-white/10 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 h-20 flex flex-col justify-between">
              <div className="h-3 w-24 bg-white/10 rounded" />
              <div className="h-6 w-32 bg-white/10 rounded" />
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/5 h-20 flex flex-col justify-between">
              <div className="h-3 w-24 bg-white/10 rounded" />
              <div className="h-6 w-32 bg-white/10 rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 w-full bg-white/5 rounded-xl" />
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-8">
        <GlassCard className="p-6 h-48">
          <div className="h-full w-full bg-white/5 rounded-xl" />
        </GlassCard>
        <GlassCard className="p-6 flex flex-col gap-4">
          <div className="h-4 w-28 bg-white/10 rounded" />
          <div className="h-10 w-full bg-white/5 rounded-xl" />
          <div className="h-10 w-full bg-white/5 rounded-xl" />
        </GlassCard>
      </div>
    </div>
  </div>
);

const StageCard = ({
  title,
  subtitle,
  icon,
  active,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  active: boolean;
  completed: boolean;
}) => (
  <div
    className={`p-4 rounded-xl border shrink-0 snap-start min-w-[220px] md:min-w-0 flex gap-4 items-center transition-all duration-300 ${
      active ? "bg-white/10 border-blue" : "bg-white/5 border-white/5"
    }`}
  >
    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-white/5">
      {icon}
    </div>
    <div>
      <h4
        className={`text-sm font-bold ${
          active ? "text-(--primary)" : "text-grey"
        }`}
      >
        {title}
      </h4>
      <p className="text-grey">{subtitle}</p>
    </div>
  </div>
);

const StatRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => (
  <div className="flex justify-between items-center">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-grey text-sm">{label}</span>
    </div>
    <span className="text-(--primary) font-bold text-sm">{value}</span>
  </div>
);

export default Profile;
