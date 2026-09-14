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
import ApprovedBanksPanel from "@/components/admin/ApprovedBanksPanel";
import { getAdminFinanceOverview, getAllTransactions } from "@/lib/api/apis";
import { cn } from "@/lib/utils/cn";
import {
  MdAccountBalance,
  MdOutlinePending,
  MdCheckCircleOutline,
  MdErrorOutline,
  MdChevronRight,
} from "react-icons/md";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "transactions", label: "Transactions" },
  { key: "banks", label: "Approved Banks" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const STATUS_BADGE: Record<string, BadgeStatus> = {
  success: "success",
  processing: "warning",
  failed: "error",
};

const TYPE_OPTIONS = [
  { label: "All Payout Types", value: "" },
  { label: "Quiz Rewards", value: "quiz" },
  { label: "Finance", value: "finance" },
  { label: "Referral", value: "referral" },
];

const FinancePage = () => (
  <Suspense fallback={null}>
    <FinancePageContent />
  </Suspense>
);

const FinancePageContent = () => {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<TabKey>("overview");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && TABS.some((t) => t.key === tabParam)) {
      setTab(tabParam as TabKey);
    }
  }, [searchParams]);

  const { data: overview, isLoading: isOverviewLoading } = useQuery({
    queryKey: ["admin-finance-overview"],
    queryFn: async () => {
      const res = await getAdminFinanceOverview();
      return res?.data?.payload;
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-finance-transactions", type, status, page],
    enabled: tab === "transactions",
    queryFn: async () => {
      const res = await getAllTransactions({
        type: type || undefined,
        status: status || undefined,
        page,
        limit,
      });
      return res?.data?.payload;
    },
  });

  const transactions = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Finance & Banks"
        subtitle="Payout activity and approved payout banks."
      />

      <div className="flex gap-1 overflow-x-auto border-b border-slate-100">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn(
              "shrink-0 border-b-2 px-3.5 py-2.5 text-sm font-semibold transition-colors",
              tab === key
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={MdOutlinePending}
              title="Pending Payouts"
              value={
                isOverviewLoading
                  ? "…"
                  : overview?.pendingPayouts?.toLocaleString() ?? "0"
              }
              accent="amber"
              href="/genuslab/finance?tab=transactions"
            />
            <StatCard
              icon={MdCheckCircleOutline}
              title="Successful Payouts"
              value={
                isOverviewLoading
                  ? "…"
                  : overview?.successfulPayouts?.toLocaleString() ?? "0"
              }
              accent="emerald"
            />
            <StatCard
              icon={MdErrorOutline}
              title="Failed Payouts"
              value={
                isOverviewLoading
                  ? "…"
                  : overview?.failedPayouts?.toLocaleString() ?? "0"
              }
              accent="red"
            />
            <StatCard
              icon={MdAccountBalance}
              title="Total Payout Value"
              value={`₦${Number(overview?.totalPayoutAmount ?? 0).toLocaleString()}`}
              accent="blue"
            />
          </div>

          <AdminCard>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-400">
              Payouts by Category
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5">
                <span className="text-sm font-semibold text-slate-700">
                  Quiz Reward Payouts
                </span>
                <span className="font-data text-sm font-bold text-slate-900">
                  ₦{Number(overview?.quizPayoutAmount ?? 0).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3.5">
                <span className="text-sm font-semibold text-slate-700">
                  Finance (Withdrawal) Payouts
                </span>
                <span className="font-data text-sm font-bold text-slate-900">
                  ₦{Number(overview?.financePayoutAmount ?? 0).toLocaleString()}
                </span>
              </div>
            </div>
          </AdminCard>

          <Link
            href="/genuslab/transactions?type=finance"
            className="flex w-fit items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
          >
            Review all finance transactions <MdChevronRight size={14} />
          </Link>
        </div>
      )}

      {tab === "transactions" && (
        <div className="flex flex-col gap-6">
          <AdminCard className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-56">
              <CustomSelect
                options={TYPE_OPTIONS}
                value={type}
                placeholder="All Payout Types"
                onChange={(value: string) => {
                  setType(value);
                  setPage(1);
                }}
              />
            </div>
            <div className="w-full sm:w-48">
              <CustomSelect
                options={[
                  { label: "All Statuses", value: "" },
                  { label: "Success", value: "success" },
                  { label: "Processing", value: "processing" },
                  { label: "Failed", value: "failed" },
                ]}
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
                    <th className="px-6 py-3.5 font-bold">Transaction</th>
                    <th className="px-6 py-3.5 font-bold">Type</th>
                    <th className="px-6 py-3.5 font-bold text-right">Amount</th>
                    <th className="px-6 py-3.5 font-bold">Status</th>
                    <th className="px-6 py-3.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-14 text-center text-slate-400">
                        Loading transactions...
                      </td>
                    </tr>
                  ) : isError ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-14 text-center text-red-400">
                        Unable to load transactions. Please try again.
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-14 text-center text-slate-400">
                        No transactions match your current filters.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx: any) => (
                      <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <p className="max-w-xs truncate font-bold text-slate-800">
                            {tx.title}
                          </p>
                        </td>
                        <td className="px-6 py-4 capitalize text-slate-600">
                          {tx.type}
                        </td>
                        <td className="font-data px-6 py-4 text-right font-semibold text-slate-800">
                          ₦{Number(tx.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <Badge status={STATUS_BADGE[tx.status] || "warning"}>
                            {tx.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/genuslab/transactions/${tx.id}`}
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

            <AdminPagination
              meta={meta}
              onPageChange={setPage}
              itemLabel="transactions"
            />
          </AdminCard>
        </div>
      )}

      {tab === "banks" && <ApprovedBanksPanel />}
    </div>
  );
};

export default FinancePage;
