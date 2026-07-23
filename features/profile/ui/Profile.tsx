"use client";
import Avatar from "@/components/ui/Avatar";
import GlassCard from "@/components/ui/cards/GlassCard";
import React from "react";
import { FaCheckCircle } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";
import {
  MdAccountBalanceWallet,
  MdEdit,
  MdGroups,
  MdPerson,
  MdStars,
} from "react-icons/md";
import ShareCard from "../cards/Share";
import { FaChartBar } from "react-icons/fa6";
import CustomCardChart from "@/components/ui/charts/Modbar";
import PrimaryButton from "@/components/ui/buttons/Primary";

const Profile = ({ user, rank, totalRewards, userRewardsArray }: any) => {
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
            icon="🔥"
            active={rank?.rankName === "Fresh Mind"}
            completed={true}
          />
          <StageCard
            title="Rising Star"
            subtitle={
              rank?.rankName === "Rising Star" ? "Achieved" : "Rising Star"
            }
            icon="⭐"
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
            icon="🛡️"
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
            icon="🏆"
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
            {userRewardsArray.length > 0 || totalRewards > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <p className="text-grey text-[10px] md:text-xs mb-1">
                      Total Rewards
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold text-(--primary)">
                      ₦0.00
                      {/* {totalRewards.toLocaleString()} */}
                    </h2>
                    <p className="text-green-400 text-[10px] md:text-xs mt-2 font-bold flex gap-1 items-center">
                      +15.4%{" "}
                      <span className="text-grey font-normal">
                        vs last month
                      </span>
                    </p>
                  </div>
                  <PrimaryButton
                    text="Redeem"
                    style="bg-blue text-white rounded-full px-8 py-2 md:py-3 w-full sm:w-auto"
                  />
                </div>

                <CustomCardChart />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-grey text-[10px] flex gap-2 items-center uppercase">
                      <MdStars className="text-orange-400" /> Quiz Winnings
                    </p>
                    <p className="text-xl font-bold text-(--primary) mt-1">
                      ₦0.00
                    </p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <p className="text-grey text-[10px] flex gap-2 items-center uppercase">
                      <MdGroups className="text-blue" /> Referral Earnings
                    </p>
                    <p className="text-xl font-bold text-(--primary) mt-1">
                      ₦0.00
                    </p>
                    <p className="text-[10px] text-blue mt-1">
                      ₦1000 per invite
                    </p>
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
          <ShareCard user={user} />

          {/* Quick Stats */}
          <GlassCard className="p-6">
            <h4 className="text-grey text-xs font-bold uppercase tracking-widest mb-6">
              Quick Stats
            </h4>
            <div className="flex flex-col gap-6">
              <StatRow
                icon={<FaCheckCircle className="text-green-500" />}
                label="Quizzes Completed"
                value={user?.details._count.quizHistory}
              />
              <StatRow
                icon={<MdGroups className="text-purple-500" />}
                label="Referrals"
                value={user?.referrals.length ?? 0}
              />
              {/* <StatRow
                icon={<LuLayoutDashboard className="text-orange-400" />}
                label="Avg. Rank"
                value="#42"
              /> */}
            </div>
          </GlassCard>
        </div>
      </div>
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
  value: string;
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
