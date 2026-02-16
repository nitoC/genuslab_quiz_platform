"use client";

import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import PrimaryButton from "@/components/ui/buttons/Primary";
import GlassCard from "@/components/ui/cards/GlassCard";
import { FaGraduationCap } from "react-icons/fa";
import { IoMdArrowForward } from "react-icons/io";
import { MdStars } from "react-icons/md";
import { FaPlay } from "react-icons/fa";
import { RiProgress5Line } from "react-icons/ri";
import { LuTimer } from "react-icons/lu"; // Added for the timer icon
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import { useEffect, useState } from "react";
import clsx from "clsx";
import Link from "next/link";

const page = () => {
  const [pop, setpop] = useState(false);
  const quizzes = [
    {
      day: "1250",
      episode: 1,
      time: "7AM-9AM",
      pool: 2500,
      participants: 10000,
      status: "finished" as const,
      poster: "/images/q2.jpg",
      title: "Master the Basics",
    },
    {
      day: "1250",
      episode: 2,
      pool: 6000,
      time: "9AM-11AM",
      participants: null,
      status: "ongoing" as const,
      poster: "/images/About1.png",
      title: "Challenge Your Mind",
    },
    {
      day: "1250",
      episode: 3,
      pool: 2500,
      time: "11AM-1PM",
      participants: null,
      status: "upcoming" as const,
      poster: "/images/Study.jpg",
      title: "Top the Leaderboard",
    },
    {
      day: "1250",
      episode: 4,
      pool: 2500,
      time: "1PM-3PM",
      participants: null,
      status: "upcoming" as const,
      poster: "/images/Job.png",
      title: "Expand Your Knowledge",
    },
    {
      day: "1250",
      episode: 5,
      pool: 3000,
      time: "3PM-5PM",
      participants: null,
      status: "upcoming" as const,
      poster:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cXVpenplfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      title: "Sharpen Your Skills",
    },
    {
      day: "1250",
      episode: 6,
      pool: 5500,
      time: "5PM-7PM",
      participants: null,
      status: "upcoming" as const,
      poster:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cXVpenplfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      title: "Advanced Strategies",
    },
    {
      day: "1250",
      episode: 7,
      pool: 2500,
      time: "7PM-9PM",
      participants: null,
      status: "upcoming" as const,
      poster:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cXVpenplfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
      title: "Final Showdown",
    },
  ];

  useEffect(() => {
    const popTimeout = setTimeout(() => {
      setpop(true);
    }, 3000);

    return () => {
      clearTimeout(popTimeout);
    };
  }, []);

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
                <p className="text-2xl font-bold text-(--primary)">₦5000</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="flex-1">
            <div className="bg-blue/10 p-6 flex flex-wrap gap-4 h-full justify-between items-center">
              <div className="flex flex-col gap-1">
                <h3 className="text-blue font-bold text-lg">Performance</h3>
                <p className="text-grey">
                  <span className="text-3xl font-bold text-(--primary)">
                    85
                  </span>
                  /100
                </p>
                <p className="text-grey text-sm">Last week average score</p>
              </div>
              <PrimaryButton text="View Analytics" />
            </div>
          </GlassCard>
        </div>
      </section>

      {/* UPCOMING QUIZZES */}
      <section className="p-4 md:p-8 flex flex-col gap-6">
        <div>
          <div className="flex gap-4 items-center">
            <FaGraduationCap size={28} className="text-blue" />
            <h2 className="text-2xl font-bold text-(--primary)">
              Upcoming Quizzes
            </h2>
          </div>
          <p className="text-sm text-grey">
            Seven educational sessions scheduled for today
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto scroll-hide">
          {quizzes.map((quiz, index) => (
            <QuizCard key={index} {...quiz} />
          ))}
        </div>
      </section>

      {/* NEW BOTTOM THREE CARDS */}
      <section className="p-4 relative md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* PROFILE CARD */}
          <GlassCard>
            <div className="p-6 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <ImageWithFallback
                  src="/images/avatar.png"
                  alt="Jane Doe"
                  width={60}
                  height={60}
                  className="rounded-xl"
                />
                <div>
                  <h3 className="text-(--primary) font-semibold">Jane Doe</h3>
                  <p className="text-blue text-sm">Quiz Overlord</p>
                </div>
              </div>

              <div>
                <p className="text-grey text-xs">752 XP Earned</p>
                <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                  <div className="bg-blue h-2 rounded-full w-[75%]" />
                </div>
                <p className="text-grey text-xs mt-2">
                  Earn a Level: 248 XP remaining
                </p>
              </div>

              <PrimaryButton text="View Profile" />
            </div>
          </GlassCard>

          {/* PLAY NOW CARD */}
          <GlassCard>
            <div className="p-6 bg-blue/10 flex flex-col gap-6 h-full justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue p-4 rounded-xl">
                  <FaPlay className="text-white" />
                </div>
                <div>
                  <p className="text-grey text-sm">Estimated Reward</p>
                  <p className="text-blue font-bold text-xl">₦500 Reward</p>
                </div>
              </div>

              <div>
                <h3 className="text-(--primary) font-semibold">Episode 102</h3>
                <p className="text-grey text-sm">10 Questions • 10 mins</p>
              </div>

              <PrimaryButton text="Play Now" />
            </div>
          </GlassCard>

          {/* PAST QUIZZES CARD */}
          <GlassCard>
            <div className="p-6 flex flex-col gap-6 h-full justify-between">
              <div className="flex items-center gap-3">
                <RiProgress5Line className="text-purple-400" />
                <h3 className="text-(--primary) font-semibold">Past Quizzes</h3>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-purple-400 font-bold">67</span>
                  <span className="text-grey">Master Path</span>
                </div>

                <div className="w-full bg-white/10 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full w-[87%]" />
                </div>

                <p className="text-grey text-xs mt-2">87% Complete</p>
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

      {/* Countdown - Updated to match Image */}
      {
        <section
          className={clsx(
            pop ? "opacity-100" : "opacity-0",
            "px-4 duration-100 md:px-8 py-4 sticky bottom-0 z-10",
          )}
        >
          <GlassCard>
            <div className="p-4 md:p-6 flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-blue/20 p-3 rounded-xl">
                  <LuTimer size={24} className="text-blue" />
                </div>
                <div className="flex flex-col">
                  <span className="text-blue text-[10px] uppercase tracking-wider font-bold">
                    Next Event Starts In
                  </span>
                  <h2 className="text-white text-xl md:text-2xl font-bold">
                    1hrs 58mins 18secs
                  </h2>
                </div>
              </div>

              <PrimaryButton text="Join Quiz" />
            </div>
          </GlassCard>
        </section>
      }
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
  time,
  pool,
}: {
  day: string;
  episode: number;
  participants: number | null;
  status: "upcoming" | "ongoing" | "finished";
  title: string;
  poster: string;
  time: string;
  pool: number;
}) => {
  const formater = new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  });
  return (
    <div
      style={{ backgroundImage: `url('${poster}')` }}
      className={` bg-cover bg-blend-overlay h-90 bg-(--background)/70 basis-70 shrink-0 bg-center p-4 rounded-lg flex flex-col gap-4 items-start`}
    >
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
            <p className="text-white text-3xl">{status}</p>
          )}
        </div>
        <p className="text-blue-300 font-bold text-sm">{title}</p>
      </section>
      <section className="flex items-end grow-2 w-full justify-between">
        <div>
          <p className="text-sm text-grey">Prize Pool</p>
          <p className="text-lg font-bold text-(--primary)">
            ₦{formater.format(pool)}
          </p>
        </div>
        <button className="text-sm duration-200 hover:bg-white/15 bg-white/5 backdrop-blur-md text-white border border-white/30 py-2 px-4 rounded-full mt-4">
          <IoMdArrowForward size={20} />
        </button>
      </section>
    </div>
  );
};

export default page;
