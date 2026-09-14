"use client";

import { useState } from "react";
import Link from "next/link";
import AdminPageHeader from "@/components/layouts/AdminPageHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import PerformanceChart from "@/components/ui/charts/CurveArea";
import CustomActiveShapePieChart from "@/components/ui/charts/LinePie";
import {
  getAdminStats,
  getAdminUserGrowth,
  getAdminQuizOverview,
} from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";

import {
  FaPiggyBank,
  FaMoneyBill,
  FaUserGroup,
  FaUserPlus,
} from "react-icons/fa6";
import { MdQuiz, MdOutlineLiveTv, MdOutlineArchive, MdOutlineBarChart } from "react-icons/md";

import { cn } from "@/lib/utils/cn";

type Period = "day" | "week" | "month";

const Card = ({
  icon,
  title,
  value,
  color,
  bg,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  color: string;
  bg: string;
  href: string;
}) => {
  return (
    <Link href={href} className="block">
      <AdminCard className="transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xl",
              bg,
              color,
            )}
          >
            {icon}
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>
            <h2 className="font-data text-2xl font-extrabold text-slate-900">
              {value}
            </h2>
          </div>
        </div>
      </AdminCard>
    </Link>
  );
};

const PERIOD_OPTIONS: { label: string; value: Period }[] = [
  { label: "Day", value: "day" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

const Page = () => {
  const [period, setPeriod] = useState<Period>("day");

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await getAdminStats();
      return res?.data?.payload;
    },
  });

  const { data: growth, isLoading: isGrowthLoading } = useQuery({
    queryKey: ["admin-user-growth", period],
    queryFn: async () => {
      const res = await getAdminUserGrowth(period);
      return res?.data?.payload ?? [];
    },
  });

  const { data: quizOverview, isLoading: isQuizOverviewLoading } = useQuery({
    queryKey: ["admin-quiz-overview"],
    queryFn: async () => {
      const res = await getAdminQuizOverview();
      return res?.data?.payload;
    },
  });

  const fmt = (n?: number) => `₦${Number(n ?? 0).toLocaleString()}`;
  const totalUsers = stats?.totalUsers ?? 0;
  const premiumUsers = stats?.premiumUsers ?? 0;

  const pieData = [
    {
      name: "Premium",
      value: premiumUsers,
      color: "#10b981",
      description: "Premium Users",
    },
    {
      name: "Free",
      value: Math.max(totalUsers - premiumUsers, 0),
      color: "#6366f1",
      description: "Free Users",
    },
  ];

  const topCardsData = [
    {
      icon: <FaUserGroup />,
      title: "Total Users",
      value: isLoading ? "..." : totalUsers.toLocaleString(),
      color: "text-blue-600",
      bg: "bg-blue-50",
      href: "/genuslab/users",
    },
    {
      icon: <FaUserPlus />,
      title: "Premium Users",
      value: isLoading ? "..." : premiumUsers.toLocaleString(),
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      href: "/genuslab/users?plan=premium",
    },
    {
      icon: <FaMoneyBill />,
      title: "Total Revenue",
      value: isLoading ? "..." : fmt(stats?.totalRevenue),
      color: "text-orange-600",
      bg: "bg-orange-50",
      href: "/genuslab/transactions?type=plan",
    },
    {
      icon: <FaPiggyBank />,
      title: "Total Payouts",
      value: isLoading ? "..." : fmt(stats?.totalPayouts),
      color: "text-purple-600",
      bg: "bg-purple-50",
      href: "/genuslab/transactions?type=finance",
    },
  ];

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* HEADER SECTION */}
      <AdminPageHeader
        title="Admin Dashboard"
        subtitle="Welcome back! Here's what's happening with Genus Lab today."
      />

      {/* KPI GRID */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topCardsData.map((cardData, index) => (
            <Card key={index} {...cardData} />
          ))}
        </div>
      </section>

      {/* QUIZ OVERVIEW */}
      <section>
        <AdminCard>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Quiz Overview</h2>
            <Link
              href="/genuslab/quizzes"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View all quizzes
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                icon: <MdQuiz />,
                label: "Total Quizzes",
                value: (quizOverview?.totalQuizzes ?? 0).toLocaleString(),
                color: "text-blue-600",
                bg: "bg-blue-50",
              },
              {
                icon: <MdOutlineLiveTv />,
                label: "Live",
                value: (quizOverview?.liveQuizzes ?? 0).toLocaleString(),
                color: "text-emerald-600",
                bg: "bg-emerald-50",
              },
              {
                icon: <MdOutlineArchive />,
                label: "Completed",
                value: (quizOverview?.completedQuizzes ?? 0).toLocaleString(),
                color: "text-slate-600",
                bg: "bg-slate-100",
              },
              {
                icon: <MdOutlineBarChart />,
                label: "Total Attempts",
                value: (quizOverview?.totalAttempts ?? 0).toLocaleString(),
                color: "text-purple-600",
                bg: "bg-purple-50",
              },
              {
                icon: <MdOutlineBarChart />,
                label: "Average Score",
                value: `${Number(quizOverview?.averageScore ?? 0).toFixed(1)}%`,
                color: "text-orange-600",
                bg: "bg-orange-50",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div
                  className={cn(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg",
                    item.bg,
                    item.color,
                  )}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-[14px] text-slate-500">{item.label}</p>
                  <p className="font-data text-lg font-extrabold text-slate-900">
                    {isQuizOverviewLoading ? "..." : item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </section>

      {/* CHART SECTION */}
      <section className="grid grid-cols-1 xl:grid-cols-3 gap-4 items-stretch">
        {/* LINE / AREA CHART */}
        <div className="xl:col-span-2">
          <AdminCard className="h-full">
            <div className="flex flex-col gap-4">
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900">
                  User Growth
                </h2>

                <div className="flex gap-2">
                  {PERIOD_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setPeriod(opt.value)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-lg transition font-semibold",
                        period === opt.value
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-600",
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CHART */}
              <div className="w-full min-h-[260px] sm:min-h-[300px]">
                {isGrowthLoading ? (
                  <div className="flex h-full min-h-[260px] items-center justify-center text-sm text-slate-400">
                    Loading chart...
                  </div>
                ) : (
                  <PerformanceChart data={growth ?? []} />
                )}
              </div>
            </div>
          </AdminCard>
        </div>

        {/* PIE CHART */}
        <div className="xl:col-span-1">
          <AdminCard className="h-full flex items-center justify-center">
            <div className="w-full min-h-[260px] sm:min-h-[300px] flex items-center justify-center">
              <CustomActiveShapePieChart data={pieData} />
            </div>
          </AdminCard>
        </div>
      </section>
    </div>
  );
};

export default Page;
