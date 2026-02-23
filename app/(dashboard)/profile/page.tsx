"use client";

import React from "react";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import Avatar from "@/components/ui/Avatar";
import GlassCard from "@/components/ui/cards/GlassCard";
import PrimaryButton from "@/components/ui/buttons/Primary";
import CustomCardChart from "@/components/ui/charts/Modbar";
import {
  MdEdit,
  MdStars,
  MdContentCopy,
  MdPerson,
  MdAccountBalanceWallet,
  MdGroups,
} from "react-icons/md";
import { FaCheckCircle } from "react-icons/fa";
import { LuLayoutDashboard } from "react-icons/lu";

const ProfilePage = () => {
  return (
    <Layout>
      <Header title="Profile" backBtn={false} />

      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-10">
        {/* HEADER SECTION - Glass Profile Banner */}
        <GlassCard className="overflow-hidden">
          <div className="relative p-6 sm:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue/10 blur-[100px] rounded-full -mr-20 -mt-20 hidden md:block" />

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 z-10">
              <div className="relative">
                <Avatar
                  size={80}
                  type="main"
                  color="border-blue"
                  className="md:w-[100px] md:h-[100px]"
                />
                <span className="absolute bottom-1 right-1 bg-green-500 p-1 rounded-full border-2 border-[#0a121f]">
                  <FaCheckCircle className="text-white text-[8px] md:text-[10px]" />
                </span>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-xl md:text-2xl font-bold text-(--primary)">
                  Jane Doe
                </h1>
                <div className="flex flex-col md:flex-row items-center md:justify-start gap-2 md:gap-3 mt-2">
                  <span className="text-blue bg-blue/20 px-4 py-1 rounded-full text-[10px] md:text-xs font-bold">
                    Level 15 — Quiz Overlord
                  </span>
                  <span className="text-grey text-[10px] md:text-xs">
                    Rank: 435 Global
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-row items-center gap-4 md:gap-6 z-10 w-full md:w-auto justify-center md:justify-end">
              <button className="bg-white/5 hover:bg-white/10 text-grey text-[10px] md:text-xs py-2 px-6 rounded-full border border-white/10 flex gap-2 items-center transition-all">
                <MdEdit /> Edit Profile
              </button>

              <div className="relative w-12 h-12 md:w-16 md:h-16 border-4 border-white/5 rounded-full flex items-center justify-center">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue border-t-transparent rounded-full -rotate-45" />
                <span className="text-[10px] md:text-xs font-bold text-(--primary) text-center leading-tight">
                  752 <br />
                  <span className="text-[6px] md:text-[8px] text-grey">XP</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tab Navigation - Scrollable on mobile */}
          <div className="flex border-t border-white/5 px-4 md:px-6 overflow-x-auto no-scrollbar whitespace-nowrap">
            <button className="px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold text-(--primary) border-b-2 border-blue flex gap-2 items-center shrink-0">
              <MdPerson /> Profile
            </button>
            <button className="px-4 md:px-6 py-4 text-[10px] md:text-xs text-grey flex gap-2 items-center hover:text-white transition-all shrink-0">
              <MdAccountBalanceWallet /> Account
            </button>
            <button className="px-4 md:px-6 py-4 text-[10px] md:text-xs text-grey flex gap-2 items-center hover:text-white transition-all shrink-0">
              <MdGroups /> Referral
            </button>
          </div>
        </GlassCard>

        {/* RANK STAGES */}
        <div>
          <h3 className="text-(--primary) font-bold flex items-center gap-2 mb-4 text-sm md:text-base">
            <MdStars className="text-blue" /> Rank Stages
          </h3>
          <div className="flex scroll-hide md:grid md:grid-cols-4 gap-4 overflow-x-auto no-scrollbar pb-2">
            <StageCard
              title="Fresh Mind"
              subtitle="Starter Badge"
              icon="🔥"
              active={false}
              completed={true}
            />
            <StageCard
              title="Rising Star"
              subtitle="Achieved"
              icon="⭐"
              active={false}
              completed={true}
            />
            <StageCard
              title="Aspiring Expert"
              subtitle="In Progress"
              icon="🛡️"
              active={true}
              completed={false}
            />
            <StageCard
              title="Studio Champion"
              subtitle="Locked"
              icon="🏆"
              active={false}
              completed={false}
            />
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT: REWARDS & CHART (Col 8) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <GlassCard className="p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div>
                  <p className="text-grey text-[10px] md:text-xs mb-1">
                    Total Rewards
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold text-(--primary)">
                    ₦756,000
                  </h2>
                  <p className="text-green-400 text-[10px] md:text-xs mt-2 font-bold flex gap-1 items-center">
                    +15.4%{" "}
                    <span className="text-grey font-normal">vs last month</span>
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
                    ₦450,000
                  </p>
                </div>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-grey text-[10px] flex gap-2 items-center uppercase">
                    <MdGroups className="text-blue" /> Referral Earnings
                  </p>
                  <p className="text-xl font-bold text-(--primary) mt-1">
                    ₦306,000
                  </p>
                  <p className="text-[10px] text-blue mt-1">₦250 per invite</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* RIGHT: INVITE & STATS (Col 4) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Invite Friends */}
            <GlassCard className="p-8 flex flex-col items-center text-center gap-4">
              <div className="w-12 h-12 bg-blue/20 rounded-full flex items-center justify-center">
                <MdGroups className="text-blue text-xl" />
              </div>
              <div>
                <h3 className="text-(--primary) font-bold">Invite Friends</h3>
                <p className="text-grey text-xs mt-2">
                  Earn ₦250 for every friend who joins using your unique code.
                </p>
              </div>
              <div className="w-full bg-white/5 p-3 rounded-lg flex justify-between items-center border border-white/5">
                <span className="text-blue text-[10px] font-mono">
                  GENUS-JANE-2024
                </span>
                <MdContentCopy className="text-grey cursor-pointer hover:text-white" />
              </div>
              <PrimaryButton
                text="Share Link"
                style="w-full bg-white rounded-sm text-black font-bold"
              />
            </GlassCard>

            {/* Quick Stats */}
            <GlassCard className="p-6">
              <h4 className="text-grey text-xs font-bold uppercase tracking-widest mb-6">
                Quick Stats
              </h4>
              <div className="flex flex-col gap-6">
                <StatRow
                  icon={<FaCheckCircle className="text-green-500" />}
                  label="Quizzes Completed"
                  value="128"
                />
                <StatRow
                  icon={<MdGroups className="text-purple-500" />}
                  label="Referrals"
                  value="1,224"
                />
                <StatRow
                  icon={<LuLayoutDashboard className="text-orange-400" />}
                  label="Avg. Rank"
                  value="#42"
                />
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </Layout>
  );
};

// Helper Components for clean code
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

export default ProfilePage;
