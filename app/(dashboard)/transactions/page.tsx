"use client";

import GlassCard from "@/components/ui/cards/GlassCard";
import { ReactNode, useState, useMemo, useEffect, useRef } from "react";
import Layout from "@/components/layouts/Layout";
import Header from "@/components/layouts/Header";
import { FaCrown, FaTrophy, FaUniversity } from "react-icons/fa";
import {
  MdCardGiftcard,
  MdSearch,
  MdReceiptLong,
  MdFilterListOff,
  MdExpandMore,
  MdCheck,
} from "react-icons/md";
import { cn } from "@/lib/utils/cn";
import { useQuery } from "@tanstack/react-query";
import { getUserTransactions, getTotalRewards } from "@/lib/api/apis"; // adjust import path to your api file
import useUser from "@/hooks/useUser";
import GlassBadge from "@/components/ui/GlassBadge";

export type TransactionTypeFilter = "all" | "referral" | "rewards" | "plan";

export interface Transaction {
  id: string;
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
  icon: ReactNode;
}

interface TransactionItemProps {
  title: string;
  description: string;
  date: string;
  time: string;
  amount: string;
  type: "credit" | "debit";
  status: "Completed" | "Processing" | "Failed";
  icon: ReactNode;
}

const TransactionItem = ({
  title,
  description,
  date,
  time,
  amount,
  type,
  status,
  icon,
}: TransactionItemProps) => {
  const isCredit = type === "credit";

  const statusVariant = {
    Completed: "success" as const,
    Processing: "warning" as const,
    Failed: "danger" as const,
  };

  return (
    <GlassCard className="transition-all hover:bg-white/[0.03]">
      <div className="p-4 md:p-5 flex items-center justify-between gap-3">
        {/* Left Section: Icon & Info */}
        <div className="flex gap-3 md:gap-4 items-center flex-1 min-w-0">
          <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 flex items-center justify-center rounded-lg bg-white/5 border border-white/5">
            {icon}
          </div>

          <div className="min-w-0">
            <h4 className="text-(--primary) font-bold text-sm md:text-base truncate">
              {title}
            </h4>
            <p className="text-[14px] md:text-sm text-grey truncate mt-0.5">
              {description}
            </p>
          </div>
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
            <GlassBadge variant={statusVariant[status]}>{status}</GlassBadge>
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

const CATEGORY_TABS = [
  "All",
  "Subscription",
  "Rewards",
  "Claimed Rewards",
] as const;

const TYPE_OPTIONS: { label: string; value: TransactionTypeFilter }[] = [
  { label: "All Types", value: "all" },
  { label: "Referral", value: "referral" },
  { label: "Rewards", value: "rewards" },
  { label: "Plan", value: "plan" },
];

// Helper functions for mapping backend transaction values
const mapCategory = (
  type: string,
): "Subscription" | "Rewards" | "Claimed Rewards" => {
  const lower = type?.toLowerCase() || "";
  if (lower === "plan" || lower === "subscription") return "Subscription";
  if (lower === "referral") return "Rewards";
  if (lower === "rewards" || lower === "reward") return "Rewards";
  if (lower === "claimed" || lower === "withdrawal") return "Claimed Rewards";
  return "Subscription";
};

const mapStatus = (status: string): "Completed" | "Processing" | "Failed" => {
  const lower = status?.toLowerCase() || "";
  if (lower === "success" || lower === "completed") return "Completed";
  if (lower === "pending" || lower === "processing") return "Processing";
  return "Failed";
};

const getIconForType = (type: string) => {
  const lower = type?.toLowerCase() || "";
  if (lower === "plan") return <FaCrown className="text-blue text-lg" />;
  if (lower === "referral")
    return <MdCardGiftcard className="text-green text-xl" />;
  if (lower === "rewards") return <FaTrophy className="text-green text-lg" />;
  return <FaUniversity className="text-yellow text-lg" />;
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

  // TanStack Query to fetch user transactions from API
  const { data: apiResponse, isLoading } = useQuery({
    queryKey: ["userTransactions", selectedType],
    queryFn: async () => {
      try {
        const res = await getUserTransactions({
          type: selectedType === "all" ? undefined : selectedType,
          limit: 100,
          page: 1,
        });
        return res?.data?.payload?.data || [];
      } catch (err) {
        console.error("Error fetching transactions:", err);
        return err;
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

      const filterType = (item.type?.toLowerCase() || "plan") as
        | "referral"
        | "rewards"
        | "plan";
      const isCredit = item.type === "referral" || item.type === "rewards";

      return {
        id: item.id || item._id,
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
        icon: getIconForType(item.type),
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
                <div className="absolute top-full left-0 right-0 mt-2 z-50 rounded-lg bg-background-dark-secondary border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden py-1 space-y-0.5">
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
              <div className="relative flex-1">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-3 text-sm font-medium text-grey outline-none focus:border-blue/50 transition-colors [color-scheme:dark]"
                  placeholder="From Date"
                />
              </div>
              <div className="relative flex-1">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-3 text-sm font-medium text-grey outline-none focus:border-blue/50 transition-colors [color-scheme:dark]"
                  placeholder="To Date"
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
                title={tx.title}
                description={tx.description}
                date={tx.displayDate}
                time={tx.time}
                amount={tx.amount}
                type={tx.type}
                status={tx.status}
                icon={tx.icon}
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
    </Layout>
  );
};

export default TransactionsPage;
