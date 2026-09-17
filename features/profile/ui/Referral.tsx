"use client";

import React, { useState } from "react";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import GlassCard from "@/components/ui/cards/GlassCard";
import PrimaryButton from "@/components/ui/buttons/Primary";
import toast from "react-hot-toast";

// Icons
import {
  MdPerson,
  MdAccountBalanceWallet,
  MdGroups,
  MdContentCopy,
  MdArrowForward,
} from "react-icons/md";
import { FaCheckCircle, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { HiLockClosed } from "react-icons/hi";
import GlassBadge from "@/components/ui/GlassBadge";

import useUser from "@/hooks/useUser";
import { useQuery } from "@tanstack/react-query";
import { getReferrals } from "@/lib/api/apis";

// Interface reflecting the Prisma model
interface ReferralData {
  id: string;
  referrerId: string | null;
  email: string;
  name: string;
  verified: boolean;
  createdAt: string | Date;
}

const ReferralTabContent = ({ user }: { user: any }) => {
  const referralCode = user?.referralCode?.toUpperCase() || "GENUS-xxxx-2024";
  const totalEarnings = 25000; // Mocked or fetched from user data context
  const successfulInvites = user?.referrals.length;
  const targetInvites = 150;
  const progressPercentage = (successfulInvites / targetInvites) * 100;

  // Fetch referrals from backend
  const { data, isLoading, isError, error } = useQuery<ReferralData[]>({
    queryKey: ["get profile ref", user?.id],
    queryFn: async () => {
      const res = await getReferrals(5, 1, user?.id);
      console.log(res, "referrals");
      return res.data.payload;
    },
  });

  const handleCopyCode = (link?: boolean) => {
    if (link) {
      const baseUrl = window.location.origin;
      console.log(`${baseUrl + "/signup?"}ref=${referralCode}`);
      const refLink = `${baseUrl + "/signup?"}ref=${referralCode}`;
      navigator.clipboard.writeText(refLink);
      toast.success("Referral link copied to clipboard!");
    } else {
      navigator.clipboard.writeText(referralCode);
      toast.success("Referral code copied to clipboard!");
    }
  };

  // Safe fallback to an empty array when loading or empty
  const referralsList = data || [];

  // Helper function to extract up to 2 initials from names (e.g., "Michael Kalu" -> "MK")
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  // Helper function to format ISO DB string to readable date
  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* TOP SECTION: DASHBOARD BANNER & ACTION HERO */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Hero Panel */}
        <GlassCard className="lg:col-span-8 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-2">
            <span className="text-green text-sm font-bold uppercase tracking-wide">
              Referral Program
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-(--primary) tracking-tight">
              Earn rewards with your Network
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-white/5">
            <div>
              <p className="text-grey text-[14px] md:text-sm uppercase tracking-wider mb-1">
                Total Rewards
              </p>
              <p className="text-2xl md:text-3xl font-black text-(--primary)">
                ₦0.00
                {/* {totalEarnings.toLocaleString()} */}
              </p>
            </div>
            <div>
              <p className="text-grey text-[14px] md:text-sm uppercase tracking-wider mb-1">
                Successful Invites
              </p>
              <p className="text-2xl md:text-3xl font-black text-green">
                {successfulInvites}
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Right Code & Share Panel */}
        <GlassCard className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between gap-6">
          <div>
            <p className="text-grey text-sm text-center lg:text-left mb-3">
              Your Referral Code
            </p>
            <div className="bg-white/5 border border-white/5 rounded-xl px-4 py-3 flex justify-between items-center group hover:bg-white/10 transition-all">
              <span className="font-mono font-bold tracking-wider text-blue text-sm sm:text-base">
                {referralCode}
              </span>
              <button
                onClick={() => handleCopyCode()}
                className="text-grey hover:text-white transition-colors p-1"
                title="Copy Code"
              >
                <MdContentCopy size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full">
            <PrimaryButton
              handler={() => handleCopyCode(true)}
              text="Copy Link"
              style="bg-white text-black hover:bg-white/90 rounded-xl py-3 px-6 text-sm font-bold flex-1 flex justify-center items-center gap-2"
            />
            {/* <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 flex items-center justify-center text-grey hover:text-white transition-all">
              <FaTwitter size={18} className="text-blue-400" />
            </button>
            <button className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 flex items-center justify-center text-grey hover:text-white transition-all">
              <FaWhatsapp size={18} className="text-green-500" />
            </button> */}
          </div>
        </GlassCard>
      </div>

      {/* MIDDLE SECTION: BONUS MILESTONE PROGRESS */}
      {/* <BonusCard
        successfulInvites={successfulInvites}
        targetInvites={targetInvites}
        progressPercentage={progressPercentage}
      /> */}

      {/* BOTTOM SECTION: HISTORY DATATABLE / MOBILE LIST */}
      <GlassCard className="overflow-hidden">
        <div className="p-4 sm:p-6 flex justify-between items-center border-b border-white/5">
          <h3 className="text-base font-bold text-(--primary)">
            Referral History
          </h3>
          <button className="text-sm text-blue hover:underline flex items-center gap-1 font-semibold transition-all">
            View All <MdArrowForward />
          </button>
        </div>

        {/* Shared Async States UI handler */}
        {isLoading && (
          <div className="py-12 text-center text-sm text-grey">
            Loading referrals...
          </div>
        )}
        {isError && (
          <div className="py-12 text-center text-sm text-red">
            Failed to load referrals.
          </div>
        )}
        {!isLoading && !isError && referralsList.length === 0 && (
          <div className="py-12 text-center text-sm text-grey">
            No referrals found.
          </div>
        )}

        {!isLoading && !isError && referralsList.length > 0 && (
          <>
            {/* 1. MOBILE ONLY VIEW (Card Cards Stacked) */}
            <div className="block md:hidden divide-y divide-white/5">
              {referralsList.map((row) => (
                <div key={row.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[14px] text-blue shrink-0">
                        {getInitials(row.name)}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-(--primary) text-sm truncate">
                          {row.name}
                        </span>
                        <span className="text-[14px] text-grey/60 truncate">
                          {row.email}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`font-bold text-sm ${
                          row.verified ? "text-green" : "text-grey"
                        }`}
                      >
                        ₦{row.verified ? (1000).toFixed(2) : (0).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[14px] pt-1">
                    <span className="text-grey/60">
                      {formatDate(row.createdAt)}
                    </span>
                    <GlassBadge variant={row.verified ? "success" : "warning"}>
                      {row.verified ? "Successful" : "Pending"}
                    </GlassBadge>
                  </div>
                </div>
              ))}
            </div>

            {/* 2. TABLET & DESKTOP VIEW (Standard structural table) */}
            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 text-[14px] uppercase tracking-wider text-grey">
                    <th className="py-4 px-6 font-medium">User</th>
                    <th className="py-4 px-6 font-medium">Date Joined</th>
                    <th className="py-4 px-6 font-medium">Status</th>
                    <th className="py-4 px-6 font-medium text-right">
                      Reward Earned
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm">
                  {referralsList.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="py-4 px-6 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-[14px] text-blue">
                          {getInitials(row.name)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-(--primary)">
                            {row.name}
                          </span>
                          <span className="text-[14px] text-grey/60">
                            {row.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-grey/80">
                        {formatDate(row.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <GlassBadge
                          variant={row.verified ? "success" : "warning"}
                        >
                          {row.verified ? "Successful" : "Pending"}
                        </GlassBadge>
                      </td>
                      <td
                        className={`py-4 px-6 text-right font-bold ${
                          row.verified ? "text-green" : "text-grey"
                        }`}
                      >
                        ₦{row.verified ? (250).toFixed(2) : (0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </GlassCard>
    </div>
  );
};

const ManageReferralsPage = ({ user }: any) => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-10">
      <ReferralTabContent user={user} />
    </div>
  );
};

const BonusCard = ({
  successfulInvites,
  targetInvites,
  progressPercentage,
}: {
  successfulInvites: number;
  targetInvites: number;
  progressPercentage: number;
}) => {
  return (
    <GlassCard className="p-6 sm:p-8 space-y-6">
      <div className="flex justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-(--primary)">
            Bonus Milestone
          </h3>
          <p className="text-sm text-grey">
            Next Big Reward:{" "}
            <span className="text-white/40 line-through">₦50,000</span> Bonus
            Credit
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-blue tracking-wide">
            {successfulInvites} / {targetInvites}
          </p>
          <p className="text-[14px] text-grey">Invites to next goal</p>
        </div>
      </div>

      {/* Dynamic Progress Bar tracking */}
      <div className="space-y-4">
        <div className="w-full bg-white/5 h-3 rounded-full overflow-hidden p-[2px] border border-white/5">
          <div
            className="bg-gradient-to-r from-blue to-green-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progressPercentage, 100)}%` }}
          />
        </div>

        {/* Tier Map Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="flex items-center gap-2 text-[14px]">
            <FaCheckCircle className="text-green-500 shrink-0" size={14} />
            <span className="text-grey">Tier 1: 50 Invites</span>
          </div>
          <div className="flex items-center gap-2 text-[14px] md:justify-center">
            <IoMdInformationCircleOutline
              className="text-blue shrink-0"
              size={14}
            />
            <span className="text-(--primary) font-semibold">
              Tier 2: 150 Invites
            </span>
          </div>
          <div className="flex items-center gap-2 text-[14px] md:justify-end">
            <HiLockClosed className="text-grey shrink-0" size={14} />
            <span className="text-grey/60">Tier 3: 500 Invites</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ManageReferralsPage;
