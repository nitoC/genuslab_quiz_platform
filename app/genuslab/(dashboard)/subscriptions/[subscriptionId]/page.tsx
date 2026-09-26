"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import AdminCard from "@/components/ui/cards/AdminCard";
import Badge, { BadgeStatus } from "@/components/ui/Badge";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import { getSubscriptionById, updateSubscriptionStatus } from "@/lib/api/apis";
import { MdArrowBack, MdCardMembership } from "react-icons/md";
import { FaCrown } from "react-icons/fa";

const LIFECYCLE_STATUS_OPTIONS = [
  { label: "Active", value: "ACTIVE" },
  { label: "Expired", value: "EXPIRED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
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

export default function SubscriptionDetailPage() {
  const { subscriptionId } = useParams<{ subscriptionId: string }>();
  const queryClient = useQueryClient();
    // Read the clock once on mount (the compiler flags Date.now() in render).
  const [now] = useState(() => Date.now());

  const { data: sub, isLoading, isError } = useQuery({
    queryKey: ["admin-subscription-detail", subscriptionId],
    enabled: !!subscriptionId,
    queryFn: async () => {
      const res = await getSubscriptionById(subscriptionId);
      return res?.data?.payload;
    },
  });

  const statusMutation = useMutation({
    mutationFn: (status: string) =>
      updateSubscriptionStatus(subscriptionId, status),
    onSuccess: () => {
      toast.success("Subscription status updated");
      queryClient.invalidateQueries({
        queryKey: ["admin-subscription-detail", subscriptionId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-subscriptions"] });
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

  if (isError || !sub) {
    return (
      <AdminCard className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-semibold text-slate-700">
          Unable to load this subscription
        </p>
        <p className="text-sm text-slate-400">
          It may not exist, or something went wrong fetching it.
        </p>
        <Link
          href="/genuslab/subscriptions"
          className="mt-2 text-sm font-bold text-blue-600 hover:underline"
        >
          Back to Subscriptions
        </Link>
      </AdminCard>
    );
  }

  const diffMs = new Date(sub.endAt).getTime() - now;
  const status: { label: string; badge: BadgeStatus } =
    diffMs <= 0
      ? { label: "Expired", badge: "inactive" }
      : diffMs <= 3 * 24 * 60 * 60 * 1000
        ? { label: "Expiring Soon", badge: "warning" }
        : { label: "Active", badge: "success" };

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/genuslab/subscriptions"
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        <MdArrowBack size={16} /> Back to Subscriptions
      </Link>

      <AdminCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MdCardMembership size={26} />
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                {sub.name === "PREMIUM" ? (
                  <span className="inline-flex items-center gap-2">
                    <FaCrown className="text-amber-500" size={18} /> Premium Plan
                  </span>
                ) : (
                  "Free Plan"
                )}
              </h1>
              <p className="text-sm text-slate-500">
                Subscription ID: {sub.id}
              </p>
            </div>
          </div>

          <Badge status={status.badge}>{status.label}</Badge>
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            User Information
          </h2>
          <InfoRow label="Name" value={sub.user?.name ?? "—"} />
          <InfoRow label="Email" value={sub.user?.email ?? "—"} />
          <InfoRow label="Phone" value={sub.user?.phone || "—"} />
          {sub.user?.id && (
            <div className="mt-4">
              <Link
                href={`/genuslab/users/${sub.user.id}`}
                className="text-sm font-bold text-blue-600 hover:underline"
              >
                View full user profile & transactions →
              </Link>
            </div>
          )}
        </AdminCard>

        <AdminCard>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            Plan Details
          </h2>
          <InfoRow label="Plan" value={sub.name} />
          <InfoRow
            label="Price"
            value={`₦${Number(sub.price).toLocaleString()}`}
          />
          <InfoRow label="Start date" value={formatDate(sub.startAt)} />
          <InfoRow label="End date" value={formatDate(sub.endAt)} />
          <InfoRow label="Created" value={formatDate(sub.createdAt)} />
          <div className="flex items-center justify-between py-2.5">
            <span className="text-sm text-slate-500">Lifecycle Status</span>
            <div className="w-40">
              <CustomSelect
                options={LIFECYCLE_STATUS_OPTIONS}
                value={sub.status}
                loading={statusMutation.isPending}
                onChange={(value: string) => statusMutation.mutate(value)}
              />
            </div>
          </div>
        </AdminCard>
      </div>
    </div>
  );
}
