import React from "react";
import {
  MdAccountBalance,
  MdDeleteOutline,
  MdCheckCircle,
} from "react-icons/md";
import { BankAccount, IBankAccount } from "@/types/bank";
import GlassCard from "./GlassCard";

interface BankAccountCardProps {
  account: IBankAccount;
  onRemove: (id: string) => void;
}

export const BankAccountCard: React.FC<BankAccountCardProps> = ({
  account,
  onRemove,
}) => {
  return (
    <GlassCard>
      <div className="p-4 flex items-center justify-between transition-color">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-md bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 shrink-0">
            <MdAccountBalance size={20} />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-white">
                {account.provider}
              </h4>
              {account.isPrimary && (
                <span className="inline-flex items-center gap-1 text-[14px] font-medium text-green">
                  <MdCheckCircle size={12} /> Primary
                </span>
              )}
            </div>
            <p className="text-sm text-slate-400 font-mono tracking-wider">
              •••• •••• {account.providerAccountId?.slice(-4)}
            </p>
            <p className="text-[14px] text-slate-500 font-medium uppercase">
              {account.accountName}
            </p>
          </div>
        </div>

        <button
          onClick={() => onRemove(account.id)}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-md transition-colors"
          title="Remove Bank Account"
          aria-label="Remove bank account"
        >
          <MdDeleteOutline size={18} />
        </button>
      </div>
    </GlassCard>
  );
};
