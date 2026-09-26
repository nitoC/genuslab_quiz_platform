"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import { useState, useMemo, useEffect, useRef } from "react";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import {
  MdSearch,
  MdReceiptLong,
  MdFilterListOff,
  MdExpandMore,
  MdCheck,
} from "react-icons/md";
import { cn } from "@/lib/utils/cn";
import { useQuery } from "@tanstack/react-query";
import {
  getUserTransactions,
  getTotalRewards,
  getTransactionById,
} from "@/lib/api/apis"; // adjust import path to your api file
import useUser from "@/hooks/useUser";
import RecordDetailView from "@/components/ui/modals/RecordDetailView";
import DateFilterPicker from "@/components/ui/FormItems/DateFilterPicker";

export type TransactionTypeFilter = "all" | "referral" | "rewards" | "plan";

export interface Transaction {
  id: string;
  reference: string;
  title: string;
  description: string;
  date: string; // ISO / YYYY-MM-DD for date filtering logic
  displayDate: string;
  time: string;
  amount: string;
  type: "credit" | "debit";
  filterType: "referral" | "rewards" | "plan";
  category: "Subscription" | "Rewards" | "Claimed Rewards";
  status: "Completed" | "Processing" | "Failed";
}

interface TransactionItemProps {
  reference: string;
  title: string;
  description: string;
  date: string;
  time: string;
  amount: string;
  type: "credit" | "debit";
  status: "Completed" | "Processing" | "Failed";
  onClick: () => void;
}

const STATUS_TEXT_CLASS: Record<TransactionItemProps["status"], string> = {
  Completed: "text-green",
  Processing: "text-yellow",
  Failed: "text-red",
};

const TransactionItem = ({
  reference,
  title,
  description,
  date,
  time,
  amount,
  type,
  status,
  onClick,
}: TransactionItemProps) => {
  const isCredit = type === "credit";

  return (
    <button type="button" onClick={onClick} className="w-full text-left cursor-pointer">
      <GlassCard className="transition-all hover:bg-white/[0.03]">
        <div className="p-4 md:p-5 flex items-center justify-between gap-3">
          {/* Left Section: Info — no decorative icon, the text already says what this is */}
          <div className="min-w-0 flex-1">
            <h4 className="text-(--primary) font-bold text-sm md:text-base truncate">
              {title}
            </h4>
            <p className="text-[14px] md:text-sm text-grey truncate mt-0.5">
              {description}
            </p>
            <p className="text-[12px] text-grey/70 font-mono truncate mt-0.5">
              Ref: {reference}
            </p>
          </div>

          {/* Right Section: Amount & Meta */}
          <div className="flex flex-col md:flex-row items-end md:items-center gap-2 md:gap-8 shrink-0">
            <div className="hidden md:flex flex-col text-right">
              <p className="text-[14px] text-(--primary) font-medium">{date}</p>
              <p className="text-[14px] text-grey uppercase">{time}</p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <p
                className={cn(
                  "font-bold text-sm md:text-base",
                  isCredit ? "text-green" : "text-red",
                )}
              >
                {isCredit ? "+" : "-"}₦{amount}
              </p>
              <span className={cn("text-xs font-semibold", STATUS_TEXT_CLASS[status])}>
                {status}
              </span>
            </div>
          </div>
        </div>
      </GlassCard>
    </button>
  );
};

// "Rewards" (earned but not yet claimed) was removed — a Transaction only
// ever exists for a reward once it has actually been claimed and paid out,
// so that tab could never show anything and just looked broken.
const CATEGORY_TABS = ["All", "Subscription", "Claimed Rewards"] as const;

const TYPE_OPTIONS: { label: string; value: TransactionTypeFilter }[] = [
  { label: "All Types", value: "all" },
  { label: "Referral", value: "referral" },
  { label: "Rewards", value: "rewards" },
  { label: "Plan", value: "plan" },
];

// quiz/referral/finance are reward payouts; plan is a subscription payment.
const REWARD_TRANSACTION_TYPES = ["quiz", "referral", "finance"];

// Helper functions for mapping backend transaction values
const mapCategory = (
  type: string,
): "Subscription" | "Rewards" | "Claimed Rewards" => {
  const lower = type?.toLowerCase() || "";
  if (lower === "plan" || lower === "subscription") return "Subscription";
  if (REWARD_TRANSACTION_TYPES.includes(lower)) return "Claimed Rewards";
  return "Subscription";
};

const mapStatus = (status: string): "Completed" | "Processing" | "Failed" => {
  const lower = status?.toLowerCase() || "";
  if (lower === "success" || lower === "completed") return "Completed";
  if (lower === "pending" || lower === "processing") return "Processing";
  return "Failed";
};

const TransactionsPage = () => {
  const { data: userData } = useUser();
  const detailsId = userData?.user?.details?.id;

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("All");
  const [selectedType, setSelectedType] =
    useState<TransactionTypeFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Custom Dropdown Ref for Outside-click Handling
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Date range state
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Detail view state — which transaction's full-window receipt is open
  const [selectedTransactionId, setSelectedTransactionId] = useState<
    string | null
  >(null);

  useEffect(() => {
    setIsMounted(true);

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch everything and filter on the client. The page's filter values
  // (e.g. "rewards") aren't backend transaction types.
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["userTransactions"],
    queryFn: async () => {
      try {
        const res = await getUserTransactions({
          limit: 100,
          page: 1,
        });
        return res?.data?.payload?.data || [];
      } catch (err) {
        console.error("Error fetching transactions:", err);
        return [];
      }
    },
  });

  // Current reward balance (sum of all quiz/referral/rank-unlock rewards)
  const { data: currentReward, isLoading: isRewardLoading } = useQuery({
    queryKey: ["totalReward", detailsId],
    queryFn: async () => {
      const res = await getTotalRewards(detailsId as string);
      return res?.data?.payload?.total ?? 0;
    },
    enabled: !!detailsId,
  });

  // Full detail for whichever transaction's receipt is currently open
  const { data: selectedTransaction, isLoading: isDetailLoading } = useQuery({
    queryKey: ["transactionDetail", selectedTransactionId],
    queryFn: async () => {
      const res = await getTransactionById(selectedTransactionId as string);
      return res?.data?.payload;
    },
    enabled: !!selectedTransactionId,
  });

  // Transform raw API transaction items to match UI interface
  const rawTransactions: Transaction[] = useMemo(() => {
    if (!Array.isArray(apiResponse)) return [];

    return apiResponse.map((item: any) => {
      const createdDate = item.createdAt
        ? new Date(item.createdAt)
        : new Date();
      const isoDate = createdDate.toISOString().split("T")[0];
      const displayDate = createdDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const time = createdDate.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });

      const rawType = (item.type?.toLowerCase() || "plan") as string;
            // quiz + finance both show as "Rewards". Only plan is a debit.
      const filterType: "referral" | "rewards" | "plan" =
        rawType === "referral"
          ? "referral"
          : rawType === "plan"
            ? "plan"
            : "rewards";
      const isCredit = REWARD_TRANSACTION_TYPES.includes(rawType);

      return {
        id: item.id || item._id,
        reference: item.providerRef || item.id || item._id,
        title: item.title || "Transaction",
        description: item.description || `ID: #${item.id?.slice(0, 8)}`,
        date: isoDate,
        displayDate,
        time,
        amount: Number(item.amount || 0).toLocaleString(),
        type: isCredit ? "credit" : "debit",
        filterType,
        category: mapCategory(item.type),
        status: mapStatus(item.status),
      };
    });
  }, [apiResponse]);

  // Dynamic filter pipeline
  const filteredTransactions = useMemo(() => {
    return rawTransactions.filter((item) => {
      // 1. Category Tab Filter
      const matchesCategory =
        activeTab === "All" || item.category === activeTab;

      // 2. Custom Type Filter (referral, rewards, plan)
      const matchesType =
        selectedType === "all" || item.filterType === selectedType;

      // 3. Search Query Filter
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.amount.includes(searchQuery);

      // 4. Date Range Filter
      let matchesDate = true;
      if (startDate) {
        matchesDate = matchesDate && new Date(item.date) >= new Date(startDate);
      }
      if (endDate) {
        matchesDate = matchesDate && new Date(item.date) <= new Date(endDate);
      }

      return matchesCategory && matchesType && matchesSearch && matchesDate;
    });
  }, [
    rawTransactions,
    activeTab,
    selectedType,
    searchQuery,
    startDate,
    endDate,
  ]);

  const isFiltered =
    activeTab !== "All" ||
    selectedType !== "all" ||
    searchQuery !== "" ||
    startDate !== "" ||
    endDate !== "";

  const resetFilters = () => {
    setActiveTab("All");
    setSelectedType("all");
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
  };

  const selectedTypeLabel =
    TYPE_OPTIONS.find((opt) => opt.value === selectedType)?.label ||
    "All Types";

  if (!isMounted) return null;

  return (
    <Layout>
      <Header title="Transaction History" backBtn={false} />

      <main className="p-4 md:p-8 space-y-6 md:space-y-8 max-w-[1200px] mx-auto">
        {/* Page Intro */}
        <div className="space-y-1">
          <h2 className="text-(--primary) text-xl md:text-2xl font-bold">
            Transaction History
          </h2>
          <p className="text-grey text-sm md:text-sm">
            Manage and track your financial activities with precision.
          </p>
        </div>

        {/* Current Reward Card */}
        <GlassCard className="w-full md:w-[320px]">
          <div className="p-6 space-y-3">
            <p className="text-[14px] md:text-sm text-grey font-bold uppercase tracking-widest">
              Current reward
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-(--primary)">
              {isRewardLoading
                ? "₦..."
                : `₦${Number(currentReward || 0).toLocaleString()}`}
            </h2>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-2 h-2 rounded-full",
                  currentReward > 0 ? "bg-green" : "bg-grey",
                )}
              />
              <span
                className={cn(
                  "text-[14px] font-bold uppercase",
                  currentReward > 0 ? "text-green" : "text-grey",
                )}
              >
                {currentReward > 0 ? "Active Reward" : "No Active Reward"}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Filters & Actions Area */}
        <div className="space-y-4">
          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-5 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all cursor-pointer",
                  activeTab === tab
                    ? "bg-blue text-white"
                    : "bg-white/5 text-grey border border-white/5 hover:bg-white/10",
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search, Custom Type Dropdown & Date Range Controls */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-5">
              <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-grey text-xl" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search transactions, IDs..."
                className="w-full bg-white/5 border border-white/5 rounded-lg pl-11 pr-4 py-3 text-sm outline-none text-(--primary) focus:border-blue/50 transition-colors"
              />
            </div>

            {/* Custom Dropdown for Type Filter */}
            <div className="relative md:col-span-3" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="w-full bg-white/5 border border-white/5 rounded-lg px-4 py-3 text-sm md:text-sm font-bold text-grey flex items-center justify-between outline-none hover:bg-white/10 focus:border-blue/50 transition-all cursor-pointer"
              >
                <span className="truncate">Type: {selectedTypeLabel}</span>
                <MdExpandMore
                  className={cn(
                    "text-grey text-lg transition-transform duration-200",
                    isDropdownOpen && "rotate-180 text-blue",
                  )}
                />
              </button>

              {/* Custom Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-lg bg-(--background-dark-secondary) border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden py-1 space-y-0.5">
                  {TYPE_OPTIONS.map((opt) => {
                    const isSelected = selectedType === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setSelectedType(opt.value);
                          setIsDropdownOpen(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2.5 text-sm font-medium flex items-center justify-between transition-all cursor-pointer text-left",
                          isSelected
                            ? "bg-blue/20 text-blue font-bold"
                            : "text-grey hover:bg-white/5 hover:text-(--primary)",
                        )}
                      >
                        <span>{opt.label}</span>
                        {isSelected && (
                          <MdCheck className="text-blue text-base" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Date Range Selectors */}
            <div className="flex gap-2 md:col-span-4">
              <div className="min-w-0 flex-1">
                <DateFilterPicker
                  theme="dark"
                  value={startDate}
                  onChange={setStartDate}
                  placeholder="From Date"
                  maxDate={endDate ? new Date(endDate) : undefined}
                />
              </div>
              <div className="min-w-0 flex-1">
                <DateFilterPicker
                  theme="dark"
                  value={endDate}
                  onChange={setEndDate}
                  placeholder="To Date"
                  minDate={startDate ? new Date(startDate) : undefined}
                  popperPlacement="bottom-end"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Transactions List / Empty State */}
        <div className="space-y-3 min-h-[260px]">
          {isLoading ? (
            <div className="py-12 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredTransactions.length > 0 ? (
            filteredTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                reference={tx.reference}
                title={tx.title}
                description={tx.description}
                date={tx.displayDate}
                time={tx.time}
                amount={tx.amount}
                type={tx.type}
                status={tx.status}
                onClick={() => setSelectedTransactionId(tx.id)}
              />
            ))
          ) : (
            /* Empty State Container */
            <GlassCard className="py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 border-dashed border-white/10">
              <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                {isFiltered ? (
                  <MdFilterListOff className="text-3xl text-grey" />
                ) : (
                  <MdReceiptLong className="text-3xl text-grey" />
                )}
              </div>

              <div className="space-y-1 max-w-sm">
                <h3 className="text-(--primary) font-bold text-base md:text-lg">
                  No Transactions Found
                </h3>
                <p className="text-grey text-sm md:text-sm">
                  {isFiltered
                    ? "We couldn't find any transactions matching your current filters."
                    : "You haven't made any transactions yet. Your transaction history will show up here once available."}
                </p>
              </div>

              {isFiltered && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-lg text-sm font-bold text-blue bg-blue/10 hover:bg-blue/20 transition-all cursor-pointer"
                >
                  Reset Filters
                </button>
              )}
            </GlassCard>
          )}
        </div>
      </main>

      {selectedTransactionId && (
        <RecordDetailView
          open={!!selectedTransactionId}
          onClose={() => setSelectedTransactionId(null)}
          loading={isDetailLoading}
          documentTitle="Transaction Receipt"
          subtitle={selectedTransaction?.title || "Transaction"}
          amount={
            selectedTransaction
              ? `₦${Number(selectedTransaction.amount || 0).toLocaleString()}`
              : undefined
          }
          amountVariant={
            selectedTransaction
              ? REWARD_TRANSACTION_TYPES.includes(
                  (selectedTransaction.type || "").toLowerCase(),
                )
                ? "credit"
                : "debit"
              : "neutral"
          }
          statusLabel={
            selectedTransaction ? mapStatus(selectedTransaction.status) : undefined
          }
          statusVariant={
            selectedTransaction
              ? ({
                  Completed: "success",
                  Processing: "warning",
                  Failed: "danger",
                } as const)[mapStatus(selectedTransaction.status)]
              : "neutral"
          }
          reference={
            selectedTransaction?.providerRef ||
            selectedTransaction?.id ||
            selectedTransactionId
          }
          filename={`Genuslab_Transaction_${
            selectedTransaction?.providerRef || selectedTransactionId
          }`}
          rows={[
            { label: "Transaction ID", value: selectedTransaction?.id || "—" },
            {
              label: "Type",
              value: (
                <span className="capitalize">
                  {selectedTransaction?.type || "—"}
                </span>
              ),
            },
            {
              label: "Description",
              value: selectedTransaction?.description || "—",
            },
          ]}
        />
      )}
    </Layout>
  );
};

export default TransactionsPage;
