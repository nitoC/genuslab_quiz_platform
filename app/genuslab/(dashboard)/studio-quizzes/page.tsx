"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import AdminPagination from "@/components/ui/AdminPagination";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import Badge, { BadgeStatus } from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/modals/ConfirmDialog";
import {
  getStudioQuizzes,
  createStudioQuiz,
  deleteStudioQuiz,
  CreateStudioQuizInput,
} from "@/lib/api/apis";
import toast from "react-hot-toast";
import {
  MdEventSeat,
  MdAdd,
  MdClose,
  MdChevronRight,
  MdImage,
} from "react-icons/md";
import { FaTrash } from "react-icons/fa";

const STATUS_BADGE: Record<string, BadgeStatus> = {
  UPCOMING: "info",
  ONGOING: "warning",
  COMPLETED: "success",
  CANCELLED: "inactive",
};

const STATUS_OPTIONS = [
  { label: "All Statuses", value: "" },
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const currentMonthKey = () => {
  const now = new Date();
  return `${String(now.getMonth() + 1).padStart(2, "0")}-${now.getFullYear()}`;
};

const emptyForm: CreateStudioQuizInput = {
  title: "",
  month: currentMonthKey(),
  mediaUrl: "",
  autoAssignWinners: true,
  winnersPerWeek: 3,
};

const CreateStudioQuizModal = ({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) => {
  const [form, setForm] = useState<CreateStudioQuizInput>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const mutation = useMutation({
    mutationFn: (payload: CreateStudioQuizInput) => createStudioQuiz(payload),
    onSuccess: () => {
      toast.success("Studio quiz created.");
      setForm(emptyForm);
      onCreated();
      onClose();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to create studio quiz.",
      );
    },
  });

  if (!open) return null;

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (!/^(0[1-9]|1[0-2])-\d{4}$/.test(form.month))
      next.month = "Month must be in MM-yyyy format (e.g. 09-2026).";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({
      ...form,
      mediaUrl: form.mediaUrl?.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            Create Studio Quiz
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

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Title</label>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="e.g. September Championship"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Month (MM-yyyy)
            </label>
            <input
              value={form.month}
              onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}
              placeholder="09-2026"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
            {errors.month && <p className="text-xs text-red-500">{errors.month}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Media URL <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              value={form.mediaUrl}
              onChange={(e) =>
                setForm((f) => ({ ...f, mediaUrl: e.target.value }))
              }
              placeholder="https://..."
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>

          <label className="flex items-center gap-2.5 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.autoAssignWinners}
              onChange={(e) =>
                setForm((f) => ({ ...f, autoAssignWinners: e.target.checked }))
              }
              className="h-4 w-4 rounded border-slate-300"
            />
            Automatically compile weekly leaderboard winners as the roster
          </label>

          <div className="mt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={mutation.isPending}
              className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {mutation.isPending ? "Creating..." : "Create Studio Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function StudioQuizzesPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [createOpen, setCreateOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);
  const limit = 9;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-studio-quizzes", status, page],
    queryFn: async () => {
      const res = await getStudioQuizzes({
        status: status || undefined,
        page,
        limit,
      });
      return res?.data?.payload;
    },
  });

  const quizzes = data?.data ?? [];
  const meta = data?.meta;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteStudioQuiz(id),
    onSuccess: () => {
      toast.success("Studio quiz deleted.");
      setPendingDelete(null);
      queryClient.invalidateQueries({ queryKey: ["admin-studio-quizzes"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to delete studio quiz.",
      );
    },
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Studio Quizzes"
        subtitle="Manage monthly championship sessions, rosters, and results."
        actions={
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            <MdAdd size={18} /> Create Studio Quiz
          </button>
        }
      />

      <CreateStudioQuizModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() =>
          queryClient.invalidateQueries({ queryKey: ["admin-studio-quizzes"] })
        }
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this studio quiz?"
        description={
          <>
            <span className="font-semibold text-slate-700">
              {pendingDelete?.title}
            </span>{" "}
            will be permanently removed. This only succeeds if no results have
            been recorded yet.
          </>
        }
        confirmLabel="Delete"
        loading={deleteMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
      />

      <AdminCard className="flex flex-col sm:flex-row gap-3">
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

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-slate-100" />
          ))}
        </div>
      ) : isError ? (
        <AdminCard className="py-14 text-center text-red-400">
          Unable to load studio quizzes. Please try again.
        </AdminCard>
      ) : quizzes.length === 0 ? (
        <AdminCard className="flex flex-col items-center gap-2 py-16 text-center">
          <MdEventSeat size={32} className="text-slate-300" />
          <p className="font-semibold text-slate-600">
            No Studio Quiz sessions
          </p>
          <p className="text-sm text-slate-400">
            Create your first championship session to begin managing
            participants.
          </p>
        </AdminCard>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((q: any) => (
            <AdminCard key={q.id} className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {q.month}
                  </p>
                  <h3 className="mt-1 font-bold text-slate-900">{q.title}</h3>
                </div>
                <Badge status={STATUS_BADGE[q.status] || "inactive"}>
                  {q.status}
                </Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-slate-500">
                <span>{q.weeks?.length ?? 0} weeks</span>
                {q.mediaUrl && (
                  <span className="flex items-center gap-1">
                    <MdImage size={14} /> Media attached
                  </span>
                )}
              </div>

              <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3">
                <button
                  type="button"
                  onClick={() => setPendingDelete({ id: q.id, title: q.title })}
                  aria-label={`Delete ${q.title}`}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                >
                  <FaTrash size={13} />
                </button>
                <Link
                  href={`/genuslab/studio-quizzes/${q.id}`}
                  className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
                >
                  Manage <MdChevronRight size={16} />
                </Link>
              </div>
            </AdminCard>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <AdminCard className="p-0">
          <AdminPagination meta={meta} onPageChange={setPage} itemLabel="studio quizzes" />
        </AdminCard>
      )}
    </div>
  );
}
