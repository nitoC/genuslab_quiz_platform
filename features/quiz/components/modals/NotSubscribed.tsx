import Link from "next/link";
import React from "react";
import { MdWorkspacePremium, MdPlayCircleOutline } from "react-icons/md";
import { FiArrowRight as ArrowRight } from "react-icons/fi";

export default function NotSubscribedModal() {
  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-md bg-(--background-dark-secondary) border border-white/10 rounded-lg p-8 md:p-10 flex flex-col items-center text-center">
        {/* Icon */}
        <div className="w-16 h-16 bg-blue/10 border border-blue/20 rounded-lg flex items-center justify-center mb-6 text-blue">
          <MdWorkspacePremium size={28} />
        </div>

        {/* Header Title */}
        <h2 className="text-(--primary) text-lg font-bold tracking-wide mb-4">
          Subscription Required
        </h2>

        {/* Context Explainer Paragraph */}
        <p className="text-grey text-sm leading-relaxed max-w-xs mb-8">
          Live quizzes are a premium feature. Subscribe to join live episodes,
          climb the leaderboard, and earn rewards — or try a demo quiz for
          free in the meantime.
        </p>

        {/* Primary Call to Action Button */}
        <Link
          href={"/subscriptions"}
          className="w-full bg-blue hover:bg-blue/90 text-white font-bold text-base py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <span>Subscribe Now</span>
          <ArrowRight size={18} style={{ strokeWidth: "2.5px" }} />
        </Link>

        {/* Secondary Demo Quiz Link */}
        <Link
          href={"/quiz/demo"}
          className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-(--primary) font-bold text-base py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
        >
          <MdPlayCircleOutline size={20} />
          <span>Take a Demo Quiz</span>
        </Link>
      </div>
    </div>
  );
}
