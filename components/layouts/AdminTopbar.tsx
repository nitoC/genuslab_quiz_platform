"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import useSidebar from "@/store/useSidebar";
import { useUser as useUserStore } from "@/store/useUser";
import { getUserProfile, getNotifications, logout } from "@/lib/api/apis";
import clsx from "clsx";
import {
  MdMenu,
  MdMenuOpen,
  MdNotificationsNone,
  MdLogout,
  MdSettings,
  MdPerson,
} from "react-icons/md";

// The single, consistent home for the sidebar toggle, notification access,
// and admin profile menu — replaces the old pattern of a mobile-only menu
// button embedded inside each page's own header. See directive: the menu
// control belongs in a persistent app header, not floating in page content.
const AdminTopbar = () => {
  const router = useRouter();
  const { collapsed, toggleSidebar, toggleCollapsed } = useSidebar(
    (state) => state,
  );
  const userId = useUserStore((state) => state.user?.userId);

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { data: profile } = useQuery({
    queryKey: ["admin-topbar-profile", userId],
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const res = await getUserProfile(userId as string);
      return res.data.user;
    },
  });

  const { data: unreadCount } = useQuery({
    queryKey: ["admin-topbar-unread-notifications", userId],
    enabled: !!userId,
    refetchInterval: 60_000,
    queryFn: async () => {
      const res = await getNotifications("unread");
      const payload = res.data?.payload ?? res.data ?? [];
      return Array.isArray(payload) ? payload.length : 0;
    },
  });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      // ignore — proceed with client-side cleanup regardless
    } finally {
      useUserStore.setState({ user: null });
      router.push("/genuslab/admin");
      setLoggingOut(false);
    }
  };

  const initials = (profile?.name || "Admin")
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-slate-100 bg-white/90 px-4 backdrop-blur-md md:px-6">
      {/* LEFT: menu toggle + wordmark (mobile only) */}
      <div className="flex items-center gap-3">
        {/* Mobile: opens the drawer. Desktop: collapses/expands the sidebar. */}
        <button
          type="button"
          onClick={() => {
            if (typeof window !== "undefined" && window.innerWidth < 768) {
              toggleSidebar();
            } else {
              toggleCollapsed();
            }
          }}
          className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:outline-2 focus-visible:outline-blue-500"
          aria-label={collapsed ? "Expand sidebar" : "Toggle sidebar"}
        >
          {collapsed ? <MdMenuOpen size={22} /> : <MdMenu size={22} />}
        </button>

        <div className="flex items-center gap-2 md:hidden">
          <Image
            src="/logo/genus_logo_1.png"
            alt="Genus Lab Logo"
            width={26}
            height={26}
          />
          <span className="text-sm font-extrabold tracking-tight text-slate-900">
            Genus Lab Admin
          </span>
        </div>
      </div>

      {/* RIGHT: notifications + profile */}
      <div className="flex items-center gap-2">
        <Link
          href="/genuslab/notifications"
          aria-label={
            unreadCount
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
          className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
        >
          <MdNotificationsNone size={22} />
          {!!unreadCount && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500" />
          )}
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Open admin profile menu"
            className="flex items-center gap-2 rounded-lg p-1.5 pr-2 transition-colors hover:bg-slate-100"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-600">
              {initials}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-semibold leading-tight text-slate-800">
                {profile?.name ?? "Admin"}
              </span>
              <span className="block text-[11px] font-medium leading-tight text-slate-400">
                Administrator
              </span>
            </span>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-slate-100 bg-white py-2 shadow-xl shadow-slate-900/5"
            >
              <div className="border-b border-slate-100 px-4 py-2.5">
                <p className="truncate text-sm font-semibold text-slate-800">
                  {profile?.name ?? "Admin"}
                </p>
                <p className="truncate text-xs text-slate-400">
                  {profile?.email ?? ""}
                </p>
              </div>

              <Link
                href="/genuslab/settings"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <MdPerson size={17} className="text-slate-400" />
                Profile
              </Link>
              <Link
                href="/genuslab/settings"
                role="menuitem"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <MdSettings size={17} className="text-slate-400" />
                Settings
              </Link>

              <button
                type="button"
                role="menuitem"
                disabled={loggingOut}
                onClick={handleLogout}
                className={clsx(
                  "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50",
                  loggingOut && "opacity-50",
                )}
              >
                <MdLogout size={17} />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminTopbar;
