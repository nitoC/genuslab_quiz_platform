"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import { HiOutlineChevronRight } from "react-icons/hi";
import { ReactNode } from "react";

import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import { MdLaptopMac } from "react-icons/md";
import { FaVideo } from "react-icons/fa";
import { IoBookOutline } from "react-icons/io5";
import { PiMedalFill } from "react-icons/pi";

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
          {/* Thumbnail */}
          <div className="w-40 h-28 rounded-xl overflow-hidden">
            <img
              src={image}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
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
          <HiOutlineChevronRight
            className="text-(--primary) cursor-pointer"
            size={20}
          />
        </button>
      </div>
    </GlassCard>
  );
};

const PerformancePage = () => {
  return (
    <Layout>
      <div className="flex-2">
        <Header title="Previous Quiz Performance" backBtn={false} />

        <div className="p-8 flex flex-col gap-8">
          {/* Page Intro */}
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
            <button className="flex items-center gap-2 bg-blue/20 text-blue px-6 py-3 rounded-lg text-sm font-medium">
              <MdLaptopMac size={18} />
              Online Quiz
            </button>

            <button className="flex items-center gap-2 bg-white/5 text-grey px-6 py-3 rounded-lg text-sm font-medium hover:bg-white/10 transition">
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
                  <h2 className="text-4xl font-bold text-(--primary)">2</h2>
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
                  <h2 className="text-4xl font-bold text-blue">95%</h2>
                </div>
                <div className="bg-white/5 p-4 rounded-xl">
                  <PiMedalFill size={24} className="text-blue" />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Quiz History List */}
          <div className="flex flex-col gap-6">
            <QuizHistoryCard
              episode="Episode 1"
              date="December 31, 2025 • 06:07 PM"
              title="Genus Quiz"
              score={100}
              image="/images/q1.png"
              badge={{
                label: "Top Performer",
                icon: "🏆",
                variant: "gold",
              }}
            />

            <QuizHistoryCard
              episode="Episode 2"
              date="December 28, 2025 • 02:30 PM"
              title="Genus Quiz"
              score={90}
              image="/images/q2.jpg"
              badge={{
                label: "Silver Tier",
                icon: "🥈",
                variant: "silver",
              }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PerformancePage;
