"use client";

import Layout from "@/components/layouts/Layout";
import GlassCard from "@/components/ui/cards/GlassCard";
import { cn } from "@/lib/utils/cn";
import useSidebar from "@/store/useSidebar";
import {
  MdNotificationsActive,
  MdEmojiEvents,
  MdSettings,
  MdPersonAdd,
  MdShield,
  MdFilterList,
  MdMenu,
} from "react-icons/md";

const NotificationsPage = () => {
  const { toggleSidebar } = useSidebar((state: any) => state);
  const notificationGroups = [
    {
      label: "Today",
      items: [
        {
          id: 1,
          icon: <MdNotificationsActive />,
          title: "Episode 7 Results Are Out!",
          description:
            "Congratulations! You ranked in the top 5% of participants for the Global History quiz.",
          time: "2 hours ago",
          color: "bg-blue-500",
          action: "View Results",
          dot: true,
        },
        {
          id: 2,
          icon: <MdEmojiEvents />,
          title: "Reward Earned: Gold Trophy",
          description:
            "You've unlocked the 'Master Historian' badge and earned 500 G-Coins.",
          time: "5 hours ago",
          color: "bg-amber-500",
          action: "Claim Reward",
          dot: true,
        },
      ],
    },
    {
      label: "Yesterday",
      items: [
        {
          id: 3,
          icon: <MdSettings />,
          title: "System Update: Version 2.4.0",
          description:
            "Performance improvements and new midnight themes are now available for your dashboard.",
          time: "Yesterday at 14:20",
          color: "bg-slate-500",
          dot: false,
          action: undefined,
        },
        {
          id: 4,
          icon: <MdPersonAdd />,
          title: "Referral Success!",
          description:
            "Your friend Sarah just joined Genuslab using your invite link.",
          time: "Yesterday at 09:15",
          color: "bg-slate-500",
          dot: false,
          action: undefined,
        },
      ],
    },
    {
      label: "Last Week",
      items: [
        {
          id: 5,
          icon: <MdShield />,
          title: "Weekly Streak Bonus",
          description:
            "7-day streak maintained! Check your rewards vault for your bonus.",
          time: "6 days ago",
          color: "bg-slate-700",
          dot: false,
          action: undefined,
        },
      ],
    },
  ];

  return (
    <Layout>
      {/* Responsive Header */}
      <div className="p-4 md:p-8 space-y-4">
        <div className="flex justify-between items-start md:items-center">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleSidebar()}
                className="md:hidden p-2 bg-white/5 rounded-full border border-white/10"
              >
                <MdMenu className="text-white text-xl" />
              </button>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                Notifications
              </h1>
            </div>
            <span className="w-fit bg-blue-600/20 text-blue-400 text-[9px] md:text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/20">
              4 UNREAD
            </span>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button className="text-blue-500 md:text-slate-300 text-[11px] md:text-[10px] font-bold md:bg-white/5 md:px-6 md:py-2.5 md:rounded-xl md:border md:border-white/5 transition-all">
              Mark all as read
            </button>
            <button className="p-2 md:p-2.5 bg-white/5 text-slate-300 rounded-full md:rounded-xl border border-white/10 md:border-white/5">
              <MdFilterList size={18} />
            </button>
          </div>
        </div>
      </div>

      <main className="px-4 md:px-8 pb-8 space-y-8 md:space-y-12 max-w-5xl">
        {notificationGroups.map((group) => (
          <div key={group.label} className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-4 px-2">
              <h2 className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap">
                {group.label}
              </h2>
              <div className="h-px w-full bg-white/5 md:hidden" />
            </div>

            <div className="space-y-3 md:space-y-4">
              {group.items.map((item) => (
                <div key={item.id} className="relative group overflow-hidden">
                  <div
                    className={cn(
                      "absolute left-0 top-6 bottom-6 w-0.75 rounded-r-full z-10",
                      item.color,
                    )}
                  />

                  <GlassCard className="bg-[#0f172a]/40! border-white/5 hover:bg-white/3 transition-all duration-300">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6 p-5 md:p-6">
                      <div className="flex items-start md:items-center gap-4 md:gap-6 flex-1">
                        {/* Icon */}
                        <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 text-lg md:text-xl border border-white/10">
                          {item.icon}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-white font-bold text-sm md:text-base leading-tight">
                              {item.title}
                            </h3>
                            {item.dot && (
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                            )}
                          </div>
                          <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                            {item.description}
                          </p>
                          <p className="hidden md:block text-slate-600 text-[10px] font-bold uppercase tracking-wider pt-2">
                            {item.time}
                          </p>
                        </div>
                      </div>

                      {/* Mobile Time & Action Row */}
                      <div className="flex items-center justify-between md:justify-end gap-4 mt-2 md:mt-0">
                        <p className="md:hidden text-slate-600 text-[9px] font-bold uppercase tracking-wider">
                          {item.time}
                        </p>

                        {item.action && (
                          <button
                            className={cn(
                              "px-5 py-2 md:px-8 md:py-3 rounded-xl md:rounded-2xl text-[10px] md:text-xs font-bold transition-all shadow-lg whitespace-nowrap",
                              item.id === 1
                                ? "bg-blue-600 text-white hover:bg-blue-500"
                                : "bg-white/5 text-slate-300 border border-white/10",
                            )}
                          >
                            {item.action}
                          </button>
                        )}
                      </div>
                    </div>
                  </GlassCard>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
    </Layout>
  );
};

export default NotificationsPage;
