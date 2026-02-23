"use client";
import React, { use } from "react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import clsx from "clsx";
// import useSidebar from "@/store/useSidebar";
// import UpdateSuccessModal from "../ui/modals/update";
// import SubscriptionModal from "../ui/modals/subscription";
// import RankUnlockModal from "../ui/modals/leaderboard";
// import { MdStars } from "react-icons/md";

const Layout = ({
  className,
  type,
  children,
}: {
  className?: string;
  type?: "quiz" | "transaction";
  children: React.ReactNode;
}) => {
  const page = usePathname().split("/")[1];

  return (
    <div className="bg-[url('/background/account.png')] bg-(--background) min-h-screen bg-no-repeat bg-cover">
      {type !== "quiz" && (
        <div className="hidden cu-lg:block">
          <Sidebar />
        </div>
      )}
      {type !== "quiz" && (
        <div>
          <Sidebar type="mobile" />
        </div>
      )}
      <div
        className={clsx(
          className && className,
          type !== "quiz" && "cu-lg:ml-62",
        )}
      >
        {/* <RankUnlockModal
          icon={MdStars}
          rank={{ level: "1", title: "Pioneer" }}
          requirementPoints={"3000"}
          unlockReward="20000"
          unlockStatus={4000}
        /> */}
        {/* <SubscriptionModal /> */}
        {children}
      </div>
    </div>
  );
};

export default Layout;
