"use client";

import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import PrimaryButton from "@/components/ui/buttons/Primary";
import GlassCard from "@/components/ui/cards/GlassCard";
import { FaGraduationCap } from "react-icons/fa";
import { IoMdArrowForward } from "react-icons/io";
import { MdStars, MdLock } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { RiProgress5Line } from "react-icons/ri";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { useEffect, useMemo, useState } from "react";
// import { useSocket } from "@/store/useSocket";
import { useQuery } from "@tanstack/react-query";
import {
  getAllActiveQuiz,
  getLastFiveWeeksAverageScore,
  getSlotDetails,
} from "@/lib/api/apis";
import Link from "next/link";

// 1. IMPORT SKELETONS & FALLBACKS
import { DashboardSkeleton } from "@/components/ui/skeletons/quizdashboard";
import { FallbackQuizCard } from "@/components/ui/cards/FallbackQuizCard";
import useUser from "@/hooks/useUser";
import { deAT } from "date-fns/locale";
import TimerPop from "@/features/quiz/components/TimerPop";
import useSlots from "@/hooks/useSlots";
import { FloatingDemoButton } from "@/components/ui/buttons/FloatingDemo";

const page = () => {
  const [pop, setpop] = useState(true);

  const {
    data,
    isLoading: userLoading,
    isError: userIsError,
    error,
    storedUser,
  } = useUser();
  const user = data?.user;
  const rank = data?.user.details.rankName;
  const exp = data?.user.details.xp;

  const {
    data: quizData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["quiz episodes"],
    queryFn: async () => {
      const res = await getAllActiveQuiz();
      console.log(res.data.payload, "quiz data");
      return res.data.payload;
    },
  });

  // const {
  //   data: slotData,
  //   isLoading: slotLoading,
  //   isError: slotError,
  // } = useQuery({
  //   queryKey: ["slots"],
  //   queryFn: async () => {
  //     const res = await getSlotDetails();
  //     return res?.data?.payload;
  //   },
  // });

  const { slotData, slotLoading, slotError } = useSlots();

  const {
    data: avgData,
    isLoading: avgLoading,
    isError: avgError,
  } = useQuery({
    queryKey: ["lastFiveWeeksAverageScore", user?.details?.id],
    queryFn: async () => {
      const res = await getLastFiveWeeksAverageScore(user?.details?.id || "");
      // console.log(res?.data?.payload, "avg data");
      // console.log(res, "avg data2");
      return res?.data?.average;
    },
  });

  // Base fallback posters for rendering safety

  const nextActive = useMemo(() => {
    if (!quizData || quizData.length === 0 || isError) {
      return null;
    }
    const next = quizData.find((a: any) => a.status === "active".toUpperCase());
    console.log(next, "next");
    return next;
  }, [quizData]);
  const localPosters = [
    "/images/q2.jpg",
    "/images/About1.png",
    "/images/Study.jpg",
    "/images/Job.png",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=60",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=60",
  ];

  // 2. RENDER GLOBAL SKELETON IF LOADING CORE DATA pop
  if (isLoading || slotLoading || userLoading || avgLoading) {
    return <DashboardSkeleton />;
  }

  // 3. DEFINE RENDERING LOGIC FOR CARDS ARRAY
  const renderQuizTrack = () => {
    // Case A: Query missing or broken payload completely -> Return 6 dummy cards
    if (!quizData || quizData.length === 0 || isError) {
      return Array.from({ length: 6 }).map((_, index) => (
        <FallbackQuizCard
          key={`fallback-only-${index}`}
          slotIndex={index + 1}
        />
      ));
    }

    // Case B: Real values are found -> Fill up to 7 total blocks if count is low
    const targetLength = 7;
    const items = [...quizData];

    return Array.from({ length: Math.max(targetLength, items.length) }).map(
      (_, index) => {
        const quiz = items[index];

        if (quiz) {
          // Render genuine content card
          const assignedTime =
            slotData && slotData.length > 0
              ? slotData.find((a: any) => a.tag === quiz.activeAt)?.label ||
                "TBD"
              : "TBD";

          return (
            <QuizCard
              key={`quiz-active-${quiz.id || index}`}
              {...quiz}
              id={quiz.id}
              poster={localPosters[index] || localPosters[0]}
              pool={quiz.pool || 15_000}
              time={assignedTime}
            />
          );
        } else {
          // Render custom fill placeholder to complete the layout grid requirements
          return (
            <FallbackQuizCard
              key={`fill-card-${index}`}
              slotIndex={index + 1}
            />
          );
        }
      },
    );
  };
  const reward = 0;
  const formatedReward =
    reward > 0 ? reward.toLocaleString() : reward.toFixed(2);

  return (
    <Layout className="relative">
      <Header backBtn={false} title="Quizzes" />

      {/* TOP STATS */}
      <section className="wrapper p-4 md:p-8">
        <div className="flex flex-col md:flex-row gap-6">
          <GlassCard className="flex-1">
            <div className="bg-purple-600/10 p-6 h-full flex flex-col gap-4">
              <div className="flex justify-center w-fit rounded-sm items-center p-3 bg-purple-600/10">
                <MdStars size={30} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-grey text-sm">Rewards</h3>
                <p className="text-2xl font-bold text-primary">
                  ₦{formatedReward}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex-1">
            <div className="bg-blue/10 p-6 flex flex-wrap gap-4 h-full justify-between items-center">
              <div className="flex flex-col gap-1">
                <h3 className="text-blue font-bold text-lg">Performance</h3>
                <p className="text-grey">
                  <span className="text-3xl font-bold text-primary">
                    {avgData}
                  </span>
                  /100
                </p>
                <p className="text-grey text-sm">average score</p>
              </div>
              <PrimaryButton
                type="link"
                to="/leaderboard"
                text="View Analytics"
              />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* UPCOMING QUIZZES */}
      <section className="p-4 md:p-8 flex flex-col gap-6">
        <div>
          <div className="flex gap-4 items-center">
            <FaGraduationCap size={28} className="text-blue" />
            <h2 className="text-2xl font-bold text-primary">
              Upcoming Quizzes
            </h2>
          </div>
          <p className="text-sm text-grey">
            Educational tracks scheduled for today
          </p>
        </div>

        {/* Dynamic horizontal scrolling containers */}
        <div className="flex gap-4 overflow-x-auto scroll-hide">
          {renderQuizTrack()}
        </div>
      </section>

      {/* ADDITIONAL SECTIONS */}
      <section className="p-4 relative md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GlassCard>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <ImageWithFallback
                  src={user?.details?.avatar}
                  alt="Jane Doe"
                  width={60}
                  height={60}
                  className="rounded-xl"
                />
                <div>
                  <h3 className="text-(--primary) font-semibold">
                    {user?.name}
                  </h3>
                  <p className="text-blue text-sm">{rank?.rankName}</p>
                </div>
              </div>
              <div>
                <p className="text-grey text-xs">{exp} XP Earned</p>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                  <div className="bg-blue h-2 rounded-full w-[75%]" />
                </div>
              </div>
              <PrimaryButton type="link" to="/profile" text="View Profile" />
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6 bg-blue/10 flex flex-col gap-6 h-full justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue p-4 rounded-xl">
                  <FaPlay className="text-white" />
                </div>
                <div>
                  <p className="text-grey text-sm">Estimated Reward</p>
                  <p className="text-blue font-bold text-xl">₦10,000 Reward</p>
                </div>
              </div>
              {quizData && nextActive && quizData.length > 0 ? (
                <div>
                  <h3 className="text-primary font-semibold">
                    Episode{" "}
                    {nextActive?.episode?.toString().split("_")[1] ?? "N/A"}
                  </h3>
                  <p className="text-grey text-sm">10 Questions • 5 mins</p>
                  <PrimaryButton
                    type="link"
                    style="block bg-blue text-white rounded-sm"
                    to={`/quiz/`}
                    text="Enter Now"
                  />
                </div>
              ) : (
                <div>
                  <h3 className="text-(--primary) font-semibold">
                    No Episode available
                  </h3>
                  <p className="text-grey text-sm">10 Questions • 5 mins</p>
                  <PrimaryButton
                    style="w-full bg-blue text-white rounded-sm opacity-40"
                    type="button"
                    text="Enter Now"
                  />
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard>
            <div className="p-6 flex flex-col gap-6 h-full justify-between">
              <div className="flex items-center gap-3">
                <RiProgress5Line className="text-purple-400" />
                <h3 className="text-(--primary) font-semibold">Past Quizzes</h3>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-purple-400 font-bold">
                    {data?.user?.details?._count?.quizHistory ?? 0}
                  </span>
                  <span className="text-grey">Master Path</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-full" />
                </div>
              </div>
              <PrimaryButton
                type="link"
                to="quizzes/previous"
                text="View past quizzes"
              />
            </div>
          </GlassCard>
        </div>
      </section>
      <TimerPop pop={pop} refetchQuiz={refetch} />
      <FloatingDemoButton href="/quiz/demo" />
    </Layout>
  );
};

const QuizCard = ({
  day,
  episode,
  participants,
  status,
  title,
  poster,
  id,
  time,
  pool,
}: {
  day: string;
  episode: number;
  participants: number | null;
  id: string;
  status: string;
  title: string;
  poster: string;
  time: string;
  pool: number;
}) => {
  const formater = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  });

  if (!status) return;
  const normalizedStatus = status.toLowerCase();
  const isUpcoming = normalizedStatus === "upcoming";
  const isArchived =
    normalizedStatus === "archived" || normalizedStatus === "finished";
  const isLocked = isUpcoming || isArchived;

  const handleDisabledClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUpcoming) {
      alert("Quiz is not yet active");
    } else if (isArchived) {
      alert("Quiz has expired");
    }
  };

  return (
    <div
      style={{ backgroundImage: `url('${poster}')` }}
      className="relative bg-cover bg-blend-overlay h-90 bg-(--background)/70 basis-70 shrink-0 bg-center p-4 rounded-lg flex flex-col gap-4 items-start"
    >
      {/* WARNING DIM OVERLAY LAYER */}
      {isLocked && (
        <div
          onClick={handleDisabledClick}
          className="absolute inset-0 bg-black/60 backdrop-blur-[1px] rounded-lg z-6 flex flex-col items-center justify-center cursor-not-allowed transition-all duration-200 hover:bg-black/70"
        >
          <div className="bg-amber-500/20 border border-amber-500/40 p-3 rounded-full text-amber-400 shadow-lg mb-2">
            <MdLock size={28} />
          </div>
          <span className="text-xs tracking-wider uppercase font-bold text-amber-400 bg-black/40 px-2.5 py-1 rounded">
            {isUpcoming ? "Upcoming" : "Expired"}
          </span>
        </div>
      )}

      <span className="text-touquise border border-touquise bg-touquise/30 font-bold py-2 px-4 rounded-full text-xs">
        {time}
      </span>
      <section className="flex flex-col gap-4">
        <div className="flex bg-white/5 backdrop-blur-sm p1 border border-white/30 rounded-sm w-fit">
          <div className="p-2 text-white text-[.625rem]">
            <h3>Day</h3>
            <p>{day}</p>
          </div>
          <div className="p-2 text-white text-[.625rem]">
            <h3>Episode</h3>
            <p>{episode}</p>
          </div>
        </div>
        <div>
          {participants ? (
            <p className="text-grey">
              <span className="text-white text-3xl">
                {formater.format(participants)}
              </span>{" "}
              participants
            </p>
          ) : (
            <p className="text-white text-3xl capitalize">{status}</p>
          )}
        </div>
        <p className="text-blue-300 font-bold text-sm">{title}</p>
      </section>
      <section className="flex items-end grow-2 w-full justify-between">
        <div>
          <p className="text-sm text-grey">Total Reward</p>
          <p className="text-lg font-bold text-(--primary)">
            ₦{formater.format(pool)}
          </p>
        </div>
        <Link
          href={`quiz/live/${id}`}
          tabIndex={isLocked ? -1 : 0}
          className="text-sm duration-200 hover:bg-white/15 bg-white/5 backdrop-blur-md text-white border border-white/30 py-2 px-4 rounded-full mt-4"
        >
          <IoMdArrowForward size={20} />
        </Link>
      </section>
    </div>
  );
};

export default page;
