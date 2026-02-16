"use client";
import React, { use } from "react";
import Sidebar from "./Sidebar";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import useSidebar from "@/store/useSidebar";

const Layout = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const page = usePathname().split("/")[1];

  return (
    <div className="bg-[url('/background/account.png')] bg-(--background) min-h-screen bg-no-repeat bg-cover">
      <div className="hidden cu-lg:block">
        <Sidebar />
      </div>
      <div>
        <Sidebar type="mobile" />
      </div>
      <div className={clsx(className && className, "cu-lg:ml-62")}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
