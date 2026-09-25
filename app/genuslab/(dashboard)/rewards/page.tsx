"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import {
  MdCardGiftcard,
  MdCheckCircle,
  MdHourglassEmpty,
  MdSearch,
  MdClose,
  MdHistory,
} from "react-icons/md";
import { FaPen } from "react-icons/fa";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import StatCard from "@/components/ui/cards/StatCard";
import Badge from "@/components/ui/Badge";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import AdminPagination from "@/components/ui/AdminPagination";
import {
  getAdminRewardSummary,
  getAdminRewards,
  updateAdminReward,
  getAdminAuditLogs,
} from "@/lib/api/apis";

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Unclaimed", value: "unclaimed" },
  { label: "Claimed", value: "claimed" },
];

const SOURCE_OPTIONS = [
  { label: "All Sources", value: "" },
  { label: "Quiz", value: "QUIZ" },
  { label: "Referral", value: "REFERRAL" },
  { label: "Rank Unlock", value: "RANK_UNLOCK" },
];

const SOURCE_LABELS: Record<string, string> = {
  QUIZ: "Quiz",
  REFERRAL: "Referral",
  RANK_UNLOCK: "Rank Unlock",
};

interface RewardRow {
  id: string;
  value: string | number;
  claimed: boolean;
  claimedAt: string | null;
  notes: string | null;
  source: string;
  createdAt: string;
  userDetails: {
    id: string;
    user: { name: string; email: string };
  };
}

const formatCurrency = (value: string | number) =>
  `₦${Number(value).toLocaleString()}`;

const RewardEditModal = ({
  open,
  reward,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean;
  reward: RewardRow | null;
  loading: boolean;
  onClose: () => void;
  onSubmit: (payload: { claimed: boolean; notes: string }) => void;
}) => {
  const [claimed, setClaimed] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  // Re-seed local state whenever a different reward is opened for editing —
  // notes always starts blank (a fresh reason is required for every edit,
  // not a re-submission of whatever was written last time).
  useEffect(() => {
    if (open && reward) {
      setClaimed(reward.claimed);
      setNotes("");
      setError("");
    }
  }, [open, reward?.id]);

  if (!open || !reward) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">Update Reward</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-5 px-6 py-5">
          <div className="rounded-xl bg-slate-50 p-4 text-sm">
            <p className="font-bold text-slate-800">
              {reward.userDetails.user.name}
            </p>
            <p className="text-slate-500">{reward.userDetails.user.email}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-slate-500">
                {SOURCE_LABELS[reward.source] ?? reward.source}
              </span>
              <span className="font-bold text-slate-800">
                {formatCurrency(reward.value)}
              </span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700">
              Status
            </label>
            <div className="mt-2 flex gap-3">
              <button
                type="button"
                onClick={() => setClaimed(false)}
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${
                  !claimed
                    ? "border-amber-300 bg-amber-50 text-amber-700"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                Unclaimed
              </button>
              <button
                type="button"
                onClick={() => setClaimed(true)}
                className={`flex-1 rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${
                  claimed
                    ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                    : "border-slate-200 text-slate-500 hover:bg-slate-50"
                }`}
              >
                Claimed
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Notes <span className="font-normal text-slate-400">(required)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                if (error) setError("");
              }}
              rows={3}
              placeholder="Why is this status changing? e.g. Paid out via bank transfer on 25/09."
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <div className="mt-1 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => {
                if (!notes.trim()) {
                  setError("Notes are required to update a reward.");
                  return;
                }
                onSubmit({ claimed, notes: notes.trim() });
              }}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AuditTrailModal = ({
  open,
  entityId,
  onClose,
}: {
  open: boolean;
  entityId: string | null;
  onClose: () => void;
}) => {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-reward-audit", entityId],
    enabled: open && !!entityId,
    queryFn: async () => {
      const res = await getAdminAuditLogs({ entity: "Reward", entityId: entityId! });
      return res?.data?.payload?.data ?? [];
    },
  });

  if (!open) return null;

  const logs = data ?? [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <MdHistory size={20} /> Change History
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <MdClose size={20} />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto px-6 py-5">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Loading history...
            </p>
          ) : logs.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-400">
              No changes have been recorded for this reward yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {logs.map((log: any) => (
                <li
                  key={log.id}
                  className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-800">
                      {log.actorEmail}
                    </p>
                    <span className="text-xs text-slate-400">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                    {log.actorRole}
                  </p>

                  {log.changes && Object.keys(log.changes).length > 0 && (
                    <ul className="mt-2 space-y-1 text-xs text-slate-600">
                      {Object.entries(log.changes).map(
                        ([field, diff]: [string, any]) => (
                          <li key={field}>
                            <span className="font-semibold capitalize">
                              {field}
                            </span>
                            : {String(diff.before)} → {String(diff.after)}
                          </li>
                        ),
                      )}
                    </ul>
                  )}

                  {log.notes && (
                    <p className="mt-2 text-xs italic text-slate-500">
                      &ldquo;{log.notes}&rdquo;
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default function RewardsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [source, setSource] = useState("");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<RewardRow | null>(null);
  const [historyFor, setHistoryFor] = useState<string | null>(null);

  const { data: summary } = useQuery({
    queryKey: ["admin-reward-summary"],
    queryFn: async () => {
      const res = await getAdminRewardSummary();
      return res?.data?.payload;
    },
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-rewards", search, status, source, page],
    queryFn: async () => {
      const res = await getAdminRewards({
        search: search || undefined,
        status: (status || undefined) as "claimed" | "unclaimed" | undefined,
        source: (source || undefined) as
          | "QUIZ"
          | "REFERRAL"
          | "RANK_UNLOCK"
          | undefined,
        page,
        limit: 20,
      });
      return res?.data?.payload as {
        data: RewardRow[];
        meta: { total: number; page: number; limit: number; totalPages: number };
      };
    },
  });

  const rewards = data?.data ?? [];

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { claimed: boolean; notes: string };
    }) => updateAdminReward(id, payload),
    onSuccess: () => {
      toast.success("Reward updated successfully.");
      setEditing(null);
      queryClient.invalidateQueries({ queryKey: ["admin-rewards"] });
      queryClient.invalidateQueries({ queryKey: ["admin-reward-summary"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to update reward.",
      );
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Rewards"
        subtitle="Review and update reward claim status, with a full change history for every edit."
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          icon={MdHourglassEmpty}
          title="Unclaimed"
          value={summary?.unclaimedCount?.toLocaleString() ?? "—"}
        />
        <StatCard
          icon={MdCardGiftcard}
          title="Unclaimed Value"
          value={
            summary ? formatCurrency(summary.unclaimedValue) : "—"
          }
        />
        <StatCard
          icon={MdCheckCircle}
          title="Claimed"
          value={summary?.claimedCount?.toLocaleString() ?? "—"}
        />
        <StatCard
          icon={MdCardGiftcard}
          title="Claimed Value"
          value={summary ? formatCurrency(summary.claimedValue) : "—"}
        />
      </div>

      <AdminCard className="flex flex-col gap-3">
        <div className="relative w-full">
          <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by user name or email..."
            className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white transition-colors"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
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
          <div className="w-full sm:w-48">
            <CustomSelect
              options={SOURCE_OPTIONS}
              value={source}
              placeholder="All Sources"
              onChange={(value: string) => {
                setSource(value);
                setPage(1);
              }}
            />
          </div>
        </div>
      </AdminCard>

      <RewardEditModal
        open={!!editing}
        reward={editing}
        loading={updateMutation.isPending}
        onClose={() => setEditing(null)}
        onSubmit={(payload) => {
          if (editing) updateMutation.mutate({ id: editing.id, payload });
        }}
      />

      <AuditTrailModal
        open={!!historyFor}
        entityId={historyFor}
        onClose={() => setHistoryFor(null)}
      />

      <AdminCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3.5 font-bold">User</th>
                <th className="px-6 py-3.5 font-bold">Source</th>
                <th className="px-6 py-3.5 font-bold text-right">Value</th>
                <th className="px-6 py-3.5 font-bold">Status</th>
                <th className="px-6 py-3.5 font-bold">Notes</th>
                <th className="px-6 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                    Loading rewards...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-red-400">
                    Unable to load rewards. Please try again.
                  </td>
                </tr>
              ) : rewards.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <MdCardGiftcard size={28} className="text-slate-300" />
                      <p className="font-semibold text-slate-500">
                        No rewards found
                      </p>
                      <p className="text-xs text-slate-400">
                        Try adjusting your search or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                rewards.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800">
                        {r.userDetails.user.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        {r.userDetails.user.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {SOURCE_LABELS[r.source] ?? r.source}
                    </td>
                    <td className="font-data px-6 py-4 text-right font-semibold text-slate-800">
                      {formatCurrency(r.value)}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={r.claimed ? "success" : "warning"}>
                        {r.claimed ? "Claimed" : "Unclaimed"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 max-w-56 truncate text-slate-500">
                      {r.notes || "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setHistoryFor(r.id)}
                          aria-label="View change history"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                        >
                          <MdHistory size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditing(r)}
                          aria-label="Edit reward"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                        >
                          <FaPen size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          meta={data?.meta}
          onPageChange={setPage}
          itemLabel="rewards"
        />
      </AdminCard>
    </div>
  );
}
