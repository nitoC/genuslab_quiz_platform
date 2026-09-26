"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import GlassCard from "@/components/ui/cards/GlassCard";
import GlassBadge from "@/components/ui/GlassBadge";
import ProgressBar from "@/components/ui/ProgressBar";
import { getMyCourses, startCourse } from "@/lib/api/apis";
import toast from "react-hot-toast";
import {
  MdComputer,
  MdCode,
  MdSecurity,
  MdCloud,
  MdStorage,
  MdDeveloperMode,
  MdMemory,
  MdWifi,
  MdApps,
  MdSchool,
  MdLock,
  MdCheckCircle,
  MdPlayCircle,
} from "react-icons/md";
import { FaTrophy } from "react-icons/fa6";

const COURSE_ICONS = [
  MdComputer,
  MdCode,
  MdSecurity,
  MdCloud,
  MdStorage,
  MdDeveloperMode,
  MdMemory,
  MdWifi,
  MdApps,
  MdSchool,
];

interface CourseItem {
  id: string;
  title: string;
  description: string | null;
  status?: "IN_PROGRESS" | "COMPLETED" | null;
}

interface CoursesPayload {
  xp: number;
  currentRank: {
    id: string;
    rank: number;
    rankName: string;
    unlockXp: number;
  };
  hasBrokenCurrent: boolean;
  xpToUnlockCurrent: number;
  currentCourses: CourseItem[];
  isMaxRank: boolean;
  nextRank: {
    id: string;
    rank: number;
    rankName: string;
    unlockXp: number;
    xpToUnlock: number;
  } | null;
  nextCourses: { id: string; title: string; description: string | null }[];
}

const CoursesSkeleton = () => (
  <div className="flex flex-col gap-8 animate-pulse">
    <div className="h-36 rounded-md bg-white/10" />
    <div className="flex flex-col gap-4">
      <div className="h-6 w-40 rounded bg-white/10" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-44 rounded-md bg-white/10" />
        ))}
      </div>
    </div>
  </div>
);

const CourseCard = ({
  course,
  index,
  locked,
  onStart,
  starting,
}: {
  course:
    | CourseItem
    | { id: string; title: string; description: string | null };
  index: number;
  locked: boolean;
  onStart?: (id: string) => void;
  starting?: boolean;
}) => {
  const Icon = COURSE_ICONS[index % COURSE_ICONS.length];
  const status = "status" in course ? course.status : null;
  const isCompleted = status === "COMPLETED";
  const isInProgress = status === "IN_PROGRESS";

  return (
    <GlassCard
      className={`p-5 flex flex-col gap-4 transition-colors ${
        locked ? "opacity-60" : "hover:bg-white/5"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`p-3 rounded-lg ${
            locked ? "bg-white/5 text-grey" : "bg-blue/10 text-blue"
          }`}
        >
          <Icon size={20} />
        </div>
        {locked ? (
          <GlassBadge variant="neutral" icon={<MdLock size={12} />}>
            Locked
          </GlassBadge>
        ) : isCompleted ? (
          <GlassBadge variant="success" icon={<MdCheckCircle size={12} />}>
            Completed
          </GlassBadge>
        ) : isInProgress ? (
          <GlassBadge variant="info" icon={<MdPlayCircle size={12} />}>
            In progress
          </GlassBadge>
        ) : null}
      </div>

      <div className="flex-1">
        <h3 className="text-(--primary) font-bold">{course.title}</h3>
        {course.description && (
          <p className="mt-1 text-sm leading-relaxed text-grey">
            {course.description}
          </p>
        )}
      </div>

      {locked ? (
        <button
          disabled
          className="mt-auto flex items-center justify-center gap-2 rounded-sm bg-white/10 px-4 py-2.5 text-sm font-bold text-grey cursor-not-allowed"
        >
          <MdLock size={16} /> Locked
        </button>
      ) : (
        <button
          onClick={() => onStart?.(course.id)}
          disabled={starting || isCompleted}
          className="mt-auto flex items-center justify-center gap-2 rounded-sm bg-blue px-4 py-2.5 text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isCompleted
            ? "Completed"
            : isInProgress
              ? "Continue Learning"
              : starting
                ? "Starting..."
                : "Start Learning"}
        </button>
      )}
    </GlassCard>
  );
};

export default function CoursesPage() {
  const queryClient = useQueryClient();
  const [startingId, setStartingId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["my-courses"],
    queryFn: async () => {
      const res = await getMyCourses();
      return res?.data?.payload as CoursesPayload;
    },
  });

  const startMutation = useMutation({
    mutationFn: (courseId: string) => startCourse(courseId),
    onMutate: (courseId: string) => setStartingId(courseId),
    onSuccess: () => {
      toast.success("Course started — happy learning!");
      queryClient.invalidateQueries({ queryKey: ["my-courses"] });
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "Could not start this course",
      );
    },
    onSettled: () => setStartingId(null),
  });

  const hasUnlockedCourses =
    !!data && data.hasBrokenCurrent && data.currentCourses.length > 0;

  return (
    <Layout>
      <Header title="Courses" backBtn={false} />
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8 max-w-6xl mx-auto">
        {isLoading ? (
          <CoursesSkeleton />
        ) : isError || !data ? (
          <GlassCard>
            <div className="py-12 text-center text-sm font-medium text-red">
              Failed to load your courses. Please try again later.
            </div>
          </GlassCard>
        ) : (
          <>
            {/* PROGRESS HERO */}
            <GlassCard className="p-6 sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[13px] font-bold uppercase tracking-wider text-grey">
                    Rank {data.currentRank.rank} &middot;{" "}
                    {data.currentRank.rankName}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold text-(--primary)">
                    {data.hasBrokenCurrent
                      ? "Courses Unlocked"
                      : "Almost there"}
                  </h1>
                </div>
                {data.hasBrokenCurrent ? (
                  <GlassBadge
                    variant="success"
                    icon={<MdCheckCircle size={14} />}
                  >
                    Unlocked
                  </GlassBadge>
                ) : (
                  <GlassBadge variant="warning" icon={<MdLock size={14} />}>
                    {data.xpToUnlockCurrent.toLocaleString()} XP to go
                  </GlassBadge>
                )}
              </div>

              <div className="mt-6 flex flex-col gap-2">
                <div className="flex justify-between text-sm">
                  <span className="text-grey">XP progress</span>
                  <span className="font-semibold text-(--primary)">
                    {data.xp.toLocaleString()} /{" "}
                    {data.currentRank.unlockXp.toLocaleString()} XP
                  </span>
                </div>
                <ProgressBar
                  value={data.xp}
                  total={data.currentRank.unlockXp}
                  color="bg-blue"
                />
              </div>
            </GlassCard>

            {/* NO UNLOCKED COURSES — the single, primary notice for "you
                can't start anything right now," shown above both the
                Current Stage and Next Stage sections whenever nothing is
                actually startable (either XP hasn't broken the current
                rank's threshold, or it has but no courses exist for it
                yet). The sections below still list courses (locked) for
                context — this banner is the headline, not a replacement. */}
            {!hasUnlockedCourses && (
              <GlassCard>
                <div className="flex flex-col items-center gap-3 px-4 py-12 text-center">
                  <div className="rounded-full bg-white/5 p-4 text-grey">
                    <MdLock size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-(--primary)">
                    You have no unlocked courses
                  </h3>
                  <p className="max-w-sm text-sm text-grey">
                    {data.hasBrokenCurrent
                      ? `No courses have been assigned to ${data.currentRank.rankName} yet — check back soon.`
                      : `Earn ${data.xpToUnlockCurrent.toLocaleString()} more XP to unlock the courses for ${data.currentRank.rankName}.`}
                  </p>
                  <button
                    disabled
                    className="mt-2 flex items-center gap-2 rounded-sm bg-white/10 px-6 py-2.5 text-sm font-bold text-grey cursor-not-allowed"
                  >
                    <MdLock size={16} /> Start Learning
                  </button>
                </div>
              </GlassCard>
            )}

            {/* CURRENT STAGE — same treatment as "Next Stage" below: always
                list the rank's courses, locked or not, rather than hiding
                them behind a bare "nothing to see" message. */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-(--primary)">
                  {data.hasBrokenCurrent
                    ? "Available Courses"
                    : "Current Stage"}
                </h2>
                {!data.hasBrokenCurrent && data.currentCourses.length > 0 && (
                  <GlassBadge variant="warning" icon={<MdLock size={12} />}>
                    {data.xpToUnlockCurrent.toLocaleString()} XP to unlock
                  </GlassBadge>
                )}
              </div>

              {data.currentCourses.length === 0 ? (
                <GlassCard>
                  <p className="py-8 text-center text-sm text-grey">
                    No courses have been assigned to{" "}
                    {data.currentRank.rankName} yet.
                  </p>
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.currentCourses.map((course, i) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={i}
                      locked={!data.hasBrokenCurrent}
                      starting={startingId === course.id}
                      onStart={(id) => startMutation.mutate(id)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* NEXT STAGE */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-(--primary)">
                  Next Stage
                </h2>
                {data.nextRank && (
                  <GlassBadge variant="warning" icon={<MdLock size={12} />}>
                    {data.nextRank.xpToUnlock.toLocaleString()} XP away
                  </GlassBadge>
                )}
              </div>

              {data.isMaxRank ? (
                <GlassCard>
                  <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
                    <div className="rounded-full bg-yellow/10 p-4 text-yellow">
                      <FaTrophy size={24} />
                    </div>
                    <h3 className="font-semibold text-(--primary)">
                      You&apos;ve reached the top tier
                    </h3>
                    <p className="max-w-sm text-sm text-grey">
                      {data.currentRank.rankName} is the highest rank —
                      there&apos;s no next stage beyond this.
                    </p>
                  </div>
                </GlassCard>
              ) : data.nextCourses.length === 0 ? (
                <GlassCard>
                  <p className="py-8 text-center text-sm text-grey">
                    No courses have been assigned to {data.nextRank?.rankName}{" "}
                    yet.
                  </p>
                </GlassCard>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.nextCourses.map((course, i) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={i}
                      locked
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </Layout>
  );
}
