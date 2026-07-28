import GlassCard from "@/components/ui/cards/GlassCard";
import { ArrowRight } from "lucide-react";

const Glass = () => {
  return (
    <GlassCard className="flex justify-between items-center">
      <span>Add a profile picture to standout</span>
      <button>
        <GlassCard className="rounded-full w-10 h-10">
          <ArrowRight size={20} color="#ccc" />
        </GlassCard>
      </button>
    </GlassCard>
  );
};

export default Glass;
