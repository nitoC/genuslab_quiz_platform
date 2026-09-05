"use client";
import Avatar from "@/components/ui/Avatar";
import GlassCard from "@/components/ui/cards/GlassCard";
import React, { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  MdAccountBalanceWallet,
  MdEdit,
  MdGroups,
  MdHistory,
  MdPerson,
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
  const { data, isLoading, isError } = useQuery({
    queryKey: ["total-rewards", user?.details?.id],
    queryFn: async () => {
      const res = await getTotalRewards(user?.details?.id);
      console.log(res, "total rewards");
      return res.data;
    },
    enabled: !!user?.details?.id,
  });

  const handleShare = (val: boolean) => {
    setShare(val);
  };

  const rewardsList: RewardItem[] = data?.payload.lastFive ?? [];

  // Derived earnings calculations directly from real payload data
  // const quizEarnings = rewardsList
  //   .filter((r) => r.source === "QUIZ")
  //   .reduce((sum, r) => sum + parseFloat(r.value || "0"), 0);

  // const referralEarnings = rewardsList
  //   .filter((r) => r.source === "REFERRAL")
  //   .reduce((sum, r) => sum + parseFloat(r.value || "0"), 0);

  // const grandTotal = totalRewards ?? quizEarnings + referralEarnings;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-(--primary) text-lg">Loading...</p>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">Error fetching data.</p>
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
        <div className="flex scroll-hide md:grid md:grid-cols-4 gap-4 overflow-x-auto no-scrollbar pb-2">
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
                    <p className="text-grey text-[10px] md:text-xs mb-1">
                      Total Rewards
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-(--primary)">
                      ₦
                      {data &&
                        data?.payload &&
                        data?.payload.total.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                    </h2>
                    {/* <p className="text-green-400 text-[10px] md:text-xs mt-2 font-bold flex gap-1 items-center">
                      +15.4%{" "}
                      <span className="text-grey font-normal">vs last</span>
                    </p> */}
                  </div>
                </div>

                {/* <CustomCardChart data={rewardsList} /> */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-grey text-[10px] flex gap-2 items-center uppercase">
                      <MdStars className="text-orange-400" /> Quiz Winnings
                    </p>
                    <p className="text-xl font-bold text-(--primary) mt-1">
                      ₦
                      {data &&
                        data?.payload &&
                        data?.payload?.quiz.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-grey text-[10px] flex gap-2 items-center uppercase">
                      <MdGroups className="text-blue" /> Referral Earnings
                    </p>
                    <p className="text-xl font-bold text-(--primary) mt-1">
                      ₦
                      {data &&
                        data?.payload &&
                        data?.payload?.referral.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                    </p>
                    <p className="text-[10px] text-blue mt-1">
                      ₦1000 per invite
                    </p>
                  </div>
                </div>

                {/* RECENT REWARDS ACTIVITY (LAST 5 REWARDS) */}
                <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-3">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-grey text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <MdHistory className="text-blue" size={16} /> Recent
                      Rewards (Last 5)
                    </p>
                  </div>

                  <div className=" rounded-xl overflow-hidden">
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
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue">
                              {isReferral ? (
                                <MdGroups size={18} />
                              ) : (
                                <MdStars
                                  size={18}
                                  className="text-orange-400"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-(--primary)">
                                {isReferral
                                  ? "Referral Bonus"
                                  : "Quiz Event Prize"}
                              </p>
                              <p className="text-[10px] text-grey">
                                {formattedDate}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-green-400">
                              +₦
                              {amount.toLocaleString("en-US", {
                                minimumFractionDigits: 2,
                              })}
                            </p>
                            <span className="text-[9px] uppercase tracking-wider text-grey">
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
                  <p className="text-xs text-grey max-w-sm mx-auto leading-relaxed">
                    Your completed tracks and performance settlement timelines
                    metrics update here. Participate in live events to earn
                    rewards.
                  </p>
                </div>
                <PrimaryButton
                  text="View Active Quizzes"
                  type="link"
                  to="/quizzes"
                  style="bg-blue text-white rounded-full px-6 py-2 text-xs font-semibold mt-2"
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
            <h4 className="text-grey text-xs font-bold uppercase tracking-widest mb-6">
              Quick Stats
            </h4>
            <div className="flex flex-col gap-6">
              <StatRow
                icon={<FaCheckCircle className="text-green-500" />}
                label="Quizzes Completed"
                value={user?.details?._count?.quizHistory}
              />
              <StatRow
                icon={<MdGroups className="text-purple-500" />}
                label="Referrals"
                value={user?.referrals?.length ?? 0}
              />
            </div>
          </GlassCard>
        </div>
      </div>
      <section
        className={clsx(
          share ? "fixed inset-0 z-200 overflow-hidden" : "hidden z-3",
        )}
      >
        {share && (
          <div
            onClick={() => setShare(false)}
            className="bg-black/50 isolate z-2 absolute inset-0"
          ></div>
        )}
        <div
          className={clsx(
            "absolute max-w-250 w-full isolate md:right-20 xl:translate-x-[50%] xl:right-[50%] z-3 duration-300",
            !share ? "-bottom-250" : "-bottom-2 md:bottom-2.5",
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

const StageCard = ({
  title,
  subtitle,
  icon,
  active,
  completed,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  active: boolean;
  completed: boolean;
}) => (
  <div
    className={`p-4 rounded-xl border shrink-0 flex gap-4 items-center transition-all ${active ? "bg-white/10 border-blue" : "bg-white/5 border-white/5"}`}
  >
    <div
      className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl bg-white/5`}
    >
      {icon}
    </div>
    <div>
      <h4
        className={`text-xs font-bold ${active ? "text-(--primary)" : "text-grey"}`}
      >
        {title}
      </h4>
      <p className="text-[10px] text-grey">{subtitle}</p>
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
      <span className="text-grey text-xs">{label}</span>
    </div>
    <span className="text-(--primary) font-bold text-sm">{value}</span>
  </div>
);

export default Profile;
