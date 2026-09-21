"use client";

import React from "react";
import { MdClose } from "react-icons/md";
import { cn } from "@/lib/utils/cn";
import GlassCard from "../cards/GlassCard";
import { FaAward, FaUsers, FaChartBar, FaMoneyBillWave } from "react-icons/fa";
import Link from "next/link";

type GradientButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  href: string;
  /**
   * Tailwind gradient classes, e.g.
   * "from-blue-600 to-indigo-600"
   */
  gradient?: string;
};

export const GradientButton = ({
  children,
  onClick,
  href,
  className,
  gradient = "from-blue-600 to-indigo-600",
}: GradientButtonProps) => {
  return (
    <Link
      onClick={onClick}
      href={href}
      className={cn(
        "w-full rounded-2xl px-6 py-4 text-sm font-extrabold text-white inline-block text-center",
        "bg-gradient-to-r",
        gradient,
        "shadow-[0_14px_40px_rgba(37,99,235,0.35)]",
        "transition-transform duration-200 active:scale-[0.99] hover:scale-[1.01]",
        "disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100",
        className,
      )}
    >
      {children}
    </Link>
  );
};

type LiveQuizModalProps = {
  open: boolean;
  onClose: () => void;
  onProceed?: () => void;
  gradient?: string; // forwarded to GradientButton
  title?: string;
  id: string;
};

const LiveQuizModal = ({
  open,
  onClose,
  onProceed,
  id,
  gradient = "from-blue-600 to-indigo-600",
  title = "Live Quiz",
}: LiveQuizModalProps) => {
  if (!open) return null;
  if (!id) return null;
  return (
    <div className="fixed inset-0 z-[100]">
      <div
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-[10px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            "relative w-full max-w-[430px] overflow-hidden rounded-[28px]",
            "backdrop-blur-2xl",
            "border border-white/60",
            "shadow-[0_30px_80px_rgba(0,0,0,0.25)]",
          )}
        >
          <GlassCard className="bg-white/70">
            {/* top subtle tint panel */}
            <div className="absolute inset-0 pointer-events-none" />

            {/* close */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className={cn(
                "absolute right-4 top-4 z-12 grid h-10 w-10 place-items-center rounded-xl",
                "text-slate-400 hover:text-slate-700",
                "hover:bg-white/60 transition",
              )}
            >
              <MdClose size={20} />
            </button>

            <div className="relative z-10 px-8 pt-10 pb-8">
              {/* icon */}
              <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                <span className="text-2xl">
                  <FaAward />
                </span>
              </div>

              {/* title */}
              <h2 className="text-center text-2xl font-extrabold text-slate-900">
                {title}
              </h2>

              {/* description */}
              <p className="mx-auto mt-3 max-w-[330px] text-center text-sm leading-relaxed text-slate-500">
                The live quiz is where the real challenge begins. Compete with
                others in real-time, climb the global leaderboard, and earn real
                rewards.
              </p>

              {/* feature list */}
              <div className="mt-6 space-y-3">
                <FeatureRow
                  icon={
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-100 text-blue-600">
                      <FaUsers size={16} />
                    </div>
                  }
                  label="Real-time competition with peers"
                />
                <FeatureRow
                  icon={
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-100 text-blue-600">
                      <FaChartBar size={16} />
                    </div>
                  }
                  label="Climb the global ranking tiers"
                />
                <FeatureRow
                  icon={
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-blue-100 text-blue-600">
                      <FaMoneyBillWave size={16} />
                    </div>
                  }
                  label="Win exclusive prizes and cash rewards"
                />
              </div>

              {/* action */}
              <div className="mt-7">
                <GradientButton gradient={gradient} href={`/quiz/live/${id}`}>
                  Enter Live Quiz
                </GradientButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default LiveQuizModal;

function FeatureRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-2xl px-4 py-3",
        "bg-white/70 border border-white/70",
        "shadow-[0_8px_18px_rgba(15,23,42,0.06)]",
      )}
    >
      {icon}
      <div className="text-sm font-semibold text-slate-800">{label}</div>
    </div>
  );
}
