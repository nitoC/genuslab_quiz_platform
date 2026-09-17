"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import clsx from "clsx";
import { IoIosNotifications, IoMdMenu, IoMdSettings } from "react-icons/io";
import { MdLogout, MdPerson } from "react-icons/md";

import GlassCard from "../ui/cards/GlassCard";
import Back from "../ui/buttons/Back";
import Avatar from "../ui/Avatar";
import useSidebar from "@/store/useSidebar";
import useUser from "@/hooks/useUser";
import { useSocket } from "@/store/useSocket";
import { logout } from "@/lib/api/apis";
import toast from "react-hot-toast";
import { useUser as useUserStore } from "@/store/useUser";
import { useRouter } from "next/navigation";
import { ImSpinner11 } from "react-icons/im";

interface HeaderProps {
  title?: string;
  backBtn?: boolean;
}

const Header = ({ title, backBtn = false }: HeaderProps) => {
  const { data, isLoading } = useUser();
  const [isMounted, setIsMounted] = useState(false);
  const [unRead, setUnRead] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleSidebar = useSidebar((state: any) => state.toggleSidebar);
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleLogout = async () => {
    if (isSigningOut) return;
    // if (loading) return;
    try {
      setIsSigningOut(true);
      console.log("signing out");
      // setLoading(true);

      // Axios request to your logout server endpoint
      await logout();
      toast.success("logout successfull");
      // localStorage.clear();
      useUserStore.setState({ user: null });
      console.log("signing out bottom");
      router.push("/login");
    } catch (error) {
      console.error(
        "Server-side logout failed, proceeding with client cleanup:",
        error,
      );
    } finally {
      // Redirect cleanly to login screen
      setIsSigningOut(false);
      // setLoading(false);
    }
  };

  // The single notification socket connection is owned by SocketProvider
  // (mounted once at the dashboard layout level, so it survives page
  // navigation) — Header just reads it back out of the shared store rather
  // than opening a second connection of its own.
  const socket = useSocket((state: any) => state.socket);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleUnread = (notification: any) => {
      setUnRead(notification);
    };
    socket.on("has-unread", handleUnread);
    return () => {
      socket.off("has-unread", handleUnread);
    };
  }, [socket]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [userMenuOpen]);

  const firstName = data?.user?.name ? data.user.name.split(" ")[0] : "User";

  return (
    <header className="sticky top-0 z-10 w-full">
      <GlassCard type="header">
        <div className="flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          {/* Left Section: Back button & Title */}
          <div className="flex items-center gap-3 min-w-0">
            {backBtn && (
              <div className="flex-shrink-0">
                <Back text="" />
              </div>
            )}
            {title && (
              <h1 className="text-base font-bold text-(--primary) sm:text-xl lg:text-2xl truncate tracking-tight">
                {title}
              </h1>
            )}
          </div>

          {/* Right Section: Interactive Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 ml-auto flex-shrink-0">
            {/* Settings Link */}
            <Link
              href="/settings"
              aria-label="Settings"
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl transition-all hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <IoMdSettings className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </Link>

            {/* Notifications Link */}
            <Link
              href="/notifications"
              aria-label="Notifications"
              className="relative flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl transition-all hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <IoIosNotifications className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              {unRead && (
                <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-1.5 w-1.5 rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                </span>
              )}
            </Link>

            {/* Profile Menu Trigger & Dropdown Popover */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setUserMenuOpen((prev) => !prev)}
                aria-expanded={userMenuOpen}
                aria-label="User menu"
                className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full transition-transform active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                {!isMounted || isLoading ? (
                  <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-gray-300/40 dark:bg-gray-700/40 animate-pulse" />
                ) : (
                  <Avatar
                    type="explore"
                    size={36}
                    url={data?.user?.details?.avatar}
                  />
                )}
              </button>

              {/* User Popover Menu */}
              {userMenuOpen && (
                <div
                  role="menu"
                  aria-orientation="vertical"
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-white/15 bg-blue-950/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="px-3 py-2.5 border-b border-white/10 mb-1">
                    <p className="text-xs text-gray-300 font-medium">
                      Signed in as
                    </p>
                    <p className="text-sm font-semibold text-white truncate">
                      {firstName}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <MdPerson className="h-5 w-5 text-gray-400" />
                    Profile
                  </Link>

                  <Link
                    href="/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-200 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <IoMdSettings className="h-5 w-5 text-gray-400" />
                    Settings
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      // setUserMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300 border-t border-white/10 mt-1"
                  >
                    {isSigningOut ? (
                      <ImSpinner11 className="animate-spin" />
                    ) : (
                      <MdLogout className="h-5 w-5" />
                    )}
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Navigation Sidebar Toggle */}
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Toggle navigation menu"
              className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl transition-all hover:bg-white/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cu-lg:hidden"
            >
              <IoMdMenu className="h-6 w-6 text-primary" />
            </button>
          </div>
        </div>
      </GlassCard>
    </header>
  );
};

export default Header;
