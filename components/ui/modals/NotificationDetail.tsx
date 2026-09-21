"use client";

import React from "react";
import { X, Clock3, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface NotificationDetailData {
  id: string | number;
  icon: React.ReactNode;
  title: string;
  subject?: string;
  description: string;
  time: string;
  color: string;
  isRead: boolean;
}

interface NotificationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: NotificationDetailData | null;
}

export const NotificationDetailModal: React.FC<
  NotificationDetailModalProps
> = ({ isOpen, onClose, notice }) => {
  if (!isOpen || !notice) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Overlay backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", notice.color)} />
            <span className="text-[14px] font-bold uppercase tracking-wider text-slate-400">
              Notification Details
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 bg-slate-900 text-slate-100 space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="flex items-start gap-4">
            <div className="shrink-0 w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-xl border border-white/10">
              {notice.icon}
            </div>
            <div className="flex-1 min-w-0 pt-1">
              <h2 className="text-lg md:text-xl font-bold text-white leading-snug">
                {notice.title}
              </h2>
              {notice.subject && (
                <p className="text-slate-300 text-sm md:text-sm font-medium mt-1">
                  {notice.subject}
                </p>
              )}
            </div>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-4 md:p-5">
            <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
              {notice.description || "No additional details were provided."}
            </p>
          </div>

          <div className="flex items-center justify-between text-[14px] text-slate-500 font-medium pt-1">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="w-3.5 h-3.5" />
              {notice.time}
            </span>
            <span className="inline-flex items-center gap-1.5 text-green">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Marked as read
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
