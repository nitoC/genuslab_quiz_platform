"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import StatCard from "@/components/ui/cards/StatCard";
import AdminPagination from "@/components/ui/AdminPagination";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import Badge from "@/components/ui/Badge";
import {
  getAdminReferrals,
  getAdminReferralSummary,
} from "@/lib/api/apis";
import { MdShare, MdChevronRight, MdOutlineVerified } from "react-icons/md";

const STATUS_OPTIONS = [
  { label: "All Referrals", value: "" },
  { label: "Verified", value: "true" },
  { label: "Pending", value: "false" },
];

const formatSource = (source?: string | null) => {
  if (!source || source === "unknown") return "Unknown";
  return source.charAt(0).toUpperCase() + source.slice(1).toLowerCase();
};

export default function ReferralsPage() {
  const [verified, setVerified] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: summary } = useQuery({
    queryKey: ["admin-referral-summary"],
    queryFn: async () => {
      const res = await getAdminReferralSummary();
      return res?.data?.payload;
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-referrals", verified, page],
    queryFn: async () => {
      const res = await getAdminReferrals({
        verified: verified === "" ? undefined : verified === "true",
        page,
        limit,
      });
      return res?.data?.payload;
    },
  });

  const referrals = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Referrals"
        subtitle="Track referral activity, verification, and rewards across the platform."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={MdShare}
          title="Total Referrals"
          value={summary?.total?.toLocaleString() ?? "—"}
          accent="blue"
        />
        <StatCard
          icon={MdOutlineVerified}
          title="Verified"
          value={summary?.verified?.toLocaleString() ?? "—"}
          accent="emerald"
        />
        <StatCard
          icon={MdShare}
          title="Pending"
          value={summary?.pending?.toLocaleString() ?? "—"}
          accent="amber"
        />
        <StatCard
          icon={MdShare}
          title="Total Rewards"
          value={`₦${Number(summary?.totalRewards ?? 0).toLocaleString()}`}
          accent="purple"
        />
      </div>

      {summary?.sourceBreakdown?.length > 0 && (
        <AdminCard>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
            Acquisition Source
          </h2>
          <div className="flex flex-col">
            {summary.sourceBreakdown.map((s: any) => (
              <div
                key={s.source}
                className="flex items-center justify-between gap-3 border-b border-slate-100 py-2.5 last:border-0"
              >
                <span className="text-sm font-semibold text-slate-700">
                  {formatSource(s.source)}
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  {s.count}
                </span>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      {summary?.topReferrers?.length > 0 && (
        <AdminCard>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
            Top Referrers
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {summary.topReferrers.map((r: any) => (
              <Link
                key={r.referrerId}
                href={r.user?.id ? `/genuslab/users/${r.user.id}` : "#"}
                className="flex flex-col gap-1 rounded-xl border border-slate-100 p-3.5 hover:border-blue-200 hover:bg-blue-50/40"
              >
                <p className="truncate text-sm font-bold text-slate-800">
                  {r.user?.name ?? "Unknown user"}
                </p>
                <p className="text-xs text-slate-400">{r.count} referrals</p>
              </Link>
            ))}
          </div>
        </AdminCard>
      )}

      <AdminCard className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-48">
          <CustomSelect
            options={STATUS_OPTIONS}
            value={verified}
            placeholder="All Referrals"
            onChange={(value: string) => {
              setVerified(value);
              setPage(1);
            }}
          />
        </div>
      </AdminCard>

      <AdminCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3.5 font-bold">Referrer</th>
                <th className="px-6 py-3.5 font-bold">Referred User</th>
                <th className="px-6 py-3.5 font-bold">Source</th>
                <th className="px-6 py-3.5 font-bold">Verified</th>
                <th className="px-6 py-3.5 font-bold">Date</th>
                <th className="px-6 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                    Loading referrals...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-red-400">
                    Unable to load referrals. Please try again.
                  </td>
                </tr>
              ) : referrals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <MdShare size={28} className="text-slate-300" />
                      <p className="font-semibold text-slate-500">
                        No referrals found
                      </p>
                      <p className="text-xs text-slate-400">
                        No referrals match your current filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                referrals.map((r: any) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <p className="max-w-[160px] truncate font-bold text-slate-800">
                        {r.referrer?.name ?? "Unknown"}
                      </p>
                      <p className="max-w-[160px] truncate text-xs text-slate-400">
                        {r.referrer?.referralCode ?? "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-[160px] truncate font-medium text-slate-700">
                        {r.name}
                      </p>
                      <p className="max-w-[160px] truncate text-xs text-slate-400">
                        {r.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatSource(r.referrer?.referrer)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={r.verified ? "success" : "warning"}>
                        {r.verified ? "Verified" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/genuslab/referrals/${r.id}`}
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                      >
                        View <MdChevronRight size={14} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination meta={meta} onPageChange={setPage} itemLabel="referrals" />
      </AdminCard>
    </div>
  );
}
