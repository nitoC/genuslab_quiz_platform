import Link from "next/link";
import React from "react";
// icons
import { BiHourglass as Hourglass } from "react-icons/bi";
import { FiArrowRight as ArrowRight, FiInfo as Info } from "react-icons/fi";

interface ActiveSessionModalProps {
  onViewDetails?: () => void;
  /** The backend's actual conflict reason (AttemptGaurd's 409 message) —
   * "Quiz already completed" / "Quiz session has expired" / "user already
   * in another session" are three different situations that each need
   * different copy, not one generic "you have an active session" message
   * that's actively wrong for the completed/expired cases. */
  reason?: string;
}

const describeConflict = (reason?: string) => {
  const normalized = reason?.toLowerCase() ?? "";

  if (normalized.includes("expired")) {
    return {
      title: "Session Expired",
      body: (
        <>
          Your <span className="text-blue font-semibold">quiz session</span>{" "}
          timed out while you were away. It can no longer be completed —
          check back for the next available episode.
        </>
      ),
    };
  }

  if (normalized.includes("completed")) {
    return {
      title: "Quiz Already Completed",
      body: (
        <>
          You&apos;ve already finished this{" "}
          <span className="text-blue font-semibold">quiz</span>. Head back to
          see your results or try the next one.
        </>
      ),
    };
  }

  return {
    title: "Active Session Alert",
    body: (
      <>
        You already have an active{" "}
        <span className="text-blue font-semibold">quiz session</span> in
        progress on another device or tab. Please complete it there before
        starting a new one.
      </>
    ),
  };
};

export default function ActiveSessionModal({
  onViewDetails,
  reason,
}: ActiveSessionModalProps) {
  const { title, body } = describeConflict(reason);

  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-(--background-dark-secondary) border border-white/10 rounded-lg p-8 md:p-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center mb-6">
          <Hourglass size={28} className="text-blue" />
        </div>

        {/* Header Alert Title */}
        <h2 className="text-(--primary) text-lg font-bold tracking-wide mb-4">
          {title}
        </h2>

        {/* Context Explainer Paragraph */}
        <p className="text-grey text-sm leading-relaxed max-w-xs mb-8">
          {body}
        </p>

        {/* Primary Call to Action Button */}
        <Link
          href={"/quizzes"}
          className="w-full bg-blue hover:bg-blue/90 text-white font-bold text-base py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <span>Back to Dashboard</span>
          <ArrowRight size={18} style={{ strokeWidth: "2.5px" }} />
        </Link>

        {/* Secondary View Details Trigger */}
        <button className="mt-6 flex items-center gap-2 text-grey hover:text-(--primary) font-mono text-sm uppercase tracking-wider transition-colors">
          <Info size={14} />
          <span>View session details</span>
        </button>
      </div>
    </div>
  );
}
