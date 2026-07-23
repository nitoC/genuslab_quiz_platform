"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import ImageWithFallback from "@/components/ui/ImageWithFallback";
import CircularProgress from "@/components/ui/progress/Circular";
import { cn } from "@/lib/utils/cn";
import SimpleAreaChart from "@/components/ui/charts/CurveArea";
import { IoMdTrophy } from "react-icons/io";
import { Bar, BarChart, Cell, ResponsiveContainer } from "recharts";
import { memo, useMemo, FC } from "react";
import { useQuery } from "@tanstack/react-query";
import { getUserDashboard } from "@/lib/api/apis";
import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";
import { MdOutlineTrendingFlat } from "react-icons/md";
import {
  BsTrophy,
  BsBarChartLine,
  BsPersonX,
  BsExclamationCircle,
} from "react-icons/bs";
import { IconType } from "react-icons";
import clsx from "clsx";
import { IWeekInterface } from "../interface";
import StatsSkeleton from "./skeletons/Stats";

interface ActivityEntry {
  name: string;
  score: number;
  avatar?: string;
  color?: string;
}

interface ReferralEntry {
  name?: string;
  value: number;
}

interface MasterEntry {
  name?: string;
  value: number;
}

interface Performer {
  color: string;
  name: string;
  avatar: string;
  email: string;
  position: number;
  rank: number;
  rewardBalance: number;
  score: number;
  totalXp: number;
  userDetailsId: number;
}

interface StatsProps {
  // ACTIVITY_DATA: ActivityEntry[];
  BAR_COLORS: string[];
  maxPoints: number;
  REFERRAL_DATA: ReferralEntry[];
  MASTER_DATA: MasterEntry[];
  detailsId: string;
}

// Reusable Professional Empty State Card
interface EmptyStateCardProps {
  icon: IconType;
  title: string;
  description: string;
  className?: string;
}

const EmptyStateCard: FC<EmptyStateCardProps> = ({
  icon: Icon,
  title,
  description,
  className,
}) => (
  <div
    className={cn(
      "flex flex-col items-center justify-center text-center p-6 rounded-xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-sm",
      className,
    )}
  >
    <div className="w-12 h-12 rounded-full bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-3 shadow-inner">
      <Icon className="text-slate-400 text-xl" />
    </div>
    <h4 className="text-slate-200 font-semibold text-sm mb-1">{title}</h4>
    <p className="text-slate-400 text-xs max-w-[200px] leading-relaxed">
      {description}
    </p>
  </div>
);

// Light dynamic colors optimized for dark mode background
const DARK_MODE_LIGHT_COLORS = [
  "#38bdf8", // Light Bright Blue (sky-400)
  "#fb923c", // Light Bright Orange (orange-400)
  "#4ade80", // Light Bright Green (green-400)
  "#60a5fa", // Soft Blue (blue-400)
  "#ffb703", // Warm Amber Orange
  "#34d399", // Minty Emerald Green (emerald-400)
];

const Stats = ({ BAR_COLORS, detailsId }: StatsProps) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-dashboard", detailsId],
    queryFn: async () => {
      const res = await getUserDashboard(detailsId!);
      return res.data?.payload;
    },
    enabled: !!detailsId,
  });

  // Dynamic activity data safely memoized
  const dynamicActivityData: ActivityEntry[] = useMemo(() => {
    return data?.leaderboard?.overallActivity || [];
  }, [data]);

  const dynamicMaxScore = useMemo(() => {
    if (!dynamicActivityData.length) return 0;
    return Math.max(...dynamicActivityData.map((item) => item.score || 0));
  }, [dynamicActivityData]);

  // Dynamic quiz performers safely memoized
  const overallLeaderboard: Performer[] = useMemo(() => {
    return data?.leaderboard?.overallLeaderboard || [];
  }, [data]);

  const maxLeaderboardScore = useMemo(() => {
    if (!overallLeaderboard.length) return 0;
    return Math.max(...overallLeaderboard.map((a) => a.score || 0));
  }, [overallLeaderboard]);

  const getDynamicBarColor = (itemScore: number, index: number) => {
    if (dynamicActivityData[index]?.color) {
      return dynamicActivityData[index].color;
    }

    const palette =
      BAR_COLORS && BAR_COLORS.length > 0 ? BAR_COLORS : DARK_MODE_LIGHT_COLORS;

    if (itemScore === dynamicMaxScore && dynamicMaxScore > 0) {
      return "#38bdf8";
    }

    return palette[index % palette.length];
  };

  if (isLoading || !data) {
    return <StatsSkeleton />;
  }

  if (isError || error) {
    return (
      <GlassCard className="p-8 flex flex-col items-center justify-center text-center my-6">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-3">
          <BsExclamationCircle className="text-red-400 text-xl" />
        </div>
        <h3 className="text-lg font-semibold text-white">
          Failed to load statistics
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          An error occurred while fetching dashboard details.
        </p>
      </GlassCard>
    );
  }

  const lastWeek = data?.weeksData?.[4]?.totalScore || 0;
  const last2Weeks = data?.weeksData?.[3]?.totalScore || 0;
  const growthWeek = Math.max(lastWeek, last2Weeks);
  const receedWeek = Math.min(lastWeek, last2Weeks);
  const trend =
    lastWeek - last2Weeks > 1 ? "+" : lastWeek - last2Weeks < 0 ? "-" : "";
  const growth =
    growthWeek === 0 || receedWeek === 0 ? 0 : growthWeek / receedWeek;

  const statsData = {
    lastWeek,
    last2Weeks,
    growth,
    growthWeek,
    trend,
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const weeksDataFormatted = (data?.weeksData || []).map(
    (a: IWeekInterface) => {
      return { name: `W-${a.week.split("-")[1]}`, value: a.totalScore };
    },
  );

  const daysDataFormatted = (data?.analytics || []).map((a: any) => {
    const dateArr = a.day.split("-");
    const dateStrRearrange = `${dateArr[2]}-${dateArr[1]}-${dateArr[0]}`;
    const day = new Date(dateStrRearrange).getDay();
    const dayStr = days[day];
    return { name: dayStr, value: a.totalScore };
  });

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Analytics Chart */}
        <GlassCard className="lg:col-span-2 p-6 flex flex-col relative overflow-hidden">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-slate-400 text-sm font-medium">
                Weekly Analytics
              </p>
              <h2 className="text-4xl font-bold text-white mt-1">
                {/* {data.fiveWeeksAverage} */}
              </h2>
              <p
                className={clsx(
                  "text-sm mt-1 flex items-center gap-1",
                  trend === "+" && "text-emerald-400",
                  trend === "-" && "text-red-400",
                  trend === "" && "text-gray-400",
                )}
              >
                <span className="text-xs">
                  {trend === "+" && <FaArrowTrendUp />}
                  {trend === "-" && <FaArrowTrendDown />}
                  {trend === "" && <MdOutlineTrendingFlat />}
                </span>{" "}
                {statsData.trend} {statsData.growth}% last week
              </p>
            </div>
          </div>
          <div className="h-[220px] w-full mt-4">
            <SimpleAreaChart data={weeksDataFormatted} />
          </div>
        </GlassCard>

        {/* Top Quiz Performers Leaderboard */}
        <GlassCard className="p-6 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-slate-400 font-medium">Top Quiz Performers</h3>
            <div className="text-white bg-white/10 p-2 rounded-full text-xl">
              <IoMdTrophy color="white" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-6">
            Record Score: {maxLeaderboardScore}
          </h2>

          {overallLeaderboard.length > 0 ? (
            <div className="space-y-6">
              {overallLeaderboard.map((user: Performer, i: number) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="relative">
                    <CircularProgress
                      percentage={user.score}
                      size={45}
                      strokeWidth={3}
                      color={user.color}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold">
                      {user.score}
                    </span>
                  </div>
                  <div className="flex-1 text-sm font-medium">
                    <div className="flex justify-between text-white mb-1">
                      <span>{user.name}</span>
                      <span className="text-blue-400 font-mono">
                        {user.totalXp}
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full"
                        style={{ width: `${user.score}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyStateCard
              icon={BsTrophy}
              title="No Performers Yet"
              description="Top Quiz leaderboard rankings will appear once scores are recorded."
              className="flex-1 my-auto"
            />
          )}
        </GlassCard>
      </div>

      {/* MIDDLE ROW */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Personal Performance */}
        <GlassCard className="p-6 flex flex-col justify-between min-h-55">
          <div className="flex justify-between">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider">
                Personal Performance
              </p>
              <h2 className="text-3xl font-bold text-white mt-2">
                Avg: {data.totalAverage}%
              </h2>
            </div>
            <div className="relative">
              <CircularProgress
                percentage={data.totalAverage}
                size={80}
                strokeWidth={6}
                color="text-[#3b82f6]"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {data.totalAverage}
                </span>
              </div>
            </div>
          </div>
          <div className="h-30 w-full mt-4">
            <SimpleAreaChart data={daysDataFormatted} size="sm" />
          </div>
        </GlassCard>

        {/* Activity Leaderboard Bar Chart */}
        <GlassCard className="p-6 flex flex-col justify-between">
          <div>
            <p className="text-slate-400 text-xs uppercase tracking-wider">
              Activity Leaderboard
            </p>
            <h2 className="text-3xl font-bold text-white mt-2 mb-4">
              Top Score: {dynamicMaxScore ?? 0}
            </h2>
          </div>

          {dynamicActivityData.length > 0 ? (
            <>
              <div className="flex-1 min-h-[180px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dynamicActivityData}
                    margin={{ top: 0, right: 10, left: 10, bottom: 0 }}
                  >
                    <Bar dataKey="score" radius={[6, 6, 6, 6]} barSize={40}>
                      {dynamicActivityData.map(
                        (entry: ActivityEntry, index: number) => (
                          <Cell
                            key={index}
                            fill={getDynamicBarColor(entry.score, index)}
                          />
                        ),
                      )}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-between items-center mt-4 px-4">
                {dynamicActivityData.map((user: ActivityEntry, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 w-[40px]"
                  >
                    <ImageWithFallback
                      src={user.avatar}
                      alt={user.name}
                      className={cn(
                        "w-8 h-8 rounded-full bg-slate-700 border overflow-hidden",
                        user.score === dynamicMaxScore
                          ? "border-sky-400 ring-2 ring-sky-400/30"
                          : "border-slate-600",
                      )}
                    />
                    <span className="text-[9px] text-slate-400 font-medium truncate w-full text-center">
                      {user.name}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyStateCard
              icon={BsBarChartLine}
              title="No Activity Logged"
              description="Activity scores are currently empty. Check back once users log actions."
              className="py-10"
            />
          )}
        </GlassCard>
      </div>
    </>
  );
};

export default memo(Stats);
