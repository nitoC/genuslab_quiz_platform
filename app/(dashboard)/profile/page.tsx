"use client";

import { Suspense, useState } from "react";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import Avatar from "@/components/ui/Avatar";
import GlassCard from "@/components/ui/cards/GlassCard";
import {
  MdEdit,
  MdPerson,
  MdAccountBalanceWallet,
  MdGroups,
} from "react-icons/md";
import { FaCheckCircle, FaPen } from "react-icons/fa";
import useUser from "@/hooks/useUser";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Profile from "@/features/profile/ui/Profile";
import ManageReferralsPage from "@/features/profile/ui/Referral";
import clsx from "clsx";
import AccountTabContent from "@/features/profile/ui/Account";
import AvatarUpload from "@/features/profile/modals/AvatarUpload";
import { HiPhotograph } from "react-icons/hi";

const Skeleton = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`animate-pulse rounded-xl bg-white/10 ${className}`} />
  );
};

const ProfileSkeleton = () => {
  return (
    <Layout>
      <Header title="Profile" backBtn={false} />
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-10">
        {/* Banner Skeleton */}
        <GlassCard>
          <div className="p-6 sm:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="space-y-2 flex-1 text-center md:text-left">
                <Skeleton className="h-6 w-48 mx-auto md:mx-0" />
                <Skeleton className="h-5 w-36 mx-auto md:mx-0 rounded-full" />
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto justify-center md:justify-end">
              <Skeleton className="h-8 w-28 rounded-full" />
              <Skeleton className="w-12 h-12 md:w-16 md:h-16 rounded-full" />
            </div>
          </div>
          <div className="flex border-t border-white/5 px-6 py-4 gap-6">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        </GlassCard>

        {/* Stages Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="flex md:grid md:grid-cols-4 gap-4 overflow-x-auto pb-2">
            {[1, 2, 3, 4].map((i) => (
              <GlassCard key={i} className="p-4 shrink-0 w-[200px] md:w-auto">
                <div className="flex gap-4 items-center">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-2 w-12" />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Grid Content Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <GlassCard className="p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-8 w-36" />
                </div>
                <Skeleton className="h-10 w-32 rounded-full" />
              </div>
              <Skeleton className="h-[200px] w-full" />
            </GlassCard>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-8">
            <GlassCard className="p-8 flex flex-col items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-10 w-full" />
            </GlassCard>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const ProfilePage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const PROFILE_TABS = [
    {
      id: "profile",
      label: "Profile",
      icon: MdPerson,
    },
    {
      id: "account",
      label: "Account",
      icon: MdAccountBalanceWallet,
    },
    {
      id: "referral",
      label: "Referral",
      icon: MdGroups,
    },
  ];
  /* -----------------------------
   * USER QUERY & MUTATIONS
  
  /* ---------- Rewards and Chart Track States ---------- */
  const [totalRewards, setTotalRewards] = useState<number>(0);
  const [modal, setModal] = useState(false);
  const [overlay, setOverlay] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [userRewardsArray, setUserRewardsArray] = useState<any[]>([]);
  const pageParam = useSearchParams();

  const tab = pageParam.get("tab");

  const { data, isLoading, isError, error, storedUser } = useUser();
  const user = data?.user;
  const rank = data?.user.details.rankName;
  const avatar = data?.user.details.avatar;
  const exp = data?.user.details.xp;

  /* ---------- Rewards and Chart Track States ---------- */

  /* ----------------------------- LOADING SKELETON ---------------------------- */
  if (isLoading || !storedUser || !data?.user) {
    return <ProfileSkeleton />;
  }
  /* ----------------------------- LOADING SKELETON ---------------------------- */

  const handleTab = (val: string) => {
    const url = new URLSearchParams(pageParam.toString());

    url.set("tab", val);

    router.push(`${pathname}?${url.toString()}`);
  };

  const onUpload = (url: string) => {
    setAvatarUrl(url);
  };
  const userName = user?.name;
  console.log(avatarUrl, "avatar url");
  return (
    <Layout>
      <Header title="Profile" backBtn={false} />
      <div className="p-4 sm:p-6 lg:p-8 flex flex-col gap-10">
        {/* HEADER SECTION - Glass Profile Banner */}
        <GlassCard className="overflow-hidden">
          <div className="relative p-6 sm:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue/10 blur-[100px] rounded-full -mr-20 -mt-20 hidden md:block" />

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 z-10">
              <div
                onMouseOver={() => setOverlay(true)}
                onMouseOut={() => setOverlay(false)}
                onClick={() => setModal(true)}
                className="relative overflow-hidden cursor-pointer"
              >
                <Avatar
                  url={
                    avatarUrl || avatar || "https://placehold.net/avatar.svg"
                  }
                  size={80}
                  type="main"
                  color="border-blue"
                />
                {overlay && (
                  <div className="bg-black/20 inset-0 rounded-full absolute flex justify-center items-center">
                    <HiPhotograph color="#ccc" />
                  </div>
                )}
                <span className="absolute bottom-1 right-1 bg-green-500 p-1 rounded-full border-2 border-[#0a121f]">
                  <FaPen className="text-white text-[8px] md:text-[10px]" />
                </span>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-xl md:text-2xl font-bold text-(--primary)">
                  {userName}
                </h1>
                <div className="flex flex-col md:flex-row items-center md:justify-start gap-2 md:gap-3 mt-2">
                  <span className="text-blue bg-blue/20 px-4 py-1 rounded-full text-[10px] md:text-xs font-bold">
                    Level {rank?.rank} — {rank?.rankName}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row md:flex-row items-center gap-4 md:gap-6 z-10 w-full md:w-auto justify-center md:justify-end">
              <button className="bg-white/5 hover:bg-white/10 text-grey text-[10px] md:text-xs py-2 px-6 rounded-full border border-white/10 flex gap-2 items-center transition-all">
                <MdEdit /> Edit Profile
              </button>

              <div className="relative w-12 h-12 md:w-16 md:h-16 border-4 border-white/5 rounded-full flex items-center justify-center">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-blue border-t-transparent rounded-full -rotate-45" />
                <span className="text-[10px] md:text-xs font-bold text-(--primary) text-center leading-tight">
                  {exp} <br />
                  <span className="text-[6px] md:text-[8px] text-grey">XP</span>
                </span>
              </div>
            </div>
          </div>

          {/* <button className="">
            <MdEdit /> Edit Profile
          </button> */}
          {/* Tab Navigation - Scrollable on mobile */}
          <div className="flex border-t border-white/5 px-4 md:px-6 overflow-x-auto no-scrollbar whitespace-nowrap">
            {/* <div className="flex flex-row md:flex-row items-center gap-4 md:gap-6 z-10 w-full md:w-auto justify-center md:justify-end"> */}
            {PROFILE_TABS.map((a) => {
              return (
                <button
                  key={a.label}
                  onClick={() => {
                    handleTab(a.label);
                  }}
                  className={clsx(
                    "px-4 md:px-6 py-4 text-[10px] md:text-xs font-bold text-(--primary) border-b-2 flex gap-2 items-center shrink-0",

                    (tab === "" || !tab) && a.label === "Profile"
                      ? "border-blue"
                      : tab === a.label
                        ? "border-blue"
                        : "border-transparent",
                  )}
                >
                  {a.label}{" "}
                  <span>
                    <a.icon />
                  </span>
                </button>
              );
            })}
          </div>
          {/* </div> */}
        </GlassCard>
      </div>
      {(tab === "" || tab === "Profile" || !tab) && (
        <Profile
          user={user}
          rank={rank}
          totalRewards={totalRewards}
          userRewardsArray={userRewardsArray}
        />
      )}
      {tab === "Referral" && (
        <ManageReferralsPage
          user={user}
          // rank={rank}
          // totalRewards={totalRewards}
          // userRewardsArray={userRewardsArray}
        />
      )}
      {tab === "Account" && (
        <AccountTabContent
          user={user}
          // rank={rank}
          // totalRewards={totalRewards}
          // userRewardsArray={userRewardsArray}
        />
      )}
      {modal && (
        <AvatarUpload
          handleModal={(val: boolean) => setModal(val)}
          onUploaded={onUpload}
        />
      )}
    </Layout>
  );
};

const page = () => {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <ProfilePage />
    </Suspense>
  );
};
export default page;
