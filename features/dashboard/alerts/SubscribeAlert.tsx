import Link from "next/link";
import GlassCard from "@/components/ui/cards/GlassCard";
import { FaCrown } from "react-icons/fa";
import { ArrowRight } from "lucide-react";

const SubscribeAlert = () => {
  return (
    <Link href="/pricing" className="block">
      <GlassCard className="flex justify-between items-center gap-4 p-4 hover:bg-white/5 transition-colors">
        <div className="min-w-0">
          <p className="flex items-center gap-1.5 text-(--primary) font-bold text-sm">
            <FaCrown size={14} className="text-yellow" />
            Unlock Premium
          </p>
          <p className="text-grey text-xs truncate mt-0.5">
            Subscribe to access unlimited quizzes, the leaderboard & more.
          </p>
        </div>

        <ArrowRight size={18} className="text-grey shrink-0" />
      </GlassCard>
    </Link>
  );
};

export default SubscribeAlert;
