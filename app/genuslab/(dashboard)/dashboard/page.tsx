"use client";

import { useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/layouts/AdminHeader";
import AdminCard from "@/components/ui/cards/AdminCard";
import PerformanceChart from "@/components/ui/charts/CurveArea";
import CustomActiveShapePieChart from "@/components/ui/charts/LinePie";
import { getAdminStats, getAdminUserGrowth } from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";

import {
  FaPiggyBank,
  FaMoneyBill,
  FaUserGroup,
  FaUserPlus,
} from "react-icons/fa6";

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
      <AdminHeader
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
