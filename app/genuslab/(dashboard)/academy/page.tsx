"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import ConfirmDialog from "@/components/ui/modals/ConfirmDialog";
import {
  getAdminRanks,
  createAdminRank,
  updateAdminRank,
  RankInput,
  getAdminCourses,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
} from "@/lib/api/apis";
import toast from "react-hot-toast";
import {
  MdMilitaryTech,
  MdAdd,
  MdClose,
  MdExpandMore,
  MdSchool,
} from "react-icons/md";
import { FaTrash, FaPen } from "react-icons/fa";

interface RankRow extends RankInput {
  id: string;
  _count: { userDetails: number };
}

interface CourseRow {
  id: string;
  rankId: string;
  title: string;
  description: string | null;
  order: number;
  rank: { id: string; rank: number; rankName: string };
  _count: { enrollments: number };
}

const emptyRankForm: RankInput = {
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
  const [form, setForm] = useState<RankInput>(emptyRankForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      setForm(initial ?? emptyRankForm);
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
    onSubmit(form);
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
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <MdClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
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

            <div className="flex flex-col gap-1.5">
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

interface CourseFormValues {
  title: string;
  description: string;
  order: number;
}

const CourseFormModal = ({
  open,
  rankName,
  initial,
  onClose,
  onSubmit,
  loading,
}: {
  open: boolean;
  rankName?: string;
  initial: (CourseFormValues & { id?: string }) | null;
  onClose: () => void;
  onSubmit: (data: CourseFormValues) => void;
  loading: boolean;
}) => {
  const [form, setForm] = useState<CourseFormValues>({
    title: "",
    description: "",
    order: 0,
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setForm(initial ?? { title: "", description: "", order: 0 });
      setError("");
    }
  }, [open, initial]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setError("Course title is required.");
      return;
    }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {initial?.id ? "Edit Course" : "Add Course"}
            </h2>
            {rankName && (
              <p className="text-xs text-slate-400">for {rankName}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <MdClose size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Course title
            </label>
            <input
              value={form.title}
              onChange={(e) => {
                setForm((f) => ({ ...f, title: e.target.value }));
                if (error) setError("");
              }}
              placeholder="e.g. Advanced cybersecurity"
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Description{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              placeholder="What this course covers, shown to users on the Courses page."
              className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">
              Display order
            </label>
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm((f) => ({ ...f, order: Number(e.target.value) }))
              }
              className="w-32 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm outline-none focus:border-blue-400 focus:bg-white"
            />
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
              {loading ? "Saving..." : initial?.id ? "Save Changes" : "Add Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AcademyPage() {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const [rankModalOpen, setRankModalOpen] = useState(false);
  const [editingRank, setEditingRank] = useState<
    (RankInput & { id?: string }) | null
  >(null);

  const [courseModalOpen, setCourseModalOpen] = useState(false);
  const [courseTargetRankId, setCourseTargetRankId] = useState<string | null>(
    null,
  );
  const [editingCourse, setEditingCourse] = useState<
    (CourseFormValues & { id?: string }) | null
  >(null);
  const [pendingDeleteCourse, setPendingDeleteCourse] =
    useState<CourseRow | null>(null);

  const { data: ranks = [], isLoading: ranksLoading } = useQuery({
    queryKey: ["admin-ranks"],
    queryFn: async () => {
      const res = await getAdminRanks();
      return (res?.data?.payload ?? []) as RankRow[];
    },
  });

  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const res = await getAdminCourses();
      return (res?.data?.payload ?? []) as CourseRow[];
    },
  });

  const coursesByRank = useMemo(() => {
    const map = new Map<string, CourseRow[]>();
    for (const course of courses) {
      const list = map.get(course.rankId) ?? [];
      list.push(course);
      map.set(course.rankId, list);
    }
    return map;
  }, [courses]);

  const invalidateRanks = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-ranks"] });
  const invalidateCourses = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-courses"] });

  const createRankMutation = useMutation({
    mutationFn: (payload: RankInput) => createAdminRank(payload),
    onSuccess: () => {
      toast.success("Rank created successfully.");
      setRankModalOpen(false);
      invalidateRanks();
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Failed to create rank."),
  });

  const updateRankMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: RankInput }) =>
      updateAdminRank(id, payload),
    onSuccess: () => {
      toast.success("Rank updated successfully.");
      setRankModalOpen(false);
      invalidateRanks();
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Failed to update rank."),
  });

  const createCourseMutation = useMutation({
    mutationFn: (payload: CourseFormValues & { rankId: string }) =>
      createAdminCourse(payload),
    onSuccess: () => {
      toast.success("Course added.");
      setCourseModalOpen(false);
      invalidateCourses();
    },
    onError: (error: any) =>
      toast.error(error?.response?.data?.message || "Failed to add course."),
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CourseFormValues;
    }) => updateAdminCourse(id, payload),
    onSuccess: () => {
      toast.success("Course updated.");
      setCourseModalOpen(false);
      invalidateCourses();
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.message || "Failed to update course.",
      ),
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: string) => deleteAdminCourse(id),
    onSuccess: () => {
      toast.success("Course removed.");
      setPendingDeleteCourse(null);
      invalidateCourses();
    },
    onError: (error: any) =>
      toast.error(
        error?.response?.data?.message || "Failed to remove course.",
      ),
  });

  const toggleExpanded = (rankId: string) =>
    setExpanded((prev) => ({ ...prev, [rankId]: !prev[rankId] }));

  const isLoading = ranksLoading || coursesLoading;

  return (
    <div className="flex flex-col gap-6 w-full">
      <AdminPageHeader
        title="Academy"
        subtitle="Manage rank tiers and the courses unlocked at each one."
        actions={
          <button
            type="button"
            onClick={() => {
              setEditingRank(null);
              setRankModalOpen(true);
            }}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
          >
            <MdAdd size={18} /> Create Rank
          </button>
        }
      />

      <RankFormModal
        open={rankModalOpen}
        initial={editingRank}
        loading={createRankMutation.isPending || updateRankMutation.isPending}
        onClose={() => setRankModalOpen(false)}
        onSubmit={(payload) => {
          if (editingRank?.id) {
            updateRankMutation.mutate({ id: editingRank.id, payload });
          } else {
            createRankMutation.mutate(payload);
          }
        }}
      />

      <CourseFormModal
        open={courseModalOpen}
        rankName={
          ranks.find((r) => r.id === courseTargetRankId)?.rankName ??
          ranks.find((r) => r.id === editingCourse?.id)?.rankName
        }
        initial={editingCourse}
        loading={
          createCourseMutation.isPending || updateCourseMutation.isPending
        }
        onClose={() => setCourseModalOpen(false)}
        onSubmit={(payload) => {
          if (editingCourse?.id) {
            updateCourseMutation.mutate({ id: editingCourse.id, payload });
          } else if (courseTargetRankId) {
            createCourseMutation.mutate({
              ...payload,
              rankId: courseTargetRankId,
            });
          }
        }}
      />

      <ConfirmDialog
        open={!!pendingDeleteCourse}
        title="Remove this course?"
        description={
          <>
            <span className="font-semibold text-slate-700">
              {pendingDeleteCourse?.title}
            </span>{" "}
            will no longer be available to users, including anyone currently
            enrolled in it.
          </>
        }
        confirmLabel="Remove Course"
        loading={deleteCourseMutation.isPending}
        onCancel={() => setPendingDeleteCourse(null)}
        onConfirm={() =>
          pendingDeleteCourse &&
          deleteCourseMutation.mutate(pendingDeleteCourse.id)
        }
      />

      {isLoading ? (
        <AdminCard>
          <p className="py-10 text-center text-sm text-slate-400">
            Loading academy data...
          </p>
        </AdminCard>
      ) : ranks.length === 0 ? (
        <AdminCard>
          <div className="flex flex-col items-center gap-2 py-14 text-center">
            <MdMilitaryTech size={28} className="text-slate-300" />
            <p className="font-semibold text-slate-500">
              No ranks configured yet
            </p>
            <p className="text-xs text-slate-400">
              Create your first rank tier to start building out the Academy.
            </p>
          </div>
        </AdminCard>
      ) : (
        <div className="flex flex-col gap-4">
          {ranks.map((rank) => {
            const rankCourses = coursesByRank.get(rank.id) ?? [];
            const isOpen = expanded[rank.id] ?? false;

            return (
              <AdminCard key={rank.id} className="overflow-hidden p-0">
                <button
                  type="button"
                  onClick={() => toggleExpanded(rank.id)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left hover:bg-slate-50/70"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-50 text-xs font-bold text-purple-600">
                      #{rank.rank}
                    </span>
                    <div>
                      <p className="font-bold text-slate-800">
                        {rank.rankName}
                      </p>
                      <p className="text-xs text-slate-400">
                        {rank.unlockXp.toLocaleString()} XP &middot;{" "}
                        {rankCourses.length} course
                        {rankCourses.length === 1 ? "" : "s"} &middot;{" "}
                        {rank._count.userDetails.toLocaleString()} users
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      role="button"
                      tabIndex={0}
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingRank(rank);
                        setRankModalOpen(true);
                      }}
                      aria-label={`Edit ${rank.rankName}`}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                    >
                      <FaPen size={13} />
                    </span>
                    <MdExpandMore
                      size={22}
                      className={`text-slate-400 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-slate-100 px-6 py-5">
                    <div className="mb-4 flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                        Courses
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCourse(null);
                          setCourseTargetRankId(rank.id);
                          setCourseModalOpen(true);
                        }}
                        className="flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600 hover:bg-blue-100"
                      >
                        <MdAdd size={14} /> Add Course
                      </button>
                    </div>

                    {rankCourses.length === 0 ? (
                      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-slate-200 py-8 text-center">
                        <MdSchool size={22} className="text-slate-300" />
                        <p className="text-sm text-slate-400">
                          No courses assigned to this rank yet.
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col divide-y divide-slate-100">
                        {rankCourses
                          .slice()
                          .sort((a, b) => a.order - b.order)
                          .map((course) => (
                            <div
                              key={course.id}
                              className="flex items-center justify-between gap-4 py-3"
                            >
                              <div className="min-w-0">
                                <p className="truncate font-semibold text-slate-800">
                                  {course.title}
                                </p>
                                {course.description && (
                                  <p className="truncate text-xs text-slate-400">
                                    {course.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex shrink-0 items-center gap-3">
                                <span className="text-xs text-slate-400">
                                  {course._count.enrollments} enrolled
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCourse({
                                      id: course.id,
                                      title: course.title,
                                      description: course.description ?? "",
                                      order: course.order,
                                    });
                                    setCourseTargetRankId(course.rankId);
                                    setCourseModalOpen(true);
                                  }}
                                  aria-label={`Edit ${course.title}`}
                                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                                >
                                  <FaPen size={12} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setPendingDeleteCourse(course)}
                                  aria-label={`Delete ${course.title}`}
                                  className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                                >
                                  <FaTrash size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </AdminCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
