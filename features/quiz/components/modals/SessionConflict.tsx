import Link from "next/link";
import React from "react";
// icons
import { BiHourglass as Hourglass } from "react-icons/bi";
import { FiArrowRight as ArrowRight, FiInfo as Info } from "react-icons/fi";

interface ActiveSessionModalProps {
  onViewDetails?: () => void;
}

export default function ActiveSessionModal({
  onViewDetails,
}: ActiveSessionModalProps) {
  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-[#292a3a] border border-white/5 rounded-[32px] p-8 md:p-10 flex flex-col items-center text-center shadow-2xl">
        {/* Hourglass Icon Wrapper Box */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-white/[0.04] border border-white/10 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden shadow-inner">
            <Hourglass size={32} className="text-[#a4bcfc] mb-1" />
            {/* The distinct green bar under the hourglass */}
            <div className="w-8 h-[3px] bg-[#3fd18a] rounded-full shadow-[0_0_10px_rgba(63,209,138,0.5)]" />
          </div>
          {/* Accent decoration blob mirroring the small glass offset in image_ec166a.png */}
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#3fd18a]/20 blur-[2px]" />
        </div>

        {/* Header Alert Title */}
        <h2 className="text-white text-sm font-bold tracking-wide mb-4">
          Active Session Alert
        </h2>

        {/* Context Explainer Paragraph */}
        <p className="text-slate-400 text-sm leading-relaxed max-w-xs mb-8">
          You already have an active{" "}
          <span className="text-[#a4bcfc] font-semibold">quiz session</span> in
          progress. Please complete your current challenge before starting a new
          one.
        </p>

        {/* Primary Call to Action Button */}
        <Link
          href={"/quizzes"}
          className="w-full bg-[#a4bcfc] hover:bg-[#8da9fc] text-[#0f1325] font-black text-base py-4 px-6 rounded-2xl flex items-center justify-center gap-2 transition-colors duration-200 shadow-[0_4px_20px_rgba(164,188,252,0.25)]"
        >
          <span>Back to Dashboard</span>
          <ArrowRight size={18} style={{ strokeWidth: "2.5px" }} />
        </Link>

        {/* Secondary View Details Trigger */}
        <button
          //   onClick={onViewDetails || onClose}
          className="mt-6 flex items-center gap-2 text-slate-400 hover:text-slate-300 font-mono text-sm uppercase tracking-wider transition-colors"
        >
          <Info size={14} className="text-slate-400" />
          <span>View session details</span>
        </button>
      </div>
    </div>
  );
}
