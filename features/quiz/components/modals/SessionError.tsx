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
      <div className="w-full max-w-xl bg-[#0f111e] border border-white/5 rounded-[24px] p-8 md:p-12 flex flex-col items-center text-center shadow-2xl relative overflow-hidden">
        {/* Red Circular Failure Icon Wrapper */}
        <div className="w-20 h-20 bg-[#7a0c11] rounded-full flex items-center justify-center mb-6 shadow-lg">
          {/* Custom composition replicating a loading/refresh alert style */}
          <div className="relative text-white font-bold text-xl flex items-center justify-center">
            <HiOutlineRefresh size={36} className="text-white/90" />
            <span className="absolute text-xs top-[11px] left-[15px] font-black">
              !
            </span>
          </div>
        </div>

        {/* Header Title */}
        <h2 className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-4">
          Session Load Failure
        </h2>

        {/* Description Body */}
        <p className="text-slate-400 text-base leading-relaxed max-w-md mb-10">
          We encountered an issue while trying to load your quiz session. Please
          check your connection and try again.
        </p>

        {/* Action Buttons Grid */}
        <div className="w-full grid grid-cols-2 gap-4 mb-8">
          {/* Retry Button */}
          <button
            onClick={onRetry}
            className="bg-[#a4bcfc] hover:bg-[#8da9fc] text-[#0f1325] font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <MdRefresh size={22} />
            <span>Retry</span>
          </button>

          {/* Go Back Button */}
          <Link
            href={"/quizzes"}
            className="bg-[#212433] hover:bg-[#2b2f42] border border-white/5 text-white font-bold text-base py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors duration-200"
          >
            <MdArrowBack size={20} />
            <span>Go Back</span>
          </Link>
        </div>

        {/* Contact Support Footer Link */}
        <Link
          href={"/support"}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-300 text-sm font-medium tracking-wide transition-colors"
        >
          <span>Contact Support</span>
          <FiExternalLink size={14} className="text-slate-400" />
        </Link>
      </div>
    </div>
  );
}
