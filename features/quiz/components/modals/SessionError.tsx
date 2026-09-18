import React from "react";
import { MdRefresh, MdArrowBack } from "react-icons/md";
import { FiExternalLink } from "react-icons/fi";
import { HiOutlineRefresh } from "react-icons/hi"; // Crisp refresh with exclamation style
import Link from "next/link";

interface SessionFailureModalProps {
  onRetry: () => void;
}

export default function SessionFailureModal({
  onRetry,
}: SessionFailureModalProps) {
  return (
    // Backdrop overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-xl bg-(--background-dark-secondary) border border-white/10 rounded-lg p-8 md:p-12 flex flex-col items-center text-center">
        {/* Failure Icon */}
        <div className="w-16 h-16 bg-red/10 border border-red/20 rounded-lg flex items-center justify-center mb-6 text-red">
          <HiOutlineRefresh size={28} />
        </div>

        {/* Header Title */}
        <h2 className="text-(--primary) text-2xl md:text-3xl font-bold tracking-tight mb-4">
          Session Load Failure
        </h2>

        {/* Description Body */}
        <p className="text-grey text-base leading-relaxed max-w-md mb-10">
          We encountered an issue while trying to load your quiz session. Please
          check your connection and try again.
        </p>

        {/* Action Buttons Grid */}
        <div className="w-full grid grid-cols-2 gap-4 mb-8">
          {/* Retry Button */}
          <button
            onClick={onRetry}
            className="bg-blue hover:bg-blue/90 text-white font-bold text-base py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <MdRefresh size={22} />
            <span>Retry</span>
          </button>

          {/* Go Back Button */}
          <Link
            href={"/quizzes"}
            className="bg-white/5 hover:bg-white/10 border border-white/10 text-(--primary) font-bold text-base py-4 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <MdArrowBack size={20} />
            <span>Go Back</span>
          </Link>
        </div>

        {/* Contact Support Footer Link */}
        <Link
          href={"/support"}
          className="flex items-center gap-2 text-grey hover:text-(--primary) text-sm font-medium tracking-wide transition-colors"
        >
          <span>Contact Support</span>
          <FiExternalLink size={14} />
        </Link>
      </div>
    </div>
  );
}
