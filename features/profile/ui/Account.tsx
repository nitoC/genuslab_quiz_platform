"use client";

import React, { useState } from "react";
import GlassCard from "@/components/ui/cards/GlassCard";
import PrimaryButton from "@/components/ui/buttons/Primary";
import toast from "react-hot-toast";

// Icons
import {
  MdPerson,
  MdEmail,
  MdPhone,
  MdSave,
  MdSecurity,
  MdArrowForward,
} from "react-icons/md";
import {
  FaCheckCircle,
  FaGoogle,
  FaFacebook,
  FaUniversity,
} from "react-icons/fa";
import { HiOutlineTv } from "react-icons/hi2";
import { RiShieldUserLine } from "react-icons/ri";
import { LuFileKey2 } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { getReferrals } from "@/lib/api/apis";

const AccountTabContent = ({ user }: any) => {
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.name,
    email: user?.email,
    phone: user?.phone,
  });

  const [isTwoFactorActive, setIsTwoFactorActive] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Personal information updated successfully!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-start">
      {/* 1. PERSONAL INFORMATION CARD */}
      <GlassCard className="p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <MdPerson className="text-blue text-xl" />
          <h3 className="text-base font-bold text-(--primary)">
            Personal Information
          </h3>
        </div>

        <form onSubmit={handleSaveChanges} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-grey text-[11px] font-medium tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={personalInfo.fullName}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/5 focus:border-blue/50 rounded-xl px-4 py-3 text-xs text-(--primary) outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-grey text-[11px] font-medium tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={personalInfo.email}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/5 focus:border-blue/50 rounded-xl px-4 py-3 text-xs text-(--primary) outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-grey text-[11px] font-medium tracking-wide">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={personalInfo.phone}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/5 focus:border-blue/50 rounded-xl px-4 py-3 text-xs text-(--primary) outline-none transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-blue hover:bg-blue/95 text-white text-xs font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue/10"
            >
              <MdSave size={16} /> Save Changes
            </button>
          </div>
        </form>
      </GlassCard>

      {/* 2. SUBSCRIPTION PLAN CARD */}
      <GlassCard className="p-6 sm:p-8 flex flex-col justify-between gap-6 min-h-[315px]">
        <div>
          <div className="flex justify-between items-center border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <HiOutlineTv className="text-blue text-xl" />
              <h3 className="text-base font-bold text-(--primary)">
                Subscription Plan
              </h3>
            </div>
            <span className="bg-blue/10 border border-blue/20 text-blue text-[10px] font-bold px-3 py-1 rounded-full">
              Current Plan
            </span>
          </div>

          <div className="mt-5 bg-white/[0.02] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue/5 blur-[50px] rounded-full -mr-10 -mt-10" />

            <div className="flex items-baseline gap-1">
              <h4 className="text-2xl font-black text-(--primary)">
                Free Tier
              </h4>
              <span className="text-grey text-xs font-medium">$0/month</span>
            </div>

            <p className="text-[11px] text-grey font-bold mt-4 mb-3 tracking-wide uppercase">
              Active Benefits
            </p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              <BenefitItem active={true} text="10 Daily Quizzes" />
              <BenefitItem active={true} text="Global Leaderboard" />
              <BenefitItem active={false} text="Unlimited Quizzes" />
              <BenefitItem active={false} text="Double XP Boost" />
            </div>
          </div>
        </div>

        <PrimaryButton
          text="Upgrade Plan"
          style="bg-blue text-white hover:bg-blue/90 rounded-xl py-3.5 w-full text-xs font-bold tracking-wide flex justify-center items-center gap-2 mt-auto"
        />
      </GlassCard>

      {/* 3. SECURITY & PRIVACY CARD */}
      <GlassCard className="p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <RiShieldUserLine className="text-blue text-xl" />
          <h3 className="text-base font-bold text-(--primary)">Security</h3>
        </div>

        <div className="space-y-4">
          {/* Password Management Node */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex justify-between items-center gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-(--primary)">
                Password Management
              </p>
              <p className="text-[11px] text-grey">Last changed 3 months ago</p>
            </div>
            <button
              onClick={() =>
                toast.loading("Redirecting to verification framework...")
              }
              className="text-blue hover:underline text-xs font-bold tracking-tight whitespace-nowrap"
            >
              Change Password
            </button>
          </div>

          {/* Two-Factor Toggle Node */}
          <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex justify-between items-center gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-(--primary)">
                Two-Factor Authentication
              </p>
              <p className="text-[11px] text-grey">
                Add an extra layer of security
              </p>
            </div>

            {/* Custom Toggle Switch */}
            <button
              type="button"
              onClick={() => setIsTwoFactorActive(!isTwoFactorActive)}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors duration-200 ease-in-out outline-none ${
                isTwoFactorActive ? "bg-blue" : "bg-white/10"
              }`}
            >
              <div
                className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                  isTwoFactorActive ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </GlassCard>

      {/* 4. LINKED ACCOUNTS CARD */}
      <GlassCard className="p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <LuFileKey2 className="text-blue text-xl" />
            <h3 className="text-base font-bold text-(--primary)">
              Linked Accounts
            </h3>
          </div>
          <button className="text-[11px] text-blue hover:underline flex items-center gap-0.5 font-bold">
            Add New <MdArrowForward size={12} />
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <LinkedAccountRow
            icon={<FaGoogle className="text-orange-500" size={14} />}
            title="Google Account"
            subtitle="jane.doe@gmail.com"
            status="Linked"
          />
          <LinkedAccountRow
            icon={<FaFacebook className="text-blue-500" size={14} />}
            title="Facebook"
            subtitle="Not connected"
            status="Connect"
          />
          <LinkedAccountRow
            icon={<FaUniversity className="text-grey/60" size={14} />}
            title="GTBank PLC"
            subtitle="Payout •••• 4291"
            status="Linked"
            hasUpdateAction={true}
          />
        </div>
      </GlassCard>
    </div>
  );
};

/* -----------------------------
 * SUB-COMPONENT HELPERS
 * ---------------------------- */

const BenefitItem = ({ active, text }: { active: boolean; text: string }) => (
  <div
    className={`flex items-center gap-2 text-[11px] ${active ? "text-(--primary)" : "text-grey/40"}`}
  >
    <FaCheckCircle
      className={`shrink-0 ${active ? "text-green-500" : "text-grey/20"}`}
      size={12}
    />
    <span className={!active ? "line-through opacity-80" : "font-medium"}>
      {text}
    </span>
  </div>
);

const LinkedAccountRow = ({
  icon,
  title,
  subtitle,
  status,
  hasUpdateAction = false,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  status: "Linked" | "Connect";
  hasUpdateAction?: boolean;
}) => (
  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex justify-between items-center gap-4">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-white">
        {icon}
      </div>
      <div className="space-y-0.5">
        <p className="text-xs font-bold text-(--primary)">{title}</p>
        <p className="text-[11px] text-grey/80 font-medium">{subtitle}</p>
      </div>
    </div>

    <div className="flex items-center gap-3">
      {hasUpdateAction && (
        <button className="text-blue hover:underline text-[11px] font-bold tracking-tight">
          Update
        </button>
      )}
      <span
        className={`px-3 py-1 rounded-lg text-[10px] font-bold tracking-wide transition-all select-none ${
          status === "Linked"
            ? "bg-green-500/10 text-green-400 border border-green-500/10"
            : "bg-blue text-white hover:bg-blue/90 cursor-pointer shadow-sm"
        }`}
      >
        {status}
      </span>
    </div>
  </div>
);

export default AccountTabContent;
