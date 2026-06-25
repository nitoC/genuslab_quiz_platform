// "use client";

// import ChartUpIcon from "@/assets/ChartUpIcon";
// import ShieldIcon from "@/assets/ShieldIcon";
// import Header from "@/components/layouts/Header";
// import Layout from "@/components/layouts/Layout";
// import Avatar from "@/components/ui/Avatar";
// import PrimaryButton from "@/components/ui/buttons/Primary";
// import GlassCard from "@/components/ui/cards/GlassCard";
// import ProgressBar from "@/components/ui/ProgressBar";
// import useCountdown from "@/hooks/useCountdown";
// import { useTime } from "@/hooks/useTime";
// import getSessionStorage from "@/lib/utils/getSessionStorage";
// import nameResolver from "@/lib/utils/nameResolver";
// import { useSocket } from "@/store/useSocket";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { AiFillDollarCircle } from "react-icons/ai";
// import { FaCheckCircle, FaTrophy } from "react-icons/fa";
// import { IoIosRocket } from "react-icons/io";
// import { MdStars } from "react-icons/md";

// const page = () => {
//   const router = useRouter();
//   const socketId = useSocket((state: any) => state.socketId);
//   // const loggedInUser = useUser((state: any) => state.user);

//   const [targetEpoch, setTargetEpoch] = useState<number | null>(null);
//   const [countdown, setCountdown] = useState("Next quiz in —");
//   const [userData, setUserData] = useState<any>();
//   const [userName, setUserName] = useState<any>("");
//   const [Sid, setSid] = useState("");
//   const [showNotStartedModal, setShowNotStartedModal] = useState(false);
//   const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [type, setType] = useState("dash");

//   const loading = !userData;

//   useEffect(() => {
//     const user = getSessionStorage("user");
//     console.log(user, "user");
//     if (user) {
//       setUserData(JSON.parse(user));
//       setUserName(nameResolver(JSON.parse(user).fullname));
//     } else {
//       router.push("/login");
//     }
//   }, []);

//   useEffect(() => {
//     setSid(socketId);
//   }, [socketId]);

//   /* ---------- Socket Epoch ---------- */
//   const handleTimerUpdate = (epoch: number) => {
//     setTargetEpoch(epoch);
//   };

//   useTime(socketId, handleTimerUpdate);

//   useCountdown(
//     targetEpoch,
//     "dash",
//     (
//       val:
//         | string
//         | { days: number; hours: number; minutes: number; seconds: number },
//     ) => {
//       setCountdown(typeof val === "string" ? val : `Next quiz in —`);
//     },
//   );

//   /* ---------- Quiz Card Click Logic ---------- */
//   const handleQuizClick = (
//     e: React.MouseEvent,
//     quizHour: number,
//     episode: number,
//   ) => {
//     e.preventDefault();
//     if (!targetEpoch) return;

//     const now = Date.now();
//     const quizStart = new Date(targetEpoch);
//     quizStart.setHours(quizHour, 0, 0, 0);

//     const startEpoch = quizStart.getTime();
//     const endEpoch = startEpoch + 2 * 60 * 60 * 1000;

//     if (now < startEpoch) {
//       setShowNotStartedModal(true);
//       return;
//     }

//     if (now >= startEpoch && now < endEpoch) {
//       router.push(`/quiz-online/${Sid}`);
//       return;
//     }

//     router.push(`/quiz/results?episode=${episode}`);
//   };

//   const handleNoticeModal = () => setIsNoticeModalOpen(!isNoticeModalOpen);

//   if (loading) return <p className="text-gray-500">Loading...</p>;

//   return (
//     <Layout>
//       <div>
//         <Header title="Dashboard" backBtn={false} />

//         {/* responsive padding */}
//         <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
//           {/* WELCOME */}
//           <div>
//             <h2 className="text-(--primary) dash-title text-lg sm:text-xl lg:text-2xl">
//               Welcome back, <span className="text-blue">{userName}!</span>
//             </h2>
//             <p className="text-grey text-sm">
//               Here's is a quick overview of your account and activity quizzes.
//             </p>
//           </div>

//           {/* TOP ROW */}
//           <div className="flex flex-col lg:flex-row gap-8 items-stretch">
//             {/* PROFILE CARD */}
//             <GlassCard className="flex-2">
//               <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center">
//                 <div className="relative">
//                   <Avatar size={96} type="main" color="border-orange-400" />
//                   <h6 className="text-orange-400 whitespace-nowrap py-2 px-4 rounded-full absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold bg-[#0f127a] flex gap-2 items-center">
//                     <MdStars size={15} />
//                     Quiz Overlord
//                   </h6>
//                 </div>

//                 <div className="flex flex-2 p-2 sm:p-4 flex-col gap-3 w-full">
//                   <div>
//                     <div className="flex flex-wrap gap-2 items-center">
//                       <h3 className="text-(--primary) font-bold text-lg">
//                         {userName}
//                       </h3>
//                       <span className="text-blue text-[.625rem] bg-blue/20 py-2 px-4 rounded-full">
//                         Rank 12
//                       </span>
//                     </div>
//                     <p className="text-sm text-grey mt-2">
//                       Mastering the Genius Quiz Challenge
//                     </p>
//                   </div>

//                   <div className="flex justify-between">
//                     <h4 className="text-xs text-(--primary)">
//                       Level 12 Progress
//                     </h4>
//                     <h4 className="text-blue text-xs">743/1000 XP</h4>
//                   </div>

//                   <ProgressBar
//                     value={743}
//                     total={1000}
//                     color="bg-linear-90 from-blue-400 to-teal-800/80"
//                   />

//                   <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4">
//                     <PrimaryButton
//                       type="link"
//                       to="/quizzes"
//                       text="Earn a level"
//                     />
//                     <PrimaryButton
//                       type="link"
//                       to="/profile"
//                       text="View Profile"
//                       style="text-(--primary) rounded-sm backdrop-blur-lg hover:bg-white/20 duration-500 bg-white/10"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </GlassCard>

//             {/* REWARDS CARD */}
//             <GlassCard className="flex-1">
//               <div className="p-6 sm:p-8 flex flex-col gap-4 h-full">
//                 <div className="flex items-center justify-between">
//                   <ChartUpIcon color="#B3B3B3" size={24} />
//                   <span className="text-yellow text-xs font-bold px-2 py-1 rounded-b-sm bg-yellow/10">
//                     TOP 5%
//                   </span>
//                 </div>

//                 <div className="flex justify-center flex-1 items-center">
//                   <ShieldIcon />
//                 </div>

//                 <div className="flex flex-col gap-2 items-center">
//                   <h3 className="text-grey">Current Rewards</h3>
//                   <h3 className="font-bold text-lg text-(--primary)">
//                     ₦750,000
//                   </h3>
//                   <PrimaryButton
//                     text="View Rankings"
//                     type="link"
//                     to="/leaderboard"
//                     style="text-(--primary) rounded-sm backdrop-blur-lg hover:bg-white/20 duration-500 bg-white/10"
//                   />
//                 </div>
//               </div>
//             </GlassCard>
//           </div>

//           {/* SECOND ROW */}
//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
//             {/* DAILY TASKS */}
//             <GlassCard>
//               <div className="p-6 flex flex-col gap-4">
//                 <div className="flex justify-between items-center">
//                   <h3 className="text-(--primary) font-semibold">
//                     Daily Tasks
//                   </h3>
//                   <span className="text-grey text-xs">2/3 Done</span>
//                 </div>

//                 <div className="flex justify-between items-center rounded-lg p-3">
//                   <div className="flex gap-3 items-center">
//                     <span className="w-8 h-8 rounded-full text-purple-600 bg-purple-500/20 flex items-center justify-center">
//                       <IoIosRocket />
//                     </span>
//                     <p className="text-sm text-grey">Complete 5 Quizzes</p>
//                   </div>
//                   <span className="text-yellow text-xs font-bold">+150 XP</span>
//                 </div>

//                 <div className="flex justify-between items-center rounded-lg p-3">
//                   <div className="flex gap-3 items-center">
//                     <span className="w-8 h-8 rounded-full text-green bg-green-500/20 flex items-center justify-center">
//                       <AiFillDollarCircle size={20} />
//                     </span>
//                     <p className="text-sm text-grey">Share Referral Link</p>
//                   </div>
//                   <span className="text-green-400 text-xs font-bold">DONE</span>
//                 </div>

//                 <div className="flex justify-center">
//                   <Link
//                     href="/quizzes/previous"
//                     className="text-blue text-xs hover:underline"
//                   >
//                     View all quizzes
//                   </Link>
//                 </div>
//               </div>
//             </GlassCard>

//             {/* ONLINE QUIZ EVENT */}
//             <GlassCard>
//               <div className="p-6 flex flex-col gap-4 h-full">
//                 <h3 className="text-(--primary) font-semibold flex gap-2">
//                   <FaTrophy className="text-orange-400" /> Online Quiz Event
//                 </h3>

//                 <div>
//                   <h2 className="text-(--primary) font-bold text-xl">₦500</h2>
//                   <p className="text-grey text-sm">Reward</p>
//                 </div>

//                 <div className="flex gap-4 text-xs text-grey">
//                   <span>10 Questions</span>
//                   <span>2 mins left</span>
//                 </div>

//                 <PrimaryButton
//                   type="link"
//                   to={Sid ? `live-quiz/${Sid}` : "#"}
//                   text="Enter Now"
//                   style="bg-green-500 text-white rounded-sm hover:bg-green-400 font-semibold"
//                 />
//               </div>
//             </GlassCard>

//             {/* RECENT PAYOUT */}
//             <GlassCard>
//               <div className="p-6 flex h-full flex-col justify-between gap-4">
//                 <div className="flex justify-between">
//                   <h3 className="text-(--primary) font-semibold">
//                     Recent Payout
//                   </h3>
//                   <FaCheckCircle className="text-green-400" />
//                 </div>

//                 <div>
//                   <p className="text-grey text-xs">Amount</p>
//                   <h2 className="text-(--primary) font-bold text-xl">
//                     ₦10,000.00
//                   </h2>
//                   <p className="text-grey text-xs mt-2">xxxx-8329 GTBank PLC</p>
//                 </div>

//                 <Link
//                   href="/transactions"
//                   className="text-blue text-xs hover:underline text-center"
//                 >
//                   View Transaction History
//                 </Link>
//               </div>
//             </GlassCard>
//           </div>

//           {/* INVITE FRIENDS */}
//           <GlassCard>
//             <div className="p-6 flex flex-col sm:flex-row gap-6 justify-between items-center">
//               <div className="text-center sm:text-left">
//                 <h3 className="text-(--primary) font-semibold">
//                   Invite Friends & Earn More!
//                 </h3>
//                 <p className="text-grey text-sm">
//                   Get credited instantly for every friend you refer to Genuslab.
//                 </p>
//               </div>

//               <div className="flex gap-4 items-center">
//                 <span className="text-green-400 bg-green-400/10 px-4 py-2 rounded-full text-sm">
//                   Bonus ₦250
//                 </span>
//                 <PrimaryButton
//                   type="link"
//                   to={"/profile"}
//                   text="Invite Friends"
//                 />
//               </div>
//             </div>
//           </GlassCard>

//           {/* FOOTER */}
//           <div className="flex flex-col sm:flex-row gap-2 justify-between text-xs text-grey px-2 text-center sm:text-left">
//             <span>{countdown}</span>
//             <div className="flex gap-4 justify-center">
//               <a href="#" className="hover:text-blue">
//                 Privacy Policy
//               </a>
//               <a href="#" className="hover:text-blue">
//                 Terms of Service
//               </a>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// };

// export default page;
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import ChartUpIcon from "@/assets/ChartUpIcon";
import ShieldIcon from "@/assets/ShieldIcon";

import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";

import Avatar from "@/components/ui/Avatar";
import PrimaryButton from "@/components/ui/buttons/Primary";
import GlassCard from "@/components/ui/cards/GlassCard";
import ProgressBar from "@/components/ui/ProgressBar";

// import useCountdown from "@/hooks/useCountdown";
// import { useTime } from "@/hooks/useTime";

import { getRankData, getTime, getUserProfile } from "@/lib/api/apis";
import getLocalStorage from "@/lib/utils/getLocalStorage";
import nameResolver from "@/lib/utils/nameResolver";

// import { useSocket } from "@/store/useSocket";

import { AiFillDollarCircle } from "react-icons/ai";
import { FaCheckCircle, FaTrophy } from "react-icons/fa";
import { IoIosRocket } from "react-icons/io";
import { MdStars } from "react-icons/md";

const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`animate-pulse rounded-xl bg-white/10 ${className}`} />
  );
};

const DashboardSkeleton = () => {
  return (
    <Layout>
      <div>
        <Header title="Dashboard" backBtn={false} />

        <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
          {/* Welcome */}
          <div className="space-y-3">
            <Skeleton className="h-8 w-72" />
            <Skeleton className="h-4 w-96 max-w-full" />
          </div>

          {/* Top row */}
          <div className="flex flex-col lg:flex-row gap-8">
            <GlassCard className="flex-2">
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6">
                <div className="flex flex-col items-center gap-4">
                  <Skeleton className="w-24 h-24 rounded-full" />
                  <Skeleton className="w-32 h-8 rounded-full" />
                </div>

                <div className="flex-1 space-y-4">
                  <div className="space-y-3">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-56" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-3 w-28" />
                      <Skeleton className="h-3 w-20" />
                    </div>

                    <Skeleton className="h-3 w-full rounded-full" />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Skeleton className="h-11 flex-1" />
                    <Skeleton className="h-11 flex-1" />
                  </div>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="flex-1">
              <div className="p-6 sm:p-8 flex flex-col gap-6">
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-6 w-20" />
                </div>

                <Skeleton className="h-32 w-full" />

                <div className="space-y-3">
                  <Skeleton className="h-4 w-32 mx-auto" />
                  <Skeleton className="h-7 w-40 mx-auto" />
                  <Skeleton className="h-11 w-full" />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Grid cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <GlassCard key={item}>
                <div className="p-6 flex flex-col gap-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Invite */}
          <GlassCard>
            <div className="p-6 flex flex-col sm:flex-row gap-6 justify-between">
              <div className="space-y-3">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-80 max-w-full" />
              </div>

              <div className="flex gap-4">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-36" />
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </Layout>
  );
};

const Page = () => {
  const router = useRouter();

  // const socketId = useSocket((state: any) => state.socketId);

  const [targetEpoch, setTargetEpoch] = useState<number | null>(null);
  const [countdown, setCountdown] = useState("Next quiz in —");
  // const [Sid, setSid] = useState("");

  /* -----------------------------
  rankRes.data.data
   * AUTH GUARD
   * ---------------------------- */
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
  const { data, isLoading, isError, error } = useQuery({
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

  /* -----------------------------
   * SOCKET
   * ---------------------------- */
  // useEffect(() => {
  //   setSid(socketId);
  // }, [socketId]);

  // const handleTimerUpdate = (epoch: number) => {
  //   setTargetEpoch(epoch);
  // };

  // useTime(socketId, handleTimerUpdate);

  // useCountdown(
  //   targetEpoch,
  //   "dash",
  //   (
  //     val:
  //       | string
  //       | {
  //           days: number;
  //           hours: number;
  //           minutes: number;
  //           seconds: number;
  //         },
  //   ) => {
  //     setCountdown(typeof val === "string" ? val : "Next quiz in —");
  //   },
  // );

  /* -----------------------------
   * LOADING
   * ---------------------------- */
  if (isLoading || !storedUser) {
    return <DashboardSkeleton />;
  }

  /* -----------------------------
   * ERROR
   * ---------------------------- */
  if (isError || !data?.user) {
    return (
      <Layout>
        <div>
          <Header title="Dashboard" backBtn={false} />

          <div className="min-h-[70vh] flex items-center justify-center p-6">
            <GlassCard className="max-w-md w-full">
              <div className="p-8 text-center space-y-4">
                <div className="text-red-400 text-lg font-semibold">
                  Failed to load dashboard
                </div>

                <p className="text-sm text-grey">
                  {(error as Error)?.message ||
                    "Something went wrong while fetching your dashboard data."}
                </p>

                <div className="flex gap-3 justify-center">
                  <PrimaryButton
                    text="Retry"
                    handler={() => window.location.reload()}
                  />

                  <PrimaryButton
                    text="Go Home"
                    type="link"
                    to="/"
                    style="text-(--primary) rounded-sm backdrop-blur-lg hover:bg-white/20 duration-500 bg-white/10"
                  />
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </Layout>
    );
  }

  const user = data.user;
  const rank = data.rank;

  const userName = nameResolver(user.name);

  return (
    <Layout>
      <div>
        <Header title="Dashboard" backBtn={false} />

        <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
          {/* WELCOME */}
          <div>
            <h2 className="text-(--primary) dash-title text-lg sm:text-xl lg:text-2xl">
              Welcome back, <span className="text-blue">{userName}!</span>
            </h2>

            <p className="text-grey text-sm">
              Here's a quick overview of your account and activity quizzes.
            </p>
          </div>

          {/* TOP ROW */}
          <div className="flex flex-col lg:flex-row gap-8 items-stretch">
            {/* PROFILE CARD */}
            <GlassCard className="flex-2">
              <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 items-center">
                <div className="relative">
                  <Avatar size={96} type="main" color="border-orange-400" />

                  <h6 className="text-orange-400 whitespace-nowrap py-2 px-4 rounded-full absolute -bottom-4 left-1/2 -translate-x-1/2 text-xs font-bold bg-[#0f127a] flex gap-2 items-center">
                    <MdStars size={15} />

                    {rank?.rankName || "Fresh Mind"}
                  </h6>
                </div>

                <div className="flex flex-2 p-2 sm:p-4 flex-col gap-3 w-full">
                  <div>
                    <div className="flex flex-wrap gap-2 items-center">
                      <h3 className="text-(--primary) font-bold text-lg">
                        {userName}
                      </h3>

                      <span className="text-blue text-[.625rem] bg-blue/20 py-2 px-4 rounded-full">
                        Rank {rank?.rank || 0}
                      </span>
                    </div>

                    <p className="text-sm text-grey mt-2">
                      Mastering the Genius Quiz Challenge
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <h4 className="text-xs text-(--primary)">
                      Level {rank?.rank || 0} Progress
                    </h4>

                    <h4 className="text-blue text-xs">
                      {user?.details?.xp || 0}/{rank?.unlockXp || 0} XP
                    </h4>
                  </div>

                  <ProgressBar
                    value={user?.details?.xp || 0}
                    total={rank?.unlockXp || 1}
                    color="bg-linear-90 from-blue-400 to-teal-800/80"
                  />

                  <div className="flex flex-col sm:flex-row gap-3 justify-between pt-4">
                    <PrimaryButton
                      type="link"
                      to="/quizzes"
                      text="Earn a level"
                    />

                    <PrimaryButton
                      type="link"
                      to="/profile"
                      text="View Profile"
                      style="text-(--primary) rounded-sm backdrop-blur-lg hover:bg-white/20 duration-500 bg-white/10"
                    />
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* REWARDS CARD */}
            <GlassCard className="flex-1">
              <div className="p-6 sm:p-8 flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between">
                  <ChartUpIcon color="#B3B3B3" size={24} />

                  <span className="text-yellow text-xs font-bold px-2 py-1 rounded-b-sm bg-yellow/10">
                    TOP 5%
                  </span>
                </div>

                <div className="flex justify-center flex-1 items-center">
                  <ShieldIcon />
                </div>

                <div className="flex flex-col gap-2 items-center">
                  <h3 className="text-grey">Current Rewards</h3>

                  <h3 className="font-bold text-lg text-(--primary)">
                    ₦750,000
                  </h3>

                  <PrimaryButton
                    text="View Rankings"
                    type="link"
                    to="/leaderboard"
                    style="text-(--primary) rounded-sm backdrop-blur-lg hover:bg-white/20 duration-500 bg-white/10"
                  />
                </div>
              </div>
            </GlassCard>
          </div>

          {/* SECOND ROW */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {/* DAILY TASKS */}
            <GlassCard>
              <div className="p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-(--primary) font-semibold">
                    Daily Tasks
                  </h3>

                  <span className="text-grey text-xs">2/3 Done</span>
                </div>

                <div className="flex justify-between items-center rounded-lg p-3">
                  <div className="flex gap-3 items-center">
                    <span className="w-8 h-8 rounded-full text-purple-600 bg-purple-500/20 flex items-center justify-center">
                      <IoIosRocket />
                    </span>

                    <p className="text-sm text-grey">Complete 5 Quizzes</p>
                  </div>

                  <span className="text-yellow text-xs font-bold">+150 XP</span>
                </div>

                <div className="flex justify-between items-center rounded-lg p-3">
                  <div className="flex gap-3 items-center">
                    <span className="w-8 h-8 rounded-full text-green bg-green-500/20 flex items-center justify-center">
                      <AiFillDollarCircle size={20} />
                    </span>

                    <p className="text-sm text-grey">Share Referral Link</p>
                  </div>

                  <span className="text-green-400 text-xs font-bold">DONE</span>
                </div>

                <div className="flex justify-center">
                  <Link
                    href="/quizzes/previous"
                    className="text-blue text-xs hover:underline"
                  >
                    View all quizzes
                  </Link>
                </div>
              </div>
            </GlassCard>

            {/* ONLINE QUIZ EVENT */}
            <GlassCard>
              <div className="p-6 flex flex-col gap-4 h-full">
                <h3 className="text-(--primary) font-semibold flex gap-2">
                  <FaTrophy className="text-orange-400" />
                  Online Quiz Event
                </h3>

                <div>
                  <h2 className="text-(--primary) font-bold text-xl">₦500</h2>

                  <p className="text-grey text-sm">Reward</p>
                </div>

                <div className="flex gap-4 text-xs text-grey">
                  <span>10 Questions</span>

                  <span>2 mins left</span>
                </div>

                <PrimaryButton
                  type="link"
                  to={`/quiz/`}
                  text="Enter Now"
                  style="bg-green-500 text-white rounded-sm hover:bg-green-400 font-semibold disabled:opacity-50 disabled:pointer-events-none"
                />
                {/* <PrimaryButton
                  type="link"
                  to={Sid ? `/live-quiz/${Sid}` : "#"}
                  text="Enter Now"
                  disabled={!Sid}
                  style="bg-green-500 text-white rounded-sm hover:bg-green-400 font-semibold disabled:opacity-50 disabled:pointer-events-none"
                /> */}
              </div>
            </GlassCard>

            {/* RECENT PAYOUT */}
            <GlassCard>
              <div className="p-6 flex h-full flex-col justify-between gap-4">
                <div className="flex justify-between">
                  <h3 className="text-(--primary) font-semibold">
                    Recent Payout
                  </h3>

                  <FaCheckCircle className="text-green-400" />
                </div>

                <div>
                  <p className="text-grey text-xs">Amount</p>

                  <h2 className="text-(--primary) font-bold text-xl">
                    ₦10,000.00
                  </h2>

                  <p className="text-grey text-xs mt-2">xxxx-8329 GTBank PLC</p>
                </div>

                <Link
                  href="/transactions"
                  className="text-blue text-xs hover:underline text-center"
                >
                  View Transaction History
                </Link>
              </div>
            </GlassCard>
          </div>

          {/* INVITE FRIENDS */}
          <GlassCard>
            <div className="p-6 flex flex-col sm:flex-row gap-6 justify-between items-center">
              <div className="text-center sm:text-left">
                <h3 className="text-(--primary) font-semibold">
                  Invite Friends & Earn More!
                </h3>

                <p className="text-grey text-sm">
                  Get credited instantly for every friend you refer to Genuslab.
                </p>
              </div>

              <div className="flex gap-4 items-center">
                <span className="text-green-400 bg-green-400/10 px-4 py-2 rounded-full text-sm">
                  Bonus ₦250
                </span>

                <PrimaryButton
                  type="link"
                  to="/profile"
                  text="Invite Friends"
                />
              </div>
            </div>
          </GlassCard>

          {/* FOOTER */}
          <div className="flex flex-col sm:flex-row gap-2 justify-between text-xs text-grey px-2 text-center sm:text-left">
            <span>{countdown}</span>

            <div className="flex gap-4 justify-center">
              <a href="#" className="hover:text-blue">
                Privacy Policy
              </a>

              <a href="#" className="hover:text-blue">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Page;
