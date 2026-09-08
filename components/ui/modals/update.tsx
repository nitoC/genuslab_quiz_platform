import React from "react";
import { MdCheck, MdArrowForward, MdVerifiedUser } from "react-icons/md";

const UpdateSuccessModal = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#111111] border border-white/5 rounded-[40px] p-10 flex flex-col items-center text-center shadow-2xl">
        {/* Tilted Success Icon */}
        <div className="relative mb-8">
          <div className="w-20 h-20 bg-emerald-500 rounded-[24px] rotate-[15deg] flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <MdCheck className="text-white text-4xl -rotate-[15deg]" />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-white text-2xl font-bold mb-4">
          Update Successful
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-10 max-w-[280px]">
          Your profile information has been securely updated within the Genuslab
          ecosystem.
        </p>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full max-w-[240px] bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 py-4 rounded-full flex items-center justify-center gap-2 group transition-all"
        >
          <span className="text-emerald-500 font-bold text-sm">
            Back to Profile
          </span>
          <MdArrowForward className="text-emerald-500 group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Footer info */}
        <div className="mt-12 flex items-center gap-2 opacity-40">
          <MdVerifiedUser className="text-slate-400 text-sm" />
          <span className="text-slate-400 text-[14px] font-bold uppercase tracking-widest">
            Security Verified
          </span>
        </div>
      </div>
    </div>
  );
};

export default UpdateSuccessModal;
