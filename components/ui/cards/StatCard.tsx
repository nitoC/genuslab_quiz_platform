import React from "react";
import Link from "next/link";
import { IconType } from "react-icons";
import { MdArrowUpward, MdArrowDownward } from "react-icons/md";
import AdminCard from "./AdminCard";
import { cn } from "@/lib/utils/cn";

export interface StatCardProps {
  icon: IconType;
  title: string;
  value: React.ReactNode;
  secondary?: React.ReactNode;
  trend?: { value: number; label?: string };
  href?: string;
  // Still accepted by old call sites, but every card now uses the same icon style.
  accent?: "blue" | "emerald" | "amber" | "red" | "slate" | "purple";
}

// Shared KPI card used across Dashboard-style overview sections (Dashboard,
// Subscriptions summary, Transactions summary, etc.) so every module's
// top-of-page metrics look and behave the same way.
const StatCard = ({
  icon: Icon,
  title,
  value,
  secondary,
  trend,
  href,
}: StatCardProps) => {
  const content = (
    <AdminCard
      className={cn(
        "flex flex-col gap-4",
        href && "transition-shadow hover:shadow-md",
      )}
    >
      <div className="flex items-start justify-between">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          <Icon size={20} />
        </span>

        {trend && (
          <span
            className={cn(
              "flex items-center gap-0.5 text-xs font-bold",
              trend.value >= 0 ? "text-emerald-600" : "text-red-500",
            )}
          >
            {trend.value >= 0 ? (
              <MdArrowUpward size={14} />
            ) : (
              <MdArrowDownward size={14} />
            )}
            {Math.abs(trend.value)}
            {trend.label ? ` ${trend.label}` : "%"}
          </span>
        )}
      </div>

      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
          {value}
        </p>
        {secondary && (
          <p className="mt-1 text-xs text-slate-400">{secondary}</p>
        )}
      </div>
    </AdminCard>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block" aria-label={`View ${title}`}>
      {content}
    </Link>
  );
};

export default StatCard;
