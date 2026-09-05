"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  MdVerifiedUser,
  MdClose,
  MdKeyboardArrowDown,
  MdCheck,
  MdAccountBalance,
  MdBadge,
  MdPin,
  MdSearch,
} from "react-icons/md";
import { BankAccount } from "@/types/bank";
import GlassCard from "../cards/GlassCard";
import useBanks from "@/hooks/useBanks";
import { linkBankAccount } from "@/lib/api/apis";

const SUPPORTED_BANKS = [
  { code: "057", name: "Zenith Bank" },
  { code: "011", name: "First Bank of Nigeria" },
  { code: "058", name: "GTBank" },
  { code: "033", name: "United Bank for Africa (UBA)" },
  { code: "044", name: "Access Bank" },
  { code: "050", name: "Ecobank Nigeria" },
  { code: "214", name: "FCMB" },
  { code: "070", name: "Fidelity Bank" },
];

interface CustomBankSelectProps {
  value: string;
  onChange: (value: { bankName: string; bankCode: string }) => void;
}

const CustomBankSelect: React.FC<CustomBankSelectProps> = ({
  value,
  onChange,
}) => {
  const { data, isLoading, isError, refetch } = useBanks();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  //   const filteredBanks = SUPPORTED_BANKS.filter((b) =>
  //     b.name.toLowerCase().includes(searchQuery.toLowerCase()),
  //   );

  //   const selectedBank = SUPPORTED_BANKS.find((b) => b.name === value);

  if (isLoading) {
    return (
      <div className="w-full bg-slate-950/40 border border-slate-800/80 rounded-xl px-4 py-2.5 transition-all duration-200 flex items-center gap-3 animate-pulse">
        <MdAccountBalance size={18} className="text-slate-500" />
        <div className="flex flex-col w-full">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Financial Institution
          </span>
          <span className="text-slate-500 text-xs mt-0.5">
            Loading banks...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full bg-slate-950/40 border border-slate-800/80 rounded-xl px-4 py-2.5 transition-all duration-200 flex items-center gap-3">
        <MdAccountBalance size={18} className="text-slate-500" />
        <div className="flex flex-col w-full">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
            Financial Institution
          </span>
          <span className="text-slate-500 text-xs mt-0.5">
            Error loading banks
          </span>
        </div>
      </div>
    );
  }

  const banks = data?.payload;

  const filteredBanks = banks.filter((b: any) =>
    b.bankName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedBank = banks.find((b: any) => b.bankName === value);

  console.log(filteredBanks);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Trigger */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        className={`w-full bg-slate-950/20 border ${
          isOpen
            ? "border-blue-500/80 shadow-[0_0_12px_rgba(59,130,246,0.15)] ring-1 ring-blue-500/20"
            : "border-slate-800/80 hover:border-slate-700"
        } rounded-xl px-4 py-3 text-xs text-white flex items-center justify-between cursor-pointer transition-all duration-200 backdrop-blur-md group`}
      >
        <div className="flex items-center gap-3">
          <MdAccountBalance
            size={18}
            className={`transition-colors ${
              isOpen || selectedBank ? "text-blue-400" : "text-slate-500"
            }`}
          />
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Financial Institution
            </span>
            <span
              className={
                selectedBank
                  ? "text-slate-100 font-medium text-xs mt-0.5"
                  : "text-slate-500 text-xs mt-0.5"
              }
            >
              {selectedBank ? selectedBank.bankName : "Select your bank"}
            </span>
          </div>
        </div>
        <MdKeyboardArrowDown
          size={20}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180 text-blue-400" : "group-hover:text-slate-300"
          }`}
        />
      </div>

      {/* Options Menu with Custom Glass Scrollbar */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-slate-900/90 border border-slate-800/90 rounded-xl shadow-2xl backdrop-blur-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Search Filter Input inside Dropdown */}
          <div className="p-2 border-b border-slate-800/60 bg-slate-950/40">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 border border-slate-800 rounded-lg text-xs text-slate-300">
              <MdSearch size={16} className="text-slate-500" />
              <input
                type="text"
                placeholder="Search bank..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent focus:outline-none text-slate-200 placeholder:text-slate-500 text-xs"
              />
            </div>
          </div>

          {/* List Wrapper with Custom Scrollbar Utility */}
          <div className="max-h-52 pb-10 overflow-y-auto divide-y divide-slate-800/30 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-700/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-blue-500/50">
            {filteredBanks.length === 0 ? (
              <div className="px-4 py-3 text-xs text-slate-500 text-center">
                No bank found
              </div>
            ) : (
              filteredBanks.map((b: any) => {
                const isSelected = b.bankName === value;
                return (
                  <div
                    key={b.code}
                    role="option"
                    aria-selected={isSelected}
                    tabIndex={0}
                    onClick={() => {
                      onChange(b);
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        onChange(b);
                        setIsOpen(false);
                        setSearchQuery("");
                      }
                    }}
                    className={`px-4 py-3 text-xs flex items-center justify-between cursor-pointer transition-all ${
                      isSelected
                        ? "bg-blue-600/15 text-blue-300 font-medium"
                        : "text-slate-300 hover:bg-slate-800/50 hover:text-white"
                    }`}
                  >
                    <span>{b.bankName}</span>
                    {isSelected && (
                      <MdCheck size={16} className="text-blue-400" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

interface LinkBankFormModalProps {
  isOpen: boolean;
  userName: string;
  onSuccess: (newAccount: BankAccount) => void;
  onClose: () => void;
}

export const LinkBankFormModal: React.FC<LinkBankFormModalProps> = ({
  isOpen,
  userName,
  onSuccess,
  onClose,
}) => {
  const [bankName, setBankName] = useState("");
  const [bankDetails, setBankDetails] = useState<any>(null);
  const [accountNumber, setAccountNumber] = useState("");

  const [accountName, setAccountName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setError("");
    }, 5000);
    return () => clearTimeout(timeoutId);
  }, [error]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (!bankName) {
      setError("Please select your bank institution.");
      setIsSubmitting(false);
      return;
    }
    if (!bankDetails || !bankDetails.bankCode) {
      setError("Invalid bank selection. Please select a valid bank.");
      setIsSubmitting(false);
      return;
    }

    if (accountNumber.length < 10) {
      setError("Account number must be 10 digits.");
      setIsSubmitting(false);
      return;
    }
    if (!accountName) {
      setError("Please enter the account name as shown on statements.");
      setIsSubmitting(false);
      return;
    }
    if (userName.toLowerCase() !== accountName.toLowerCase()) {
      setError("Account name does not match your registered name.");
      setIsSubmitting(false);
      return;
    }
    try {
      const res = await linkBankAccount({
        type: "bank",
        provider: bankName,
        providerAccountId: accountNumber,
      });
      onSuccess(res.data.payload);
      //   setIsSubmitting(false);
      onClose();
    } catch (err) {
      console.error("Error linking bank account:", {
        message: (err as any)?.message,
        status: (err as any)?.response?.status,
        data: (err as any)?.response?.data,
      });
      setError("Failed to link bank account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <GlassCard className="w-full max-w-lg p-6 md:p-8 relative overflow-hidden rounded-2xl border border-slate-800/80 shadow-2xl bg-slate-900/60 backdrop-blur-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-5 border-b border-slate-800/60">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
              <MdAccountBalance size={22} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white tracking-tight">
                Link Bank Account
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Connect your account for automated settlements
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/50 transition-colors"
            aria-label="Close Modal"
          >
            <MdClose size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
              {error}
            </div>
          )}

          {/* Custom Select */}
          <CustomBankSelect
            value={bankName}
            onChange={(data: { bankName: string; bankCode: string }) => {
              setBankName(data.bankName);
              setBankDetails(data);
            }}
          />

          {/* Account Number Input */}
          <div className="group relative">
            <div className="w-full bg-slate-950/40 border border-slate-800/80 focus-within:border-blue-500/80 focus-within:ring-1 focus-within:ring-blue-500/20 focus-within:shadow-[0_0_12px_rgba(59,130,246,0.15)] rounded-xl px-4 py-2.5 transition-all duration-200 flex items-center gap-3">
              <MdPin
                size={18}
                className="text-slate-500 group-focus-within:text-blue-400 transition-colors"
              />
              <div className="flex flex-col w-full">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Account Number
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="0123456789"
                  value={accountNumber}
                  onChange={(e) =>
                    setAccountNumber(e.target.value.replace(/\D/g, ""))
                  }
                  required
                  className="w-full bg-transparent text-xs text-white font-mono tracking-widest focus:outline-none placeholder:text-slate-600 mt-0.5"
                />
              </div>
            </div>
          </div>

          {/* Legal Account Name Input */}
          <div className="group relative">
            <div className="w-full bg-slate-950/40 border border-slate-800/80 focus-within:border-blue-500/80 focus-within:ring-1 focus-within:ring-blue-500/20 focus-within:shadow-[0_0_12px_rgba(59,130,246,0.15)] rounded-xl px-4 py-2.5 transition-all duration-200 flex items-center gap-3">
              <MdBadge
                size={18}
                className="text-slate-500 group-focus-within:text-blue-400 transition-colors"
              />
              <div className="flex flex-col w-full">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Legal Account Name
                </label>
                <input
                  type="text"
                  placeholder="As written on official bank statement"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  required
                  className="w-full bg-transparent text-xs text-white focus:outline-none placeholder:text-slate-600 mt-0.5"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-800/80 hover:bg-slate-800/40 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] disabled:bg-blue-900/60 disabled:text-slate-400 text-white rounded-xl text-xs font-semibold transition-all shadow-[0_4px_20px_rgba(37,99,235,0.25)] flex items-center gap-2"
            >
              <MdVerifiedUser size={16} />
              <span>
                {isSubmitting ? "Verifying..." : "Verify & Link Account"}
              </span>
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};
