"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import StatCard from "@/components/ui/cards/StatCard";
import AdminPagination from "@/components/ui/AdminPagination";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import Badge, { BadgeStatus } from "@/components/ui/Badge";
import {
  getAdminSubscriptions,
  getAdminSubscriptionSummary,
} from "@/lib/api/apis";
import {
  MdCardMembership,
  MdChevronRight,
  MdOutlinePeople,
} from "react-icons/md";
import { FaCrown } from "react-icons/fa";

const PLAN_OPTIONS = [
  { label: "All Plans", value: "" },
  { label: "Premium", value: "PREMIUM" },
  { label: "Free", value: "FREE" },
];

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Active", value: "active" },
  { label: "Expiring Soon", value: "expiring" },
  { label: "Expired", value: "expired" },
];

const remainingTime = (endAt: string) => {
  const diffMs = new Date(endAt).getTime() - Date.now();
  if (diffMs <= 0) return "Expired";
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (days === 0) return "Less than a day";
  if (days === 1) return "1 day left";
  return `${days} days left`;
};

const subscriptionStatus = (endAt: string): { label: string; badge: BadgeStatus } => {
  const diffMs = new Date(endAt).getTime() - Date.now();
  if (diffMs <= 0) return { label: "Expired", badge: "inactive" };
  if (diffMs <= 3 * 24 * 60 * 60 * 1000)
    return { label: "Expiring Soon", badge: "warning" };
  return { label: "Active", badge: "success" };
};

const SubscriptionsPage = () => (
  <Suspense fallback={null}>
    <SubscriptionsPageContent />
  </Suspense>
);

const SubscriptionsPageContent = () => {
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const statusParam = searchParams.get("status");
    if (statusParam && STATUS_OPTIONS.some((o) => o.value === statusParam)) {
      setStatus(statusParam);
    }
  }, [searchParams]);

  const { data: summary } = useQuery({
    queryKey: ["admin-subscription-summary"],
    queryFn: async () => {
      const res = await getAdminSubscriptionSummary();
      return res?.data?.payload;
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-subscriptions", plan, status, page],
    queryFn: async () => {
      const res = await getAdminSubscriptions({
        plan: plan || undefined,
        status: status || undefined,
        page,
        limit,
      });
      return res?.data?.payload;
    },
  });

  const subscriptions = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Subscriptions"
        subtitle="Manage user plans, renewals, and expirations."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={MdOutlinePeople}
          title="Total Subscribers"
          value={summary?.total?.toLocaleString() ?? "—"}
          accent="blue"
        />
        <StatCard
          icon={FaCrown}
          title="Premium"
          value={summary?.premium?.toLocaleString() ?? "—"}
          secondary={`${summary?.activePremium ?? 0} currently active`}
          accent="amber"
        />
        <StatCard
          icon={MdCardMembership}
          title="Free"
          value={summary?.free?.toLocaleString() ?? "—"}
          accent="slate"
        />
        <StatCard
          icon={MdCardMembership}
          title="Expiring Soon"
          value={summary?.expiringSoon?.toLocaleString() ?? "—"}
          secondary={`${summary?.expired ?? 0} already expired`}
          accent="red"
        />
      </div>

      <AdminCard className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-48">
          <CustomSelect
            options={PLAN_OPTIONS}
            value={plan}
            placeholder="All Plans"
            onChange={(value: string) => {
              setPlan(value);
              setPage(1);
            }}
          />
        </div>
        <div className="w-full sm:w-48">
          <CustomSelect
            options={STATUS_OPTIONS}
            value={status}
            placeholder="All Statuses"
            onChange={(value: string) => {
              setStatus(value);
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
                <th className="px-6 py-3.5 font-bold">User</th>
                <th className="px-6 py-3.5 font-bold">Plan</th>
                <th className="px-6 py-3.5 font-bold">Start</th>
                <th className="px-6 py-3.5 font-bold">End</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 font-bold">Remaining</th>
                <th className="px-6 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-slate-400">
                    Loading subscriptions...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-red-400">
                    Unable to load subscriptions. Please try again.
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <MdCardMembership size={28} className="text-slate-300" />
                      <p className="font-semibold text-slate-500">
                        No subscriptions found
                      </p>
                      <p className="text-xs text-slate-400">
                        No subscriptions match your current filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub: any) => {
                  const st = subscriptionStatus(sub.endAt);
                  return (
                    <tr key={sub.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <p className="max-w-[180px] truncate font-bold text-slate-800" title={sub.user?.name}>
                          {sub.user?.name ?? "Unknown user"}
                        </p>
                        <p className="max-w-[180px] truncate text-xs text-slate-400" title={sub.user?.email}>
                          {sub.user?.email}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        {sub.name === "PREMIUM" ? (
                          <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-bold">
                            <FaCrown size={11} /> Premium
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full text-xs font-bold">
                            Free
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(sub.startAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(sub.endAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={st.badge}>{st.label}</Badge>
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {remainingTime(sub.endAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/genuslab/subscriptions/${sub.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                        >
                          View <MdChevronRight size={14} />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          meta={meta}
          onPageChange={setPage}
          itemLabel="subscriptions"
        />
      </AdminCard>
    </div>
  );
};

export default SubscriptionsPage;
