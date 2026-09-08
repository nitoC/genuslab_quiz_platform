import React from "react";
import { MdAccountBalance, MdAdd } from "react-icons/md";
import GlassCard from "./cards/GlassCard";

interface EmptyBankStateProps {
  onLinkClick: () => void;
}

export const EmptyBankState: React.FC<EmptyBankStateProps> = ({
  onLinkClick,
}) => {
  return (
    <GlassCard className=" border rounded-lg p-8 text-center space-y-4">
      <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-400">
        <MdAccountBalance size={24} />
      </div>

      <div className="space-y-1 max-w-sm mx-auto">
        <h3 className="text-base font-semibold text-white">
          No Bank Account Linked
        </h3>
        <p className="text-sm text-slate-400 leading-relaxed">
          You haven't connected a settlement account yet. Link your bank account
          to receive automated withdrawals and payouts.
        </p>
      </div>

      <button
        onClick={onLinkClick}
        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-sm font-semibold transition-colors"
      >
        <MdAdd size={16} />
        <span>Link a Bank Account</span>
      </button>
    </GlassCard>
  );
};
