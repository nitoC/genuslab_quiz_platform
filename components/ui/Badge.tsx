import React from "react";
import { cn } from "@/lib/utils/cn";

export type BadgeStatus = "success" | "warning" | "error" | "info" | "inactive";

const STATUS_CLASSES: Record<BadgeStatus, string> = {
  success: "text-emerald-700",
  warning: "text-amber-700",
  error: "text-red-700",
  info: "text-blue-700",
  inactive: "text-slate-500",
};

// Plain colored-dot + text status indicator — no pill/chip container. A
// background+border capsule around ordinary status text is decoration, not
// information; the dot plus the semantic text color already communicate
// status without needing a shape around it.
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
        "inline-flex items-center gap-1.5 text-xs font-semibold capitalize",
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
