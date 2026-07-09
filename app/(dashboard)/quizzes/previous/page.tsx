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

import {
  getScoreHistory,
  getQuizNumber,
  getUserProfile,
  getRankData,
} from "@/lib/api/apis"; // adjust path
import getLocalStorage from "@/lib/utils/getLocalStorage";
import toast from "react-hot-toast";

interface QuizHistoryCardProps {
  episode: string;
  date: string;
  title: string;
  score: number;
  badge?: {
    label: string;
    icon?: ReactNode;
    variant?: "gold" | "silver" | "default";
  };
  image: string;
}

const QuizHistoryCard = ({
  episode,
  date,
  title,
  score,
  badge,
  image,
}: QuizHistoryCardProps) => {
  const badgeStyles = {
    gold: "bg-yellow/20 text-yellow",
    silver: "bg-white/10 text-grey",
    default: "bg-blue/20 text-blue",
  };

  return (
    <GlassCard>
      <div className="p-6 flex items-center justify-between">
        <div className="flex gap-6 items-center">
          <div className="w-40 h-28 rounded-xl overflow-hidden">
            <img
              src={"/images/q1.png"}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-xs text-grey">
              <span className="bg-blue/20 text-blue px-3 py-1 rounded-full">
                {episode}
              </span>
              <span>{date}</span>
            </div>

            <h3 className="text-lg font-semibold text-(--primary)">{title}</h3>

            <div className="flex items-center gap-6">
              <div className="flex items-end gap-2">
                <h2 className="text-3xl font-bold text-blue">{score}%</h2>
                <span className="text-grey text-sm">Score</span>
              </div>

              {badge && (
                <span
                  className={`flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg ${
                    badgeStyles[badge.variant || "default"]
                  }`}
                >
                  {badge.icon}
                  {badge.label}
                </span>
              )}
            </div>
          </div>
        </div>

        <button className="bg-white/5 p-3 rounded-full hover:bg-white/10 transition">
          <HiOutlineChevronRight className="text-(--primary)" size={20} />
        </button>
      </div>
    </GlassCard>
  );
};

const PerformancePage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"online" | "studio">("online");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [userEmail, setUserEmail] = useState<string | null>(null);

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

  /* -----------------------------
   * USER QUERY
   * ---------------------------- */

  //  const {
  //   data: queryResponse,
  //   isLoading:isDidLoading,
  //   refetch,
  //   error:didError,
  //   isError:isDidError,
  // } = useQuery<{
  //   data: unknown
  //   userDetailsId: string;
  // }>({
  //   queryKey: ["initiate quiz"],
  //   queryFn: async () => {
  //     const userStr = getLocalStorage("user");
  //     if (!userStr) {
  //       toast.error("user not found");
  //       throw new Error("user not found");
  //     }
  //     if (!quizId) {
  //       router.back();
  //       toast.error("quiz id not found");
  //       throw new Error("user not found");
  //     }
  //     const { userId } = JSON.parse(userStr);
  //     const userDetails = await getUserDetails(userId);
  //     if (!userDetails) {
  //       toast.error("user not logged in");
  //       router.push("/login");
  //     }
  //     const quizIdStr = Array.isArray(quizId) ? quizId[0] : quizId;
  //     const res = await getQuizSession(
  //       quizIdStr,
  //       userDetails?.data?.payload?.id,
  //     );
  //     return {
  //       data: res.data?.payload,
  //       userDetailsId: userDetails?.data?.payload?.id,
  //     };
  //   },
  //   staleTime: 0,
  //   gcTime: 0,
  //   refetchOnWindowFocus: false,
  //   refetchOnReconnect: false,
  //   refetchOnMount: true,
  // });

  const {
    data,
    isLoading: scoreLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["dashboard-user", storedUser?.userId],
    enabled: !!storedUser?.userId,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const [userRes, rankRes] = await Promise.all([
        getUserProfile(storedUser.userId),
        getRankData(),
      ]);

      const user = userRes.data.user;
      // console.log(rankRes.data, "rank res data");
      const userRank = rankRes.data.payload.find(
        (rank: any) => rank.id === user.details.rankId,
      );

      return {
        user,
        rank: userRank,
      };
    },
  });

  // Fetch Score History
  const { data: history = [], isLoading } = useQuery({
    queryKey: ["scoreHistory", userEmail, activeTab],
    queryFn: async () => {
      const res = await getScoreHistory(userEmail!);
      return res.data;
    },
    enabled: !!userEmail,
  });

  // Fetch Quiz Count
  const { data: numberOfQuizzes = 0 } = useQuery({
    queryKey: ["quizNumber", userEmail, activeTab],
    queryFn: () => getQuizNumber(userEmail!),
    enabled: !!userEmail,
  });

  // Average Calculation
  const averageScore = useMemo(() => {
    if (!history.length) return 0;
    const total = history.reduce((sum: number, item: any) => {
      return Number(sum) + Number(item.score);
    }, 0);
    console.log("Calculating average score:", { total, count: history.length });
    return Math.round(total / history.length);
  }, [history]);

  // Pagination
  const totalPages = Math.ceil(history.length / itemsPerPage);
  console.log("Total quizzes:", history, "Average score:", averageScore);
  const paginatedData = history.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  console.log("Paginated data:", paginatedData);
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

          {/* Toggle */}
          <div className="flex gap-4">
            <button
              onClick={() => handleTabSwitch("online")}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium ${
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
              className={`flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-medium ${
                activeTab === "studio"
                  ? "bg-blue/20 text-blue"
                  : "bg-white/5 text-grey hover:bg-white/10"
              }`}
            >
              <FaVideo size={16} />
              Studio Quiz
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            <GlassCard className="flex-1">
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

            <GlassCard className="flex-1">
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

          {/* Loading */}
          {isLoading && (
            <p className="text-grey text-sm">Loading quiz history...</p>
          )}

          {/* Empty State */}
          {!isLoading && history.length === 0 && (
            <p className="text-grey text-sm">No quiz history found.</p>
          )}

          {/* Quiz List */}
          <div className="flex flex-col gap-6">
            {paginatedData.map((quiz: any, index: number) => (
              <QuizHistoryCard
                key={quiz._id}
                episode={`Episode ${index + 1}`}
                date={new Date(quiz.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
                title={quiz.title}
                score={quiz.score}
                image={quiz.image || "/images/default.jpg"}
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
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex gap-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="px-4 py-2 bg-white/5 rounded-lg disabled:opacity-40"
              >
                Previous
              </button>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="px-4 py-2 bg-white/5 rounded-lg disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default PerformancePage;
