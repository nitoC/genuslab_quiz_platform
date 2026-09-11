import React from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeStatus = "success" | "warning" | "error" | "info" | "inactive";

const STATUS_CLASSES: Record<BadgeStatus, string> = {
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  error: "bg-red-50 text-red-700",
  info: "bg-blue-50 text-blue-700",
  inactive: "bg-slate-100 text-slate-600",
};

const Badge = ({
  status,
  children,
  className,
}: {
  status: BadgeStatus;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold capitalize",
        STATUS_CLASSES[status],
        className,
      )}
    >
      <span
        className="h-1.5 w-1.5 shrink-0 rounded-full bg-current"
        aria-hidden="true"
      />
      {children}
    </span>
  );
};

export default Badge;
