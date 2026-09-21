"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import Avatar from "@/components/ui/Avatar";
import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import { getPublicUserStats } from "@/lib/api/apis";
import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  MdOutlineTrendingUp,
  MdEmojiEvents,
  MdCardGiftcard,
  MdAccountBalanceWallet,
  MdStars,
  MdPersonOff,
  MdChecklistRtl,
  MdGroupAdd,
  MdMilitaryTech,
} from "react-icons/md";
import { ReactNode } from "react";

interface PublicUserStats {
  name: string | null;
  avatar: string | null;
  rank: string | null;
  rankMultiplier: number;
  memberSince: string | null;
  overallRank: number | null;
  totalAccumulatedPoints: number;
  rewardBalance: number;
  averageScoreThisWeek: number;
  highestScore: number;
  totalQuizzesCompleted: number;
  quizEpisodesWon: number;
  winRate: number;
  rewardsWonThisWeek: number;
  totalRewardsWon: number;
  totalReferralRewardsWon: number;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatJoinDate = (iso: string | null) => {
  if (!iso) return null;
  return new Intl.DateTimeFormat("en-GB", {
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
};

const StatCard = ({
  icon,
  label,
  value,
  sublabel,
  accent,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  sublabel?: string;
  accent?: string;
}) => (
  <GlassCard>
    <div className="p-5 sm:p-6">
      <div className="flex items-center gap-2 text-grey text-sm font-medium mb-2.5">
        <span
          className={`p-1.5 rounded-md ${accent ?? "bg-white/5 text-blue"}`}
        >
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <p className="text-2xl font-bold text-(--primary) tracking-tight">
        {value}
      </p>
      {sublabel && <p className="text-grey text-[13px] mt-1">{sublabel}</p>}
    </div>
  </GlassCard>
);

const SectionHeading = ({ children }: { children: ReactNode }) => (
  <h2 className="text-sm font-semibold text-(--primary) uppercase tracking-wider">
    {children}
  </h2>
);

const StatsSkeleton = ({ count }: { count: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
    {Array.from({ length: count }).map((_, i) => (
      <GlassCard key={i}>
        <div className="p-6 flex flex-col gap-3">
          <div className="h-4 bg-white/10 rounded w-1/2" />
          <div className="h-7 bg-white/20 rounded w-2/3" />
        </div>
      </GlassCard>
    ))}
  </div>
);

const PublicUserStatsPage = () => {
  const params = useParams<{ detailsId: string }>();
  const router = useRouter();
  const detailsId = params?.detailsId;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["public-user-stats", detailsId],
    queryFn: async () => {
      const res = await getPublicUserStats(detailsId as string);
      return res.data?.payload as PublicUserStats;
    },
    enabled: !!detailsId,
  });

  const joinDate = formatJoinDate(data?.memberSince ?? null);

  return (
    <Layout>
      <Header title="Player Stats" backBtn={true} />

      <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-10">
        {isError ? (
          <GlassCard>
            <div className="p-10 flex flex-col items-center text-center gap-3">
              <span className="bg-white/5 p-4 rounded-full text-grey">
                <MdPersonOff size={28} />
              </span>
              <h2 className="text-(--primary) font-bold text-lg">
                Couldn't load this player
              </h2>
              <p className="text-grey text-sm max-w-sm">
                This player may no longer exist, or something went wrong
                fetching their stats.
              </p>
              <button
                onClick={() => router.back()}
                className="mt-2 px-4 py-2 rounded-md bg-white/10 hover:bg-white/15 text-(--primary) text-sm font-semibold transition-colors"
              >
                Go Back
              </button>
            </div>
          </GlassCard>
        ) : (
          <>
            {/* Profile hero */}
            <GlassCard className="relative overflow-hidden">
              <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {isLoading ? (
                  <div className="w-24 h-24 rounded-full bg-white/10 animate-pulse shrink-0" />
                ) : (
                  <Avatar
                    url={data?.avatar || undefined}
                    size={96}
                    type="main"
                    color="border-blue"
                  />
                )}

                <div className="flex-1 text-center sm:text-left">
                  {isLoading ? (
                    <div className="flex flex-col gap-2.5 items-center sm:items-start">
                      <div className="h-7 w-44 bg-white/10 rounded animate-pulse" />
                      <div className="h-4 w-28 bg-white/5 rounded animate-pulse" />
                    </div>
                  ) : (
                    <>
                      <h1 className="text-2xl sm:text-3xl font-bold text-(--primary) capitalize">
                        {data?.name || "Player"}
                      </h1>

                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 mt-3">
                        {data?.rank && (
                          <span className="text-sm font-semibold text-blue">
                            {data.rank}
                          </span>
                        )}
                        {data?.overallRank && (
                          <span className="text-sm font-semibold text-yellow">
                            Global Rank #{data.overallRank}
                          </span>
                        )}
                        {joinDate && (
                          <span className="text-sm text-grey">
                            Joined {joinDate}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </GlassCard>

            {/* Performance */}
            <div className="space-y-4">
              <SectionHeading>Performance</SectionHeading>
              {isLoading ? (
                <StatsSkeleton count={4} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    icon={<MdOutlineTrendingUp size={18} />}
                    label="Average Score This Week"
                    value={`${data?.averageScoreThisWeek ?? 0}%`}
                  />
                  <StatCard
                    icon={<MdEmojiEvents size={18} />}
                    label="Highest Score"
                    value={`${(data?.highestScore ?? 0) * 10}%`}
                  />
                  <StatCard
                    icon={<MdChecklistRtl size={18} />}
                    label="Quizzes Completed"
                    value={(data?.totalQuizzesCompleted ?? 0).toLocaleString()}
                  />
                  <StatCard
                    icon={<MdStars size={18} />}
                    label="Total Accumulated Points"
                    value={(data?.totalAccumulatedPoints ?? 0).toLocaleString()}
                  />
                </div>
              )}
            </div>

            {/* Wins & Rewards */}
            <div className="space-y-4">
              <SectionHeading>Wins & Rewards</SectionHeading>
              {isLoading ? (
                <StatsSkeleton count={5} />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <StatCard
                    icon={<MdMilitaryTech size={18} />}
                    label="Quiz Episodes Won"
                    value={(data?.quizEpisodesWon ?? 0).toLocaleString()}
                    sublabel={`${data?.winRate ?? 0}% win rate`}
                  />
                  <StatCard
                    icon={<MdCardGiftcard size={18} />}
                    label="Rewards Won This Week"
                    value={formatCurrency(data?.rewardsWonThisWeek ?? 0)}
                  />
                  <StatCard
                    icon={<MdAccountBalanceWallet size={18} />}
                    label="Total Rewards Won"
                    value={formatCurrency(data?.totalRewardsWon ?? 0)}
                  />
                  <StatCard
                    icon={<MdGroupAdd size={18} />}
                    label="Total Referral Rewards Won"
                    value={formatCurrency(data?.totalReferralRewardsWon ?? 0)}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default PublicUserStatsPage;
