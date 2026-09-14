"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AdminCard from "@/components/ui/cards/AdminCard";
import Badge, { BadgeStatus } from "@/components/ui/Badge";
import { getAdminUserById } from "@/lib/api/apis";
import { cn } from "@/lib/utils/cn";
import {
  MdArrowBack,
  MdMilitaryTech,
  MdCardMembership,
  MdReceiptLong,
  MdShare,
  MdQuiz,
  MdOutlineDevices,
  MdPerson,
} from "react-icons/md";
import { FaCrown } from "react-icons/fa";

const STATUS_BADGE: Record<string, BadgeStatus> = {
  active: "success",
  inactive: "inactive",
  suspended: "error",
};

const TABS = [
  { key: "overview", label: "Overview", icon: MdPerson },
  { key: "rank", label: "XP & Rank", icon: MdMilitaryTech },
  { key: "subscription", label: "Subscription", icon: MdCardMembership },
  { key: "transactions", label: "Transactions", icon: MdReceiptLong },
  { key: "referrals", label: "Referrals", icon: MdShare },
  { key: "quiz", label: "Quiz Activity", icon: MdQuiz },
  { key: "sessions", label: "Sessions", icon: MdOutlineDevices },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const formatDate = (value?: string | null, withTime = false) => {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  });
};

const initials = (name?: string) =>
  (name || "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
    {children}
  </h2>
);

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-center justify-between border-b border-slate-50 py-2.5 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="max-w-[60%] truncate text-sm font-semibold text-slate-800">
      {value}
    </span>
  </div>
);

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const [tab, setTab] = useState<TabKey>("overview");

  const { data: user, isLoading, isError } = useQuery({
    queryKey: ["admin-user-detail", userId],
    enabled: !!userId,
    queryFn: async () => {
      const res = await getAdminUserById(userId);
      return res?.data?.payload;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-slate-100" />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <AdminCard className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-semibold text-slate-700">Unable to load this user</p>
        <p className="text-sm text-slate-400">
          The user may not exist, or something went wrong fetching their data.
        </p>
        <Link
          href="/genuslab/users"
          className="mt-2 text-sm font-bold text-blue-600 hover:underline"
        >
          Back to Users
        </Link>
      </AdminCard>
    );
  }

  const rank = user.details?.rankName;
  const xp = user.details?.xp ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/genuslab/users"
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        <MdArrowBack size={16} /> Back to Users
      </Link>

      {/* ENTITY HEADER */}
      <AdminCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg font-bold text-blue-600">
              {initials(user.name)}
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-xl font-extrabold tracking-tight text-slate-900">
                {user.name}
              </h1>
              <p className="truncate text-sm text-slate-500">{user.email}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                {user.isSubscribed ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">
                    <FaCrown size={11} /> Premium
                  </span>
                ) : (
                  <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                    Free
                  </span>
                )}
                {rank && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-bold text-purple-600">
                    <MdMilitaryTech size={12} /> {rank.rankName}
                  </span>
                )}
                <span className="text-xs font-semibold text-slate-400">
                  {xp.toLocaleString()} XP
                </span>
              </div>
            </div>
          </div>

          <Badge status={STATUS_BADGE[user.status] || "inactive"}>
            {user.status}
          </Badge>
        </div>
      </AdminCard>

      {/* TABS */}
      <div className="flex gap-1 overflow-x-auto border-b border-slate-100">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "flex shrink-0 items-center gap-1.5 border-b-2 px-3.5 py-2.5 text-sm font-semibold transition-colors",
              tab === key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminCard>
            <SectionTitle>Account Information</SectionTitle>
            <div className="mt-3">
              <InfoRow label="Full name" value={user.name} />
              <InfoRow label="Email" value={user.email} />
              <InfoRow label="Phone" value={user.phone || "—"} />
              <InfoRow label="Role" value={user.role} />
              <InfoRow label="Verified" value={user.verified ? "Yes" : "No"} />
              <InfoRow label="Joined" value={formatDate(user.createdAt)} />
            </div>
          </AdminCard>

          <AdminCard>
            <SectionTitle>Snapshot</SectionTitle>
            <div className="mt-3">
              <InfoRow
                label="Plan"
                value={user.isSubscribed ? "Premium" : "Free"}
              />
              <InfoRow label="Rank" value={rank?.rankName || "Unranked"} />
              <InfoRow label="XP" value={xp.toLocaleString()} />
              <InfoRow
                label="Reward balance"
                value={`₦${Number(user.details?.rewardBalance ?? 0).toLocaleString()}`}
              />
              <InfoRow
                label="Referral code"
                value={user.referralCode || "—"}
              />
              <InfoRow
                label="Recent quiz attempts"
                value={user.details?.quizHistory?.length ?? 0}
              />
            </div>
          </AdminCard>
        </div>
      )}

      {tab === "rank" && (
        <AdminCard>
          <SectionTitle>XP &amp; Rank</SectionTitle>
          {rank ? (
            <div className="mt-3">
              <InfoRow label="Current rank" value={rank.rankName} />
              <InfoRow label="Rank tier" value={rank.rank} />
              <InfoRow label="Current XP" value={xp.toLocaleString()} />
              <InfoRow
                label="XP required for this tier"
                value={rank.unlockXp.toLocaleString()}
              />
              <InfoRow label="Reward multiplier" value={`${rank.multiplier}×`} />
            </div>
          ) : (
            <p className="mt-3 text-sm text-slate-400">
              This user has no rank assigned yet.
            </p>
          )}
        </AdminCard>
      )}

      {tab === "subscription" && (
        <AdminCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Plan</th>
                  <th className="px-6 py-3.5 font-bold">Start</th>
                  <th className="px-6 py-3.5 font-bold">End</th>
                  <th className="px-6 py-3.5 font-bold text-right">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!user.subscriptions?.length ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-14 text-center text-slate-400">
                      No subscription history for this user.
                    </td>
                  </tr>
                ) : (
                  user.subscriptions.map((s: any) => (
                    <tr key={s.id}>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {s.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(s.startAt)}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(s.endAt)}
                      </td>
                      <td className="font-data px-6 py-4 text-right font-semibold text-slate-800">
                        ₦{Number(s.price).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {tab === "transactions" && (
        <AdminCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Transaction</th>
                  <th className="px-6 py-3.5 font-bold">Type</th>
                  <th className="px-6 py-3.5 font-bold text-right">Amount</th>
                  <th className="px-6 py-3.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!user.transactions?.length ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-14 text-center text-slate-400">
                      No transactions yet for this user.
                    </td>
                  </tr>
                ) : (
                  user.transactions.map((tx: any) => (
                    <tr key={tx.id}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{tx.title}</p>
                        <p className="max-w-xs truncate text-xs text-slate-400">
                          {tx.description}
                        </p>
                      </td>
                      <td className="px-6 py-4 capitalize text-slate-600">
                        {tx.type}
                      </td>
                      <td className="font-data px-6 py-4 text-right font-semibold text-slate-800">
                        ₦{Number(tx.amount).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          status={
                            tx.status === "success"
                              ? "success"
                              : tx.status === "failed"
                                ? "error"
                                : "warning"
                          }
                        >
                          {tx.status}
                        </Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {tab === "referrals" && (
        <AdminCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Referred user</th>
                  <th className="px-6 py-3.5 font-bold">Email</th>
                  <th className="px-6 py-3.5 font-bold">Verified</th>
                  <th className="px-6 py-3.5 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!user.referrals?.length ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-14 text-center text-slate-400">
                      This user hasn&apos;t referred anyone yet.
                    </td>
                  </tr>
                ) : (
                  user.referrals.map((r: any) => (
                    <tr key={r.id}>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {r.name}
                      </td>
                      <td className="px-6 py-4 text-slate-500">{r.email}</td>
                      <td className="px-6 py-4">
                        <Badge status={r.verified ? "success" : "warning"}>
                          {r.verified ? "Verified" : "Pending"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(r.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {tab === "quiz" && (
        <AdminCard className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Quiz</th>
                  <th className="px-6 py-3.5 font-bold">Episode</th>
                  <th className="px-6 py-3.5 font-bold text-right">Score</th>
                  <th className="px-6 py-3.5 font-bold">Status</th>
                  <th className="px-6 py-3.5 font-bold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!user.details?.quizHistory?.length ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-14 text-center text-slate-400">
                      No quiz attempts yet.
                    </td>
                  </tr>
                ) : (
                  user.details.quizHistory.map((attempt: any) => (
                    <tr key={attempt.id}>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {attempt.quiz?.title || "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {attempt.quiz?.episode || "—"}
                      </td>
                      <td className="font-data px-6 py-4 text-right font-semibold text-slate-800">
                        {attempt.score}
                      </td>
                      <td className="px-6 py-4">
                        <Badge
                          status={
                            attempt.status === "COMPLETED" ? "success" : "info"
                          }
                        >
                          {attempt.status === "COMPLETED"
                            ? "Completed"
                            : "In progress"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {formatDate(attempt.createdAt)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}

      {tab === "sessions" && (
        <AdminCard className="p-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <p className="text-sm text-slate-500">
              Most recent sessions for this user.
            </p>
            <Link
              href={`/genuslab/sessions?userId=${user.id}`}
              className="text-sm font-bold text-blue-600 hover:underline"
            >
              View all sessions for this user →
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Device / IP</th>
                  <th className="px-6 py-3.5 font-bold">Created</th>
                  <th className="px-6 py-3.5 font-bold">Expiry</th>
                  <th className="px-6 py-3.5 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {!user.sessions?.length ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-14 text-center text-slate-400">
                      No sessions recorded for this user.
                    </td>
                  </tr>
                ) : (
                  user.sessions.map((s: any) => {
                    const revoked = !!s.revokedAt;
                    const expired = !revoked && new Date(s.expiryTime) < new Date();
                    const status = revoked
                      ? "Revoked"
                      : expired
                        ? "Expired"
                        : "Active";
                    return (
                      <tr key={s.id}>
                        <td className="px-6 py-4">
                          <p className="max-w-xs truncate text-slate-700" title={s.userAgent}>
                            {s.userAgent || "Unknown device"}
                          </p>
                          <p className="text-xs text-slate-400">{s.ip || "—"}</p>
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {formatDate(s.createdAt, true)}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {formatDate(s.expiryTime, true)}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            status={
                              status === "Active"
                                ? "success"
                                : status === "Expired"
                                  ? "inactive"
                                  : "error"
                            }
                          >
                            {status}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}
    </div>
  );
}
