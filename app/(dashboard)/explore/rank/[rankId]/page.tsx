"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import GlassCard from "@/components/ui/cards/GlassCard";
import Avatar from "@/components/ui/Avatar";
import ClickableUserLink from "@/components/ui/ClickableUserLink";
import { MdLock, MdInbox } from "react-icons/md";
import { FaTrophy, FaMedal, FaBolt } from "react-icons/fa";
import {
  getRankById,
  getRankLeaderboard,
  getRankUserPosition,
} from "@/lib/api/apis";
import { formater } from "@/lib/utils/numFormatter";
import useUser from "@/hooks/useUser";

interface RankLeaderboardUser {
  position: number;
  score: number;
  userDetailsId: string;
  name: string;
  avatar: string | null;
  totalXp: number;
  rewardBalance: number;
  rank: string;
}

const PodiumSkeleton = () => (
  <section className="flex flex-col md:flex-row items-end justify-center gap-6 mt-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className={`flex flex-col items-center gap-4 w-full md:w-64 animate-pulse ${
          i === 2 ? "md:order-2 scale-105 md:scale-110 mb-4 md:mb-6" : ""
        }`}
      >
        <div className="w-20 h-20 rounded-full bg-white/10" />
        <div className="flex flex-col items-center gap-2 w-full">
          <div className="h-4 w-28 bg-white/10 rounded-md" />
          <div className="h-3 w-16 bg-white/5 rounded-md" />
        </div>
        <GlassCard className="w-full">
          <div className="h-20 md:h-24 flex items-center justify-center">
            <div className="h-8 w-12 bg-white/10 rounded-md" />
          </div>
        </GlassCard>
      </div>
    ))}
  </section>
);

const ListSkeleton = () => (
  <GlassCard>
    <div className="flex flex-col">
      {[1, 2, 3, 4, 5].map((_, idx) => (
        <div
          key={idx}
          className={`p-4 sm:p-5 flex items-center justify-between animate-pulse ${
            idx !== 4 ? "border-b border-white/5" : ""
          }`}
        >
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-6 h-4 bg-white/10 rounded-md" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10" />
              <div className="flex flex-col gap-1.5">
                <div className="h-4 w-28 bg-white/10 rounded-md" />
                <div className="h-3 w-16 bg-white/5 rounded-md" />
              </div>
            </div>
          </div>
          <div className="h-4 w-16 bg-white/10 rounded-md" />
        </div>
      ))}
    </div>
  </GlassCard>
);

const EmptyRankLeaderboard = () => (
  <div className="my-8 py-16 px-4 flex flex-col items-center justify-center text-center">
    <GlassCard className="max-w-md w-full">
      <div className="p-8 flex flex-col items-center gap-4">
        <div className="p-4 rounded-full bg-white/5 text-grey">
          <MdInbox size={32} />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-(--primary)">
            No one here yet
          </h3>
          <p className="text-sm text-grey">
            Nobody has earned XP in this rank yet. Be the first to claim the top
            spot.
          </p>
        </div>
      </div>
    </GlassCard>
  </div>
);

const RankLeaderboardPage = () => {
  const params = useParams();
  const rankId = Array.isArray(params.rankId)
    ? params.rankId[0]
    : params.rankId;

  const { data: userData } = useUser();
  const detailsId = userData?.user?.details?.id || "";

  const {
    data: rank,
    isLoading: rankLoading,
    isError: rankError,
  } = useQuery({
    queryKey: ["rank", rankId],
    enabled: !!rankId,
    queryFn: async () => {
      const res = await getRankById(rankId as string);
      return res.data.payload;
    },
  });

  const {
    data: leaderboardData = [],
    isLoading: leaderboardLoading,
    isError: leaderboardError,
  } = useQuery<RankLeaderboardUser[]>({
    queryKey: ["rank-leaderboard", rankId],
    enabled: !!rankId && !!rank?.unlocked,
    queryFn: async () => {
      const res = await getRankLeaderboard(rankId as string, 12);
      console.log(res, "ranks leaderboard");
      return res.data.payload || [];
    },
  });

  const leaderboard = leaderboardData.slice(0, 12);

  const { data: myPosition } = useQuery<number | null>({
    queryKey: ["rank-leaderboard-position", rankId, detailsId],
    enabled: !!rankId && !!rank?.unlocked && !!detailsId,
    queryFn: async () => {
      const res = await getRankUserPosition(rankId as string, detailsId);
      return res.data.payload ?? null;
    },
  });

  const hasLeaderboardData = leaderboard.length > 0;
  const rank1 = leaderboard.find((u) => u.position === 1);
  const rank2 = leaderboard.find((u) => u.position === 2);
  const rank3 = leaderboard.find((u) => u.position === 3);

  const podiumList = [
    ...(rank2 ? [{ ...rank2, ring: "border-white/20" }] : []),
    ...(rank1 ? [{ ...rank1, ring: "border-yellow" }] : []),
    ...(rank3 ? [{ ...rank3, ring: "border-orange-400/60" }] : []),
  ];

  const restRankings = leaderboard.filter((u) => u.position > 3);

  return (
    <Layout>
      <Header title={rank?.rankName || "Rank Leaderboard"} backBtn={true} />

      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8 max-w-6xl mx-auto">
        {rankLoading ? (
          <GlassCard>
            <div className="p-8 flex flex-col items-center gap-3 animate-pulse">
              <div className="h-14 w-14 rounded-lg bg-white/10" />
              <div className="h-6 w-40 bg-white/10 rounded-md" />
              <div className="h-3 w-28 bg-white/5 rounded-md" />
            </div>
          </GlassCard>
        ) : rankError || !rank ? (
          <GlassCard>
            <div className="text-center py-12 text-red text-sm font-medium">
              Failed to load this rank. Please try again later.
            </div>
          </GlassCard>
        ) : (
          <>
            {/* RANK SUMMARY */}
            <GlassCard>
              <div className="p-6 sm:p-8 flex flex-col items-center text-center gap-2">
                {!rank.unlocked && (
                  <div className="flex items-center gap-1.5 text-grey text-[13px] font-semibold uppercase tracking-wider mb-1">
                    <MdLock size={14} /> Locked
                  </div>
                )}
                <h1 className="text-2xl md:text-3xl font-black text-(--primary) tracking-tight">
                  {rank.rankName}
                </h1>
                <p className="text-grey text-sm">
                  Rank #{rank.rank} &middot; {formater(rank.unlockXp)} XP to
                  unlock
                </p>
                <p className="text-green text-sm font-semibold">
                  {formater(rank.reward)} reward
                </p>
              </div>
            </GlassCard>

            {!rank.unlocked ? (
              <GlassCard>
                <div className="p-10 flex flex-col items-center gap-3 text-center">
                  <div className="p-4 rounded-full bg-white/5 text-grey">
                    <MdLock size={28} />
                  </div>
                  <h3 className="text-(--primary) font-semibold">
                    This rank is still locked
                  </h3>
                  <p className="text-grey text-sm max-w-sm">
                    The leaderboard for this rank will be available once it's
                    unlocked.
                  </p>
                </div>
              </GlassCard>
            ) : (
              <>
                {leaderboardLoading && (
                  <div className="flex flex-col gap-6">
                    <PodiumSkeleton />
                    <ListSkeleton />
                  </div>
                )}

                {!leaderboardLoading && leaderboardError && (
                  <GlassCard>
                    <div className="text-center py-12 text-red text-sm font-medium">
                      Failed to load the leaderboard for this rank. Please try
                      again later.
                    </div>
                  </GlassCard>
                )}

                {!leaderboardLoading &&
                  !leaderboardError &&
                  !hasLeaderboardData && <EmptyRankLeaderboard />}

                {!leaderboardLoading &&
                  !leaderboardError &&
                  hasLeaderboardData && (
                    <>
                      {podiumList.length > 0 && (
                        <section className="flex flex-col md:flex-row items-end justify-center gap-6 mt-4">
                          {podiumList.map((user) => (
                            <div
                              key={user.position}
                              className={`flex flex-col items-center gap-3 w-full md:w-64 ${
                                user.position === 1
                                  ? "order-1 md:order-2 scale-105 md:scale-110 mb-4 md:mb-6"
                                  : user.position === 2
                                    ? "order-2 md:order-1"
                                    : "order-3"
                              }`}
                            >
                              <div className="relative">
                                <ClickableUserLink
                                  userDetailsId={user.userDetailsId}
                                  currentUserDetailsId={detailsId}
                                >
                                  <Avatar
                                    size={user.position === 1 ? 96 : 76}
                                    type="main"
                                    url={user.avatar || undefined}
                                    color={user.ring}
                                  />
                                </ClickableUserLink>
                                <div
                                  className={`absolute -top-2 -right-2 p-1.5 rounded-full ${
                                    user.position === 1
                                      ? "bg-yellow text-black"
                                      : "bg-white/10 text-(--primary)"
                                  }`}
                                >
                                  {user.position === 1 ? (
                                    <FaTrophy size={14} />
                                  ) : (
                                    <FaMedal size={13} />
                                  )}
                                </div>
                              </div>

                              <div className="text-center">
                                <h3 className="text-(--primary) font-semibold capitalize">
                                  {user.name}
                                </h3>
                                <p className="text-blue text-sm font-semibold mt-1 flex items-center justify-center gap-1">
                                  <FaBolt className="text-[13px]" />
                                  {(user.score ?? 0).toLocaleString()} XP
                                </p>
                              </div>

                              <GlassCard className="w-full">
                                <div className="h-16 md:h-20 flex items-center justify-center font-semibold text-3xl text-white/15">
                                  #{user.position}
                                </div>
                              </GlassCard>
                            </div>
                          ))}
                        </section>
                      )}

                      {restRankings.length > 0 && (
                        <section className="flex flex-col gap-4">
                          <h2 className="text-lg font-semibold text-(--primary) px-1">
                            Full rankings
                          </h2>

                          <GlassCard>
                            <div className="flex flex-col">
                              {restRankings.map((player, index) => (
                                <div
                                  key={player.position}
                                  className={`p-4 sm:p-5 flex items-center justify-between hover:bg-white/5 transition-colors ${
                                    index !== restRankings.length - 1
                                      ? "border-b border-white/5"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-center gap-4 sm:gap-6">
                                    <span className="text-grey font-semibold w-6 text-center">
                                      {player.position}
                                    </span>
                                    <div className="flex items-center gap-3">
                                      <ClickableUserLink
                                        userDetailsId={player.userDetailsId}
                                        currentUserDetailsId={detailsId}
                                      >
                                        <Avatar
                                          size={40}
                                          type="main"
                                          url={player.avatar || undefined}
                                        />
                                      </ClickableUserLink>
                                      <h4 className="text-(--primary) text-sm font-semibold capitalize">
                                        {player.name}
                                      </h4>
                                    </div>
                                  </div>

                                  <div className="flex flex-col items-end">
                                    <span className="text-(--primary) font-semibold text-sm">
                                      {(player.score ?? 0).toLocaleString()}
                                    </span>
                                    <span className="text-grey text-[13px]">
                                      Total XP
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </GlassCard>
                        </section>
                      )}
                    </>
                  )}
              </>
            )}

            {/* STICKY USER FOOTER — always shows where the signed-in user
                actually stands in this rank, even when they're outside the
                top 20 shown above. */}
            {rank.unlocked && detailsId && myPosition && (
              <div className="sticky bottom-0 z-10 pt-4">
                <GlassCard>
                  <div className="p-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <span className="text-blue font-semibold text-xl">
                        #{myPosition}
                      </span>
                      <span className="text-(--primary) font-semibold text-sm">
                        Your position in this rank
                      </span>
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default RankLeaderboardPage;
