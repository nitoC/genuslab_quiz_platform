import { ReactNode } from "react";
import GlassCard from "./GlassCard";
import { cn } from "@/lib/utils/cn";

export type GlassStatAccent = "neutral" | "success" | "warning" | "info";

// success = money/wins, warning = achievements, neutral = plain numbers.
const ACCENT_CLASSES: Record<GlassStatAccent, string> = {
  neutral: "bg-white/5 text-blue",
  success: "bg-green/10 text-green",
  warning: "bg-yellow/10 text-yellow",
  info: "bg-blue/10 text-blue",
};

// Stat card for the dark user-facing pages.
const GlassStatCard = ({
  icon,
  label,
  value,
  sublabel,
  accent = "neutral",
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  sublabel?: string;
  accent?: GlassStatAccent;
}) => (
  <GlassCard>
    <div className="p-5 sm:p-6">
      <div className="flex items-center gap-2 text-grey text-sm mb-2.5">
        <span className={cn("p-1.5 rounded-md", ACCENT_CLASSES[accent])}>
          {icon}
        </span>
        <span>{label}</span>
      </div>
      <p className="text-2xl font-semibold text-(--primary) tracking-tight">
        {value}
      </p>
      {sublabel && <p className="text-grey text-[13px] mt-1">{sublabel}</p>}
    </div>
  </GlassCard>
);

export default GlassStatCard;
