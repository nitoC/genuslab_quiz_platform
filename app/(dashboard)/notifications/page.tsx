"use client";

import Header from "@/components/layouts/Header";
import Layout from "@/components/layouts/Layout";
import GlassCard from "@/components/ui/cards/GlassCard";
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/lib/api/apis";
import { cn } from "@/lib/utils/cn";
import { useSocket } from "@/store/useSocket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatRelative } from "date-fns";
import React, { useState, useRef, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import {
  MdNotificationsActive,
  MdNotificationsNone,
  MdEmojiEvents,
  MdSettings,
  MdPersonAdd,
  MdShield,
  MdFilterList,
  MdExpandMore,
  MdCheck,
  MdErrorOutline,
  MdRefresh,
  MdInbox,
  MdReceiptLong,
  MdVisibility,
} from "react-icons/md";
import { NotificationDetailModal } from "@/components/ui/modals/NotificationDetail";

type FilterType = "all" | "unread" | "read";

interface NotificationItem {
  id: string | number;
  icon: React.ReactNode;
  title: string;
  subject?: string;
  description: string;
  time: string;
  color: string;
  dot: boolean;
  isRead: boolean;
  metadata?: Record<string, any>;
}

interface NotificationGroup {
  label: string;
  items: NotificationItem[];
}

const TYPE_COLORS: Record<string, string> = {
  general: "bg-grey",
  reward: "bg-green",
  system: "bg-grey",
  referral: "bg-blue",
  transaction: "bg-yellow",
};

const filterOptions: Array<{ label: string; value: FilterType }> = [
  { label: "All Notifications", value: "all" },
  { label: "Unread Only", value: "unread" },
  { label: "Read Only", value: "read" },
];

const getNotificationIcon = (type: string) => {
  switch (type?.toLowerCase()) {
    case "reward":
      return <MdEmojiEvents className="text-green" />;
    case "system":
      return <MdSettings className="text-grey" />;
    case "referral":
      return <MdPersonAdd className="text-blue" />;
    case "transaction":
      return <MdReceiptLong className="text-yellow" />;
    case "security":
      return <MdShield className="text-red" />;
    default:
      return <MdNotificationsActive className="text-blue" />;
  }
};

const NotificationSkeleton = () => (
  <GlassCard className="bg-slate-900/40 border-white/5 p-5 md:p-6 animate-pulse space-y-4">
    <div className="flex items-start md:items-center gap-4 md:gap-6">
      <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/10 shrink-0" />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 bg-white/10 rounded-md w-1/3" />
        <div className="h-3 bg-white/5 rounded-md w-3/4" />
        <div className="h-2.5 bg-white/5 rounded-md w-1/4 pt-1" />
      </div>
    </div>
  </GlassCard>
);

const NotificationsPage = () => {
  const queryClient = useQueryClient();
  const { socket } = useSocket() as any;

  // Dropdown & Filter State
  const [filter, setFilter] = useState<FilterType>("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [selectedNotice, setSelectedNotice] = useState<NotificationItem | null>(
    null,
  );

  const {
    data: notifications,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["notifications", filter],
    queryFn: () => getNotifications(filter !== "all" ? filter : undefined),
    staleTime: 1000 * 60 * 5,
  });

  // Handle incoming real-time socket notifications
  useEffect(() => {
    if (!socket) return;

    const handleIncomingNotification = (newNotice: any) => {

      queryClient.setQueryData(["notifications", filter], (oldData: any) => {
        if (!oldData) return oldData;

        const currentPayload = oldData?.data?.payload || [];

        const noticeToAdd = {
          id: newNotice.id || newNotice._id || Date.now(),
          title: newNotice.title || "New Notification",
          subject: newNotice.subject,
          content:
            newNotice.content ||
            newNotice.message ||
            newNotice.description ||
            "",
          type: newNotice.type || "general",
          isRead: false,
          read: false,
          createdAt: newNotice.createdAt || new Date().toISOString(),
          ...newNotice,
        };

        return {
          ...oldData,
          data: {
            ...oldData.data,
            payload: [noticeToAdd, ...currentPayload],
          },
        };
      });
    };

    socket.on("notification", handleIncomingNotification);

    return () => {
      socket.off("notification", handleIncomingNotification);
    };
  }, [socket, filter, queryClient]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const noticeGroups = useMemo(() => {
    const payload = notifications?.data?.payload;
    if (!Array.isArray(payload) || payload.length === 0) {
      return [] as NotificationGroup[];
    }

    return payload.reduce<NotificationGroup[]>((groups, notice: any) => {
      const groupLabel = formatRelative(
        new Date(notice.createdAt || Date.now()),
        new Date(),
      );

      const isNoticeRead = notice.isRead ?? notice.read ?? false;

      const item: NotificationItem = {
        id: notice.id || notice._id || `${notice.createdAt}-${Math.random()}`,
        icon: getNotificationIcon(notice.type),
        title: notice.title || "Notification",
        subject: notice.subject,
        description: notice.content || notice.description || "",
        time: groupLabel,
        color: TYPE_COLORS[notice.type] || "bg-grey",
        dot: !isNoticeRead,
        isRead: isNoticeRead,
      };

      const existingGroup = groups.find((g) => g.label === groupLabel);
      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        groups.push({ label: groupLabel, items: [item] });
      }

      return groups;
    }, []);
  }, [notifications]);

  const unreadCount = useMemo(() => {
    const payload = notifications?.data?.payload;
    if (!Array.isArray(payload)) return 0;
    return payload.filter((n: any) => !n.isRead && !n.read).length;
  }, [notifications]);

  const notificationsMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      console.error("Mutation failed:", error);
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => markNotificationAsRead(id),
    onMutate: (id: string) => {
      queryClient.setQueryData(["notifications", filter], (old: any) => {
        if (!old) return old;
        const payload = old?.data?.payload || [];
        return {
          ...old,
          data: {
            ...old.data,
            payload: payload.map((n: any) =>
              String(n.id ?? n._id) === id
                ? { ...n, isRead: true, read: true }
                : n,
            ),
          },
        };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleViewDetails = (item: NotificationItem) => {
    setSelectedNotice(item);
    if (!item.isRead) {
      markReadMutation.mutate(String(item.id));
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsMutation.mutateAsync();
    } catch (error) {
      toast.error(
        "Failed to mark all notifications as read. Please try again.",
      );
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  return (
    <Layout>
      <Header title="Notifications" backBtn={true} />
      <div className="p-4 md:p-8 space-y-4">
        <div className="flex justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            {unreadCount > 0 ? (
              <span className="w-fit text-[14px] font-bold text-blue uppercase">
                {unreadCount} Unread
              </span>
            ) : (
              <span className="w-fit text-[14px] font-bold text-slate-400 uppercase">
                {filter} View
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={handleMarkAllAsRead}
              className="text-blue md:text-grey text-[14px] md:text-[14px] font-bold md:bg-white/5 md:px-6 md:py-2.5 md:rounded-xl md:border md:border-white/5 hover:bg-white/10 transition-all"
            >
              Mark all as read
            </button>

            {/* Filter Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className={cn(
                  "p-2 md:p-2.5 bg-white/5 text-grey rounded-full md:rounded-xl border border-white/10 flex items-center gap-1.5 transition-all hover:bg-white/10 hover:text-white",
                  isDropdownOpen && "bg-white/10 border-white/20 text-white",
                )}
                aria-label="Filter Notifications"
              >
                <MdFilterList size={18} />
                <MdExpandMore
                  size={16}
                  className={cn(
                    "hidden md:block transition-transform duration-300",
                    isDropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 z-50 rounded-2xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 text-[14px] font-bold uppercase tracking-wider text-grey border-b border-white/5">
                    Filter By
                  </div>
                  {filterOptions.map((opt) => {
                    const active = filter === opt.value;
                    return (
                      <button
                        key={opt.value}
                        onClick={() => {
                          setFilter(opt.value);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold transition-all text-left",
                          active
                            ? "bg-blue/20 text-blue border border-blue/30"
                            : "text-grey hover:bg-white/5 hover:text-white",
                        )}
                      >
                        <span>{opt.label}</span>
                        {active && (
                          <MdCheck
                            size={16}
                            className="text-blue shrink-0"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="px-4 md:px-8 pb-8 space-y-8 md:space-y-12 max-w-5xl">
        {isLoading && (
          <div className="space-y-4">
            <div className="h-4 bg-white/5 rounded-md w-24 animate-pulse" />
            <div className="space-y-3">
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </div>
          </div>
        )}

        {isError && !isLoading && (
          <GlassCard className="relative overflow-hidden bg-red/10 border-red/20 backdrop-blur-xl p-8 md:p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-red/10 border border-red/20 flex items-center justify-center mx-auto text-red text-3xl shadow-inner">
              <MdErrorOutline />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-white font-bold text-lg md:text-xl">
                Unable to Load Notifications
              </h3>
              <p className="text-slate-400 text-sm md:text-sm leading-relaxed">
                {(error as Error)?.message ||
                  "Something went wrong while retrieving your notifications. Please check your connection and try again."}
              </p>
            </div>

            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red/20 text-red border border-red/30 text-sm font-bold transition-all hover:bg-red/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <MdRefresh size={18} />
              Try Again
            </button>
          </GlassCard>
        )}

        {!isLoading && !isError && noticeGroups.length === 0 && (
          <GlassCard className="bg-slate-900/40 border-white/5 backdrop-blur-xl p-10 md:p-16 text-center space-y-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-grey text-3xl md:text-4xl shadow-xl">
              {filter === "unread" ? (
                <MdNotificationsNone className="text-blue" />
              ) : (
                <MdInbox className="text-slate-400" />
              )}
            </div>

            <div className="space-y-1.5 max-w-sm mx-auto">
              <h3 className="text-white font-bold text-base md:text-lg">
                {filter === "unread"
                  ? "All Caught Up!"
                  : filter === "read"
                    ? "No Read Notifications"
                    : "No Notifications Found"}
              </h3>
              <p className="text-slate-400 text-sm md:text-sm leading-relaxed">
                {filter === "all"
                  ? "You don't have any notifications at the moment. Check back later!"
                  : `There are currently no ${filter} notifications to display.`}
              </p>
            </div>

            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="px-5 py-2 rounded-xl bg-white/5 text-grey border border-white/10 text-sm font-bold hover:bg-white/10 hover:text-white transition-all"
              >
                Clear Filters
              </button>
            )}
          </GlassCard>
        )}

        {!isLoading &&
          !isError &&
          noticeGroups.map((group) => (
            <div key={group.label} className="space-y-4 md:space-y-6">
              <div className="flex items-center gap-4 px-2">
                <h2 className="text-grey text-[14px] md:text-sm font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                  {group.label}
                </h2>
                <div className="h-px w-full bg-white/5 md:hidden" />
              </div>

              <div className="space-y-3 md:space-y-4">
                {group.items.map((item) => (
                  <div
                    key={item.id}
                    className="relative group overflow-hidden animate-in fade-in slide-in-from-top-4 duration-500 ease-out"
                  >
                    {/* Dynamic Border Indicator: Grey when read, color-coded when unread */}
                    <div
                      className={cn(
                        "absolute left-0 top-6 bottom-6 w-[3px] rounded-r-full z-10 transition-colors duration-300",
                        item.isRead ? "bg-slate-600/60" : item.color,
                      )}
                    />

                    <GlassCard className="bg-slate-900/40 border-white/5 hover:bg-white/5 transition-all duration-300">
                      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-5 md:p-6">
                        <div className="flex items-start md:items-center gap-4 md:gap-6 flex-1">
                          {/* Icon Box */}
                          <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center text-lg md:text-xl border border-white/10">
                            {item.icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-white font-bold text-sm md:text-base leading-tight">
                                {item.title}
                              </h3>
                              {item.dot && (
                                <div className="w-2 h-2 rounded-full bg-blue shrink-0" />
                              )}
                            </div>

                            {item.subject && (
                              <p className="text-grey text-sm font-medium">
                                {item.subject}
                              </p>
                            )}

                            <p className="text-grey text-sm md:text-sm italic leading-relaxed">
                              Tap "See Details" to view this notice
                            </p>

                            <p className="hidden md:block text-grey text-[14px] font-bold uppercase tracking-wider pt-1">
                              {item.time}
                            </p>
                          </div>
                        </div>

                        {/* Mobile Time & Action Button */}
                        <div className="flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0">
                          <p className="md:hidden text-grey text-[14px] font-bold uppercase tracking-wider">
                            {item.time}
                          </p>

                          <button
                            onClick={() => handleViewDetails(item)}
                            className={cn(
                              "flex items-center gap-1.5 px-5 py-2 md:px-6 md:py-2.5 rounded-xl text-[14px] md:text-sm font-bold transition-all shadow-lg whitespace-nowrap",
                              item.dot
                                ? "bg-blue text-white hover:bg-blue/90"
                                : "bg-white/5 text-grey border border-white/10 hover:bg-white/10",
                            )}
                          >
                            <MdVisibility size={14} />
                            See Details
                          </button>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </main>

      <NotificationDetailModal
        isOpen={!!selectedNotice}
        onClose={() => setSelectedNotice(null)}
        notice={selectedNotice}
      />
    </Layout>
  );
};

export default NotificationsPage;
