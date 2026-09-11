import Link from "next/link";
import GlassCard from "@/components/ui/cards/GlassCard";
import { FaCrown } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

const SubscribeAlert = () => {
  return (
    <Link href="/pricing" className="block">
      <GlassCard className="flex justify-between items-center gap-4 p-4 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-amber-400">
            <FaCrown size={16} />
          </span>
          <div className="min-w-0">
            <p className="text-(--primary) font-bold text-sm">
              Unlock Premium
            </p>
            <p className="text-grey text-xs truncate">
              Subscribe to access unlimited quizzes, the leaderboard & more.
            </p>
          </div>
        </div>

        <GlassCard className="rounded-full w-10 h-10 shrink-0 flex items-center justify-center">
          <ArrowRight size={18} color="#ccc" />
        </GlassCard>
      </GlassCard>
    </Link>
  );
};

export default SubscribeAlert;
