"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AdminCard from "@/components/ui/cards/AdminCard";
import Badge, { BadgeStatus } from "@/components/ui/Badge";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import { getTransactionById, updateTransactionStatus } from "@/lib/api/apis";
import { MdArrowBack, MdReceiptLong } from "react-icons/md";
import { FaCrown, FaGamepad, FaGift, FaMoneyBillWave } from "react-icons/fa";

const STATUS_BADGE: Record<string, BadgeStatus> = {
  success: "success",
  processing: "warning",
  failed: "error",
};

const STATUS_OPTIONS = [
  { label: "Success", value: "success", colorClass: "text-emerald-700" },
  { label: "Processing", value: "processing", colorClass: "text-amber-700" },
  { label: "Failed", value: "failed", colorClass: "text-red-700" },
];

const TYPE_ICONS: Record<string, React.ReactNode> = {
  plan: <FaCrown className="text-amber-500" size={16} />,
  quiz: <FaGamepad className="text-blue-500" size={16} />,
  referral: <FaGift className="text-emerald-500" size={16} />,
  finance: <FaMoneyBillWave className="text-purple-500" size={16} />,
};

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "—";

const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-center justify-between border-b border-slate-50 py-2.5 last:border-0">
    <span className="text-sm text-slate-500">{label}</span>
    <span className="max-w-[60%] truncate text-sm font-semibold text-slate-800">
      {value}
    </span>
  </div>
);

export default function TransactionDetailPage() {
  const { transactionId } = useParams<{ transactionId: string }>();
  const queryClient = useQueryClient();

  const { data: tx, isLoading, isError } = useQuery({
    queryKey: ["admin-transaction-detail", transactionId],
    enabled: !!transactionId,
    queryFn: async () => {
      const res = await getTransactionById(transactionId);
      return res?.data?.payload ?? res?.data?.data;
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) =>
      updateTransactionStatus(transactionId, status),
    onSuccess: () => {
      toast.success("Transaction status updated");
      queryClient.invalidateQueries({
        queryKey: ["admin-transaction-detail", transactionId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-transactions"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update status",
      );
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

  if (isError || !tx) {
    return (
      <AdminCard className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-semibold text-slate-700">
          Unable to load this transaction
        </p>
        <p className="text-sm text-slate-400">
          It may not exist, or something went wrong fetching it.
        </p>
        <Link
          href="/genuslab/transactions"
          className="mt-2 text-sm font-bold text-blue-600 hover:underline"
        >
          Back to Transactions
        </Link>
      </AdminCard>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/genuslab/transactions"
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        <MdArrowBack size={16} /> Back to Transactions
      </Link>

      <AdminCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-100">
              {TYPE_ICONS[tx.type] || (
                <MdReceiptLong className="text-slate-400" size={22} />
              )}
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                {tx.title}
              </h1>
              <p className="text-sm text-slate-500">ID: {tx.id}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 text-right">
            <p className="font-data text-2xl font-extrabold text-slate-900">
              ₦{Number(tx.amount).toLocaleString()}
            </p>
            <Badge status={STATUS_BADGE[tx.status] || "warning"}>
              {tx.status}
            </Badge>
          </div>
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            Transaction Details
          </h2>
          <InfoRow label="Type" value={<span className="capitalize">{tx.type}</span>} />
          <div className="flex items-center justify-between border-b border-slate-50 py-2.5">
            <span className="text-sm text-slate-500">Status</span>
            <div className="w-40">
              <CustomSelect
                options={STATUS_OPTIONS}
                value={tx.status}
                loading={statusMutation.isPending}
                onChange={(value: string) => statusMutation.mutate(value)}
              />
            </div>
          </div>
          <InfoRow label="Amount" value={`₦${Number(tx.amount).toLocaleString()}`} />
          <InfoRow label="Description" value={tx.description || "—"} />
          <InfoRow label="Reference ID" value={tx.id} />
        </AdminCard>

        <AdminCard>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            User Information
          </h2>
          <InfoRow label="Name" value={tx.user?.name ?? "—"} />
          <InfoRow label="Email" value={tx.user?.email ?? "—"} />
          <InfoRow label="Phone" value={tx.user?.phone || "—"} />
          {tx.user?.id && (
            <div className="mt-4">
              <Link
                href={`/genuslab/users/${tx.user.id}`}
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                View full user profile →
              </Link>
            </div>
          )}
        </AdminCard>
      </div>
    </div>
  );
}
