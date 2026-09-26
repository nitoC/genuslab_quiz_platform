import clsx from "clsx";
import { ReactNode } from "react";

type GlassBadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

// Reuses the app's own existing color tokens (--color-green/red/yellow/blue
// in globals.css) instead of reaching for stock Tailwind emerald/amber/red,
// which is how status colors ended up inconsistent page to page.
const VARIANT_CLASSES: Record<GlassBadgeVariant, string> = {
  neutral: "text-grey",
  success: "text-green",
  warning: "text-yellow",
  danger: "text-red",
  info: "text-blue",
};

// Status text for the dark user-facing pages (the admin one is Badge).
// Use it for real statuses only.
const GlassBadge = ({
  children,
  variant = "neutral",
  icon,
  className,
}: {
  children: ReactNode;
  variant?: GlassBadgeVariant;
  icon?: ReactNode;
  className?: string;
}) => (
  <span
    className={clsx(
      "inline-flex items-center gap-1.5 text-xs font-semibold",
      VARIANT_CLASSES[variant],
      className,
    )}
  >
    {icon}
    {children}
  </span>
);

export default GlassBadge;
