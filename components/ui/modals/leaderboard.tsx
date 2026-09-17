"use client";

import React from "react";
import {
  MdClose,
  MdEmojiEvents,
  MdAccountBalanceWallet,
  MdHub,
  MdErrorOutline,
} from "react-icons/md";
import GlassBadge from "@/components/ui/GlassBadge";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-h-[90vh] scroll-hide max-w-lg bg-background-dark-secondary rounded-lg border border-white/10 p-8 relative overflow-x-hidden overflow-y-auto">
        {/* Header Actions */}
        <div className="flex justify-between items-center mb-2">
          <GlassBadge variant="info">Pioneer Status</GlassBadge>
          <button
            onClick={onClose}
            className="w-10 cursor-pointer h-10 rounded-full bg-white/5 flex items-center justify-center text-grey hover:text-(--primary) transition-colors"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Central Rank Icon */}
        <div className="flex flex-col items-center text-center mt-4 mb-8">
          <div className="w-20 h-20 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-2xl mb-6">
            {icon}
          </div>

          <h2 className="text-(--primary) text-2xl font-bold mb-2 tracking-tight">
            Rank {rank}: {title}
          </h2>
          <p className="text-grey text-sm leading-relaxed max-w-[320px]">
            This elite rank is currently locked. It is reserved for pioneers who
            push the boundaries of knowledge through exceptional platform
            engagement.
          </p>
        </div>

        {/* Requirement & Reward Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Requirement */}
          <div className="bg-white/5 border border-white/5 rounded-lg p-5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-yellow/10 flex items-center justify-center">
              <MdEmojiEvents className="text-yellow text-xl" />
            </div>
            <div>
              <p className="text-[14px] text-grey font-bold uppercase tracking-wider mb-1">
                Requirement
              </p>
              <p className="text-(--primary) font-bold text-lg">
                {requirementPoints} Points
              </p>
              <p className="text-[14px] text-grey leading-tight mt-1">
                Accumulate XP through daily quizzes and arena victories to
                qualify.
              </p>
            </div>
          </div>

          {/* Reward */}
          <div className="bg-white/5 border border-white/5 rounded-lg p-5 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-green/10 flex items-center justify-center">
              <MdAccountBalanceWallet className="text-green text-xl" />
            </div>
            <div>
              <p className="text-[14px] text-grey font-bold uppercase tracking-wider mb-1">
                Reward
              </p>
              <p className="text-green font-bold text-lg">₦{unlockReward}</p>
              <p className="text-[14px] text-grey leading-tight mt-1">
                Direct deposit to your linked bank account upon verification.
              </p>
            </div>
          </div>
        </div>

        {/* Unlock Status Banner */}
        <div className="bg-white/5 border border-white/5 rounded-lg p-5 mb-6 flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-blue/10 flex items-center justify-center flex-shrink-0">
            <MdHub className="text-blue text-xl" />
          </div>
          <div>
            <p className="text-[14px] text-grey font-bold uppercase tracking-wider mb-0.5">
              Current Status
            </p>
            <h4 className="text-(--primary) font-bold text-sm">
              {isZeroUnlocks
                ? "No user has unlocked this rank yet"
                : `users have unlocked this rank so no cash reward is currently available`}
            </h4>
            <p className="text-[14px] text-grey mt-1">
              Global competition in progress. Be the first to claim your throne.
            </p>
          </div>
        </div>

        {/* Rules of Engagement */}
        <div className="bg-yellow/5 border border-yellow/20 rounded-lg p-6">
          <div className="flex items-start gap-3">
            <MdErrorOutline size={24} className="text-yellow mt-0.5 shrink-0" />
            <div className="space-y-2">
              <h5 className="text-yellow text-sm font-bold uppercase tracking-widest">
                Rules of Engagement
              </h5>
              <p className="text-grey text-[14px] leading-relaxed">
                This rank and its associated cash reward are strictly limited.
                The prize can only be claimed by the{" "}
                <span className="text-(--primary) font-bold">
                  first individual
                </span>{" "}
                to reach the required point threshold. Once the first pioneer
                succeeds, the reward pool is permanently closed for this rank.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex items-center justify-end">
          <button className="text-blue text-sm font-bold hover:underline transition-all">
            Learn More about Ranks
          </button>
        </div>
      </div>
    </div>
  );
};

export default RankUnlockModal;
