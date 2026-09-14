"use client";

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import ConfirmDialog from "@/components/ui/modals/ConfirmDialog";
import {
  getAdminRanks,
  createAdminRank,
  updateAdminRank,
  deleteAdminRank,
  RankInput,
} from "@/lib/api/apis";
import toast from "react-hot-toast";
import { MdMilitaryTech, MdAdd, MdClose } from "react-icons/md";
import { FaTrash, FaPen } from "react-icons/fa";

interface RankRow extends RankInput {
  id: string;
  _count: { userDetails: number };
}

const emptyForm: RankInput = {
  rank: 0,
  rankName: "",
  unlockXp: 0,
  multiplier: 1,
  reward: 0,
  topics: [],
};

const RankFormModal = ({
  open,
  initial,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  initial: (RankInput & { id?: string }) | null;
  onClose: () => void;
  onSubmit: (data: RankInput) => void;
  loading: boolean;
}) => {
  const [form, setForm] = useState<RankInput>(emptyForm);
  const [topicsText, setTopicsText] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      const base = initial ?? emptyForm;
      setForm(base);
      setTopicsText((base.topics ?? []).join(", "));
      setErrors({});
    }
  }, [open, initial]);

  if (!open) return null;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.rankName.trim()) next.rankName = "Rank name is required.";
    if (!Number.isFinite(form.rank) || form.rank <= 0)
      next.rank = "Rank tier must be a positive number.";
    if (!Number.isFinite(form.unlockXp) || form.unlockXp < 0)
      next.unlockXp = "Unlock XP must be zero or greater.";
    if (!Number.isFinite(form.multiplier) || form.multiplier <= 0)
      next.multiplier = "Multiplier must be greater than zero.";
    if (!Number.isFinite(form.reward) || form.reward < 0)
      next.reward = "Monetary reward must be zero or greater.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const topics = topicsText
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    onSubmit({ ...form, topics });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            {initial?.id ? "Edit Rank" : "Create Rank"}
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Basic Information
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Rank name
                </label>
                <input
                  value={form.rankName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, rankName: e.target.value }))
                  }
                  placeholder="e.g. Trivia Titan"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                />
                {errors.rankName && (
                  <p className="text-xs text-red-500">{errors.rankName}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Rank tier
                </label>
                <input
                  type="number"
                  value={form.rank || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, rank: Number(e.target.value) }))
                  }
                  placeholder="1 = highest"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                />
                {errors.rank && (
                  <p className="text-xs text-red-500">{errors.rank}</p>
                )}
              </div>
            </div>
          </div>

          <div>
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Configuration
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Unlock XP
                </label>
                <input
                  type="number"
                  value={form.unlockXp || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, unlockXp: Number(e.target.value) }))
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                />
                {errors.unlockXp && (
                  <p className="text-xs text-red-500">{errors.unlockXp}</p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Multiplier
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.multiplier || ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      multiplier: Number(e.target.value),
                    }))
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                />
                {errors.multiplier && (
                  <p className="text-xs text-red-500">{errors.multiplier}</p>
                )}
              </div>

              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Monetary reward (₦)
                </label>
                <input
                  type="number"
                  value={form.reward || ""}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, reward: Number(e.target.value) }))
                  }
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                />
                {errors.reward && (
                  <p className="text-xs text-red-500">{errors.reward}</p>
                )}
              </div>

              <div className="col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-medium text-slate-700">
                  Topics{" "}
                  <span className="font-normal text-slate-400">
                    (comma-separated, optional)
                  </span>
                </label>
                <input
                  value={topicsText}
                  onChange={(e) => setTopicsText(e.target.value)}
                  placeholder="e.g. Machine learning, Data science"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
                />
              </div>
            </div>
          </div>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : initial?.id
                  ? "Save Changes"
                  : "Create Rank"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function RanksPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<(RankInput & { id?: string }) | null>(
    null,
  );
  const [pendingDelete, setPendingDelete] = useState<RankRow | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-ranks"],
    queryFn: async () => {
      const res = await getAdminRanks();
      return (res?.data?.payload ?? []) as RankRow[];
    },
  });

  const ranks = data ?? [];

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-ranks"] });

  const createMutation = useMutation({
    mutationFn: (payload: RankInput) => createAdminRank(payload),
    onSuccess: () => {
      toast.success("Rank created successfully.");
      setModalOpen(false);
      invalidate();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to create rank.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RankInput }) =>
      updateAdminRank(id, payload),
    onSuccess: () => {
      toast.success("Rank updated successfully.");
      setModalOpen(false);
      invalidate();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update rank.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminRank(id),
    onSuccess: () => {
      toast.success("Rank removed.");
      setPendingDelete(null);
      invalidate();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message ||
          "This rank couldn't be removed — it may still be in use.",
      );
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Ranks & XP"
        subtitle="Configure rank tiers, XP thresholds, and reward multipliers."
        actions={
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            <MdAdd size={18} /> Create Rank
          </button>
        }
      />

      <RankFormModal
        open={modalOpen}
        initial={editing}
        loading={createMutation.isPending || updateMutation.isPending}
        onClose={() => setModalOpen(false)}
        onSubmit={(payload) => {
          if (editing?.id) {
            updateMutation.mutate({ id: editing.id, payload });
          } else {
            createMutation.mutate(payload);
          }
        }}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this rank?"
        description={
          <>
            <span className="font-semibold text-slate-700">
              {pendingDelete?.rankName}
            </span>{" "}
            will be permanently removed. This only succeeds if no users or
            questions are currently assigned to it.
          </>
        }
        confirmLabel="Delete Rank"
        loading={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
      />

      <AdminCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3.5 font-bold">Rank</th>
                <th className="px-6 py-3.5 font-bold text-right">
                  Required XP
                </th>
                <th className="px-6 py-3.5 font-bold text-right">
                  Multiplier
                </th>
                <th className="px-6 py-3.5 font-bold text-right">Reward</th>
                <th className="px-6 py-3.5 font-bold text-right">Users</th>
                <th className="px-6 py-3.5 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                    Loading ranks...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-red-400">
                    Unable to load ranks. Please try again.
                  </td>
                </tr>
              ) : ranks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <MdMilitaryTech size={28} className="text-slate-300" />
                      <p className="font-semibold text-slate-500">
                        No ranks configured yet
                      </p>
                      <p className="text-xs text-slate-400">
                        Create your first rank tier to begin XP progression.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                ranks.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-50 text-xs font-bold text-purple-600">
                          #{r.rank}
                        </span>
                        <p className="font-bold text-slate-800">{r.rankName}</p>
                      </div>
                    </td>
                    <td className="font-data px-6 py-4 text-right text-slate-600">
                      {r.unlockXp.toLocaleString()}
                    </td>
                    <td className="font-data px-6 py-4 text-right text-slate-600">
                      {r.multiplier}×
                    </td>
                    <td className="font-data px-6 py-4 text-right font-semibold text-slate-800">
                      ₦{Number(r.reward).toLocaleString()}
                    </td>
                    <td className="font-data px-6 py-4 text-right text-slate-600">
                      {r._count.userDetails.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(r);
                            setModalOpen(true);
                          }}
                          aria-label={`Edit ${r.rankName}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                        >
                          <FaPen size={13} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(r)}
                          aria-label={`Delete ${r.rankName}`}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                        >
                          <FaTrash size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
