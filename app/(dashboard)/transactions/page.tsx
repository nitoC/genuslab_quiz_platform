"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import { ReactNode } from "react";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import { FaCrown, FaTrophy, FaUniversity } from "react-icons/fa";
import { IoRefresh } from "react-icons/io5";
import { MdCardGiftcard, MdSearch, MdCalendarToday } from "react-icons/md";
import { cn } from "@/lib/utils/cn";

interface TransactionItemProps {
  title: string;
  description: string;
  date: string;
  time: string;
  amount: string;
  type: "credit" | "debit";
  status: "Completed" | "Processing" | "Failed";
  icon: ReactNode;
}

const TransactionItem = ({
  title,
  description,
  date,
  time,
  amount,
  type,
  status,
  icon,
}: TransactionItemProps) => {
  const isCredit = type === "credit";

  const statusStyles = {
    Completed: "text-emerald-400 bg-emerald-400/10",
    Processing: "text-amber-400 bg-amber-400/10",
    Failed: "text-rose-400 bg-rose-400/10",
  };

  return (
    <GlassCard className="transition-all hover:bg-white/[0.03]">
      <div className="p-4 md:p-5 flex items-center justify-between gap-3">
        {/* Left Section: Icon & Info */}
        <div className="flex gap-3 md:gap-4 items-center flex-1 min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-xl bg-white/5 border border-white/5">
            {icon}
          </div>

          <div className="min-w-0">
            <h4 className="text-white font-bold text-sm md:text-base truncate">
              {title}
            </h4>
            <p className="text-[10px] md:text-xs text-slate-500 truncate mt-0.5">
              {description}
            </p>
          </div>
        </div>

        {/* Right Section: Amount & Meta */}
        <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-8 shrink-0">
          {/* Hidden on very small mobile, visible on desktop/tablet */}
          <div className="hidden md:flex flex-col text-right">
            <p className="text-[11px] text-white font-medium">{date}</p>
            <p className="text-[10px] text-slate-500 uppercase">{time}</p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <p
              className={cn(
                "font-bold text-sm md:text-base",
                isCredit ? "text-emerald-400" : "text-rose-400",
              )}
            >
              {isCredit ? "+" : "-"}
              {amount}
            </p>
            <span
              className={cn(
                "text-[8px] md:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md",
                statusStyles[status],
              )}
            >
              {status}
            </span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

const TransactionsPage = () => {
  return (
    <Layout>
      <Header title="Transaction History" backBtn={false} />

      <main className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1200px] mx-auto">
        {/* Page Intro */}
        <div className="space-y-1">
          <h2 className="text-white text-xl md:text-2xl font-bold">
            Transaction History
          </h2>
          <p className="text-slate-500 text-xs md:text-sm">
            Manage and track your financial activities with precision.
          </p>
        </div>

        {/* Current Reward Card */}
        <GlassCard className="w-full md:w-[320px] bg-gradient-to-br from-blue-600/20 to-transparent border-blue-500/20">
          <div className="p-6 space-y-3">
            <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-widest">
              Current reward
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              ₦756,000
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-500 text-[10px] font-bold uppercase">
                Active Reward
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Filters & Actions Area */}
        <div className="space-y-4">
          {/* Scrollable Tabs for Mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {["All", "Subscription", "Rewards", "Withdrawals"].map((tab, i) => (
              <button
                key={i}
                className={cn(
                  "px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all",
                  i === 0
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : "bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search + Date Range */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-xl" />
              <input
                placeholder="Search transactions, IDs..."
                className="w-full bg-white/5 border border-white/5 rounded-xl pl-11 pr-4 py-3 text-sm outline-none text-white focus:border-blue-500/50 transition-colors"
              />
            </div>
            <button className="bg-white/5 border border-white/5 px-4 py-3 rounded-xl text-xs font-bold text-slate-400 flex items-center justify-center gap-2 hover:bg-white/10">
              <MdCalendarToday className="text-blue-500" />
              Oct 01 - Oct 31, 2025
            </button>
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-3">
          <TransactionItem
            title="Premium Plan Upgrade"
            description="ID: #GEN-49023"
            date="Oct 26, 2025"
            time="10:30 AM"
            amount="45,000"
            type="debit"
            status="Completed"
            icon={<FaCrown className="text-blue-400 text-lg" />}
          />

          <TransactionItem
            title="Episode 7 Reward"
            description="Challenge Completion Bonus"
            date="Oct 24, 2025"
            time="04:15 PM"
            amount="12,500"
            type="credit"
            status="Completed"
            icon={<FaTrophy className="text-emerald-400 text-lg" />}
          />

          <TransactionItem
            title="Bank Payout"
            description="Withdrawal to Bank Account"
            date="Oct 22, 2025"
            time="08:00 AM"
            amount="150,000"
            type="debit"
            status="Processing"
            icon={<FaUniversity className="text-amber-400 text-lg" />}
          />

          <TransactionItem
            title="Referral Bonus"
            description="5 New Users Joined"
            date="Oct 18, 2025"
            time="02:30 PM"
            amount="5,000"
            type="credit"
            status="Completed"
            icon={<MdCardGiftcard className="text-emerald-400 text-xl" />}
          />
        </div>
      </main>
    </Layout>
  );
};

export default TransactionsPage;
