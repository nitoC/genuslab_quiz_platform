"use client";

import React, { useMemo, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import toast from "react-hot-toast";
import { updateProfileData } from "@/lib/api/apis";
import PrimaryButton from "@/components/ui/buttons/Primary";

import {
  MdPerson,
  MdSave,
  MdAccountBalance,
  MdCardMembership,
  MdArrowForward,
  MdVerified,
} from "react-icons/md";
import {
  FaUniversity,
  FaEnvelope,
  FaCheckCircle,
  FaCrown,
} from "react-icons/fa";
import GlassCard from "@/components/ui/cards/GlassCard";

type TabId = "account" | "bank" | "subscription";

const TABS: { id: TabId; label: string; description: string; icon: any }[] = [
  {
    id: "account",
    label: "Account",
    description: "Update your personal details",
    icon: MdPerson,
  },
  {
    id: "bank",
    label: "Linked Accounts",
    description: "Manage payout & linked accounts",
    icon: MdAccountBalance,
  },
  {
    id: "subscription",
    label: "Subscription",
    description: "Plan, billing & upgrades",
    icon: MdCardMembership,
  },
];

const SettingsView = ({ user }: { user: any }) => {
  const [activeTab, setActiveTab] = useState<TabId>("account");

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-(--primary)">
          Settings
        </h1>
        <p className="text-grey text-sm mt-1">
          Manage your account information, payout methods, and subscription.
        </p>
      </div>

      <GlassCard>
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden lg:flex">
          {/* Vertical tab rail */}
          <nav className="lg:w-72 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 p-3 lg:p-5">
            <div className="flex lg:flex-col gap-1.5 overflow-x-auto no-scrollbar">
              {TABS.map(({ id, label, description, icon: Icon }) => {
                const active = activeTab === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className={clsx(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-left shrink-0 transition-all duration-200 border",
                      active
                        ? "bg-blue/10 border-blue/20 text-blue"
                        : "border-transparent text-grey hover:bg-white/5 hover:text-(--primary)",
                    )}
                  >
                    <span
                      className={clsx(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        active ? "bg-blue text-white" : "bg-white/5 text-grey",
                      )}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="hidden sm:block">
                      <span className="block text-sm font-bold leading-tight">
                        {label}
                      </span>
                      <span
                        className={clsx(
                          "block text-[13px] font-medium leading-tight mt-0.5",
                          active ? "text-blue/70" : "text-grey/60",
                        )}
                      >
                        {description}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Content pane */}
          <div className="flex-1 min-w-0 p-6 sm:p-8">
            {activeTab === "account" && <AccountSection user={user} />}
            {activeTab === "bank" && <LinkedAccountsSection user={user} />}
            {activeTab === "subscription" && (
              <SubscriptionSection user={user} />
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

/* -----------------------------------------------------------------
 * ACCOUNT — edit personal information
 * ---------------------------------------------------------------- */
const AccountSection = ({ user }: any) => {
  const [loading, setLoading] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    fullName: user?.name,
    email: user?.email,
    phone: user?.phone,
  });

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
    <form onSubmit={handleSaveChanges}>
      <SectionHeader
        title="Personal Information"
        subtitle="This is how you'll appear across Genus Lab."
        action={
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-blue px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue/90 disabled:opacity-50"
          >
            <MdSave size={14} /> {loading ? "Saving..." : "Save Changes"}
          </button>
        }
      />

      <div className="mt-8 space-y-6 max-w-xl">
        <FieldRow
          label="Full Name"
          name="fullName"
          value={personalInfo.fullName}
          onChange={handleInputChange}
        />
        <FieldRow
          label="Email Address"
          name="email"
          type="email"
          disabled
          value={personalInfo.email}
          onChange={handleInputChange}
          badge={
            <span className="flex items-center gap-1 text-[12px] font-bold text-emerald-400">
              <MdVerified size={12} /> Verified
            </span>
          }
        />
        <FieldRow
          label="Phone Number"
          name="phone"
          value={personalInfo.phone}
          onChange={handleInputChange}
        />
      </div>
    </form>
  );
};

const FieldRow = ({
  label,
  badge,
  ...inputProps
}: {
  label: string;
  badge?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-6 sm:items-center border-b border-white/5 pb-5">
    <div className="flex items-center gap-2">
      <label className="text-xs font-bold text-(--primary) tracking-wide">
        {label}
      </label>
      {badge}
    </div>
    <div className="sm:col-span-2">
      <input
        {...inputProps}
        className={clsx(
          "w-full bg-transparent border-b text-sm text-(--primary) outline-none py-2 transition-colors",
          inputProps.disabled
            ? "border-white/5 cursor-not-allowed text-grey"
            : "border-white/10 focus:border-blue",
        )}
      />
    </div>
  </div>
);

/* -----------------------------------------------------------------
 * LINKED ACCOUNTS — email + bank payout account
 * ---------------------------------------------------------------- */
const LinkedAccountsSection = ({ user }: any) => {
  const bank = useMemo(
    () =>
      user?.accounts?.find(
        (a: { type: string }) => a.type.toLowerCase() === "bank",
      ),
    [user],
  );

  return (
    <div>
      <SectionHeader
        title="Linked Accounts"
        subtitle="Accounts connected to your profile for login and payouts."
        action={
          <Link
            href="/accounts"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-blue/20 bg-blue/10 px-5 py-2.5 text-xs font-bold text-blue transition-all hover:bg-blue/20"
          >
            Link Bank Account <MdArrowForward size={14} />
          </Link>
        }
      />

      <div className="mt-6 divide-y divide-white/5 border-t border-white/5">
        <AccountRow
          icon={<FaEnvelope size={14} />}
          title="Email Account"
          subtitle={user?.email}
          status="Linked"
        />
        {bank ? (
          <AccountRow
            icon={<FaUniversity size={14} />}
            title={bank.provider}
            subtitle={`Payout ••••••${bank.providerAccountId?.slice(6)}`}
            status="Linked"
            url="/accounts"
          />
        ) : (
          <AccountRow
            icon={<FaUniversity size={14} />}
            title="Bank Account"
            subtitle="No payout account linked yet"
            status="Not Linked"
            url="/accounts"
          />
        )}
      </div>
    </div>
  );
};

const AccountRow = ({
  icon,
  title,
  subtitle,
  status,
  url,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  status: "Linked" | "Not Linked";
  url?: string;
}) => (
  <div className="flex items-center justify-between gap-4 py-4">
    <div className="flex items-center gap-3.5 min-w-0">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/5 text-grey">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold text-(--primary) truncate">{title}</p>
        <p className="text-xs text-grey/80 font-medium truncate">{subtitle}</p>
      </div>
    </div>

    <div className="flex items-center gap-3 shrink-0">
      <span
        className={clsx(
          "px-3 py-1 rounded-full text-[12px] font-bold tracking-wide border",
          status === "Linked"
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/10"
            : "bg-amber-500/10 text-amber-400 border-amber-500/10",
        )}
      >
        {status}
      </span>
      {url && (
        <Link
          href={url}
          className="text-blue hover:underline text-xs font-bold tracking-tight hidden sm:block"
        >
          Manage
        </Link>
      )}
    </div>
  </div>
);

/* -----------------------------------------------------------------
 * SUBSCRIPTION — current plan + upgrade CTA
 * ---------------------------------------------------------------- */
const SubscriptionSection = ({ user }: any) => {
  const isSubscribed = !!user?.isSubscribed;

  const benefits = isSubscribed
    ? [
        { active: true, text: "Demo Quiz" },
        { active: true, text: "7 Daily Quizzes" },
        { active: true, text: "Global Leaderboard" },
        { active: true, text: "Unlimited Quizzes" },
        { active: true, text: "Double XP Boost" },
      ]
    : [
        { active: true, text: "Demo Quiz" },
        { active: false, text: "7 Daily Quizzes" },
        { active: false, text: "Global Leaderboard" },
        { active: false, text: "Unlimited Quizzes" },
        { active: false, text: "Double XP Boost" },
      ];

  return (
    <div>
      <SectionHeader
        title="Subscription"
        subtitle="View your current plan and explore what's next."
      />

      <div
        className={clsx(
          "mt-6 rounded-2xl border p-6 sm:p-8",
          isSubscribed
            ? "border-amber-400/20 bg-gradient-to-br from-amber-400/10 via-transparent to-transparent"
            : "border-blue/20 bg-gradient-to-br from-blue/10 via-transparent to-transparent",
        )}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span
              className={clsx(
                "inline-flex items-center gap-1.5 text-[12px] font-bold px-3 py-1 rounded-full mb-3 border",
                isSubscribed
                  ? "bg-amber-400/10 border-amber-400/30 text-amber-400"
                  : "bg-blue/10 border-blue/20 text-blue",
              )}
            >
              {isSubscribed && <FaCrown size={11} />}
              {isSubscribed ? "Premium Member" : "Current Plan"}
            </span>
            <div className="flex items-baseline gap-2">
              <h4 className="text-3xl font-black text-(--primary)">
                {isSubscribed ? "Premium" : "Free Tier"}
              </h4>
              <span className="text-grey text-sm font-medium">
                {isSubscribed ? "₦4000/month" : "$0/month"}
              </span>
            </div>
          </div>

          {isSubscribed ? (
            <PrimaryButton
              type="link"
              to="/subscriptions"
              text="View Active Subscriptions"
              style="bg-amber-400 text-black hover:bg-amber-400/90 rounded-xl py-3 px-8 text-xs font-bold tracking-wide inline-flex justify-center items-center gap-2"
            />
          ) : (
            <PrimaryButton
              type="link"
              to="/pricing"
              text="Upgrade Plan"
              style="bg-blue text-white hover:bg-blue/90 rounded-xl py-3 px-8 text-xs font-bold tracking-wide inline-flex justify-center items-center gap-2"
            />
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/5">
          {benefits.map((b) => (
            <div
              key={b.text}
              className={clsx(
                "flex items-center gap-2 text-xs",
                b.active ? "text-(--primary)" : "text-grey/40",
              )}
            >
              <FaCheckCircle
                size={12}
                className={clsx(
                  "shrink-0",
                  b.active ? "text-green-500" : "text-grey/20",
                )}
              />
              <span className={!b.active ? "line-through" : "font-medium"}>
                {b.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* -----------------------------------------------------------------
 * SHARED
 * ---------------------------------------------------------------- */
const SectionHeader = ({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-white/5">
    <div>
      <h3 className="text-lg font-bold text-(--primary)">{title}</h3>
      <p className="text-xs text-grey mt-1">{subtitle}</p>
    </div>
    {action}
  </div>
);

export default SettingsView;
