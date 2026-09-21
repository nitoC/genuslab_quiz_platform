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

/**
 * Status indicator for the dark/glass user-facing pages (dashboard,
 * leaderboard, rewards, player stats) — the admin dashboard's own `Badge`
 * (components/ui/Badge.tsx, exports `BadgeStatus`) is a separate light-theme
 * component with 15+ existing call sites; this is deliberately a different
 * file/name so the two never collide.
 *
 * Plain colored text, no background/border chip — a pill-shaped capsule
 * around ordinary status text is decoration, not information. Reserved for
 * things that ARE a status (live, locked, pending, error), not a default
 * container for ordinary text.
 */
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
