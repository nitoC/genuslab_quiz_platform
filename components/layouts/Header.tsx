"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { IoIosNotifications, IoMdMenu } from "react-icons/io";
import { LuDot } from "react-icons/lu";

import GlassCard from "../ui/cards/GlassCard";
import Back from "../ui/buttons/Back";
import Avatar from "../ui/Avatar";
import useSidebar from "@/store/useSidebar";
import useUser from "@/hooks/useUser";
import { UseNotificationSocket } from "@/hooks/useSocket";

const Header = ({ title, backBtn }: { title?: string; backBtn: boolean }) => {
  const { data, isLoading } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [unRead, setUnRead] = useState(true);
  const toggleSidebar = useSidebar((state: any) => state.toggleSidebar);

  const socket = UseNotificationSocket(data?.user?.id || "");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  //  Attach event listeners to the socket safely inside useEffect
  useEffect(() => {
    if (!socket) return;

    const handleUnread = (notification: any) => {
      // console.log("Received notification:", notification);
      // alert(`New notification: ${notification.message}`);
      console.log(notification, "notice");
      setUnRead(notification);
    };

    socket.on("has-unread", handleUnread);

    // Clean up listener when component unmounts or socket updates
    return () => {
      socket.off("has-unread", handleUnread);
    };
  }, [socket]);

  return (
    <div className="sticky top-0 z-20">
      <GlassCard type="header">
        <div
          className={clsx(
            "w-full flex p-6 items-center",
            title ? "justify-between" : "justify-end",
          )}
        >
          <h2 className="text-(--primary) font-bold">{title}</h2>
          <div className="flex gap-4 items-center">
            {backBtn && <Back text="Back" />}
            <div className="flex gap-4 md:gap-8 items-center">
              <Link href="/notifications" className="relative">
                <IoIosNotifications size={30} className="text-primary" />
                {unRead && (
                  <LuDot
                    size={40}
                    className="text-red absolute top-[-.8rem] right-[-.8rem]"
                  />
                )}
              </Link>
              <div className="avatar-header">
                {isLoading || !isMounted ? (
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse" />
                ) : (
                  <Avatar
                    type="explore"
                    size={40}
                    url={data?.user?.details?.avatar}
                  />
                )}
              </div>
              <button
                onClick={toggleSidebar}
                className="cursor-pointer cu-lg:hidden"
              >
                <IoMdMenu size={30} className="text-primary" />
              </button>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default Header;
