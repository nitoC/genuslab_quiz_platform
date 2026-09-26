"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import GlassCard from "../ui/cards/GlassCard";
import { IoAlertCircle, IoClose } from "react-icons/io5";
import { ArrowRight } from "lucide-react";

const AUTO_DISMISS_MS = 6000;

const BottomToast = ({
  data,
  isOpen,
  onClose,
  href = "/quiz",
}: {
  data: { title: string; description: string };
  isOpen: boolean;
  onClose: () => void;
  href?: string;
}) => {
  // Auto-dismiss a few seconds after appearing, restarting whenever new
  // content opens the toast, so it never lingers indefinitely.
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(onClose, AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [isOpen, data.title, data.description, onClose]);

  if (!isOpen) return null;

  return (
    // Position on a wrapper — GlassCard's `relative` would override `fixed`.
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-sm z-50">
      <GlassCard className="flex flex-row items-center gap-4 p-4 hover:bg-white/5 transition-colors">
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-2 top-2 cursor-pointer"
        >
          <GlassCard className="cursor-pointer p-1.5">
            <IoClose />
          </GlassCard>
        </button>

        <div className="flex items-center gap-3 min-w-0 flex-1 pr-6">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-yellow">
            <IoAlertCircle size={16} />
          </span>
          <div className="flex flex-col gap-1 min-w-0">
            <h6 className="text-(--primary) font-bold text-sm">{data.title}</h6>
            <p className="text-grey text-xs truncate">{data.description}</p>
          </div>
        </div>

        <Link href={href} aria-label="Go to quiz" className="shrink-0">
          <GlassCard className="cursor-pointer rounded-full w-10 h-10 shrink-0 flex items-center justify-center hover:bg-white/10 transition-colors">
            <ArrowRight size={18} color="#ccc" />
          </GlassCard>
        </Link>
      </GlassCard>
    </div>
  );
};

export default BottomToast;
