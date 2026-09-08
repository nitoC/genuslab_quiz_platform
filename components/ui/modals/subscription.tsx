import React from "react";
import { MdStars } from "react-icons/md";

const SubscriptionModal = ({ onClose }: { onClose?: () => void }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#111111] border border-white/5 rounded-[40px] p-10 flex flex-col items-center text-center shadow-2xl">
        {/* Gold Crown Icon */}
        <div className="w-20 h-20 rounded-full border-2 border-amber-500/30 flex items-center justify-center mb-8 bg-amber-500/5 relative">
          <div className="absolute inset-0 rounded-full border border-amber-500/10 animate-ping" />
          <MdStars className="text-amber-500 text-4xl" />
        </div>

        {/* Text Content */}
        <h2 className="text-white text-2xl font-bold mb-3">
          Subscription Confirmed
        </h2>
        <p className="text-slate-500 text-sm leading-relaxed mb-10">
          Welcome to the{" "}
          <span className="text-amber-500 font-bold">Premium</span>, Jane. Your
          premium workspace is now ready for use.
        </p>

        {/* Button Actions */}
        <div className="w-full space-y-3">
          <button className="w-full bg-white/5 hover:bg-white/10 border border-white/5 py-4 rounded-2xl text-white font-bold text-sm transition-colors">
            Go to Dashboard
          </button>
          <button className="w-full bg-transparent hover:bg-white/5 py-4 rounded-2xl text-slate-500 font-bold text-sm transition-colors">
            Download Receipt
          </button>
        </div>

        {/* Badges */}
        <div className="mt-12 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-slate-400 text-[14px] font-bold uppercase tracking-wider">
              Premium Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
            <span className="text-slate-400 text-[14px] font-bold uppercase tracking-wider">
              Auto-renewal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionModal;
