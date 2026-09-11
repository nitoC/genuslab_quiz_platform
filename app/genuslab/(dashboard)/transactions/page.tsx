"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AdminHeader from "@/components/layouts/AdminHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import Badge, { BadgeStatus } from "@/components/ui/Badge";
import { getAllTransactions } from "@/lib/api/apis";
import { MdChevronLeft, MdChevronRight, MdReceiptLong } from "react-icons/md";
import { FaCrown, FaGamepad, FaGift, FaMoneyBillWave } from "react-icons/fa";

const STATUS_BADGE: Record<string, BadgeStatus> = {
  success: "success",
  processing: "warning",
  failed: "error",
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  plan: <FaCrown className="text-amber-500" size={14} />,
  quiz: <FaGamepad className="text-blue-500" size={14} />,
  referral: <FaGift className="text-emerald-500" size={14} />,
  finance: <FaMoneyBillWave className="text-purple-500" size={14} />,
};

const TYPE_OPTIONS = ["", "plan", "quiz", "referral", "finance"];
const TYPE_SELECT_OPTIONS = TYPE_OPTIONS.map((t) => ({
  label: t ? t.charAt(0).toUpperCase() + t.slice(1) : "All Types",
  value: t,
}));
const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Success", value: "success" },
  { label: "Processing", value: "processing" },
  { label: "Failed", value: "failed" },
];

const AdminTransactionsPage = () => (
  <Suspense fallback={null}>
    <AdminTransactionsPageContent />
  </Suspense>
);

const AdminTransactionsPageContent = () => {
  const searchParams = useSearchParams();
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  useEffect(() => {
    const typeParam = searchParams.get("type");
    if (typeParam && TYPE_OPTIONS.includes(typeParam)) {
      setType(typeParam);
    }
  }, [searchParams]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-transactions", type, status, page],
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
      <AdminHeader
        title="Transactions"
        subtitle="Every transaction across all users on the platform."
      />

      <AdminCard className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-48">
          <CustomSelect
            options={TYPE_SELECT_OPTIONS}
            value={type}
            placeholder="All Types"
            onChange={(value: string) => {
              setType(value);
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
                <th className="px-6 py-3.5 font-bold">Transaction</th>
                <th className="px-6 py-3.5 font-bold">Type</th>
                <th className="px-6 py-3.5 font-bold text-right">Amount</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 font-bold">User ID</th>
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
                    Failed to load transactions.
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <MdReceiptLong size={28} className="text-slate-300" />
                      No transactions found.
                    </div>
                  </td>
                </tr>
              ) : (
                transactions.map((tx: any) => (
                  <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                          {TYPE_ICONS[tx.type] || (
                            <MdReceiptLong className="text-slate-400" size={16} />
                          )}
                        </span>
                        <div>
                          <p className="font-bold text-slate-800">{tx.title}</p>
                          <p className="text-slate-400 text-xs truncate max-w-xs">
                            {tx.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 capitalize font-medium">
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
                    <td className="font-data px-6 py-4 text-xs text-slate-400">
                      {tx.userId}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta && meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
            <p className="text-xs text-slate-500">
              Page {meta.page} of {meta.totalPages} · {meta.total} transactions
            </p>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                <MdChevronLeft size={14} /> Previous
              </button>
              <button
                disabled={page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-200 text-slate-600 disabled:opacity-40 hover:bg-slate-50"
              >
                Next <MdChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </AdminCard>
    </div>
  );
};

export default AdminTransactionsPage;
