"use client";

import React from "react";
import {
  MdClose,
  MdEmojiEvents,
  MdAccountBalanceWallet,
  MdHub,
  MdErrorOutline,
  MdVerified,
} from "react-icons/md";
import { cn } from "@/lib/utils/cn";

interface RankModalProps {
  icon: React.ReactElement;
  rank: string | number;
  title: string;

  requirementPoints: string | number;
  unlockReward: string | number;
  unlockStatus: string | number; // e.g., "No user has unlocked..." or 5000
  onClose: () => void;
}

const RankUnlockModal = ({
  icon,
  rank,
  requirementPoints,
  unlockReward,
  title,
  unlockStatus,
  onClose,
}: RankModalProps) => {
  const isZeroUnlocks =
    unlockStatus === 0 ||
    unlockStatus === "0" ||
    unlockStatus === "locked" ||
    (typeof unlockStatus === "string" && unlockStatus.includes("No user"));
  // absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/90 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-h-[90vh] scroll-hide max-w-lg bg-[#0b1224] rounded-[40px] border border-blue-500/30 p-8 relative overflow-x-hidden shadow-[0_0_50px_rgba(30,58,138,0.3)]">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border">
            <MdVerified className="text-blue-400 text-sm" />
            <span className="text-[14px] text-blue-300 font-black uppercase tracking-widest">
              Pioneer Status
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-10 cursor-pointer h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
          >
            <MdClose size={20} className="cursor-pointer" />
          </button>
        </div>

        {/* Central Rank Icon (Diamond Shape) */}
        <div className="flex flex-col items-center text-center mt-4 mb-8">
          <div className="relative mb-6">
            <div className="w-32 h-32 bg-slate-400/20 rounded-[32px] rotate-45 flex items-center justify-center border border-white/10 shadow-inner">
              <div className="text-white text-6xl drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
              {icon}{" "}
            </div>
          </div>

          <h2 className="text-white text-3xl font-black mb-2 tracking-tight">
            Rank {rank}: {title}
          </h2>
          <p className="text-slate-500 text-sm leading-relaxed max-w-[320px] font-medium">
            This elite rank is currently locked. It is reserved for pioneers who
            push the boundaries of knowledge through exceptional platform
            engagement.
          </p>
        </div>

        {/* Requirement & Reward Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Requirement */}
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <MdEmojiEvents className="text-amber-500 text-xl" />
            </div>
            <div>
              <p className="text-[14px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                Requirement
              </p>
              <p className="text-white font-black text-lg">
                {requirementPoints} Points
              </p>
              <p className="text-[14px] text-slate-500 leading-tight mt-1">
                Accumulate XP through daily quizzes and arena victories to
                qualify.
              </p>
            </div>
          </div>

          {/* Reward */}
          <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <MdAccountBalanceWallet className="text-emerald-500 text-xl" />
            </div>
            <div>
              <p className="text-[14px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                Reward
              </p>
              <p className="text-emerald-500 font-black text-lg">
                ₦{unlockReward}
              </p>
              <p className="text-[14px] text-slate-500 leading-tight mt-1">
                Direct deposit to your linked bank account upon verification.
              </p>
            </div>
          </div>
        </div>

        {/* Unlock Status Banner */}
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-5 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <MdHub className="text-blue-500 text-xl" />
          </div>
          <div>
            <p className="text-[14px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
              Current Status
            </p>
            <h4 className="text-white font-bold text-sm">
              {isZeroUnlocks
                ? "No user has unlocked this rank yet"
                : `users have unlocked this rank so no cash reward is currently available`}
            </h4>
            <p className="text-[14px] text-slate-500 mt-1">
              Global competition in progress. Be the first to claim your throne.
            </p>
          </div>
        </div>

        {/* Rules of Engagement Box */}
        <div className="bg-amber-500/[0.03] border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden group">
          {/* <div className="absolute top-0 left-0 w-1 h-full bg-amber-500/40" /> */}
          <div className="flex items-start gap-3">
            <MdErrorOutline className="text-amber-500 text-xl mt-0.5" />
            <div className="space-y-2">
              <h5 className="text-amber-500 text-sm font-black uppercase tracking-widest">
                Rules of Engagement
              </h5>
              <p className="text-slate-400 text-[14px] leading-relaxed">
                This rank and its associated cash reward are strictly limited.
                The prize can only be claimed by the{" "}
                <span className="text-white font-bold">first individual</span>{" "}
                to reach the required point threshold. Once the first pioneer
                succeeds, the reward pool is permanently closed for this rank.
              </p>
            </div>
          </div>
        </div>

        {/* Footer Toggle */}
        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-5 bg-blue-600 rounded-full relative p-1 cursor-pointer">
              <div className="w-3 h-3 bg-white rounded-full ml-auto" />
            </div>
            <span className="text-slate-300 text-sm font-bold">
              Notify me on unlock
            </span>
          </div>
          <button className="text-blue-400 text-sm font-bold hover:underline transition-all">
            Learn More about Ranks
          </button>
        </div>

        {/* Background Glows */}
        {/* <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full" /> */}
      </div>
    </div>
  );
};

export default RankUnlockModal;
