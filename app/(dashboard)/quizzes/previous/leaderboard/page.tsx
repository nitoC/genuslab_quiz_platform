"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import GlassBadge from "@/components/ui/GlassBadge";
import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import ClickableUserLink from "@/components/ui/ClickableUserLink";
import useSlots from "@/hooks/useSlots";
import useSystemTime from "@/hooks/useSystemTime";
import useUser from "@/hooks/useUser";
import { getEpisodeLeaderboard } from "@/lib/api/apis";
import { cn } from "@/lib/utils/cn";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useMemo } from "react";
import {
  MdArrowForward,
  MdEmojiEvents,
  MdMoreHoriz,
  MdPerson,
  MdHourglassTop,
} from "react-icons/md";

interface LeaderboardItem {
  position: number;
  score: number;
  name: string;
  avatar: string | null;
  totalXp: number;
  timeInSeconds: number | null;
  userDetailsId: string;
}

// "1m 23s" / "45s"; em dash when the time is unknown.
const formatSpeed = (seconds: number | null | undefined) => {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) {
    return "—";
  }
  const totalSeconds = Math.max(0, Math.round(seconds));
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return minutes > 0
    ? `${minutes}m ${remainingSeconds}s`
    : `${remainingSeconds}s`;
};

// Plain label/value pair for the winner's stats.
const Stat = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div>
    <p className="text-grey text-[13px]">{label}</p>
    <p className="text-(--primary) font-semibold text-sm mt-0.5">{value}</p>
  </div>
);

const EpisodePerformancePage = () => {
  const router = useRouter();
  const QueryParam = useSearchParams();
  const { data: userData } = useUser();
  const currentDetailsId = userData?.user?.details?.id;

  const date = QueryParam.get("date");
  const episode = QueryParam.get("episode");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["episode leaderboard", date, episode],
    queryFn: async () => {
      const res = await getEpisodeLeaderboard(
        date as string,
        episode as string,
      );
      return res.data;
    },
    enabled: Boolean(date && episode),
  });

  const { slotData, slotLoading, slotError } = useSlots();
  const {
    data: sysTime,
    isLoading: sysTimeLoading,
    isError: sysTimeError,
  } = useSystemTime();

  const ongoing = useMemo(() => {
    if (!slotData || !episode || !sysTime?.payload || !date) return false;

    const slot = slotData.find((s: any) => s.episode === episode);
    if (!slot) return false;

    // `date` is dd-MM-yyyy.
    const [day, month, year] = date.split("-").map(Number);
    if (!year || !month || !day) return false;

    // 2. Derive system time object from server payload
    const currentSysTime = new Date(sysTime.payload);

    // 3. Construct exact start and end dates for the quiz episode slot
    // Note: month index is 0-based in JavaScript (month - 1)
    const slotStart = new Date(year, month - 1, day, slot.startHour || 0, 0, 0);
    const slotEnd = new Date(year, month - 1, day, slot.endHour, 0, 0);

    // 4. Compare timestamp bounds
    const currentMs = currentSysTime.getTime();
    return currentMs >= slotStart.getTime() && currentMs < slotEnd.getTime();
  }, [episode, slotData, sysTime, date]);

  if (isLoading || slotLoading || sysTimeLoading || ongoing === undefined) {
    return <p className="p-6 text-grey">Loading leaderboard...</p>;
  }
  if (isError || slotError || sysTimeError) {
    return <p className="p-6 text-red">Something went wrong fetching data.</p>;
  }

  const leaderboardList: LeaderboardItem[] = data?.payload || [];

  const winner =
    leaderboardList.find((item) => item.position === 1) || leaderboardList[0];

  return (
    <Layout>
      <Header title="Episode Performance" backBtn={true} />
      <div className="min-h-screen pb-28">
        <div className="max-w-5xl mx-auto px-4 md:px-8 pt-6 space-y-6 md:space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-grey flex items-center gap-1.5">
                  {ongoing && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green" />
                  )}
                  {ongoing ? "Live leaderboard" : "Final results"}
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-semibold text-(--primary) tracking-tight">
                Episode Performance
              </h1>
              <p className="text-sm text-grey whitespace-nowrap">
                Day {date || "--"} <span className="mx-1.5">·</span> Episode{" "}
                {episode || "--"}
              </p>
            </div>

            <button
              onClick={() => {
                router.back();
              }}
              className="w-fit shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 text-(--primary) border border-white/10 text-sm font-medium transition-colors whitespace-nowrap"
            >
              <span>View quiz answers</span>
              <MdArrowForward className="text-base text-grey" />
            </button>
          </div>

          {/* Conditional Banner: Ongoing vs Completed Winner Card */}
          {ongoing ? (
            <GlassCard>
              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-14 h-14 rounded-full bg-blue/10 flex items-center justify-center shrink-0 text-blue">
                  <MdHourglassTop size={26} className="animate-spin" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-1.5">
                  <GlassBadge variant="info">Ongoing episode</GlassBadge>
                  <h2 className="text-xl font-semibold text-(--primary) pt-1">
                    Episode is currently in progress
                  </h2>
                  <p className="text-grey text-sm">
                    Scores and positions are updated live. Final winners will be
                    announced once this episode concludes.
                  </p>
                </div>
              </div>
            </GlassCard>
          ) : (
            winner && (
              <GlassCard>
                <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8">
                  {/* Avatar + Champion */}
                  <div className="relative shrink-0 flex flex-col items-center gap-2">
                    <ClickableUserLink
                      userDetailsId={winner.userDetailsId}
                      currentUserDetailsId={currentDetailsId}
                      className="relative w-24 h-24 md:w-28 md:h-28 rounded-full border-2 border-yellow/50 p-1 block"
                    >
                      <div className="relative w-full h-full rounded-full overflow-hidden bg-white/5 flex items-center justify-center">
                        {winner.avatar ? (
                          <Image
                            src={winner.avatar}
                            alt={winner.name}
                            fill
                            className="object-cover"
                            priority
                          />
                        ) : (
                          <MdPerson className="text-4xl text-grey" />
                        )}
                      </div>

                      <div className="absolute top-0 right-0 bg-yellow text-black p-1.5 rounded-full">
                        <MdEmojiEvents size={16} />
                      </div>
                    </ClickableUserLink>

                    <p className="text-yellow text-xs font-semibold uppercase tracking-wide">
                      Champion
                    </p>
                  </div>

                  {/* Winner Content */}
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <div>
                      <p className="text-grey text-sm">
                        Rank #{winner.position}
                      </p>
                      <h2 className="text-xl md:text-2xl font-semibold text-(--primary) mt-0.5 capitalize">
                        {winner.name}
                      </h2>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-white/10 pt-4">
                      <Stat label="Total XP" value={winner.totalXp} />
                      <Stat label="Score" value={winner.score} />
                      <Stat
                        label="Winning time"
                        value={formatSpeed(winner.timeInSeconds)}
                      />
                      <Stat
                        label="Participants"
                        value={leaderboardList.length}
                      />
                    </div>

                    <p className="text-grey text-sm leading-relaxed max-w-xl">
                      Outstanding performance this episode!{" "}
                      <span className="capitalize">{winner.name}</span> achieved
                      a score of {winner.score}% and secured {winner.totalXp}{" "}
                      total XP.
                    </p>

                    <Link
                      href={"/rewards-breakdown"}
                      // target="_blank"
                      className="inline-block px-4 py-2 rounded-md bg-blue text-white text-sm font-semibold hover:brightness-110 transition-all"
                    >
                      View reward breakdown
                    </Link>
                  </div>
                </div>
              </GlassCard>
            )
          )}

          {/* Leaderboard Table Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-(--primary)">
                  Leaderboard
                </h3>
                <span className="text-sm text-grey">
                  · {leaderboardList.length}{" "}
                  {ongoing ? "participating" : "participants"}
                </span>
              </div>
              <button className="text-grey hover:text-(--primary) p-1">
                <MdMoreHoriz size={20} />
              </button>
            </div>

            <GlassCard>
              <div className="overflow-x-auto">
                {/* min-w forces the table to keep its natural column widths
                    instead of squeezing into the narrow viewport (which was
                    wrapping every cell's text) — overflow-x-auto above then
                    gives an actual horizontal scroll on mobile instead. */}
                <table className="w-full min-w-[720px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-[13px] font-medium uppercase tracking-wide text-grey">
                      <th className="py-3 px-5 whitespace-nowrap">Rank</th>
                      <th className="py-3 px-5 whitespace-nowrap">User</th>
                      <th className="py-3 px-5 whitespace-nowrap">
                        Weighted score
                      </th>
                      <th className="py-3 px-5 whitespace-nowrap">Speed</th>
                      <th className="py-3 px-5 text-right whitespace-nowrap">
                        Total XP
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-sm font-medium">
                    {leaderboardList.map((row) => (
                      <tr
                        key={row.position}
                        className={cn(
                          "hover:bg-white/5 transition-colors",
                          !ongoing && row.position === 1 && "bg-white/[0.03]",
                        )}
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <span
                            className={cn(
                              "font-semibold text-sm",
                              !ongoing && row.position === 1
                                ? "text-yellow"
                                : !ongoing && row.position === 2
                                  ? "text-grey"
                                  : !ongoing && row.position === 3
                                    ? "text-orange-400"
                                    : "text-grey",
                            )}
                          >
                            #{row.position}
                          </span>
                        </td>

                        {/* User Avatar & Name */}
                        <td className="py-3.5 px-5 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <ClickableUserLink
                              userDetailsId={row.userDetailsId}
                              currentUserDetailsId={currentDetailsId}
                              className="w-8 h-8 rounded-full relative overflow-hidden bg-white/5 border border-white/10 shrink-0 flex items-center justify-center block"
                            >
                              {row.avatar ? (
                                <Image
                                  src={row.avatar}
                                  alt={row.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <MdPerson className="text-grey text-base" />
                              )}
                            </ClickableUserLink>
                            <span className="text-(--primary) font-semibold capitalize">
                              {row.name}
                            </span>
                          </div>
                        </td>

                        {/* Score */}
                        <td className="py-3.5 px-5 whitespace-nowrap text-(--primary) font-semibold text-sm">
                          {row.score}
                        </td>

                        {/* Speed */}
                        <td className="py-3.5 px-5 whitespace-nowrap text-grey">
                          {formatSpeed(row.timeInSeconds)}
                        </td>

                        {/* Total XP */}
                        <td className="py-3.5 px-5 text-right text-(--primary) font-semibold whitespace-nowrap">
                          {row.totalXp} XP
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const PageWrapper = () => {
  return (
    <Suspense fallback={<p className="p-6 text-grey">Loading component...</p>}>
      <EpisodePerformancePage />
    </Suspense>
  );
};

export default PageWrapper;
