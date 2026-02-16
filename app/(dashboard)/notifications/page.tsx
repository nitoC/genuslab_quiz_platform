"use client";

import React from "react";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import GlassCard from "@/components/ui/cards/GlassCard";
import { cn } from "@/lib/utils/cn";
import {
  MdNotificationsActive,
  MdEmojiEvents,
  MdSettings,
  MdPersonAdd,
  MdShield,
  MdFilterList,
} from "react-icons/md";

const NotificationsPage = () => {
  const notificationGroups = [
    {
      label: "Today",
      items: [
        {
          id: 1,
          icon: <MdNotificationsActive />,
          title: "Episode 7 Results Are Out!",
          description:
            "Congratulations! You ranked in the top 5% of participants for the Global History quiz. Check your analytics now.",
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
            "You've unlocked the 'Master Historian' badge and earned 500 G-Coins. These can be used in the shop.",
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
          action: undefined,
          dot: false,
        },
        {
          id: 4,
          icon: <MdPersonAdd />,
          title: "Referral Success!",
          description:
            "Your friend Sarah just joined Genuslab using your invite link. You've been credited with a boost.",
          time: "Yesterday at 09:15",
          color: "bg-slate-500",
          action: undefined,
          dot: false,
        },
      ],
    },
    {
      label: "Last Week",
      items: [
        {
          id: 5,
          icon: <MdShield />,
          title: "Security Check Passed",
          description:
            "Your account security settings have been verified successfully via multi-factor authentication.",
          time: "6 days ago",
          color: "bg-slate-700",
          action: undefined,
          dot: false,
        },
      ],
    },
  ];

  return (
    <Layout>
      <div className="flex justify-between items-center p-8 pb-0">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-white">Notifications</h1>
          <span className="bg-blue-600/20 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/20">
            4 Unread
          </span>
        </div>
        <div className="flex gap-3">
          <button className="bg-white/5 hover:bg-white/10 text-slate-300 text-[10px] font-bold px-6 py-2.5 rounded-xl border border-white/5 transition-all">
            Mark all as read
          </button>
          <button className="bg-white/5 hover:bg-white/10 text-slate-300 p-2.5 rounded-xl border border-white/5 transition-all">
            <MdFilterList size={18} />
          </button>
        </div>
      </div>

      <main className="p-8 space-y-12 max-w-5xl">
        {notificationGroups.map((group) => (
          <div key={group.label} className="space-y-6">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em]">
                {group.label}
              </h2>
              {group.label === "Today" && (
                <button className="text-blue-500 text-[10px] font-bold bg-blue-500/5 px-4 py-1.5 rounded-lg hover:bg-blue-500/10 transition-colors">
                  Back
                </button>
              )}
            </div>

            <div className="space-y-4">
              {group.items.map((item) => (
                <GlassCard>
                  <div
                    key={item.id}
                    className="group relative flex items-center bg-[#0f172a]/40 rounded-[2rem] p-6 hover:bg-white/[0.03] transition-all duration-300"
                  >
                    {/* Left Accent Bar */}
                    <div
                      className={cn(
                        "absolute left-0 top-8 bottom-8 w-1 rounded-r-full",
                        item.color,
                      )}
                    />

                    <div className="flex items-center gap-6 w-full">
                      {/* Icon Container */}
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-slate-400 text-xl border border-white/5 group-hover:scale-110 transition-transform duration-300">
                        {item.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-white font-bold text-base">
                            {item.title}
                          </h3>
                          {item.dot && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                          )}
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                          {item.description}
                        </p>
                        <p className="text-slate-600 text-[10px] font-bold uppercase tracking-wider pt-2">
                          {item.time}
                        </p>
                      </div>

                      {/* Conditional Action Button */}
                      {item.action && (
                        <button
                          className={cn(
                            "px-8 py-3 rounded-2xl text-xs font-bold transition-all shadow-lg",
                            item.id === 1
                              ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-600/20"
                              : "bg-white/5 text-slate-300 border border-white/5 hover:bg-white/10",
                          )}
                        >
                          {item.action}
                        </button>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        ))}
      </main>
    </Layout>
  );
};

export default NotificationsPage;
