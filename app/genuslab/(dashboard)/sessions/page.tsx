"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import StatCard from "@/components/ui/cards/StatCard";
import AdminPagination from "@/components/ui/AdminPagination";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import Badge, { BadgeStatus } from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/modals/ConfirmDialog";
import {
  getAdminSessions,
  getAdminSessionSummary,
  getAdminUserSessions,
  revokeAdminSession,
} from "@/lib/api/apis";
import { parseUserAgent } from "@/lib/utils/parseUserAgent";
import toast from "react-hot-toast";
import {
  MdOutlineDevices,
  MdChevronRight,
  MdOutlineGppGood,
  MdOutlineBlock,
  MdClose,
} from "react-icons/md";

const STATUS_OPTIONS = [
  { label: "All Sessions", value: "" },
  { label: "Active", value: "active" },
  { label: "Expired", value: "expired" },
  { label: "Revoked", value: "revoked" },
];

const sessionStatus = (session: any): { label: string; badge: BadgeStatus } => {
  if (session.revokedAt) return { label: "Revoked", badge: "error" };
  if (new Date(session.expiryTime) < new Date())
    return { label: "Expired", badge: "inactive" };
  return { label: "Active", badge: "success" };
};

export default function SessionsPage() {
  return (
    <Suspense fallback={null}>
      <SessionsPageContent />
    </Suspense>
  );
}

const SessionsPageContent = () => {
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [pendingRevoke, setPendingRevoke] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const limit = 10;

  const { data: summary } = useQuery({
    queryKey: ["admin-session-summary"],
    enabled: !userId,
    queryFn: async () => {
      const res = await getAdminSessionSummary();
      return res?.data?.payload;
    },
  });

  // Two distinct data sources: the paginated/filterable admin-wide list, or
  // (when arriving from a user's detail page) the flat list of every
  // session belonging to just that one user.
  const { data, isLoading, isError } = useQuery({
    queryKey: userId
      ? ["admin-user-sessions", userId]
      : ["admin-sessions", status, page],
    queryFn: async () => {
      if (userId) {
        const res = await getAdminUserSessions(userId);
        return { data: res?.data?.payload ?? [], meta: undefined };
      }
      const res = await getAdminSessions({
        status: status || undefined,
        page,
        limit,
      });
      return res?.data?.payload;
    },
  });

  const sessions = data?.data ?? [];
  const meta = data?.meta;

  const revokeMutation = useMutation({
    mutationFn: (id: string) => revokeAdminSession(id),
    onSuccess: () => {
      toast.success("Session revoked.");
      setPendingRevoke(null);
      queryClient.invalidateQueries({ queryKey: ["admin-sessions"] });
      queryClient.invalidateQueries({ queryKey: ["admin-session-summary"] });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to revoke session.");
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Sessions"
        subtitle="Monitor active logins and revoke suspicious sessions."
      />

      <ConfirmDialog
        open={!!pendingRevoke}
        title="Revoke this session?"
        description={
          <>
            This will immediately invalidate{" "}
            <span className="font-semibold text-slate-700">
              {pendingRevoke?.label}
            </span>
            . The user will need to sign in again on that device.
          </>
        }
        confirmLabel="Revoke Session"
        loading={revokeMutation.isPending}
        onCancel={() => setPendingRevoke(null)}
        onConfirm={() => pendingRevoke && revokeMutation.mutate(pendingRevoke.id)}
      />

      {userId ? (
        <AdminCard className="flex items-center justify-between gap-3">
          <p className="text-sm text-slate-600">
            Showing sessions for{" "}
            <Link
              href={`/genuslab/users/${userId}`}
              className="font-bold text-blue-600 hover:underline"
            >
              this user
            </Link>{" "}
            only.
          </p>
          <Link
            href="/genuslab/sessions"
            className="flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800"
          >
            <MdClose size={16} /> Clear filter
          </Link>
        </AdminCard>
      ) : (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <StatCard
            icon={MdOutlineDevices}
            title="Total Sessions"
            value={summary?.total?.toLocaleString() ?? "—"}
            accent="blue"
          />
          <StatCard
            icon={MdOutlineGppGood}
            title="Active"
            value={summary?.active?.toLocaleString() ?? "—"}
            accent="emerald"
          />
          <StatCard
            icon={MdOutlineDevices}
            title="Expired"
            value={summary?.expired?.toLocaleString() ?? "—"}
            accent="slate"
          />
          <StatCard
            icon={MdOutlineBlock}
            title="Revoked"
            value={summary?.revoked?.toLocaleString() ?? "—"}
            accent="red"
          />
        </div>
      )}

      {!userId && (
      <AdminCard className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-48">
          <CustomSelect
            options={STATUS_OPTIONS}
            value={status}
            placeholder="All Sessions"
            onChange={(value: string) => {
              setStatus(value);
              setPage(1);
            }}
          />
        </div>
      </AdminCard>
      )}

      <AdminCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3.5 font-bold">User</th>
                <th className="px-6 py-3.5 font-bold">Device / Browser</th>
                <th className="px-6 py-3.5 font-bold">IP</th>
                <th className="px-6 py-3.5 font-bold">Created</th>
                <th className="px-6 py-3.5 font-bold">Expiry</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-slate-400">
                    Loading sessions...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-red-400">
                    Unable to load sessions. Please try again.
                  </td>
                </tr>
              ) : sessions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <MdOutlineDevices size={28} className="text-slate-300" />
                      <p className="font-semibold text-slate-500">
                        No sessions found
                      </p>
                      <p className="text-xs text-slate-400">
                        No sessions match your current filter.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                sessions.map((s: any) => {
                  const { browser, device } = parseUserAgent(s.userAgent);
                  const st = sessionStatus(s);
                  const isRevocable = !s.revokedAt;
                  return (
                    <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <p className="max-w-[160px] truncate font-bold text-slate-800">
                          {s.user?.name ?? "Unknown"}
                        </p>
                        <p className="max-w-[160px] truncate text-xs text-slate-400">
                          {s.user?.email}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {browser} on {device}
                      </td>
                      <td className="font-data px-6 py-4 text-slate-500">
                        {s.ip || "—"}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(s.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(s.expiryTime).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-4">
                        <Badge status={st.badge}>{st.label}</Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-4">
                          {isRevocable && (
                            <button
                              type="button"
                              onClick={() =>
                                setPendingRevoke({
                                  id: s.id,
                                  label: `${s.user?.name ?? "this user"}'s ${device} session`,
                                })
                              }
                              className="text-xs font-bold text-red-600 hover:underline"
                            >
                              Revoke
                            </button>
                          )}
                          <Link
                            href={`/genuslab/sessions/${s.id}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                          >
                            View <MdChevronRight size={14} />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination meta={meta} onPageChange={setPage} itemLabel="sessions" />
      </AdminCard>
    </div>
  );
}
