"use client";

import React, { useMemo, useState } from "react";
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
  FaEnvelope,
} from "react-icons/fa";
import { HiOutlineTv } from "react-icons/hi2";
import { RiShieldUserLine } from "react-icons/ri";
import { LuFileKey2 } from "react-icons/lu";
import { useQuery } from "@tanstack/react-query";
import { getReferrals, updateProfileData } from "@/lib/api/apis";
import Link from "next/link";
import SubscriptionCard from "../cards/Subscripiton";
import GlassBadge from "@/components/ui/GlassBadge";

const AccountTabContent = ({ user }: any) => {
  const [loading, setLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.name,
    email: user?.email,
    phone: user?.phone,
  });

  console.log(user, "user");
  // const [isTwoFactorActive, setIsTwoFactorActive] = useState(true);
  const accounts = useMemo(() => {
    return {
      bank: user?.accounts?.find(
        (a: { type: string }) => a.type.toLowerCase() === "bank",
      ),
    };
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPersonalInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfileData({
        name: personalInfo.fullName,
        phone: personalInfo.phone,
      });
      toast.success("Personal information updated successfully!");
    } catch (err) {
      toast.error("something went wrong!");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 w-full items-start p-4 sm:p-6 lg:p-8">
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
              <label className="text-grey font-medium tracking-wide">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={personalInfo.fullName}
                onChange={handleInputChange}
                className="w-full bg-white/5 border border-white/5 focus:border-blue/50 rounded-xl px-4 py-3 text-sm text-(--primary) outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-grey font-medium tracking-wide">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                disabled={true}
                value={personalInfo.email}
                onChange={handleInputChange}
                className="w-full bg-white/5 cursor-not-allowed border border-white/5 focus:border-blue/50 rounded-xl px-4 py-3 text-sm text-(--primary) outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-grey font-medium tracking-wide">
              Phone Number
            </label>
            <input
              type="text"
              name="phone"
              value={personalInfo.phone}
              onChange={handleInputChange}
              className="w-full bg-white/5 border border-white/5 focus:border-blue/50 rounded-xl px-4 py-3 text-sm text-(--primary) outline-none transition-all"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="bg-blue hover:bg-blue/95 text-white text-sm font-bold py-3 px-6 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-blue/10"
            >
              <MdSave size={16} /> {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </GlassCard>

      {/* 2. SUBSCRIPTION PLAN CARD */}
      <GlassCard className="p-6 sm:p-8 flex flex-col justify-between gap-6 min-h-[315px]">
        <SubscriptionCard isSubscribed={user.isSubscribed ?? false} />
      </GlassCard>

      {/* 3. SECURITY & PRIVACY CARD */}
      {/* <GlassCard className="p-6 sm:p-8 flex flex-col gap-6"> */}
      {/* <div className="flex items-center gap-2 border-b border-white/5 pb-4">
          <RiShieldUserLine className="text-blue text-xl" />
          <h3 className="text-base font-bold text-(--primary)">Security</h3>
        </div> */}

      {/* <div className="space-y-4"> */}
      {/* Password Management Node */}
      {/* <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex justify-between items-center gap-4">
            <div className="space-y-0.5">
              <p className="text-sm font-bold text-(--primary)">
                Password Management
              </p>
              <p className="text-grey">Last changed 3 months ago</p>
            </div>
            <button
              onClick={() =>
                toast.loading("Redirecting to verification framework...")
              }
              className="text-blue hover:underline text-sm font-bold tracking-tight whitespace-nowrap"
            >
              Change Password
            </button>
          </div> */}

      {/* Two-Factor Toggle Node */}
      {/* <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex justify-between items-center gap-4"> */}
      {/* <div className="space-y-0.5">
              <p className="text-sm font-bold text-(--primary)">
                Two-Factor Authentication
              </p>
              <p className="text-grey">
                Add an extra layer of security
              </p>
            </div> */}

      {/* Custom Toggle Switch */}
      {/* <button
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
            </button> */}
      {/* </div>
        </div> */}
      {/* </GlassCard> */}

      {/* 4. LINKED ACCOUNTS CARD */}
      <GlassCard className="p-6 sm:p-8 flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <LuFileKey2 className="text-blue text-xl" />
            <h3 className="text-base font-bold text-(--primary)">
              Linked Accounts
            </h3>
          </div>
          <Link
            href="/accounts"
            className="text-blue hover:underline flex items-center gap-0.5 font-bold"
          >
            Add New <MdArrowForward size={12} />
          </Link>
        </div>

        <div className="flex flex-col gap-3">
          <LinkedAccountRow
            icon={<FaEnvelope className="text-grey" size={14} />}
            title="Email Account"
            subtitle={personalInfo.email}
            status="Linked"
          />
          {/*<LinkedAccountRow
            icon={<FaFacebook className="text-blue-500" size={14} />}
            title="Facebook"
            subtitle="Not connected"
            status="Connect"
          />*/}
          {accounts.bank && (
            <LinkedAccountRow
              icon={<FaUniversity className="text-grey/60" size={14} />}
              title={accounts.bank.provider}
              subtitle={`Payout ••••••${accounts.bank.providerAccountId.slice(6)}`}
              status="Linked"
              url={"/accounts"}
              hasUpdateAction={true}
            />
          )}

          {/* "Payout •••• 4291" */}
        </div>
      </GlassCard>
    </div>
  );
};

/* -----------------------------
 * SUB-COMPONENT HELPERS
 * ---------------------------- */

const LinkedAccountRow = ({
  icon,
  title,
  subtitle,
  status,
  hasUpdateAction = false,
  url,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  status: "Linked" | "Connect";
  hasUpdateAction?: boolean;
  url?: string;
}) => (
  <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-wrap justify-between items-center gap-3">
    <div className="flex items-center gap-3 min-w-0">
      <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-(--primary) shrink-0">
        {icon}
      </div>
      <div className="space-y-0.5 min-w-0">
        <p className="text-sm font-bold text-(--primary) truncate">{title}</p>
        <p className="text-grey/80 font-medium truncate">{subtitle}</p>
      </div>
    </div>

    <div className="flex items-center gap-3 shrink-0">
      {hasUpdateAction && url && (
        <Link
          href={url}
          className="text-blue hover:underline font-bold tracking-tight"
        >
          Update
        </Link>
      )}
      {status === "Linked" ? (
        <GlassBadge variant="success">Linked</GlassBadge>
      ) : (
        <button className="bg-blue text-white hover:bg-blue/90 px-3 py-1 rounded-lg text-xs font-bold tracking-wide transition-all shadow-sm">
          Connect
        </button>
      )}
    </div>
  </div>
);

export default AccountTabContent;
