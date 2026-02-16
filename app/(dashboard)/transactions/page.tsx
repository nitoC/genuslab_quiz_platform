"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import { ReactNode } from "react";

import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import { FaCrown, FaTrophy, FaUniversity } from "react-icons/fa";
import { IoRefresh } from "react-icons/io5";
import { MdCardGiftcard } from "react-icons/md";

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
  const amountColor = type === "credit" ? "text-green-400" : "text-red-400";

  const statusStyles = {
    Completed: "text-green-400 bg-green-400/10",
    Processing: "text-yellow-400 bg-yellow-400/10",
    Failed: "text-red-400 bg-red-400/10",
  };

  return (
    <GlassCard>
      <div className="p-4 flex items-center justify-between">
        {/* Left */}
        <div className="flex gap-4 items-center flex-1">
          <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5">
            {icon}
          </div>

          <div>
            <h4 className="text-(--primary) font-semibold">{title}</h4>
            <p className="text-xs text-grey">{description}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex gap-4 flex-1 flex-wrap max-w-50 justify-between">
          <div className="flex flex-col gap-4 flex-1">
            <p className="text-xs text-(--primary)">{date}</p>

            <p className="text-grey text-xs">{time}</p>
          </div>
          <div className="text-right flex flex-col gap-1 flex-1">
            <p className={`font-semibold text-sm ${amountColor}`}>
              {type === "credit" ? "+" : "-"}
              {amount}
            </p>

            <span
              className={`text-[10px] px-2 py-1 rounded-full self-end ${statusStyles[status]}`}
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
      <div className="flex-2">
        <Header title="Transaction History" backBtn={false} />

        <div className="p-8 flex flex-col gap-8">
          {/* Page Intro */}
          <div>
            <h2 className="text-(--primary) dash-title">Transaction History</h2>
            <p className="text-grey text-sm">
              Manage and track your financial activities with precision.
            </p>
          </div>

          {/* Current Reward Card */}
          <GlassCard className="w-[280px]">
            <div className="p-6 flex flex-col gap-2">
              <p className="text-xs text-grey">Current reward</p>
              <h2 className="text-2xl font-bold text-(--primary)">₦756,000</h2>
              <span className="text-green-400 text-xs">● Active Reward</span>
            </div>
          </GlassCard>

          {/* Filters */}
          <div className="flex gap-4">
            {["All", "Subscription", "Rewards", "Withdrawals"].map((tab, i) => (
              <button
                key={i}
                className={`px-6 py-2 rounded-lg text-sm ${
                  i === 0
                    ? "bg-blue text-white"
                    : "bg-white/5 text-grey hover:bg-white/10"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search + Date */}
          <div className="flex gap-4">
            <input
              placeholder="Search transactions, IDs or categories..."
              className="flex-1 bg-white/5 rounded-lg px-4 py-3 text-sm outline-none text-(--primary)"
            />
            <button className="bg-white/5 px-4 py-3 rounded-lg text-sm text-grey">
              Oct 01 - Oct 31, 2025
            </button>
          </div>

          {/* Transactions List */}
          <div className="flex flex-col gap-4">
            <TransactionItem
              title="Premium Plan Upgrade"
              description="Transaction ID: #GEN-49023"
              date="Oct 26, 2025"
              time="10:30 AM"
              amount="45,000"
              type="debit"
              status="Completed"
              icon={<FaCrown className="text-blue-400" />}
            />

            <TransactionItem
              title="Episode 7 Reward"
              description="Challenge Completion Bonus"
              date="Oct 24, 2025"
              time="04:15 PM"
              amount="12,500"
              type="credit"
              status="Completed"
              icon={<FaTrophy className="text-green-400" />}
            />

            <TransactionItem
              title="Bank Payout"
              description="Redeem to GTBank ••••9201"
              date="Oct 22, 2025"
              time="08:00 AM"
              amount="150,000"
              type="debit"
              status="Processing"
              icon={<FaUniversity className="text-yellow-400" />}
            />

            <TransactionItem
              title="Basic Plan Renewal"
              description="Transaction ID: #GEN-45143"
              date="Oct 20, 2025"
              time="11:50 PM"
              amount="5,200"
              type="debit"
              status="Failed"
              icon={<IoRefresh className="text-red-400" />}
            />

            <TransactionItem
              title="Referral Bonus"
              description="New user onboarded via link"
              date="Oct 18, 2025"
              time="02:30 PM"
              amount="5,000"
              type="credit"
              status="Completed"
              icon={<MdCardGiftcard className="text-green-400" />}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TransactionsPage;
