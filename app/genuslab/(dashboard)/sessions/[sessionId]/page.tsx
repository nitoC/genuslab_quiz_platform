"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import AdminCard from "@/components/ui/cards/AdminCard";
import Badge, { BadgeStatus } from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/modals/ConfirmDialog";
import { getAdminSessionById, revokeAdminSession } from "@/lib/api/apis";
import { parseUserAgent } from "@/lib/utils/parseUserAgent";
import toast from "react-hot-toast";
import { MdArrowBack, MdOutlineDevices } from "react-icons/md";

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

export default function SessionDetailPage() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { data: session, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin-session-detail", sessionId],
    enabled: !!sessionId,
    queryFn: async () => {
      const res = await getAdminSessionById(sessionId);
      return res?.data?.payload;
    },
  });

  const revokeMutation = useMutation({
    mutationFn: () => revokeAdminSession(sessionId),
    onSuccess: () => {
      toast.success("Session revoked.");
      setConfirmOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to revoke session.");
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

  if (isError || !session) {
    return (
      <AdminCard className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-semibold text-slate-700">
          Unable to load this session
        </p>
        <p className="text-sm text-slate-400">
          It may not exist, or something went wrong fetching it.
        </p>
        <Link
          href="/genuslab/sessions"
          className="mt-2 text-sm font-bold text-blue-600 hover:underline"
        >
          Back to Sessions
        </Link>
      </AdminCard>
    );
  }

  const { browser, device } = parseUserAgent(session.userAgent);
  const status: { label: string; badge: BadgeStatus } = session.revokedAt
    ? { label: "Revoked", badge: "error" }
    : new Date(session.expiryTime) < new Date()
      ? { label: "Expired", badge: "inactive" }
      : { label: "Active", badge: "success" };

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/genuslab/sessions"
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        <MdArrowBack size={16} /> Back to Sessions
      </Link>

      <ConfirmDialog
        open={confirmOpen}
        title="Revoke this session?"
        description="This will immediately invalidate the session. The user will need to sign in again on that device."
        confirmLabel="Revoke Session"
        loading={revokeMutation.isPending}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => revokeMutation.mutate()}
      />

      <AdminCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MdOutlineDevices size={24} />
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                {browser} on {device}
              </h1>
              <p className="text-sm text-slate-500">
                {session.user?.name ?? "Unknown user"} &middot;{" "}
                {session.user?.email}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge status={status.badge}>{status.label}</Badge>
            {!session.revokedAt && (
              <button
                type="button"
                onClick={() => setConfirmOpen(true)}
                className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100"
              >
                Revoke Session
              </button>
            )}
          </div>
        </div>
      </AdminCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <AdminCard>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            Session Details
          </h2>
          <InfoRow label="IP address" value={session.ip || "—"} />
          <InfoRow label="Browser" value={browser} />
          <InfoRow label="Device" value={device} />
          <InfoRow label="Created" value={formatDate(session.createdAt)} />
          <InfoRow label="Expiry" value={formatDate(session.expiryTime)} />
          {session.revokedAt && (
            <InfoRow label="Revoked at" value={formatDate(session.revokedAt)} />
          )}
        </AdminCard>

        <AdminCard>
          <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
            User
          </h2>
          <InfoRow label="Name" value={session.user?.name ?? "—"} />
          <InfoRow label="Email" value={session.user?.email ?? "—"} />
          {session.user?.id && (
            <div className="mt-4">
              <Link
                href={`/genuslab/users/${session.user.id}`}
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
