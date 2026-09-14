"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminCard from "@/components/ui/cards/AdminCard";
import Badge, { BadgeStatus } from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/modals/ConfirmDialog";
import CustomSelect from "@/components/ui/FormItems/CustomSelect";
import {
  getStudioQuizById,
  updateStudioQuizStatus,
  addStudioQuizParticipant,
  removeStudioQuizParticipant,
  uploadStudioQuizResults,
  getAdminUsers,
} from "@/lib/api/apis";
import { cn } from "@/lib/utils/cn";
import toast from "react-hot-toast";
import {
  MdArrowBack,
  MdEventSeat,
  MdPersonAdd,
  MdClose,
  MdEmojiEvents,
  MdOpenInNew,
} from "react-icons/md";
import { FaTrash } from "react-icons/fa";

const STATUS_BADGE: Record<string, BadgeStatus> = {
  UPCOMING: "info",
  ONGOING: "warning",
  COMPLETED: "success",
  CANCELLED: "inactive",
};

const STATUS_OPTIONS = [
  { label: "Upcoming", value: "UPCOMING" },
  { label: "Ongoing", value: "ONGOING" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Cancelled", value: "CANCELLED" },
];

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "participants", label: "Participants" },
  { key: "results", label: "Results" },
  { key: "payouts", label: "Payouts" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";

// Search-as-you-type user picker used by both the "add participant" and
// "add result" forms — resolves to a `userDetailsId`, which is what the
// StudioQuizParticipant/Result models key on (not the User id).
const UserPicker = ({
  value,
  onSelect,
}: {
  value: { userDetailsId: string; name: string } | null;
  onSelect: (user: { userDetailsId: string; name: string } | null) => void;
}) => {
  const [search, setSearch] = useState("");
  const { data } = useQuery({
    queryKey: ["admin-user-picker", search],
    enabled: search.length > 1,
    queryFn: async () => {
      const res = await getAdminUsers({ search, page: 1, limit: 8 });
      return res?.data?.payload?.data ?? [];
    },
  });

  if (value) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm">
        <span className="font-semibold text-slate-800">{value.name}</span>
        <button
          type="button"
          onClick={() => onSelect(null)}
          className="text-slate-400 hover:text-slate-700"
          aria-label="Clear selected user"
        >
          <MdClose size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search users by name or email..."
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
      />
      {data && data.length > 0 && (
        <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-100 bg-white py-1 shadow-lg">
          {data.map((u: any) =>
            u.details?.id ? (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  onSelect({ userDetailsId: u.details.id, name: u.name });
                  setSearch("");
                }}
                className="flex w-full flex-col px-3.5 py-2 text-left hover:bg-slate-50"
              >
                <span className="text-sm font-semibold text-slate-800">
                  {u.name}
                </span>
                <span className="text-xs text-slate-400">{u.email}</span>
              </button>
            ) : null,
          )}
        </div>
      )}
    </div>
  );
};

export default function StudioQuizDetailPage() {
  const { studioQuizId } = useParams<{ studioQuizId: string }>();
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<TabKey>("overview");
  const [addParticipantOpen, setAddParticipantOpen] = useState(false);
  const [addResultOpen, setAddResultOpen] = useState(false);
  const [pendingRemove, setPendingRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { data: quiz, isLoading, isError } = useQuery({
    queryKey: ["admin-studio-quiz-detail", studioQuizId],
    enabled: !!studioQuizId,
    queryFn: async () => {
      const res = await getStudioQuizById(studioQuizId);
      return res?.data?.payload;
    },
  });

  const invalidate = () =>
    queryClient.invalidateQueries({
      queryKey: ["admin-studio-quiz-detail", studioQuizId],
    });

  const statusMutation = useMutation({
    mutationFn: (status: string) => updateStudioQuizStatus(studioQuizId, status),
    onSuccess: () => {
      toast.success("Status updated.");
      invalidate();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to update status.");
    },
  });

  const removeMutation = useMutation({
    mutationFn: (participantId: string) =>
      removeStudioQuizParticipant(studioQuizId, participantId),
    onSuccess: () => {
      toast.success("Participant removed.");
      setPendingRemove(null);
      invalidate();
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Failed to remove participant.",
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

  if (isError || !quiz) {
    return (
      <AdminCard className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="font-semibold text-slate-700">
          Unable to load this studio quiz
        </p>
        <Link
          href="/genuslab/studio-quizzes"
          className="mt-2 text-sm font-bold text-blue-600 hover:underline"
        >
          Back to Studio Quizzes
        </Link>
      </AdminCard>
    );
  }

  const participants = quiz.participants ?? [];
  const results = quiz.results ?? [];
  const payouts = results.filter((r: any) => Number(r.prize) > 0);

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/genuslab/studio-quizzes"
        className="flex w-fit items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800"
      >
        <MdArrowBack size={16} /> Back to Studio Quizzes
      </Link>

      <ConfirmDialog
        open={!!pendingRemove}
        title="Remove this participant?"
        description={
          <>
            <span className="font-semibold text-slate-700">
              {pendingRemove?.name}
            </span>{" "}
            will be removed from this studio quiz&apos;s roster.
          </>
        }
        confirmLabel="Remove"
        loading={removeMutation.isPending}
        onCancel={() => setPendingRemove(null)}
        onConfirm={() => pendingRemove && removeMutation.mutate(pendingRemove.id)}
      />

      <AdminCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <MdEventSeat size={24} />
            </span>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-slate-900">
                {quiz.title}
              </h1>
              <p className="text-sm text-slate-500">
                {quiz.month} &middot; {quiz.weeks?.length ?? 0} weeks
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge status={STATUS_BADGE[quiz.status] || "inactive"}>
              {quiz.status}
            </Badge>
            <div className="w-40">
              <CustomSelect
                options={STATUS_OPTIONS}
                value={quiz.status}
                onChange={(value: string) => statusMutation.mutate(value)}
              />
            </div>
          </div>
        </div>
      </AdminCard>

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
            {label} {key === "participants" && `(${participants.length})`}
            {key === "results" && `(${results.length})`}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AdminCard>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
              Session Details
            </h2>
            <div className="flex flex-col gap-2.5 text-sm">
              <div className="flex justify-between border-b border-slate-50 py-2">
                <span className="text-slate-500">Description</span>
                <span className="max-w-[60%] text-right font-semibold text-slate-800">
                  {quiz.description || "—"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 py-2">
                <span className="text-slate-500">Scheduled at</span>
                <span className="font-semibold text-slate-800">
                  {quiz.scheduledAt ? formatDate(quiz.scheduledAt) : "—"}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-50 py-2">
                <span className="text-slate-500">Created</span>
                <span className="font-semibold text-slate-800">
                  {formatDate(quiz.createdAt)}
                </span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-500">Weeks</span>
                <span className="font-semibold text-slate-800">
                  {(quiz.weeks ?? []).join(", ") || "—"}
                </span>
              </div>
            </div>
          </AdminCard>

          <AdminCard>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-400">
              Media
            </h2>
            {quiz.mediaUrl || quiz.attachmentUrl ? (
              <div className="flex flex-col gap-2">
                {quiz.mediaUrl && (
                  <a
                    href={quiz.mediaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:underline"
                  >
                    View media <MdOpenInNew size={14} />
                  </a>
                )}
                {quiz.attachmentUrl && (
                  <a
                    href={quiz.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:underline"
                  >
                    View attachment <MdOpenInNew size={14} />
                  </a>
                )}
              </div>
            ) : (
              <p className="text-sm text-slate-400">
                No media or attachment uploaded for this session.
              </p>
            )}
          </AdminCard>
        </div>
      )}

      {tab === "participants" && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setAddParticipantOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              <MdPersonAdd size={18} /> Add Participant
            </button>
          </div>

          {addParticipantOpen && (
            <AddParticipantForm
              studioQuizId={studioQuizId}
              onClose={() => setAddParticipantOpen(false)}
              onAdded={invalidate}
            />
          )}

          <AdminCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">User</th>
                    <th className="px-6 py-3.5 font-bold">Week</th>
                    <th className="px-6 py-3.5 font-bold text-right">Position</th>
                    <th className="px-6 py-3.5 font-bold text-right">Score</th>
                    <th className="px-6 py-3.5 font-bold">Source</th>
                    <th className="px-6 py-3.5 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {participants.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-14 text-center text-slate-400">
                        No participants on the roster yet.
                      </td>
                    </tr>
                  ) : (
                    participants.map((p: any) => (
                      <tr key={p.id}>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">
                            {p.userDetails?.user?.name ?? "Unknown"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {p.userDetails?.user?.email}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-slate-500">{p.week}</td>
                        <td className="font-data px-6 py-4 text-right text-slate-600">
                          #{p.position}
                        </td>
                        <td className="font-data px-6 py-4 text-right text-slate-600">
                          {p.score}
                        </td>
                        <td className="px-6 py-4">
                          <Badge status={p.isManual ? "warning" : "info"}>
                            {p.isManual ? "Manually Added" : "Auto-Selected"}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() =>
                              setPendingRemove({
                                id: p.id,
                                name: p.userDetails?.user?.name ?? "this participant",
                              })
                            }
                            aria-label="Remove participant"
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <FaTrash size={13} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </div>
      )}

      {tab === "results" && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setAddResultOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              <MdEmojiEvents size={18} /> Add Result
            </button>
          </div>

          {addResultOpen && (
            <AddResultForm
              studioQuizId={studioQuizId}
              onClose={() => setAddResultOpen(false)}
              onAdded={invalidate}
            />
          )}

          <AdminCard className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5 font-bold">User</th>
                    <th className="px-6 py-3.5 font-bold text-right">Position</th>
                    <th className="px-6 py-3.5 font-bold text-right">Score</th>
                    <th className="px-6 py-3.5 font-bold text-right">Prize</th>
                    <th className="px-6 py-3.5 font-bold">Evidence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-14 text-center text-slate-400">
                        No results recorded yet.
                      </td>
                    </tr>
                  ) : (
                    results.map((r: any) => (
                      <tr key={r.id}>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-slate-800">
                            {r.userDetails?.user?.name ?? "Unknown"}
                          </p>
                          <p className="text-xs text-slate-400">
                            {r.userDetails?.user?.email}
                          </p>
                        </td>
                        <td className="font-data px-6 py-4 text-right text-slate-600">
                          {r.position ? `#${r.position}` : "—"}
                        </td>
                        <td className="font-data px-6 py-4 text-right text-slate-600">
                          {r.score}
                        </td>
                        <td className="font-data px-6 py-4 text-right font-semibold text-slate-800">
                          {r.prize ? `₦${Number(r.prize).toLocaleString()}` : "—"}
                        </td>
                        <td className="px-6 py-4">
                          {r.evidenceUrl ? (
                            <a
                              href={r.evidenceUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View
                            </a>
                          ) : (
                            "—"
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </AdminCard>
        </div>
      )}

      {tab === "payouts" && (
        <AdminCard className="p-0 overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <p className="text-sm text-slate-500">
              Results with a prize assigned. Actual payout execution and
              reconciliation happens in{" "}
              <Link
                href="/genuslab/finance"
                className="font-semibold text-blue-600 hover:underline"
              >
                Finance & Banks
              </Link>
              .
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-3.5 font-bold">User</th>
                  <th className="px-6 py-3.5 font-bold text-right">Position</th>
                  <th className="px-6 py-3.5 font-bold text-right">Prize</th>
                  <th className="px-6 py-3.5 font-bold">Evidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payouts.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-14 text-center text-slate-400">
                      No prize payouts recorded for this session.
                    </td>
                  </tr>
                ) : (
                  payouts.map((r: any) => (
                    <tr key={r.id}>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">
                          {r.userDetails?.user?.name ?? "Unknown"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {r.userDetails?.user?.email}
                        </p>
                      </td>
                      <td className="font-data px-6 py-4 text-right text-slate-600">
                        #{r.position}
                      </td>
                      <td className="font-data px-6 py-4 text-right font-semibold text-slate-800">
                        ₦{Number(r.prize).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        {r.evidenceUrl ? (
                          <a
                            href={r.evidenceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </AdminCard>
      )}
    </div>
  );
}

const AddParticipantForm = ({
  studioQuizId,
  onClose,
  onAdded,
}: {
  studioQuizId: string;
  onClose: () => void;
  onAdded: () => void;
}) => {
  const [user, setUser] = useState<{ userDetailsId: string; name: string } | null>(
    null,
  );
  const [week, setWeek] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      addStudioQuizParticipant(studioQuizId, {
        userDetailsId: user!.userDetailsId,
        week,
      }),
    onSuccess: () => {
      toast.success("Participant added.");
      onAdded();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to add participant.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setError("Select a user.");
    if (!/^\d{4}-\d{1,2}$/.test(week))
      return setError("Week must be an ISO week key, e.g. 2026-37.");
    setError("");
    mutation.mutate();
  };

  return (
    <AdminCard>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Add Participant</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-700"
          >
            <MdClose size={18} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">User</label>
            <UserPicker value={user} onSelect={setUser} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Week (ISO, e.g. 2026-37)
            </label>
            <input
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              placeholder="2026-37"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Adding..." : "Add Participant"}
          </button>
        </div>
      </form>
    </AdminCard>
  );
};

const AddResultForm = ({
  studioQuizId,
  onClose,
  onAdded,
}: {
  studioQuizId: string;
  onClose: () => void;
  onAdded: () => void;
}) => {
  const [user, setUser] = useState<{ userDetailsId: string; name: string } | null>(
    null,
  );
  const [score, setScore] = useState("");
  const [position, setPosition] = useState("");
  const [prize, setPrize] = useState("");
  const [evidenceUrl, setEvidenceUrl] = useState("");
  const [error, setError] = useState("");

  const mutation = useMutation({
    mutationFn: () =>
      uploadStudioQuizResults(studioQuizId, {
        results: [
          {
            userDetailsId: user!.userDetailsId,
            score: Number(score),
            position: position ? Number(position) : undefined,
            prize: prize ? Number(prize) : undefined,
            evidenceUrl: evidenceUrl.trim() || undefined,
          },
        ],
        markCompleted: false,
      }),
    onSuccess: () => {
      toast.success("Result recorded.");
      onAdded();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to record result.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return setError("Select a user.");
    if (score === "" || Number.isNaN(Number(score)))
      return setError("Score must be a number.");
    setError("");
    mutation.mutate();
  };

  return (
    <AdminCard>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900">Add Result</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-slate-400 hover:text-slate-700"
          >
            <MdClose size={18} />
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="col-span-2 flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">User</label>
            <UserPicker value={user} onSelect={setUser} />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Score</label>
            <input
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Position <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="number"
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Prize (₦) <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="number"
              value={prize}
              onChange={(e) => setPrize(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Evidence URL <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              value={evidenceUrl}
              onChange={(e) => setEvidenceUrl(e.target.value)}
              placeholder="https://..."
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending}
            className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {mutation.isPending ? "Saving..." : "Add Result"}
          </button>
        </div>
      </form>
    </AdminCard>
  );
};
