import clsx from "clsx";
import { ReactNode } from "react";

type GlassBadgeVariant = "neutral" | "success" | "warning" | "danger" | "info";

// Reuses the app's own existing color tokens (--color-green/red/yellow/blue
// in globals.css) instead of reaching for stock Tailwind emerald/amber/red,
// which is how status colors ended up inconsistent page to page.
const VARIANT_CLASSES: Record<GlassBadgeVariant, string> = {
  neutral: "bg-white/5 text-grey border-white/10",
  success: "bg-green/10 text-green border-green/20",
  warning: "bg-yellow/10 text-yellow border-yellow/20",
  danger: "bg-red/10 text-red border-red/20",
  info: "bg-blue/10 text-blue border-blue/20",
};

/**
 * Status badge for the dark/glass user-facing pages (dashboard, leaderboard,
 * rewards, player stats) — the admin dashboard's own `Badge`
 * (components/ui/Badge.tsx, exports `BadgeStatus`) is a separate light-theme
 * component with 15+ existing call sites; this is deliberately a different
 * file/name so the two never collide.
 *
 * Reserved for things that ARE a status (live, locked, pending, error) —
 * not a default container for ordinary text. A rank name, a count, or a
 * label/value pair should just be text, not a colored capsule. Uses
 * rounded-md (a restrained 8px, see globals.css) rather than rounded-full —
 * a badge doesn't need to be pill-shaped to read as a badge.
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
      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-xs font-medium",
      VARIANT_CLASSES[variant],
      className,
    )}
  >
    {icon}
    {children}
  </span>
);

export default GlassBadge;
