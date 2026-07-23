"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import { HiOutlineChevronRight } from "react-icons/hi";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import { MdLaptopMac } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { PiMedalFill } from "react-icons/pi";

import { getAttempts } from "@/lib/api/apis"; // adjust path
import getLocalStorage from "@/lib/utils/getLocalStorage";
import Link from "next/link";

/* --------------------------------------------------------------------------
 * SKELETON LOADERS
 * -------------------------------------------------------------------------- */

const StatCardSkeleton = () => (
  <GlassCard className="flex-1 animate-pulse">
    <div className="p-8 flex justify-between items-center">
      <div className="flex flex-col gap-2 w-1/2">
        <div className="h-4 bg-white/10 rounded w-3/4"></div>
        <div className="h-8 bg-white/20 rounded w-1/2"></div>
      </div>
      <div className="bg-white/5 w-14 h-14 rounded-xl"></div>
    </div>
  </GlassCard>
);

const QuizCardSkeleton = () => (
  <GlassCard className="animate-pulse">
    <div className="p-6 flex items-center justify-between">
      <div className="flex gap-6 items-center flex-1">
        {/* Image block */}
        <div className="w-40 h-28 bg-white/10 rounded-xl shrink-0"></div>

        {/* Details stack */}
        <div className="flex flex-col gap-3 flex-1">
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
      <div className="bg-white/5 w-11 h-11 rounded-full shrink-0"></div>
    </div>
  </GlassCard>
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
}: QuizHistoryCardProps) => {
  const badgeStyles = {
    gold: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/10",
    silver: "bg-white/10 text-slate-400 border border-white/5",
    default: "bg-blue-500/20 text-blue-400 border border-blue-500/10",
  };

  return (
    <GlassCard className="overflow-hidden border border-white/5 transition-all duration-200 hover:bg-white/[0.02]">
      <div className="p-4 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
        {/* Left Side: Thumbnail & Content */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch sm:items-center flex-1">
          {/* Responsive Thumbnail */}
          <div className="w-full sm:w-40 h-40 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-slate-900 border border-white/5">
            <img
              src={image || "/images/q1.png"}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Details Stack */}
          <div className="flex flex-col justify-center gap-2.5 flex-1 min-w-0">
            {/* Meta Tags */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span className="bg-blue-500/10 border border-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-semibold">
                {episode}
              </span>
              <span>{date}</span>
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold tracking-wide text-white truncate">
              {title}
            </h3>

            {/* Score & Badge Row */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-1">
              <div className="flex items-end gap-1.5">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-400 font-mono leading-none">
                  {score * 10}%
                </h2>
                <span className="text-slate-400 text-[10px] uppercase tracking-wider font-semibold pb-0.5">
                  Score
                </span>
              </div>

              {badge && (
                <span
                  className={`flex items-center gap-1.5 text-[10px] sm:text-xs font-semibold px-3 py-1.5 rounded-lg ${
                    badgeStyles[badge.variant || "default"]
                  }`}
                >
                  {badge.icon && <span className="text-sm">{badge.icon}</span>}
                  {badge.label}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Navigation Trigger */}
        <div className="flex md:items-center justify-end border-t border-white/5 pt-4 md:pt-0 md:border-0">
          <Link
            href={`previous/${quizId}/${did}`}
            className="w-full md:w-auto bg-white/5 p-3 rounded-xl md:rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-95 border border-white/5 flex items-center justify-center gap-2 group"
          >
            <span className="text-xs font-semibold tracking-wide md:hidden">
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

  // Session check
  const storedUser = useMemo(() => {
    const user = getLocalStorage("user");
    if (!user) return null;
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    if (!storedUser) {
      router.replace("/login");
    }
  }, [storedUser, router]);

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
        // console.log(res, "response");
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
          <div className="flex gap-4">
            <button
              onClick={() => handleTabSwitch("online")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === "online"
                  ? "bg-blue/20 text-blue"
                  : "bg-white/5 text-grey hover:bg-white/10"
              }`}
            >
              <MdLaptopMac size={18} />
              Online Quiz
            </button>

            <button
              onClick={() => handleTabSwitch("studio")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === "studio"
                  ? "bg-blue/20 text-blue"
                  : "bg-white/5 text-grey hover:bg-white/10"
              }`}
            >
              <FaVideo size={16} />
              Studio Quiz
            </button>
          </div>

          {/* Stats Blocks Grid */}
          <div className="flex gap-8">
            {isLoading || isPending || isFetching ? (
              <>
                <StatCardSkeleton />
                <StatCardSkeleton />
              </>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
                <GlassCard className="w-full">
                  <div className="p-8 flex justify-between items-center">
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
                  <div className="p-8 flex justify-between items-center">
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
              </div>
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
                  episode={`Episode ${index + 1}`}
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
