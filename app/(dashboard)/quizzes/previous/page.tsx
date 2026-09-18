"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import GlassBadge from "@/components/ui/GlassBadge";
import { HiOutlineChevronRight } from "react-icons/hi";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import { MdLaptopMac, MdGroups } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { PiMedalFill } from "react-icons/pi";

import { getAttempts } from "@/lib/api/apis"; // adjust path
import Link from "next/link";
import useUser from "@/hooks/useUser";
import { format } from "date-fns";
import { formater } from "@/lib/utils/numFormatter";

// Three unequal bars standing in for a podium — reads as "rankings" without
// reaching for the same trophy glyph every quiz app uses.
const PodiumMark = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 28 22"
    className={className}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="9" width="7" height="12" rx="1.5" fill="#C0C6D1" />
    <rect x="10.5" y="2" width="7" height="19" rx="1.5" fill="#F5B94E" />
    <rect x="20" y="12" width="7" height="9" rx="1.5" fill="#C97A3D" />
  </svg>
);

/* --------------------------------------------------------------------------
 * SKELETON LOADERS
 * -------------------------------------------------------------------------- */

const StatCardSkeleton = () => (
  <GlassCard className="w-full animate-pulse">
    <div className="p-5 sm:p-8 flex justify-between items-center">
      <div className="flex flex-col gap-2 w-1/2">
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="h-8 bg-white/20 rounded w-1/2"></div>
      </div>
      <div className="bg-white/5 w-11 h-11 sm:w-14 sm:h-14 rounded-xl shrink-0"></div>
    </div>
  </GlassCard>
);

const QuizCardSkeleton = () => (
  <GlassCard className="overflow-hidden animate-pulse">
    <div className="p-4 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center flex-1">
        {/* Image block */}
        <div className="w-full sm:w-40 h-40 sm:h-28 bg-white/10 rounded-xl shrink-0"></div>

        {/* Details stack */}
        <div className="flex flex-col gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <div className="h-5 bg-blue/20 w-20 rounded-full"></div>
            <div className="h-3 bg-white/10 w-24 rounded"></div>
          </div>
          <div className="h-5 bg-white/20 w-2/3 rounded"></div>
          <div className="flex items-center gap-6 mt-1">
            <div className="h-8 bg-white/20 w-20 rounded"></div>
          </div>
        </div>
      </div>
      <div className="bg-white/5 w-full md:w-11 h-11 rounded-xl md:rounded-full shrink-0"></div>
    </div>
  </GlassCard>
);

/* --------------------------------------------------------------------------
 * TAB TOGGLE BUTTON
 *
 * Below the `xs` breakpoint (custom, 400px) there isn't room for icon +
 * label side by side without wrapping/overflowing, so the label is hidden
 * and only the icon shows — with a small floating tooltip (CSS-only, via
 * group-hover) standing in for the label on hover/tap, so the button's
 * purpose is never lost, just its always-visible text.
 * -------------------------------------------------------------------------- */

const TabButton = ({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: ReactNode;
  label: string;
}) => (
  <button
    onClick={onClick}
    className={`group relative flex flex-1 min-[400px]:flex-none items-center justify-center gap-2 px-3 min-[400px]:px-6 py-3 rounded-lg text-sm font-medium transition ${
      active
        ? "bg-blue/20 text-blue"
        : "bg-white/5 text-grey hover:bg-white/10"
    }`}
  >
    {icon}
    <span className="hidden min-[400px]:inline">{label}</span>

    {/* Tooltip — only relevant (and only rendered visible) when the label
        itself is hidden, i.e. below the 400px breakpoint. */}
    <span className="pointer-events-none absolute -bottom-9 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-md border border-white/10 bg-(--background-dark-secondary) px-2.5 py-1 text-xs font-medium text-(--primary) opacity-0 shadow-lg transition-opacity duration-150 group-hover:opacity-100 group-focus-visible:opacity-100 min-[400px]:hidden">
      {label}
    </span>
  </button>
);

/* --------------------------------------------------------------------------
 * QUIZZES COMPONENT
 * -------------------------------------------------------------------------- */

interface QuizHistoryCardProps {
  episode: string;
  date: string;
  title: string;
  score: number;
  did: string;
  quizId: string;
  badge?: {
    label: string;
    icon?: ReactNode;
    variant?: "gold" | "silver" | "default";
  };
  image: string;
  rawEpisode?: string;
  activeDate?: string;
  participantCount?: number;
}

const QuizHistoryCard = ({
  episode,
  did,
  quizId,
  date,
  title,
  score,
  badge,
  image,
  rawEpisode,
  activeDate,
  participantCount,
}: QuizHistoryCardProps) => {
  const badgeVariant = {
    gold: "warning" as const,
    silver: "neutral" as const,
    default: "info" as const,
  };

  const winnersDateStr = activeDate
    ? format(new Date(activeDate), "dd-MM-yyyy")
    : null;

  return (
    <GlassCard className="overflow-hidden border border-white/5 transition-all duration-200 hover:bg-white/[0.02]">
      <div className="p-4 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        {/* Left Side: Thumbnail & Content */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center flex-1">
          {/* Responsive Thumbnail */}
          <div className="w-full sm:w-40 h-40 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-white/5 border border-white/5">
            <img
              src={image || "/images/q1.png"}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Stack */}
          <div className="flex flex-col justify-center gap-2.5 flex-1 min-w-0">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-grey">
              <span className="font-semibold text-(--primary)">{episode}</span>
              <span>{date}</span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold tracking-wide text-(--primary) truncate">
              {title}
            </h3>

            {/* Score & Badge Row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-1">
              <div className="flex items-end gap-1.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-blue font-mono leading-none">
                  {score * 10}%
                </h2>
                <span className="text-grey text-[14px] uppercase tracking-wider font-semibold pb-0.5">
                  Score
                </span>
              </div>

              {badge && (
                <GlassBadge
                  variant={badgeVariant[badge.variant || "default"]}
                  icon={badge.icon}
                >
                  {badge.label}
                </GlassBadge>
              )}

              {participantCount !== undefined && (
                <span className="flex items-center gap-1.5 text-[14px] sm:text-sm font-semibold text-grey">
                  <MdGroups size={16} className="text-grey" />
                  {formater(participantCount)} participant
                  {participantCount === 1 ? "" : "s"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Navigation Trigger */}
        <div className="flex flex-col sm:flex-row gap-3 md:items-center justify-end border-t border-white/5 pt-4 md:pt-0 md:border-0">
          {winnersDateStr && rawEpisode && (
            <Link
              href={`previous/leaderboard?date=${winnersDateStr}&episode=${rawEpisode}`}
              className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-sm font-semibold text-grey transition-colors hover:text-(--primary) md:w-auto md:py-2.5"
            >
              Leaderboard
            </Link>
          )}
          <Link
            href={`previous/${quizId}/${did}`}
            className="w-full md:w-auto bg-white/5 p-3 rounded-lg hover:bg-white/10 text-grey hover:text-(--primary) transition-all active:scale-95 border border-white/5 flex items-center justify-center gap-2 group"
          >
            <span className="text-sm font-semibold tracking-wide md:hidden">
              View Details
            </span>
            <HiOutlineChevronRight
              size={20}
              className="transform group-hover:translate-x-0.5 transition-transform"
            />
          </Link>
        </div>
      </div>
    </GlassCard>
  );
};

const PerformancePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"online" | "studio">("online");
  const [currentPage, setCurrentPage] = useState(1);

  // Get user from store
  const { userStore, isLoading: userLoading } = useUser();

  const {
    data: quizData,
    isLoading,
    isPending,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["quiz episodes"],
    queryFn: async () => {
      try {
        const res = await getAttempts(1);
        console.log(res, "response");
        return res.data.payload;
      } catch (err: any) {
        console.error(err?.response?.data ?? err?.message ?? err);
        return [];
      }
    },
  });

  const history = quizData;

  const averageScore = useMemo(() => {
    if (!history || !history.length) return 0;
    const total = history.reduce(
      (sum: number, item: any) => sum + Number(item.score || 0),
      0,
    );
    return Math.round((total * 10) / history.length);
  }, [history]);

  const handleTabSwitch = (tab: "online" | "studio") => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="flex-2">
        <Header title="Previous Quiz Performance" backBtn={false} />

        <div className="p-8 flex flex-col gap-8">
          {/* Intro */}
          <div>
            <h2 className="text-(--primary) dash-title">
              Previous Quiz Performance
            </h2>
            <p className="text-grey text-sm">
              Track your progress and achievements across all quiz sessions
            </p>
          </div>

          {/* Toggle Buttons */}
          <div className="flex gap-3 sm:gap-4">
            <TabButton
              active={activeTab === "online"}
              onClick={() => handleTabSwitch("online")}
              icon={<MdLaptopMac size={18} />}
              label="Online Quiz"
            />
            <TabButton
              active={activeTab === "studio"}
              onClick={() => handleTabSwitch("studio")}
              icon={<FaVideo size={16} />}
              label="Studio Quiz"
            />
          </div>

          {/* Stats Blocks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-4">
            {isLoading || isPending || isFetching ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <>
                <GlassCard className="w-full">
                  <div className="p-5 sm:p-8 flex justify-between items-center">
                    <div>
                      <h4 className="text-grey text-sm">Total Quizzes</h4>
                      <h2 className="text-4xl font-bold text-(--primary)">
                        {history.length}
                      </h2>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <IoBookOutline size={24} className="text-blue" />
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="w-full">
                  <div className="p-5 sm:p-8 flex justify-between items-center">
                    <div>
                      <h4 className="text-grey text-sm">Average Score</h4>
                      <h2 className="text-4xl font-bold text-blue">
                        {averageScore}%
                      </h2>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl">
                      <PiMedalFill size={24} className="text-blue" />
                    </div>
                  </div>
                </GlassCard>
              </>
            )}
          </div>

          {/* Core Quiz Content Mapping Block */}
          <div className="flex flex-col gap-6">
            {isLoading || isPending || isFetching ? (
              // Renders a stack of 3 cleaner skeleton shapes while fetching data
              <>
                <QuizCardSkeleton />
                <QuizCardSkeleton />
                <QuizCardSkeleton />
              </>
            ) : history.length === 0 ? (
              <p className="text-grey text-sm p-4">No quiz history found.</p>
            ) : (
              history.map((quiz: any, index: number) => (
                <QuizHistoryCard
                  key={quiz.id}
                  quizId={quiz.quizId || quiz.id}
                  did={quiz.userDetailsId}
                  episode={`Episode ${quiz.quiz?.episode.split("_")[1] || quiz.episode || index + 1}`}
                  date={new Date(quiz.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                  title={
                    quiz.title ||
                    quiz?.quiz?.title ||
                    `Quiz Event #${index + 1}`
                  }
                  score={quiz.score}
                  image={quiz.image || "/images/q1.png"}
                  rawEpisode={quiz.quiz?.episode || quiz.episode}
                  activeDate={quiz.quiz?.activeDate || quiz.activeDate}
                  participantCount={quiz.quiz?._count?.attempts}
                  badge={
                    quiz.score >= 90
                      ? {
                          label: "Top Performer",
                          icon: "🏆",
                          variant: "gold",
                        }
                      : undefined
                  }
                />
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PerformancePage;
